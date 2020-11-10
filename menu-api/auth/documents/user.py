from __future__ import annotations

from mongoengine import BooleanField, Document, EmailField, ListField, StringField


class User(Document):
    restaurants = ListField(default=list)
    is_admin = BooleanField(required=True, default=False)
    firebase_id = StringField()
    email = EmailField()
    phone_number = StringField()
    display_name = StringField()
    photo_url = StringField()
    is_anon = BooleanField(default=False)

    @classmethod
    def create(cls, **kwargs):
        return User(**kwargs).save()

    @classmethod
    def first_or_create(cls, **kwargs):
        """ Select first cls that matches by kwargs, and create it if it doesn't exist. """
        user = cls.objects(firebase_id=kwargs["firebase_id"]).first()
        if user is None:
            cls.create(**kwargs)
        return user

    def has_permission(self, slug):
        return self.is_admin or slug in self.restaurants
