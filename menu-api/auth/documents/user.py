from __future__ import annotations

from mongoengine import Document, StringField, ListField, BooleanField, ObjectIdField
from werkzeug.security import generate_password_hash, check_password_hash


class User(Document):
    username = StringField(required=True)
    password_hash = StringField(required=True)
    menus = ListField()
    is_admin = BooleanField(required=True)

    @classmethod
    def create(cls, username: str, password: str):
        print(username, password)
        return User(username=username, password_hash=cls.hash_password(password), menus=[], is_admin=False).save()

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    @staticmethod
    def hash_password(password):
        return generate_password_hash(password)
