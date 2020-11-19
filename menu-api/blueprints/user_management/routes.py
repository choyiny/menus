from .controllers import (
    AnonymousUserResource,
    EmailUserResource,
    UserResource,
    UsersResource,
)

resources = [
    (UserResource, "users", "user", ["GET", "POST"]),
    (UsersResource, "users/<string:firebase_id>", "users", ["GET", "PATCH"]),
    (AnonymousUserResource, "anonymous", "anonymous", ["POST", "PATCH"]),
    (EmailUserResource, "email", "email", ["GET"]),
]
