"""Test utilities for generating an artificial folder"""
import argparse
import logging
import random
import time
from pathlib import Path
from typing import Dict, Optional

try:
    from pronounceable import PronounceableWord
except ModuleNotFoundError:
    PronounceableWord = None

proteins = ["ipns", "vioc", "ctx", "AlkB", "thaumatin", "lysozyme"]
modifiers = ["dark", "apo", "glovebox", "vo", "erta", "4deg"]

wordgen = PronounceableWord() if PronounceableWord else None

logger = logging.getLogger(__name__)


def _generate_protein():
    """Generate a random protein collection name"""
    return "_".join(
        [random.choice(proteins)]
        + random.choices(modifiers, k=random.choices([0, 1, 2], [1, 10, 10], k=1)[0])
    )


def _next_chip_name(previous: Optional[str] = None):
    """Generate the next name in a grid series"""
    if previous is not None:
        letter = previous[0]
        if letter == "z":
            letter = "a"
        else:
            letter = chr(ord(letter) + 1)
    else:
        letter = "a"
    word = ""
    if wordgen is None:
        # We don't have a run-time dependence on pronounceable. If not present, fudge
        word = f"{letter}{random.randrange(100000):05}"
    else:
        while not word.startswith(letter):
            word = wordgen.length(6, 7)

    return word


class ProcessFolder:
    def __init__(self, path: Path, protein: str, chip: str):
        self.path = path / protein / chip
        self.protein = protein
        self.chip = chip
        self.path.mkdir(parents=True)
        (self.path / "dials.process.log").touch()
        self.imported = 0
        self.indexed = 0
        self.integrated = 0

    def generate(self, num_images=1, p_index: float = 0.2) -> "ProcessFolder":
        """Generate a number of fake processed image outputs.

        Args:
            num_imags: How many processed images to create
            p_index: The probability to index, and generate additional lattices

        Returns: The ProcessFolder instance, for chaining
        """

        for _ in range(num_images):
            self.imported += 1
            filename = self.path / f"{self.path.name}_{self.imported:05d}_imported.expt"
            logger.debug("Creating %s", filename)
            filename.touch()

            if random.random() <= p_index:
                self.indexed += 1
                (
                    self.path / f"{self.path.name}_{self.imported:05d}_indexed.refl"
                ).touch()

                lattices = 1
                while random.random() <= p_index:
                    lattices += 1
                lattices = min(lattices, 10)
                self.integrated += lattices
                for i in range(min(lattices, 10)):
                    (self.path / f"int_{self.imported:05d}_{i:02d}.pickle").touch()
        return self


class I24Generator:
    """Generate an I24-style data processing folder"""

    def __init__(self, path: Path):
        self.last_chip_name: str = ""
        self.path = path

    def generate_chip(self, protein: str = None) -> ProcessFolder:
        """Generate a chip processing folder, optionally with processed images.

        Args:
            with_images: Pregenerate this many processed images
            indexed: The Fraction of images to generate indexing
            integrated: The Fraction of images to generate integration
        """
        self.last_chip_name = _next_chip_name(self.last_chip_name)
        return ProcessFolder(
            self.path,
            protein or _generate_protein(),
            self.last_chip_name,
        )


KEEP_PROTEIN_PROBABILITY = 0.8
TIME_PER_GRID = 20
FILE_CREATE_RATE = 3
IMAGE_COUNT = 100
LATTICE_PROBABILITY = 0.2


def run():
    parser = argparse.ArgumentParser(
        description="Generate a fake stills_process folder tree",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument("path", type=Path, help="The path to generate under")
    # parser.add_argument("--chip-time", type=float, help="Number of seconds before switching to a new chip", default=20)
    # parser.add_argument("--rate", type=int, help="Number of files to process per second")
    options = parser.parse_args()
    logging.basicConfig(level=logging.DEBUG)

    generator = I24Generator(options.path)
    chips: Dict[str, ProcessFolder] = {}
    while True:
        protein = _generate_protein()

        while random.random() < KEEP_PROTEIN_PROBABILITY:
            # Make a new chip
            start_time = time.monotonic()
            chip = generator.generate_chip(protein)
            chips[chip.chip] = chip

            while time.monotonic() - start_time < TIME_PER_GRID:
                for chip in list(chips.values()):
                    images_to_create = max(
                        0, min(FILE_CREATE_RATE, IMAGE_COUNT - chip.imported)
                    )
                    if images_to_create:
                        chip.generate(images_to_create, LATTICE_PROBABILITY)
                    if chip.indexed >= IMAGE_COUNT:
                        del chips[chip.chip]
                time.sleep(1)


if __name__ == "__main__":
    run()
