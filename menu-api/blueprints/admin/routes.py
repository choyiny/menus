from .controllers import AdminUserResource

# a list of resources
resources = [
    (AdminUserResource, "users/", "admin", ["POST", "GET", "PATCH"]),
]
