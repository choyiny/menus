from .controllers import (
    AnonymousUserResource,
    EmailUserResource,
    UserResource,
    UsersResource,
    EmailCheckResource,
)

resources = [
    (UserResource, "users", "user", ["GET", "POST"]),
    (UsersResource, "users/<string:firebase_id>", "users", ["GET", "PATCH"]),
    (AnonymousUserResource, "anonymous", "anonymous", ["POST", "PATCH"]),
    (EmailUserResource, "verify", "verify", ["PATCH", "POST"]),
    (EmailCheckResource, "email/<string:email>", "email", ["GET"]),
]
