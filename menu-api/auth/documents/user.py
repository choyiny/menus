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

    def has_permission(self, slug):
        return self.is_admin or slug in self.restaurants

    def has_user_permission(self, firebase_id):
        return self.is_admin or firebase_id == self.firebase_id

    @classmethod
    def get_or_create(cls, firebase_id):
        """Create user in backend if user exists in firebase"""
        user = User.objects(firebase_id=firebase_id).first()

        if user is None:
            user = User(firebase_id=firebase_id, is_anon=True)
            user.save()

        return user
