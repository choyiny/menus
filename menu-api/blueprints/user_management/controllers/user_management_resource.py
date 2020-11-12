import math
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
from utils.errors import FORBIDDEN

from ...auth.schemas import UserSchema, UsersWithPaginationSchema
from ..schemas import NewOrUpdateUserSchema, PaginationSchema
from .user_management_base_resource import UserManagementBaseResource


class UserResource(UserManagementBaseResource):
    @doc(description="""Get a list of all users""")
    @marshal_with(UsersWithPaginationSchema)
    @use_kwargs(PaginationSchema, location="querystring")
    @firebase_login_required
    def get(self, **kwargs):
        if g.user is None or not g.user.is_admin:
            return {"description": "You do not have permission"}, 401

        users = [user for user in User.objects()]
        page = kwargs.get("page", 1)
        limit = kwargs.get("limit", 20)
        return {
            "total_page": math.ceil(len(users) / limit),
            "users": users[(page - 1) * limit : page * limit],
        }

    @doc(description="""Create or link existing user""")
    @firebase_login_required
    @use_kwargs(NewOrUpdateUserSchema)
    @marshal_with(UserSchema)
    def post(self, **kwargs):
        if g.user is None or not g.user.is_admin:
            return FORBIDDEN

        firebase_id = kwargs.pop("firebase_id", None)
        restaurants = kwargs.pop("restaurants", None)

        # Updating user
        if firebase_id is not None:
            user = User.objects(firebase_id=firebase_id).first()

            if user:
                if restaurants:
                    user.restaurants = restaurants
                print(user.restaurants)
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
                        restaurants=restaurants,
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
                restaurants=restaurants,
                is_admin=False,
            )

        return user


class UsersResource(UserManagementBaseResource):
    @doc(description="""Get information about a user""")
    @marshal_with(UserSchema)
    @firebase_login_required
    def get(self, firebase_id):
        if not g.user.has_user_permission(firebase_id):
            return FORBIDDEN
        return User.objects(firebase_id=firebase_id).first()

    @doc(description="""Edit Users""")
    @firebase_login_required
    @use_kwargs(NewOrUpdateUserSchema)
    @marshal_with(UserSchema)
    def patch(self, firebase_id, **kwargs):
        if g.user is None or not g.user.is_admin:
            return FORBIDDEN
        if g.user is None or not g.user.is_admin:
            return FORBIDDEN

        user = User.objects(firebase_id=firebase_id).first()

        # one day someone will implement this
        # use this
        # https://firebase.google.com/docs/auth/admin/manage-users#python
        # if kwargs.get('email'):
        #     user.email = kwargs.get('email')
        #
        # if kwargs.get('phone_number'):
        #     user.phone_number = kwargs.get('phone_number')
        #
        # if kwargs.get('display_name'):
        #     user.display_name = kwargs.get('display_name')
        #
        # if kwargs.get('photo_url'):
        #     user.photo_url = kwargs.get('photo_url')
        #
        # if kwargs.get('restaurant'):
        #     user.restaurant = kwargs.get('restaurant')

        return user.save()


class AnonymousUserResource(UserManagementBaseResource):
    @doc(description="""Create anonymous user""")
    @marshal_with(UserSchema)
    @firebase_login_required
    def post(self):
        if g.user is None:
            return FORBIDDEN
        else:
            return g.user

    @doc(description="""Upgrade anonymous user to normal user""")
    @marshal_with(UserSchema)
    @firebase_login_required
    def patch(self):
        print(g.user.restaurants, "before")

        if g.user is None:
            return FORBIDDEN

        if not g.user.is_anon:
            return g.user

        firebase_user = auth.get_user(g.user.firebase_id)

        g.user.is_anon = False
        g.user.email = firebase_user.email
        g.user.phone_number = firebase_user.phone_number
        g.user.photo_url = firebase_user.photo_url
        g.user.display_name = firebase_user.display_name
        print(g.user.restaurants, "after")

        return g.user.save()
