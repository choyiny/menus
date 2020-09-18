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
    description = StringField()


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

    description = StringField()
    # description of menu item


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

    description = StringField()
    # Description of menu

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
        name_to_section = {}

        for item in self.menu_items:
            for section in item.sections:
                section_to_items[section].append(item)

        for section in self.sections:
            name_to_section[section.name] = section

        # combine it with section data
        sectionized = []
        for section_name, list_of_items in section_to_items.items():
            sectionized.append(
                {
                    "name": section_name,
                    "menu_items": list_of_items,
                    "description": name_to_section[section_name].description,
                }
            )
        return {
            "name": self.name,
            "description": self.description,
            "sections": sectionized,
            "image": self.image,
        }
