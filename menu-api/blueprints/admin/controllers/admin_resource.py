from .admin_base_resource import AdminBaseResource
from flask import g
from flask_apispec import marshal_with, use_kwargs, doc

from auth.decorators import firebase_login_required
from auth.documents.user import User
from ..schemas import (
    UsersSchema,
    PromoteUserSchema,
    UserSchema,
    CreateUserSchema,
)
from firebase_admin import auth


class AdminUserResource(AdminBaseResource):
    @marshal_with(UsersSchema)
    @firebase_login_required
    def get(self):
        if g.user is None or not g.user.is_admin:
            return {"description": "You do not have permission"}, 401
        return {"users": [user for user in User.objects()]}

    @firebase_login_required
    @use_kwargs(CreateUserSchema)
    @marshal_with(UserSchema)
    def post(self, **user_info):
        """Create firebase user"""
        # if g.user is None or not g.user.is_admin:
        #     return {"description": "You do not have permission"}, 401
        print(user_info)
        firebase_user = auth.create_user(**user_info)
        user = User.create(
            firebase_id=firebase_user.uid,
            email=firebase_user.email,
            phone_number=firebase_user.phone_number,
            menus=[],
            is_admin=False
        )
        return user

    @doc(description="""Claim Restaurant url for user""")
    @use_kwargs(PromoteUserSchema)
    @marshal_with(UserSchema)
    @firebase_login_required
    def patch(self, **kwargs):
        if g.user is None or not g.user.is_admin:
            return {"description": "You do not have permission"}, 401
        slug = kwargs["slug"]
        firebase_id = kwargs["firebase_id"]
        user = User.objects(firebase_id=firebase_id).first()
        if slug not in user.menus:
            user.menus.append(slug)
        return user.save()
