from flask import Blueprint, Flask
from flask_apispec import FlaskApiSpec

from . import bp_name
from .controllers import AuthResource, ClaimSlugResource, UserResource


# a list of resources
resources = [
    (AuthResource, "", "authentication", ["POST"]),
    (ClaimSlugResource, "claim/", "claim", ["PATCH"]),
    (UserResource, "users/", "users", ["GET", "POST"]),
]


