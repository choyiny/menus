from flask import Blueprint, Flask
from flask_apispec import FlaskApiSpec

from . import bp_name
from .controllers import AuthResource, ClaimSlugResource, UserResource, PromoteUser


def set_routes(app: Flask, bp: Blueprint, docs: FlaskApiSpec):
    # a list of resources
    resources = [
        (AuthResource, "auth/", "authentication", ["POST"]),
        (ClaimSlugResource, "claim/", "claim", ["PATCH"]),
        (UserResource, "users/", "users", ["GET", "POST"]),
        (PromoteUser, "promote/", "promote", ["PATCH"]),
    ]

    for resource, route, name, methods in resources:
        bp.add_url_rule(route, view_func=resource.as_view(name), methods=methods)

    app.register_blueprint(bp)

    for resource, route, name, methods in resources:
        docs.register(resource, blueprint=bp_name, endpoint=name)