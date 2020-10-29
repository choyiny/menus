from .controllers import UserResource, UsersResource

resources = [
    (UserResource, "users", "user", ["GET", "POST"]),
    (UsersResource, "users/<string:firebase_id>", "users", ["GET", "PATCH"]),
]
