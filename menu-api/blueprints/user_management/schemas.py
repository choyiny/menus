from marshmallow import Schema
from webargs import fields


class NewOrUpdateUserSchema(Schema):
    # Partially copied from admin/schema CreateUserSchema
    email = fields.Email()
    email_verified = fields.Bool()
    phone_number = fields.Str()
    password = fields.Str()
    display_name = fields.Str()
    photo_url = fields.Str()

    firebase_id = fields.Str()

    restaurant = fields.Str(fields.Str(required=True))


class PaginationSchema(Schema):
    limit = fields.Int()
    page = fields.Int()
