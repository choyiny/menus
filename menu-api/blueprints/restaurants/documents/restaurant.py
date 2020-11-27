from typing import Optional

from blueprints.restaurants.documents.menuv2 import MenuV2
from mongoengine import (
    BooleanField,
    Document,
    ListField,
    ReferenceField,
    StringField,
    URLField,
)


class Restaurant(Document):
    slug = StringField(primary_key=True, required=True)
    """
    url key for this restaurants
    """

    description = StringField()
    """
    description of this restaurants
    """

    image = URLField(
        default="https://pickeasy.ca/wp-content/uploads/2020/11/marble.jpeg"
    )
    """
    image url for this restaurant
    """

    menus = ListField(ReferenceField("MenuV2"), default=list)
    """
    list of menus for this restaurant
    """

    name = StringField()
    """
    name of the restaurant
    """

    force_trace = BooleanField(default=False)
    """
    field to force contact tracing on older menus
    """

    enable_trace = BooleanField(default=False)
    """
    field to enable contact tracing on restaurant
    """

    tracing_key = StringField()
    """
    key for tracing generated by tracing.pickeasy.ca
    """

    public = BooleanField(default=True)
    """
    status field for whether restaurant is viewable to the public
    """

    qrcode_link = URLField()
    """
    deployed qr codes redirect to this link
    """

    can_upload = BooleanField(default=False)
    """
    permission for user to upload menu-item images
    """

    def to_dict(self):
        """ serialize restaurants to json"""
        menus = [menu.name for menu in self.menus]
        serialized_restaurant = self.to_mongo().to_dict()
        serialized_restaurant["menus"] = menus
        return serialized_restaurant

    def get_menu(self, name: str) -> Optional[MenuV2]:
        """ get menu from restaurants """
        for menu in self.menus:
            if menu.name == name:
                return menu
        return None
