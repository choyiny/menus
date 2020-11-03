from marshmallow import INCLUDE, Schema, fields

from ..auth.schemas import UserSchema


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


pagination_args = {
    "page": fields.Int(description="Page number of table", default=1),
    "limit": fields.Int(description="How many entries per page", default=5),
}

qr_args = {"url": fields.Str(description="url of website to be encoded")}

file_args = {"file": fields.Field()}
