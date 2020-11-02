from typing import Optional

from mongoengine import (
    Document,
    EmbeddedDocument,
    EmbeddedDocumentField,
    ListField,
    StringField,
    URLField,
)


class Tag(EmbeddedDocument):
    """
    A tag for an item.
    """

    icon = StringField(required=True)
    """
    icon code for this tag
    """

    text = StringField(required=True)
    """
    text for this tag
    """


class Item(EmbeddedDocument):
    """
    A menu item, contained in a menu.
    """

    image = URLField()
    """
    image url of this menu item
    """

    name = StringField(required=True, default="No name")
    """
    name of this menu item
    """

    price = StringField(default="")
    """
    price of this menu item
    """

    tags = ListField(EmbeddedDocumentField(Tag), default=[])
    """
    list of tags for this menu item
    """

    description = StringField(default="No description")
    """
    description of this menu item
    """

    _id = StringField()
    """
    unique if of current menu item
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

    name = StringField(required=True, default="New Section")
    """
    name of this section
    """

    description = StringField(default="No description")
    """
    description of this section
    """

    subtitle = StringField()
    """
    subtitle of this section
    """

    menu_items = ListField(EmbeddedDocumentField(Item), default=[])
    """
    menu_items of this section
    """

    def __eq__(self, other):
        return type(self) == type(other) and self._id == other._id


class Menu(Document):
    """
    A menu object.
    """

    name = StringField(default="No Menu")
    """
    name of current menu
    """

    sections = ListField(EmbeddedDocumentField(Section), default=[])
    """
    List of ordered sections
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

    def __eq__(self, other):
        return type(self) == type(other) and self._id == other._id
