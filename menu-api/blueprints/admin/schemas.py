from marshmallow import fields, Schema, INCLUDE
from ..auth.schemas import UserSchema


class PromoteUserSchema(Schema):
    user_id = fields.Str(required=True)
    slug = fields.Str(required=True)


class UsersSchema(Schema):
    users = fields.List(fields.Nested(UserSchema))


class CreateUserSchema(Schema):
    email = fields.Email()
    email_verified = fields.Bool()
    phone_number = fields.Str()
    password = fields.Str()
    display_name = fields.Str()
    photo_url = fields.Str()
