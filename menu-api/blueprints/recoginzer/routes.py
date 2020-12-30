from .controllers import RecognizerResource

# a list of resources
resources = [
    (RecognizerResource, "/recognize", "recognizer", ["POST"]),
]
