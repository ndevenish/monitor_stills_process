import argparse
import random
import time
from pathlib import Path
from typing import List

import numpy
from pronounceable import PronounceableWord

proteins = ["ipns", "vioc", "ctx", "AlkB", "thaumatin", "lysozyme"]
modifiers = ["dark", "apo", "glovebox", "vo", "erta", "4deg"]

wordgen = PronounceableWord()


def _new_sample():
    parts = [random.choice(proteins)] + random.choices(
        modifiers, k=random.choices([0, 1, 2], [1, 10, 10], k=1)[0]
    )
    return "_".join(parts)


def next_name(previous=None):
    if previous is not None:
        letter = previous[0]
        if letter == "z":
            letter = "a"
        else:
            letter = chr(ord(letter) + 1)
    else:
        letter = "a"
    word = ""
    iterations = 0
    while not word.startswith(letter):
        word = wordgen.length(6, 7)
        iterations += 1
    return word


TIME_PER_GRID = 20
FILE_CREATE_RATE = 3
IMAGE_COUNT = 100
# INDEX_PROBABILITY = 0.2
LATTICE_COUNT = 0.7

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("path", type=Path, help="The path to generate under")
    options = parser.parse_args()

    name = None
    grids_to_process = {}
    grid_runs = {}
    run_number = 1

    while True:
        sample = Path(_new_sample())
        grids: List[str] = []
        # 80% chance per extra grid
        while not grids or random.random() > 0.2:
            start_time = time.monotonic()
            name = next_name(name)
            grids.append(name)
            new_grid = sample / name
            grids_to_process[sample / name] = 0
            grid_runs[sample / name] = run_number
            run_number += 1

            print(f"Creating grid {sample/name}")
            (options.path / sample / name).mkdir(exist_ok=True, parents=True)
            (options.path / sample / name / "dials.process.log").touch()
            while time.monotonic() - start_time < TIME_PER_GRID:
                # Create files for the active grids
                for path in list(grids_to_process.keys()):
                    # Create files
                    for x in range(
                        grids_to_process[path],
                        min(IMAGE_COUNT, grids_to_process[path] + FILE_CREATE_RATE),
                    ):
                        filename = path / f"{path.name}_{x:05d}_imported.expt"
                        print(filename)
                        (options.path / filename).touch()
                        lattices = numpy.random.poisson(LATTICE_COUNT)
                        if lattices:
                            (
                                options.path
                                / path
                                / f"{path.name}_{x:05d}_indexed.refl"
                            ).touch()
                            for i in range(lattices):
                                (
                                    options.path / path / f"int_{x:05d}_{i:02d}.pickle"
                                ).touch()
                    grids_to_process[path] += FILE_CREATE_RATE
                    if grids_to_process[path] > IMAGE_COUNT:
                        del grids_to_process[path]
                        print("Dropping ", path)
                time.sleep(1)
