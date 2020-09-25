from base64 import b64decode
from functools import wraps

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
            else:
                try:  # will split from with_current_user to user_permissions, but unsure how to do it atm
                    slug = kwargs["slug"]
                except KeyError:
                    return f(*args, **kwargs)
                if not g.user.isAdmin and slug not in g.user.menus:
                    g.user = None

        return f(*args, **kwargs)

    return wrapped
