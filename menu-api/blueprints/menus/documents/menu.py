import uuid
from collections import defaultdict
from typing import Optional

from mongoengine import (
    BooleanField,
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
    text = StringField(required=True)


class Section(EmbeddedDocument):
    name = StringField(required=True, default="New Section")
    image = URLField()
    description = StringField(default="No description")
    subtitle = StringField()
    _id = StringField(required=True)

    def __eq__(self, other):
        return type(self) == type(other) and self._id == other._id


class Item(EmbeddedDocument):
    """
    A menu item, contained in a menu.
    """

    image = URLField()
    # image to this menu items

    name = StringField(required=True, default="No name")
    # the name of the item

    price = StringField(default="")
    # price of the item

    tags = ListField(EmbeddedDocumentField(Tag), default=[])
    # a list of tags

    sections = ListField(StringField(required=True))
    # a list of sections this item is part of

    description = StringField(default="No description")
    # description of menu item

    _id = StringField(default_factory=uuid.uuid4)
    # unique id of menu-item

    def __eq__(self, other):
        return type(self) == type(other) and self._id == other._id


class Menu(Document):
    """
    A menu object.
    """

    slug = StringField(required=True, primary_key=True)
    # Unique identifier for the menu, which corresponds to the restaurants identifier.

    image = URLField()
    # a cover image for the menu

    name = StringField(required=True)
    # name of this menu, usually the restaurants name

    description = StringField()
    # Description of menu

    menu_items = ListField(EmbeddedDocumentField(Item))
    # a list of menu items

    sections = ListField(EmbeddedDocumentField(Section))
    # a list of sections in order

    external_link = URLField()

    # optional external link provided by user
    link_name = StringField()

    # force covid19 tracer modqal
    force_trace = BooleanField(default=False)

    # enable tracing on qr_code
    enable_trace = BooleanField(default=False)

    # key for tracing generated by tracing.pickeasy.ca
    tracing_key = StringField()

    # name for external link
    def sectionized_menu(self) -> dict:
        """
        Output a list of sections with associated menu items.
        """
        # loop through all menus and then bucket it into different sections
        section_to_items = defaultdict(list)
        id_to_section = {}

        for item in self.menu_items:
            for section_id in item.sections:
                section_to_items[section_id].append(item)

        for section in self.sections:
            id_to_section[section._id] = section

        # combine it with section data
        sectionized = []
        for section in self.sections:
            sectionized.append(
                {
                    "_id": section._id,
                    "name": id_to_section[section._id].name,
                    "menu_items": section_to_items[section._id],
                    "description": id_to_section[section._id].description,
                    "subtitle": id_to_section[section._id].subtitle,
                }
            )
        return {
            "name": self.name,
            "description": self.description,
            "sections": sectionized,
            "image": self.image,
            "link_name": self.link_name,
            "external_link": self.external_link,
            "tracing_key": self.tracing_key,
            "force_trace": self.force_trace,
            "enable_trace": self.enable_trace,
        }

    def rearrange_section(self, menu_items):
        menu_items = [item["_id"] for item in menu_items]
        menu_copy = self.menu_items[:]
        menu_set = set(menu_items)
        menu_dict = {}
        ordered_list = []
        i = 0
        while len(ordered_list) < len(menu_items):
            if self.menu_items[i]._id in menu_set:
                menu_dict[self.menu_items[i]._id] = i
                ordered_list.append(i)
            i += 1
        ordered_list.sort()
        # rearrange menu_items to correct placement
        for index in range(len(menu_items)):
            self.menu_items[ordered_list[index]] = menu_copy[
                menu_dict[menu_items[index]]
            ]

    def get_item(self, item_id) -> Optional[Item]:
        for item in self.menu_items:
            if item._id == item_id:
                return item
        return None

    def __eq__(self, other):
        return type(self) == type(other) and self._id == other._id
