from flask_apispec import doc, marshal_with
from helpers import BaseResource, ErrorResponseSchema


@doc(tags=["Restaurant"])
@marshal_with(ErrorResponseSchema, code=404)
@marshal_with(ErrorResponseSchema, code=422)
@marshal_with(ErrorResponseSchema, code=412)
@marshal_with(ErrorResponseSchema, code=401)
class RestaurantBaseResource(BaseResource):
    pass
