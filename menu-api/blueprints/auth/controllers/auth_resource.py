from .auth_base_resource import AuthBaseResource
from flask import g
from flask_apispec import marshal_with, use_kwargs, doc

from auth.decorators import with_current_user
from auth.documents.user import User
from ..schemas import (
    PostUserSchema,
    ClaimSlugSchema,
    GetUserSchema,
    GetUsersSchema,
    PromoteUserSchema,
)


class AuthResource(AuthBaseResource):
    @doc(description="""Authenticate User""")
    @use_kwargs(PostUserSchema)
    @marshal_with(GetUserSchema)
    def post(self, **kwargs):
        username = kwargs["username"]
        password = kwargs["password"]
        user = User.objects(username=username).first()
        if user is None:
            return {"description": "user does not exist"}, 404
        elif not user.verify_password(password):
            return {"description": "Invalid Credentials"}, 401
        else:
            return user


class ClaimSlugResource(AuthBaseResource):
    @doc(description="""Claim Restaurant url for user""")
    @with_current_user
    @use_kwargs(ClaimSlugSchema)
    @marshal_with(GetUserSchema)
    def patch(self, **kwargs):
        if g.user is None or not g.user.is_admin:
            return {"description": "You do not have permission"}, 401
        slug = kwargs["slug"]
        pk = kwargs["user_id"]
        user = User.objects(pk=pk).first()
        if slug not in user.menus:
            user.menus.append(slug)
        user.save()
        return user


class UserResource(AuthBaseResource):
    @doc(description="""Create new User""")
    @use_kwargs(PostUserSchema)
    @marshal_with(GetUserSchema)
    def post(self, **kwargs):
        user = User.create(**kwargs)
        return user

    @with_current_user
    @marshal_with(GetUsersSchema)
    def get(self):
        if g.user is None or not g.user.is_admin:
            return {"description": "You do not have permission"}, 401
        return {"users": [user for user in User.objects()]}
