from __future__ import annotations

from mongoengine import Document, StringField, ListField, BooleanField, EmailField


class User(Document):
    menus = ListField()
    is_admin = BooleanField(required=True)
    firebase_id = StringField()
    email = EmailField()
    phone_number = StringField(max_length=10)

    @classmethod
    def create(cls, **kwargs):
        return User(**kwargs).save()

    @classmethod
    def first_or_create(cls, **kwargs):
        """ Select first cls that matches by kwargs, and create it if it doesn't exist. """
        return cls.objects(**kwargs).first() or cls.create(**kwargs)
