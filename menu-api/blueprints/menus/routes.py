from flask import Blueprint, Flask
from flask_apispec import FlaskApiSpec

from . import bp_name
from .controllers import (
    MenusResource,
    MenuResource,
    ImportMenuResource,
    AllMenuResource,
    QRMenuResource,
)


def set_routes(app: Flask, bp: Blueprint, docs: FlaskApiSpec):
    # a list of resources
    resources = [
        (MenusResource, "/menus/", "users", ["POST"]),
        (MenuResource, "/menus/<string:slug>", "user", ["GET", "PATCH", "DELETE"]),
        (ImportMenuResource, "/menus/<string:slug>/items/import", "import", ["POST"]),
        (AllMenuResource, "menus/all", "all", ["GET"]),
        (QRMenuResource, "menus/generate_qr/<string:slug>", "QR", ["GET"]),
    ]

    for resource, route, name, methods in resources:
        bp.add_url_rule(route, view_func=resource.as_view(name), methods=methods)

    app.register_blueprint(bp)

    for resource, route, name, methods in resources:
        docs.register(resource, blueprint=bp_name, endpoint=name)
