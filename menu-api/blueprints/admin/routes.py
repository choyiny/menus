from .controllers import PromoteUserResource, UserResource

# a list of resources
resources = [
    (PromoteUserResource, "promote/", "promote", ["POST"]),
    (UserResource, "user/", 'user', ['POST', 'GET'])
]
