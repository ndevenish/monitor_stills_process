import argparse
import logging
import os
import re
import time
from pathlib import Path
from typing import Generator, Iterable, List, NamedTuple, Optional, Union

logger = logging.getLogger(__name__)
ScanGenerator = Generator[bool, Optional[float], bool]

# Regex to identify integrated files
reInt = re.compile(r"int.*\.pickle")


class Counts(NamedTuple):
    imported: int
    indexed: int
    integrated: int


def count_file_types(files: Iterable[Path]) -> Counts:
    """Count the known still_process file types given a list of files."""
    imported = indexed = integrated = 0
    for x in files:
        if x.name.endswith("datablock.json") or x.name.endswith("imported.expt"):
            imported += 1
        elif x.name.endswith("indexed.pickle") or x.name.endswith("indexed.refl"):
            indexed += 1
        elif reInt.match(x.name):
            integrated += 1

    return Counts(imported, indexed, integrated)


def count_folder(path: Path) -> Counts:
    """Return counts for a processing subfolder"""
    return count_file_types(path.iterdir())


def is_data_dir(files: List[str]):
    """Identify a data directory by the files content"""
    return any(
        x.endswith("datablock.json") or x.endswith("imported.expt") for x in files
    )


def _merge_bool_into_generator(value: bool, generator: ScanGenerator) -> ScanGenerator:
    """
    Merge a boolean result with the first result from a ScanGenerator.

    The ScanGenerator yields a sequence of True/False depending on whether
    this round generated any changes. However, sometimes we want to "inject"
    the first result by combining it with the results of a previous generator,
    but we can't yield an extra value because we promise to do that based on
    time limits rather than iterative convenience.

    Args:
        value:
            If True, the first result yielded (or returned if an empty
            generator) will be True. Otherwise, the first result from
            the generator will be yielded.
        generator:
            The generator to delegate to for all iterations
    """
    try:
        next_value = yield next(generator) or value
    except StopIteration as result:
        return value or result.value
    # Pass the previous value and all next injected values.
    try:
        while True:
            next_value = yield generator.send(next_value)
    except StopIteration as result:
        return result.value


class SinglePathWatcher:
    """Watch a single stills process folder."""

    def __init__(
        self, path: Path, initial_files: Union[Iterable[Path], Iterable[str]] = []
    ):
        self.path = path
        self.counts = Counts(0, 0, 0)
        self.last_update = time.monotonic() if initial_files else None
        self.last_checked = 0
        self.last_duration = 0
        self.counts = count_file_types([Path(x) for x in initial_files])

    def scan(self):
        """Rescan the process path"""
        start_time = time.monotonic()
        new_count = count_folder(self.path)
        self.last_duration = time.monotonic() - start_time
        self.last_checked = time.monotonic()

        if new_count != self.counts:
            self.counts = new_count
            self.last_update = time.monotonic()
            return True
        return False

    def to_dict(self, relative_to: Path):
        """Generate a dictionary description of the path.

        Args:
            relative_to: The scan root to generate relative naming
        """
        return {
            "processed": self.counts.imported,
            "indexed": self.counts.indexed,
            "integrated": self.counts.integrated,
            "name": str(self.path.relative_to(relative_to)),
            "last_update": time.monotonic() - self.last_update
            if self.last_update
            else None,
        }


class PathScanner:
    def __init__(self, root: Path):
        self.root = root.resolve()
        self.known_paths: List[SinglePathWatcher] = []
        self._current_scan: Optional[ScanGenerator] = None

    def to_dict(self):
        return [x.to_dict(self.root) for x in self.known_paths[:]]

    def _scan_for_new_paths(
        self, time_limit: Optional[float] = None, start_time: Optional[float] = None
    ) -> ScanGenerator:
        """
        Walk the scan tree looking for new stills process paths.

        Args:
            time_limit:
                The maximum time to spend searching. If scanning takes
                longer than this, the search will be paused and resumed
                next time the function is called.
            start_time:
                The initial start time to use, in case the routine doesn't
                have all of the time_limit to initially run.

        Returns:
            yields a bool - True if something changed - until the routine is completed
        """

        start_time = start_time or time.monotonic()
        # Keep track of how long we've gone without yield
        entry_time = start_time

        known = [x.path for x in self.known_paths]

        # Track whether we updated anything this time
        change = False
        checked_dircount = 0

        # Although os.walk might be slower, we use it here because we need
        # to check every folder for subfolders at least once
        for (basepath, dirs, files) in os.walk(self.root):
            path = Path(basepath)
            logger.debug("Checking \033[37m%s\033[0m", path)
            checked_dircount += 1
            # Remove subfolders from consideration
            for dirname in list(dirs):
                if (path / dirname) in known:
                    dirs.remove(dirname)
                elif (path / dirname / "dials.process.log").is_file():
                    # A _quick_ check is for this one file
                    new_path = SinglePathWatcher(path / dirname, files)
                    self.known_paths.append(new_path)
                    dirs.remove(dirname)
                    logger.debug(
                        "Found \033[32mnew path %s\033[0m",
                        new_path.path.relative_to(self.root),
                    )
                    change = True
                elif not (path / dirname / "dials.process.log").is_file():
                    print(f"{path / dirname / 'dials.process.log'} is not a file")

            # Now check this folder - might not have worked with quick check
            if is_data_dir(files):
                new_path = SinglePathWatcher(path, files)
                self.known_paths.append(new_path)
                logger.debug(
                    "Found \033[32mnew (slow) path %s\033[0m with %s",
                    path.relative_to(self.root),
                    new_path.counts,
                )
                change = True

            # Check if we've taken too long and pause
            if time_limit and time.monotonic() - entry_time > time_limit:
                logger.debug("Reached walking time limit of %s, pausing", time_limit)
                time_limit = yield change
                change = False
                entry_time = time.monotonic()

        # We're done with this walker
        logger.debug(
            "Scan for new paths complete. Total time including waits: %.2f seconds for %s paths",
            time.monotonic() - start_time,
            checked_dircount,
        )
        self._walker = None
        return change

    def _scan_existing_paths(
        self, time_limit: float = None, start_time: float = 0
    ) -> ScanGenerator:
        start_time = start_time or time.monotonic()
        entry_time = start_time
        change = False
        logger.debug("Starting single path updating")

        # Get a sorted list of everything to check
        def _sort_paths(path):
            """Sort path objects, starting with those without an update"""
            if not path.last_update:
                return (False, path.path)
            else:
                return (start_time - path.last_update, path.path)

        paths_to_update = sorted(self.known_paths, key=_sort_paths)

        # Run the scans until we run out of time
        for path in paths_to_update:
            if path.scan():
                change = True
                logger.debug(
                    "Updated %s to %s", path.path.relative_to(self.root), path.counts
                )

            if time_limit:
                logger.debug(
                    "Scanned %s, %.2f remaining",
                    path.path.relative_to(self.root),
                    time_limit - (time.monotonic() - entry_time),
                )
            if time_limit and time.monotonic() - entry_time > time_limit:
                logger.debug("Reached scan time limit during path update")
                time_limit = yield change
                change = False
                entry_time = time.monotonic()

        if paths_to_update:
            logger.debug(
                "Single path updating done in %.2f seconds",
                time.monotonic() - start_time,
            )

        return change

    def _scan(self, time_limit: float = None, start_time: float = 0) -> ScanGenerator:
        """
        Run scans over the known folders and look for new ones.

        Args:
            time_limit: Don't spend much longer than this searching at once
        """
        start_time = start_time or time.monotonic()

        change = yield from self._scan_for_new_paths(time_limit, start_time)
        change = yield from _merge_bool_into_generator(
            change,
            self._scan_existing_paths(time_limit, start_time),
        )

        logger.debug("Scan completed in %.2f seconds.", time.monotonic() - start_time)
        return change

    def scan(self, time_limit: float = None) -> bool:
        """Start or continue a scan with a time limit.

        If the limit is reached, it will continue from the previous stop
        point the next time it is called.

        Args:
            time_limit: The length to time, in seconds, to pause scanning after

        Returns:
            True if something changed this scan iteration
        """

        try:
            if self._current_scan:
                logger.debug("Resuming previous scan")
                return self._current_scan.send(time_limit)
            else:
                logger.debug("Starting new scan")
                self._current_scan = self._scan(time_limit)
                return next(self._current_scan)
        except StopIteration as result:
            # Finished scan, so clear
            self._current_scan = None
            return result.value


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Monitor for updates in a folder tree")
    # parser.add_argument("-v", "--verbose", action="store_true", help="Verbose output")
    parser.add_argument("path", help="The path to scan", type=Path)
    options = parser.parse_args()
    logging.basicConfig(level=logging.DEBUG)

    scanner = PathScanner(options.path.resolve())
    while True:
        updated = scanner.scan(time_limit=5)
        logger.debug("Waiting before rescan (updated: %s)", updated)
        time.sleep(5)
