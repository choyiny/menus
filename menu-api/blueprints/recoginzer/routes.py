from .controllers import RecognizerResource

# a list of resources
resources = [
    (RecognizerResource, "/recognizer", "recognizer", ["POST"]),
]
