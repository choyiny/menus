from flask import g
from flask_apispec import doc, marshal_with

from auth.decorators import firebase_login_required
from utils.errors import NOT_AUTHENTICATED

from ..schemas import UserSchema
from .auth_base_resource import AuthBaseResource


class AuthResource(AuthBaseResource):
    @doc(description="""Authenticate User""")
    @marshal_with(UserSchema)
    @firebase_login_required
    def get(self):
        if g.user is None:
            return NOT_AUTHENTICATED
        return g.user
