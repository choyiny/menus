from blueprints.admin.schemas import file_args
from flask_apispec import doc, marshal_with, use_kwargs
from helpers import BaseResource, ErrorResponseSchema
from marshmallow import Schema
from webargs import fields
from webargs.flaskparser import use_args


@doc(tags=["Menu Recognizer"])
@marshal_with(ErrorResponseSchema, code=401)
@marshal_with(ErrorResponseSchema, code=404)
class RecognizerResource(BaseResource):
    class RecognizerSchema(Schema):
        template = fields.Str(
            description="Template type for type of algorithm to parse image",
            example="Row",
        )

    @doc(description="""Scan an image and return recognized text""")
    @use_args(file_args, location="files")
    @use_kwargs(RecognizerSchema, location="form")
    def post(self, args, **kwargs):
        file = args.get("file")
        content = file.read()
        return "hello"
