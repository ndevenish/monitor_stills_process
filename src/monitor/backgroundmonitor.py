import logging
import time
from pathlib import Path
from threading import Thread
from typing import Optional

from .monitor import PathScanner

logger = logging.getLogger(__name__)


class BackgroundMonitor(Thread):
    def __init__(self, root: Path, duty_cyle: float = 2):
        """
        Create the background monitor scanner.

        Args:
            root: The root path to scan
            duty_cycle: The time, in seconds, to spend on/off scanning
        """
        super().__init__()
        self.root = root
        self.duty_cycle = duty_cyle
        self._stop_thread = False
        # self.results: List[Dict] = []
        self._scanner = PathScanner(self.root)

    def run(self):
        while not self._stop_thread:
            self._scanner.scan(time_limit=self.duty_cycle)
            time.sleep(self.duty_cycle)

    def stop(self, timeout: Optional[float] = None):
        self._stop_thread = True
        self.join(timeout)

    def results(self):
        return self._scanner.to_dict()
