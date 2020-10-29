from .controllers import AdminTracingResource, AdminUserResource

# a list of resources
resources = [
    (AdminUserResource, "users/", "admin", ["POST", "GET", "PATCH"]),
    (AdminTracingResource, "menus/<string:slug>/tracing", "tracing", ["PATCH"]),
]
