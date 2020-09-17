from marshmallow import Schema
from webargs import fields


class TagSchema(Schema):
    icon = fields.Str(example="fas-star")
    text = fields.Str(example="Chef Featured")


class SectionSchema(Schema):
    name = fields.Str(example="A la carte")
    image = fields.Url(
        description="Image for the section", example="https://via.placeholder.com/150"
    )
    description = fields.Str(
        example="Piece by piece", description="Description of section"
    )


class ItemSchema(Schema):
    image = fields.Url(example="https://via.placeholder.com/150")
    name = fields.Str(example="Meatball Pasta")
    price = fields.Str(example="$6.99")
    tags = fields.List(fields.Nested(TagSchema))
    sections = fields.List(fields.Str(), example=["A la carte", "Chef's Featured"])
    description = fields.Str(example="A Pasta with Meatballs")


class MenuSchema(Schema):
    slug = fields.Str(description="Slug of the menu", example="hollywood")
    name = fields.Str(description="Name of the restaurant", example="Hollywood Cafe")
    image = fields.Url(example="https://via.placeholder.com/150")
    description = fields.Str(example="A cafe in Hollywood")
    menu_items = fields.List(fields.Nested(ItemSchema))
    sections = fields.List(fields.Nested(SectionSchema))


class SectionItemSchema(Schema):
    name = fields.Str(description="Name of section", example="A la carte")
    menu_items = fields.List(fields.Nested(ItemSchema))
    description = fields.Str(description="Name of section", example="Piece by piece")


class GetMenuSchema(Schema):
    name = fields.Str(description="Name of the restaurant", example="Hollywood Cafe")
    image = fields.Url(example="https://via.placeholder.com/150")
    description = fields.Str(example="A cafe in Hollywood")
    sections = fields.List(fields.Nested(SectionItemSchema, required=True))


import_args = {"csv": fields.Field()}
