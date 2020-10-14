from marshmallow import Schema
from webargs import fields


class TagSchema(Schema):
    icon = fields.Str(example="fas-star")
    text = fields.Str(example="Chef Featured")


class SectionSchema(Schema):
    _id = fields.Str(description="Section id")
    name = fields.Str(example="A la carte")
    image = fields.Url(
        description="Image for the section", example="https://via.placeholder.com/150"
    )
    description = fields.Str(
        example="Piece by piece", description="Description of section"
    )
    subtitle = fields.Str(description="Headers for section anchors")


class ItemSchema(Schema):
    _id = fields.Str()
    image = fields.Url(
        example="https://via.placeholder.com/150", allow_none=True, missing=None
    )
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
    external_link = fields.Str(description="external link")
    link_name = fields.Str(description="name of link")


class SectionItemSchema(Schema):
    _id = fields.Str(description="Section id")
    name = fields.Str(description="Name of section", example="A la carte")
    menu_items = fields.List(fields.Nested(ItemSchema))
    description = fields.Str(description="Name of section", example="Piece by piece")
    subtitle = fields.Str(description="Headers for section anchors")


class GetMenuSchema(Schema):
    name = fields.Str(description="Name of the restaurant", example="Hollywood Cafe")
    image = fields.Url(example="https://via.placeholder.com/150")
    description = fields.Str(example="A cafe in Hollywood")
    sections = fields.List(fields.Nested(SectionItemSchema, required=True))
    external_link = fields.Str(
        description="external link", example="https://mydeliverysite.com"
    )
    link_name = fields.Str(description="name of link")


class PaginationMenuSchema(Schema):
    name = fields.Str(description="Name of the restaurant", example="Hollywood Cafe")
    slug = fields.Str()


pagination_args = {
    "page": fields.Int(description="Page number of table", default=1),
    "limit": fields.Int(description="How many entries per page", default=5),
}

qr_args = {
    "url": fields.Str(description="url of website to be encoded"),
    "name": fields.Str(description="name of generated qr"),
}

file_args = {"file": fields.Field()}
