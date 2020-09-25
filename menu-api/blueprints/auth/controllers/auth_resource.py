from .auth_base_resource import AuthBaseResource
from flask import g
from flask_apispec import marshal_with, use_kwargs, doc

from auth.decorators import with_current_user
from auth.documents.user import User
from ..schemas import PostUser, Authenticated


class AuthResource(AuthBaseResource):
    @doc(description="""Create new User""")
    @use_kwargs(PostUser)
    def post(self, **kwargs):
        print(kwargs)
        User.create(**kwargs).save()
        return 'new user created'

    @doc(description="""Authenticate User""")
    @marshal_with(Authenticated)
    @with_current_user
    def get(self):
        if g.user is None:
            return {'authenticated': False}
        else:
            return {'authenticated': True}
