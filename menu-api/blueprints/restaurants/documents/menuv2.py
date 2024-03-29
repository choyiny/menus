from __future__ import annotations

from datetime import datetime
from typing import Optional

from mongoengine import (
    DateTimeField,
    Document,
    EmbeddedDocument,
    EmbeddedDocumentField,
    IntField,
    LazyReferenceField,
    ListField,
    StringField,
    URLField,
)


class Tag(EmbeddedDocument):
    """
    A tag for an item.
    """

    icon = StringField()
    """
    icon code for this tag
    """

    text = StringField()
    """
    text for this tag
    """

    background_color = StringField()
    """
    color for tag
    """


class Item(EmbeddedDocument):
    """
    A menu item, contained in a menu.
    """

    image = URLField()
    """
    image url of this menu item
    """

    name = StringField(required=True, default="")
    """
    name of this menu item
    """

    price = StringField(default="")
    """
    price of this menu item
    """

    tags = ListField(EmbeddedDocumentField(Tag), default=list)
    """
    list of tags for this menu item
    """

    description = StringField(default="")
    """
    description of this menu item
    """

    _id = StringField()
    """
    unique id of current menu item
    """

    def __eq__(self, other):
        return type(self) == type(other) and self._id == other._id


class Section(EmbeddedDocument):
    """
    A section object
    """

    _id = StringField(required=True)
    """
    unique id of section object
    """

    name = StringField(required=True, default="")
    """
    name of this section
    """

    description = StringField(default="")
    """
    description of this section
    """

    subtitle = StringField()
    """
    subtitle of this section
    """

    menu_items = ListField(EmbeddedDocumentField(Item), default=list)
    """
    menu_items of this section
    """

    def __eq__(self, other):
        return type(self) == type(other) and self._id == other._id


class MenuVersion(Document):
    """
    A version of the menu.
    """

    name = StringField(required=True)
    """
    name of this menu
    """
    sections = ListField(EmbeddedDocumentField(Section), default=list)
    """
    List of ordered sections
    """

    start = IntField()
    """
    Start interval for when this menu is shown to customers for the corresponding restaurant
    """

    end = IntField()
    """
    End interval for when this menu is shown to customers for the corresponding restaurant
    """

    footnote = StringField(default="")
    """
    Menu footnote at the bottom of the page
    """

    save_time = DateTimeField(required=True)
    """
    Time of version creation
    """

    @classmethod
    def create(cls, menu: MenuV2) -> MenuVersion:
        version = MenuVersion(save_time=datetime.utcnow())
        version.name = menu.name
        version.sections = menu.sections
        version.start = menu.start
        version.end = menu.end
        version.footnote = menu.footnote
        version.save()
        menu.versions.append(version)
        menu.save()
        return version

    def __eq__(self, other):
        return (
            type(self) == type(other)
            and self.name == other.name
            and self.sections == other.sections
            and self.start == other.start
            and self.end == other.end
            and self.footnote == other.footnote
        )


class MenuV2(Document):
    """
    A menu object.
    """

    name = StringField(default="New Menu")
    """
    name of current menu
    """

    sections = ListField(EmbeddedDocumentField(Section), default=list)
    """
    List of ordered sections
    """

    start = IntField()
    """
    Start interval for when this menu is the defaulted menu for its corresponding restaurant
    """

    end = IntField()
    """
    End interval for when this menu is the defaulted menu for its corresponding restaurant
    """

    footnote = StringField(default="")
    """
    Menu footnote at the bottom of the page
    """

    versions = ListField(LazyReferenceField("MenuVersion"), default=list)

    """
    List of versions for this menu
    """

    def get_section(self, section_id: str) -> Optional[Section]:
        """ get section of this menu """
        for section in self.sections:
            if section._id == section_id:
                return section
        return None

    def get_item(self, item_id: str) -> Optional[Item]:
        """ get menu-item from this menu """
        for section in self.sections:
            for item in section.menu_items:
                if item._id == item_id:
                    return item
        return None

    def get_version(self, version_id: str) -> MenuVersion:
        """ get menu-version from this menu """
        return MenuVersion.objects(id=version_id).first()

    def hide_images(self):
        for section in self.sections:
            for item in section.menu_items:
                del item.image

    def __eq__(self, other):
        return type(self) == type(other) and self.name == other.name
