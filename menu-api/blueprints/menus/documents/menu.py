from collections import defaultdict

from mongoengine import (
    Document,
    StringField,
    ListField,
    EmbeddedDocumentField,
    EmbeddedDocument,
    URLField,
)


class Tag(EmbeddedDocument):
    """
    A tag for an item.
    """

    icon = StringField(required=True)
    text = StringField(required=True)


class Section(EmbeddedDocument):
    name = StringField(required=True)
    image = URLField()


class Item(EmbeddedDocument):
    """
    A menu item, contained in a menu.
    """

    image = URLField()
    # image to this menu items

    name = StringField(required=True)
    # the name of the item

    price = StringField()
    # price of the item

    tags = ListField(EmbeddedDocumentField(Tag))
    # a list of tags

    sections = ListField(StringField(required=True))
    # a list of sections this item is part of


class Menu(Document):
    """
    A menu object.
    """

    slug = StringField(required=True, primary_key=True)
    # Unique identifier for the menu, which corresponds to the restaurant identifier.

    image = URLField()
    # a cover image for the menu

    name = StringField(required=True)
    # name of this menu, usually the restaurant name

    menu_items = ListField(EmbeddedDocumentField(Item))
    # a list of menu items

    sections = ListField(EmbeddedDocumentField(Section))
    # a list of sections in order

    def sectionized_menu(self) -> dict:
        """
        Output a list of sections with associated menu items.
        """
        # loop through all menus and then bucket it into different sections
        section_to_items = defaultdict(list)

        for item in self.menu_items:
            for section in item.sections:
                section_to_items[section].append(item)

        # combine it with section data
        sectionized = []
        for section_name, list_of_items in section_to_items.items():
            sectionized.append({"name": section_name, "menu_items": list_of_items})

        return {"name": self.name, "sections": sectionized}
