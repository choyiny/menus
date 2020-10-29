from marshmallow import Schema, fields


class UserSchema(Schema):
    menus = fields.List(fields.Str(), example=["charcoal-grill", "spicy-house"])
    is_admin = fields.Bool()
    firebase_id = fields.Str(required=True)
    email = fields.Email()
    phone_number = fields.Str()
    display_name = fields.Str()
    photo_url = fields.Str()


class UsersSchema(Schema):
    users = fields.List(fields.Nested(UserSchema))
