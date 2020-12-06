from blueprints.admin.schemas import file_args
from flask_apispec import doc, marshal_with, use_kwargs
from helpers import BaseResource, ErrorResponseSchema
from marshmallow import Schema
from webargs import fields
from webargs.flaskparser import use_args

from ..recognizer import recognizer_factory


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
    def post(self, args, **kwargs):
        file = args.get("file")
        content = file.read()
        template = kwargs.get('template')

        recognizer_class = recognizer_factory(template)
        if not recognizer_class:
            return { "description": "Invalid template name: " + template }, 400
        
        recognizer = recognizer_class({})
        result = recognizer.recognize(content)
        return {"data": result}
