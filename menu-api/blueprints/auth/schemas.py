from marshmallow import Schema, fields


class UserSchema(Schema):
    menus = fields.List(fields.Str(), example=["charcoal-grill", "spicy-house"])
    is_admin = fields.Bool()
    firebase_id = fields.Str(required=True)
    email = fields.Email()
    phone_number = fields.Str()


class ClaimSlugSchema(Schema):
    user_id = fields.Str(required=True)
    slug = fields.Str(required=True)


class GetUsersSchema(Schema):
    users = fields.List(fields.Nested(UserSchema))


class PromoteUserSchema(Schema):
    user_id = fields.Str(required=True)
