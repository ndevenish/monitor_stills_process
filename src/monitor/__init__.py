import datetime
import json
from copy import deepcopy
from pathlib import Path

from flask import Flask
from flask_cors import CORS

__version__ = "0.1.0"


def create_app(test_config=None):
    app = Flask(__name__)
    CORS(app)

    if test_config is not None:
        app.config.from_mapping(test_config)

    raw_example_data = json.loads(
        (Path(__file__).parent / "example_data.json").read_bytes()
    )

    @app.route("/api")
    def return_process_list():
        data = deepcopy(raw_example_data)
        fraction = datetime.datetime.now().second / 60
        for x in data:
            for col in ["integrated", "indexed", "processed"]:
                x[col] = int(x[col] * fraction)
        return json.dumps(data)

    return app
