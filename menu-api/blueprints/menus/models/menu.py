from mongoengine import (
    Document,
    StringField,
    ListField,
    EmbeddedDocumentField,
    EmbeddedDocument,
    URLField,
)


class Item(EmbeddedDocument):
    """
    A menu item, contained in a menu.
    """

    image_url = URLField()
    # image to this menu items

    name = StringField(required=True)
    # the name of the item

    price = StringField()
    # price of the item

    tags = ListField(StringField())
    # a list of tags. For example, ["Halal", "Vegan", "Healthy"]

    sections = ListField(StringField())
    # a list of sections that this is part of. For example, ["Featured", "Entreé"]


class Menu(Document):
    """
    A menu object.
    """

    slug = StringField(required=True, primary_key=True)
    # Unique identifier for the menu, which corresponds to the restaurant identifier.

    name = StringField(required=True)
    # name of this menu, usually the restaurant name

    menu_items = ListField(EmbeddedDocumentField(Item))
    # a list of menu items

    sections = ListField(StringField())
    # a list of sections in order
