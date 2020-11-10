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

    restaurants = fields.List(fields.Str())


class PaginationSchema(Schema):
    limit = fields.Int()
    page = fields.Int()


class AnonymousUserSchema(Schema):
    firebase_id = fields.Str()
