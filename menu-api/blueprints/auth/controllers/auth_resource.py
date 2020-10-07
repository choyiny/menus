from .auth_base_resource import AuthBaseResource
from flask import g
from flask_apispec import marshal_with, use_kwargs, doc

from auth.decorators import firebase_login_required
from auth.documents.user import User
from ..schemas import (
    ClaimSlugSchema,
    UserSchema,
    GetUsersSchema,
)


class AuthResource(AuthBaseResource):
    @doc(description="""Authenticate User""")
    @marshal_with(UserSchema)
    @firebase_login_required
    def post(self):
        if g.user is None:
            return {"description": "Cannot authenticate"}, 401
        return g.user


class ClaimSlugResource(AuthBaseResource):
    @doc(description="""Claim Restaurant url for user""")
    @firebase_login_required
    @use_kwargs(ClaimSlugSchema)
    @marshal_with(UserSchema)
    def patch(self, **kwargs):
        if g.user is None or not g.user.is_admin:
            return {"description": "You do not have permission"}, 401
        slug = kwargs["slug"]
        firebase_id = kwargs["firebase_id"]
        user = User.objects(firebase_id=firebase_id).first()
        if slug not in user.menus:
            user.menus.append(slug)
        return user.save()


class UserResource(AuthBaseResource):
    @firebase_login_required
    @marshal_with(GetUsersSchema)
    def get(self):
        if g.user is None or not g.user.is_admin:
            return {"description": "You do not have permission"}, 401
        return {"users": [user for user in User.objects()]}
