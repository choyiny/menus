from .controllers import AuthResource

# a list of resources
resources = [
    (AuthResource, "", "authentication", ["POST"]),
]
