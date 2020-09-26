from .auth_base_resource import AuthBaseResource
from flask import g
from flask_apispec import marshal_with, use_kwargs, doc

from auth.decorators import with_current_user
from auth.documents.user import User
from ..schemas import PostUserSchema, UserAuthenticatedSchema, UserPromotionSchema, GetUserSchema, GetUsersSchema


class AuthResource(AuthBaseResource):
    @doc(description="""Create new User""")
    @use_kwargs(PostUserSchema)
    def post(self, **kwargs):
        User.create(**kwargs).save()
        return 'new user created'

    @doc(description="""Authenticate User""")
    @with_current_user
    @marshal_with(UserAuthenticatedSchema)
    def get(self):
        if g.user is None:
            return {'authenticated': False}, 401
        else:
            return {'authenticated': True}


class ClaimSlugResource(AuthBaseResource):
    @doc(description="""Claim Restaurant url for user""")
    @with_current_user
    @use_kwargs(UserPromotionSchema)
    @marshal_with(GetUserSchema)
    def patch(self, **kwargs):
        if g.user is None or not g.user.is_admin:
            return {"description": "You do not have permission"}, 401
        slug = kwargs['slug']
        pk = kwargs['id']
        user = User.objects(pk=pk).first()
        if slug not in user.menus:
            user.menus.append(slug)
        user.save()
        return user


class UserResource(AuthBaseResource):
    @with_current_user
    @marshal_with(GetUsersSchema)
    def get(self):
        if g.user is None or not g.user.is_admin:
            return {"description": "You do not have permission"}, 401
        return {'users': [user for user in User.objects()]}

# class PromoteUser(AuthBaseResource):
#     @with_current_user
#     @marshal_with(GetUserSchema)
#     def patch(self):
#         if g.user is None or not g.user.is_admin:
#             return
