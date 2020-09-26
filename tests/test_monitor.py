import pytest

from monitor.generator import I24Generator
from monitor.monitor import PathScanner


@pytest.fixture
def i24(tmp_path):
    return I24Generator(tmp_path)


def test_generator(i24):
    chip = i24.generate_chip().generate(100)
    assert chip.imported == 100
    assert len(list(chip.path.glob("*_imported.expt"))) == 100


# def test_process_delete(i24):
#     chip = i24.generate_chip().generate(100)

#     print(chip.path)
# breakpoint()
