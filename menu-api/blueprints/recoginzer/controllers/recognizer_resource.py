from flask_apispec import doc, marshal_with
from helpers import BaseResource, ErrorResponseSchema


@doc(tags=["Menu Recognizer"])
@marshal_with(ErrorResponseSchema, code=401)
@marshal_with(ErrorResponseSchema, code=404)
class RecognizerResource(BaseResource):
    @doc(description="""Scan an image and return recognized text""")
    def post(self):
        pass
