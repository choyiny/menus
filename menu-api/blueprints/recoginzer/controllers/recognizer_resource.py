from auth.decorators import firebase_login_required
from blueprints.admin.schemas import file_args
from flask_apispec import doc, marshal_with, use_kwargs
from helpers import BaseResource, ErrorResponseSchema
from marshmallow import Schema
from webargs import fields
from webargs.flaskparser import use_args

from ..recognizer import recognizer_factory
from ..schema import MenuRecognizeSchema


@doc(tags=["Menu Recognizer"])
@marshal_with(ErrorResponseSchema, code=401)
@marshal_with(ErrorResponseSchema, code=404)
class RecognizerResource(BaseResource):
    class RecognizerSchema(Schema):
        template = fields.Str(
            required=True,
            description="Template type for type of algorithm to parse image",
            example="row",
        )

    @doc(description="""Scan an image and return recognized text""")
    @use_args(file_args, location="files")
    @use_kwargs(RecognizerSchema, location="form")
    @firebase_login_required
    @marshal_with(MenuRecognizeSchema)
    def post(self, args, **kwargs):
        template = kwargs.get("template")
        recognizer_class = recognizer_factory(template)
        if not recognizer_class:
            return {"description": "Invalid template name: " + template}, 400

        if not args.get("file"):
            return {"description": "Missing image"}, 400
        file = args.get("file")
        content = file.read()
        recognizer = recognizer_class({})
        recognizer.recognize(content)
        return recognizer.recognize(content)
