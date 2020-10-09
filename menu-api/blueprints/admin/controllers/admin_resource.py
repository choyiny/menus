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
from firebase_admin._auth_utils import (
    PhoneNumberAlreadyExistsError,
    EmailAlreadyExistsError,
)


class AdminUserResource(AdminBaseResource):
    @marshal_with(UsersSchema)
    @firebase_login_required
    def get(self):
        if g.user is None or not g.user.is_admin:
            return {"description": "You do not have permission"}, 401
        return {"users": [user for user in User.objects()]}

    # @firebase_login_required
    @use_kwargs(CreateUserSchema)
    @marshal_with(UserSchema)
    def post(self, **user_info):
        """Create firebase user"""
        # if g.user is None or not g.user.is_admin:
        #     return {"description": "You do not have permission"}, 401
        try:
            firebase_user = auth.create_user(**user_info)
        except EmailAlreadyExistsError:
            return {"description": "User already exists with that email"}, 400
        except PhoneNumberAlreadyExistsError:
            return {"description": "User already exists with that phone-number"}, 400
        user = User.create(
            firebase_id=firebase_user.uid,
            email=firebase_user.email,
            phone_number=firebase_user.phone_number,
            display_name=firebase_user.display_name,
            photo_url=firebase_user.photo_url,
            menus=[],
            is_admin=False,
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
