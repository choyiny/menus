from __future__ import annotations

from mongoengine import Document, StringField
from werkzeug.security import generate_password_hash, check_password_hash


class User(Document):
    username = StringField(required=True)
    password_hash = StringField(required=True)

    @classmethod
    def create(cls, username: str, password: str):
        return User(username=username, password_hash=cls.hash_password(password))

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    @staticmethod
    def hash_password(password):
        return generate_password_hash(password)
