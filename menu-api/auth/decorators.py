from functools import wraps

from firebase_admin import auth
from firebase_admin.auth import InvalidIdTokenError
from flask import g, request

from .documents.user import User


def firebase_login_required(f):
    """
    Decorator to check and validate Authorization header for any view
    """

    @wraps(f)
    def wrapped(*args, **kwargs):
        # Uncomment this for local development
        g.user = User.objects.first()
        return f(*args, **kwargs)

        # Check for Authorization header in the form of "Bearer <token>"
        if "Authorization" not in request.headers:
            return {"description": "Missing Authorization header"}, 401

        try:
            id_token = request.headers.get("Authorization").split(" ")[1]
        except IndexError:
            return {"description": "Failed to parse Authorization header"}, 401

        # verify with Firebase
        try:
            decoded_token = auth.verify_id_token(id_token)
        except InvalidIdTokenError:
            return {"description": "Token is invalid."}, 401

        # get our user with the uid (create if not exists)
        g.user = User.get_or_create(decoded_token["uid"])
        return f(*args, **kwargs)

    return wrapped


def firebase_login_preferred(f):
    """More access if given firebase login"""

    @wraps(f)
    def wrapped(*args, **kwargs):
        # Check for Authorization header in the form of "Bearer <token>"
        if "Authorization" not in request.headers:
            g.user = None
            return f(*args, **kwargs)

        try:
            id_token = request.headers.get("Authorization").split(" ")[1]
        except IndexError:
            g.user = None
            return f(*args, **kwargs)

        # verify with Firebase
        try:
            decoded_token = auth.verify_id_token(id_token)
        except InvalidIdTokenError:
            g.user = None
            return f(*args, **kwargs)

        # get our user with the uid (create if not exists)
        g.user = User.get_or_create(decoded_token["uid"])
        return f(*args, **kwargs)

    return wrapped
