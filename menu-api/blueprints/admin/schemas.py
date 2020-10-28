from ..auth.schemas import UserSchema
from marshmallow import fields, Schema, INCLUDE


class PromoteUserSchema(Schema):
    firebase_id = fields.Str(required=True)
    slug = fields.Str(required=True)


class CreateUserSchema(Schema):
    email = fields.Email()
    email_verified = fields.Bool()
    phone_number = fields.Str()
    password = fields.Str()
    display_name = fields.Str()
    photo_url = fields.Str()


class ContactTracingSchema(Schema):
    enable_trace = fields.Bool()
    force_trace = fields.Bool()
    tracing_key = fields.Str()
