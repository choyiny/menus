from flask_apispec import doc, marshal_with

from helpers import BaseResource, ErrorResponseSchema


@doc(tags=["Authentication"])
@marshal_with(ErrorResponseSchema, code=404)
@marshal_with(ErrorResponseSchema, code=422)
class AuthBaseResource(BaseResource):
    pass
