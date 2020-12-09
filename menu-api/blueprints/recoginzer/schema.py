from marshmallow import Schema
from webargs import fields


class MenuItemRecognizeSchema(Schema):
    bound = fields.List(fields.List(fields.Number()))
    text = fields.List(fields.Str())


class MenuRecognizeSchema(Schema):
    result = fields.List(fields.Nested(MenuItemRecognizeSchema))


class MenuRecognizeResponseSchema(Schema):
    data = fields.Nested(MenuRecognizeSchema)
