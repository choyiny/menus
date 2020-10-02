from base64 import b64decode
from functools import wraps
from firebase_admin import auth
from firebase_admin.auth import InvalidIdTokenError

from flask import request, g

from .documents.user import User


def with_current_user(f):
    """
    Decorator to check and validate Authorization header for any view
    """

    @wraps(f)
    def wrapped(*args, **kwargs):
        # Check for Authorization header in the form of "Bearer <token>"
        if "Authorization" not in request.headers:
            g.user = None
            return f(*args, **kwargs)
        try:
            provided_key = request.headers.get("Authorization").split(" ")[1]
        except IndexError:
            g.user = None
            return f(*args, **kwargs)
        try:
            username, password = b64decode(provided_key).decode("utf-8").split(":")
        except ValueError:
            g.user = None
        else:
            g.user = User.objects(username=username).first()
            if g.user is None or not g.user.verify_password(password):
                g.user = None

        return f(*args, **kwargs)

    return wrapped


def firebase_login_required(f):
    """
    Decorator to check and validate Authorization header for any view
    """

    @wraps(f)
    def wrapped(*args, **kwargs):

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
        g.user = User.first_or_create(
            firebase_id=decoded_token["uid"],
            email=decoded_token.get("email"),
            phone_number=decoded_token.get(
                "phoneNumber", decoded_token.get("phone_number")
            ),
        )

        return f(*args, **kwargs)

    return wrapped