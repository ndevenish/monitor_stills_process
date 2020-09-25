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


class SinglePathWatcher:
    """Watch a single stills process folder."""

    def __init__(
        self, path: Path, initial_files: Union[Iterable[Path], Iterable[str]] = []
    ):
        self.path = path
        self.counts = Counts(0, 0, 0)
        self.last_update = time.monotonic()
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
            "path": self.path.relative_to(relative_to),
            "last_update": time.monotonic() - self.last_update,
        }


def is_data_dir(files: List[str]):
    """Identify a data directory by the files content"""
    return any(
        x.endswith("datablock.json") or x.endswith("imported.expt") for x in files
    )


class PathScanner:
    def __init__(self, root: Path):
        self.root = root.resolve()
        self.known_paths: List[SinglePathWatcher] = []
        self._current_scan: Optional[ScanGenerator] = None

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

        # Although os.walk might be slower, we use it here because we need
        # to check every folder for subfolders at least once
        for (basepath, dirs, files) in os.walk(self.root):
            path = Path(basepath)
            for dirname in list(dirs):
                if (path / dirname) in known:
                    dirs.remove(dirname)
                elif is_data_dir(files):
                    self.known_paths.append(SinglePathWatcher(path, files))
                    change = True
            # Check if we've taken too long and pause
            if time_limit and time.monotonic() - entry_time > time_limit:
                logger.debug("Reached walking time limit of %s, pausing", time_limit)
                time_limit = yield change
                change = False
                entry_time = time.monotonic()

        # We're done with this walker
        logger.debug(
            "New path complete. Total time including waits: %s seconds",
            time.monotonic() - start_time,
        )
        self._walker = None
        return change

    def _scan(self, time_limit: float = None, start_time: float = 0) -> ScanGenerator:
        """
        Run scans over the known folders and look for new ones.

        Args:
            time_limit: Don't spend much longer than this searching at once
        """
        start_time = start_time or time.monotonic()
        entry_time = start_time

        # Check for resume or new scan
        paths_to_update = sorted(
            self.known_paths, key=lambda x: start_time - x.last_update
        )

        change = False

        # Run the scans until we run out of time
        for path in paths_to_update:
            change = change or path.scan()
            if time_limit and time.monotonic() - entry_time > time_limit:
                logger.debug("Reached scan time limit during path update")
                time_limit = yield change
                change = False
                entry_time = time.monotonic()

        logger.debug(
            "Single path updating done in %s",
            time.monotonic() - start_time,
        )

        path_scanner = self._scan_for_new_paths(
            time_limit=time_limit, start_time=start_time
        )
        # If something changed here, then we need to mix the signal in
        # with the first/only return value from the sub-generator
        try:
            if change:
                # Whatever the path scanner finds, we know a change happened
                next(path_scanner)
                yield True
        except StopIteration as result:
            change = result.value
        else:
            # Now we solved the first change mixer, can just return everything
            change = yield from path_scanner

        logger.debug("Scan completed.")
        return change

    def scan(self, time_limit: float = None) -> bool:
        """Start or continue a scan with a time limit.

        If the limit is reached, it will continue from the previous stop
        point the next time it is called.

        Args:
            time_limit: The length to time to stop scanning after

        Returns:
            True if something changed this scan iteration
        """

        try:
            if not self._current_scan:
                self._current_scan = self._scan(time_limit)
                return next(self._current_scan)
            else:
                return self._current_scan.send(time_limit)
        except StopIteration as result:
            # Finished scan, so clear
            self._current_scan = None
            return result.value
