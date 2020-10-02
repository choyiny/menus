from __future__ import annotations

from mongoengine import Document, StringField, ListField, BooleanField, EmailField
from werkzeug.security import generate_password_hash, check_password_hash


class User(Document):
    username = StringField(required=True)
    password_hash = StringField(required=True)
    menus = ListField()
    is_admin = BooleanField(required=True)
    firebase_id = StringField()
    email = EmailField()
    phone_number = StringField(max_length=10)

    @classmethod
    def create(cls, username: str, password: str):
        return User(
            username=username,
            password_hash=cls.hash_password(password),
            menus=[],
            is_admin=False,
        ).save()

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    @staticmethod
    def hash_password(password):
        return generate_password_hash(password)

    def has_permission(self, slug):
        return self.is_admin or slug in self.menus

    @classmethod
    def first_or_create(cls, **kwargs):
        """ Select first cls that matches by kwargs, and create it if it doesn't exist. """
        return cls.query.filter_by(**kwargs).first() or cls.create(**kwargs)
