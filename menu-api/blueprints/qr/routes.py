from .controllers import DynamicQrResource

# a list of resources
resources = [
    (DynamicQrResource, "<string:slug>", "dynamic-qr", ["GET"]),
]
