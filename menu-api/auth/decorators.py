from functools import wraps
from firebase_admin import auth
from firebase_admin.auth import InvalidIdTokenError

from flask import request, g

from .documents.user import User


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
        g.user = User.objects(firebase_id=decoded_token["uid"]).first()
        return f(*args, **kwargs)

    return wrapped
