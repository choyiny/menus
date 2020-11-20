import math
import secrets
from contextlib import closing

import config as c
import redis
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
from marshmallow import Schema
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from utils.errors import FORBIDDEN, INVALID_TOKEN, USER_NOT_FOUND
from webargs import fields

from ...auth.schemas import UserSchema, UsersWithPaginationSchema
from ...restaurants.documents.restaurant import Restaurant
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
        if not g.user.is_admin:
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

        if g.user is None:
            return FORBIDDEN

        if not g.user.is_anon:
            return g.user

        firebase_user = auth.get_user(g.user.firebase_id)

        g.user.is_anon = firebase_user.email is None
        g.user.email = firebase_user.email
        g.user.phone_number = firebase_user.phone_number
        g.user.photo_url = firebase_user.photo_url
        g.user.display_name = firebase_user.display_name

        return g.user.save()


class EmailUserResource(UserManagementBaseResource):
    class EmailSchema(Schema):
        email = fields.Email(required=True)
        location = fields.Url(required=True)

    class VerifySchema(Schema):
        token = fields.Str(required=True)
        email = fields.Email(required=True)

    class VerifiedSchema(Schema):
        verified = fields.Bool()

    @doc(description="""Send verification email to user""")
    @firebase_login_required
    @use_kwargs(EmailSchema)
    def post(self, **kwargs):
        email = kwargs.get("email")
        location = kwargs.get("location")
        token = secrets.token_hex(32)
        verification_url = location + f"/verification?token={token}&email={email}"

        r = redis.Redis.from_url(c.REDIS_CACHE_URL)
        r.set(token, email)
        try:
            firebase_user = auth.get_user_by_email(email)
        except UserNotFoundError:
            return USER_NOT_FOUND

        message = {
            "personalizations": [
                {
                    "to": [{"email": email}],
                    "dynamic_template_data": {
                        "url": verification_url,
                        "display_name": firebase_user.email,
                    },
                }
            ],
            "from": {"email": c.SENGRID_SENDER},
            "template_id": "d-366053af87d2416aaced7af86d5a2723",
        }

        try:
            sg = SendGridAPIClient(c.SENGRID_API)
            sg.send(message)
        except Exception as e:
            return {"description": e.message}

        return {"email-sent": True}

    @doc(description="""Verify email""")
    @marshal_with(UserSchema)
    @use_kwargs(VerifySchema)
    def patch(self, **kwargs):

        token = kwargs.get("token")
        email = kwargs.get("email")

        user = User.objects(email=email).first()
        if user and user.is_anon:
            return user

        r = redis.Redis.from_url(c.REDIS_CACHE_URL)
        if r.get(token) == email.encode("utf-8"):
            try:
                firebase_user = auth.get_user_by_email(email)
                user = User.objects(firebase_id=firebase_user.uid).first()
                user.email = firebase_user.email
                user.phone_number = firebase_user.phone_number
                user.photo_url = firebase_user.photo_url
                user.display_name = firebase_user.display_name
                if user.restaurants:
                    slug = user.restaurants[0]
                    restaurant = Restaurant.objects(slug=slug).first()
                    restaurant.public = True
                    restaurant.save()
            except UserNotFoundError:
                return
            return user.save()

        return INVALID_TOKEN
