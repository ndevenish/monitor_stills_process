import argparse
import datetime
import json
import logging
from copy import deepcopy
from pathlib import Path

from flask import Flask, send_file
from flask_cors import CORS

from .backgroundmonitor import BackgroundMonitor

logger = logging.getLogger()

scanner = None


def create_app(test_config=None):
    # Find the static folder
    static_folder = Path(__file__).parent.parent.parent / "static"
    print(static_folder)
    app = Flask(__name__, static_url_path="", static_folder=str(static_folder))
    CORS(app)

    if test_config is not None:
        app.config.from_mapping(test_config)

    raw_example_data = json.loads(
        (Path(__file__).parent / "example_data.json").read_bytes()
    )

    @app.route("/")
    def index():
        return send_file(static_folder / "index.html")

    @app.route("/api")
    def return_process_list():
        if scanner is None:
            data = deepcopy(raw_example_data)
            time = datetime.datetime.now()
            fraction = (
                time.minute / 60
                + (time.second / 60 / 60)
                + time.microsecond / 1e6 / 60 / 60
            )
            # fraction = time.second / 60 + ()
            for x in data:
                for col in ["integrated", "indexed", "processed"]:
                    x[col] = int(x[col] * fraction)
        else:
            data = scanner.results()
        return json.dumps(data)

    return app


def run():
    parser = argparse.ArgumentParser()
    parser.add_argument("root", help="Root path to monitor", type=Path)
    options = parser.parse_args()
    logging.basicConfig(level=logging.DEBUG)

    logger.info(f"Monitoring {options.root.resolve()}")

    global scanner
    scanner = BackgroundMonitor(root=options.root)
    scanner.start()

    logging.basicConfig(level=logging.DEBUG)
    app = create_app()
    try:
        app.run()
    finally:
        logger.info("Shutting down background scanner")
        scanner.stop()


if __name__ == "__main__":
    run()
