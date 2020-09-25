from marshmallow import Schema, fields


class PostUser(Schema):
    username = fields.Str(required=True)
    password = fields.Str(required=True)


class Authenticated(Schema):
    authenticated = fields.Bool()
