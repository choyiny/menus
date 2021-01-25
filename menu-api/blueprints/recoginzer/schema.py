from marshmallow import Schema
from webargs import fields


class MenuItemRecognizeSchema(Schema):
    bounds = fields.List(fields.List(fields.Number()), example=[[0, 0], [1028, 700]])
    text = fields.List(fields.Str(), example=["Double", "smoked", "bacon", "lardon,"])


class MenuRecognizeSchema(Schema):
    results = fields.List(fields.Nested(MenuItemRecognizeSchema))
