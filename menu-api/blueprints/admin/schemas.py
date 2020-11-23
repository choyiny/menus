from marshmallow import Schema, fields

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


class CreateRestaurantSchema(Schema):
    slug = fields.Str(
        description="Slug of the menu", example="hollywood", required=True
    )
    name = fields.Str(
        description="Name of the restaurants", example="Hollywood Cafe", allow_none=True
    )
    image = fields.Url(example="https://via.placeholder.com/150", allow_none=True)
    description = fields.Str(example="A cafe in Hollywood", allow_none=True)
    public = fields.Bool(
        example=True, description="Allow restaurant to be viewable", allow_none=True
    )


pagination_args = {
    "page": fields.Int(description="Page number of table", default=1),
    "limit": fields.Int(description="How many entries per page", default=5),
}

qr_args = {"url": fields.Str(description="url of website to be encoded")}

file_args = {"file": fields.Field()}
