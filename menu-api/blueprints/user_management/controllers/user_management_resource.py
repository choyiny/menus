from contextlib import closing

from auth.decorators import firebase_login_required
from auth.documents.user import User
from firebase_admin import auth
from firebase_admin._auth_utils import (
    EmailAlreadyExistsError,
    PhoneNumberAlreadyExistsError,
    UserNotFoundError,
)
from flask import g
from flask_apispec import doc, marshal_with, use_kwargs

from ...auth.schemas import UserSchema, UsersSchema
from ..schemas import NewOrUpdateUserSchema
from .user_management_base_resource import UserManagementBaseResource


class UserResource(UserManagementBaseResource):
    @doc(description="""Get a list of all users""")
    @marshal_with(UsersSchema)
    @firebase_login_required
    def get(self):
        if g.user is None or not g.user.is_admin:
            return {"description": "You do not have permission"}, 401

        return {"users": [user for user in User.objects()]}

    @doc(description="""Create or link existing user""")
    @firebase_login_required
    @use_kwargs(NewOrUpdateUserSchema)
    @marshal_with(UserSchema)
    def post(self, **kwargs):
        if g.user is None or not g.user.is_admin:
            return {"description": "You do not have permission"}, 401

        firebase_id = kwargs.pop("firebase_id", None)
        menus = kwargs.pop("menus", None)

        user = None

        # Updating user
        if firebase_id is not None:
            user = User.objects(firebase_id=firebase_id).first()

            if user is not None:
                user.menus = menus
                user.save()
            else:
                try:
                    firebase_user = auth.get_user(firebase_id)
                    user = User.create(
                        firebase_id=firebase_user.uid,
                        email=firebase_user.email,
                        phone_number=firebase_user.phone_number,
                        display_name=firebase_user.display_name,
                        photo_url=firebase_user.photo_url,
                        menus=menus,
                        is_admin=False,
                    )

                except (ValueError, UserNotFoundError):
                    return (
                        {"description": "Cannot find user with specified firebase id"},
                        404,
                    )

        # Creating user
        else:
            # Copied from admin_resource.py AdminUserResource
            try:
                firebase_user = auth.create_user(**kwargs)
            except EmailAlreadyExistsError:
                return {"description": "User already exists with that email"}, 400
            except PhoneNumberAlreadyExistsError:
                return (
                    {"description": "User already exists with that phone-number"},
                    400,
                )
            user = User.create(
                firebase_id=firebase_user.uid,
                email=firebase_user.email,
                phone_number=firebase_user.phone_number,
                display_name=firebase_user.display_name,
                photo_url=firebase_user.photo_url,
                menus=menus,
                is_admin=False,
            )

        return user


class UsersResource(UserManagementBaseResource):
    @doc(description="""Get information about a user""")
    @firebase_login_required
    def get(self, firebase_id):
        if g.user is None or not g.user.is_admin:
            return {"description": "You do not have permission"}, 401

        return "hello"

    @doc(description="""Update user permission""")
    @firebase_login_required
    def patch(self, firebase_id):
        if g.user is None or not g.user.is_admin:
            return {"description": "You do not have permission"}, 401

        return "hello"
