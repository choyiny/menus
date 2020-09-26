from marshmallow import Schema, fields


class PostUserSchema(Schema):
    username = fields.Str(required=True)
    password = fields.Str(required=True)


class UserAuthenticatedSchema(Schema):
    authenticated = fields.Bool()


class GetUserSchema(Schema):
    id = fields.Str(required=True)
    username = fields.Str(required=True)
    menus = fields.List(fields.Str(), example=["charcoal-grill", "spicy-house"])
    is_admin = fields.Bool()


class ClaimSlugSchema(Schema):
    user_id = fields.Str(required=True)
    slug = fields.Str(required=True)


class GetUsersSchema(Schema):
    users = fields.List(fields.Nested(GetUserSchema))


class PromoteUserSchema(Schema):
    user_id = fields.Str(required=True)
