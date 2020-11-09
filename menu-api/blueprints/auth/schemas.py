from marshmallow import Schema, fields


class UserSchema(Schema):
    restaurants = fields.List(fields.Str(required=True))
    is_admin = fields.Bool()
    firebase_id = fields.Str(required=True)
    email = fields.Email()
    phone_number = fields.Str()
    display_name = fields.Str()
    photo_url = fields.Str()
    is_anon = fields.Bool()


class UsersSchema(Schema):
    users = fields.List(fields.Nested(UserSchema))


class UsersWithPaginationSchema(UsersSchema):
    total_page = fields.Int()
