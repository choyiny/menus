from marshmallow import Schema
from webargs import fields


class TagSchema(Schema):
    icon = fields.Str(example="fas-star")
    text = fields.Str(example="Chef Featured")


class ItemSchema(Schema):
    _id = fields.Str(required=True, example="da95f757-603a-41a8-aa62-dede4484a601")
    image = fields.Url(
        example="https://via.placeholder.com/150", allow_none=True, missing=None
    )
    name = fields.Str(example="Meatball Pasta")
    price = fields.Str(example="$6.99")
    tags = fields.List(fields.Nested(TagSchema))
    sections = fields.List(fields.Str(), example=["A la carte", "Chef's Featured"])
    description = fields.Str(example="A Pasta with Meatballs")


class SectionSchema(Schema):
    _id = fields.Str(required=True, example="da95f757-603a-41a8-aa62-dede4484a601")
    name = fields.Str(description="Name of section", example="A la carte")
    menu_items = fields.List(fields.Nested(ItemSchema))
    description = fields.Str(description="Name of section", example="Piece by piece")
    subtitle = fields.Str(description="Headers for section anchors")


class MenuSchema(Schema):
    name = fields.Str(description="Name of the restaurant", example="Hollywood Cafe")
    sections = fields.List(fields.Nested(SectionSchema, required=True))


class Restaurant(Schema):
    slug = fields.Str(description="Slug of the menu", example="hollywood")
    name = fields.Str(description="Name of the restaurant", example="Hollywood Cafe")
    image = fields.Url(example="https://via.placeholder.com/150")
    description = fields.Str(example="A cafe in Hollywood")
    menu_items = fields.List(fields.Nested(ItemSchema))
    link_name = fields.Str(description="name of link")
    enable_trace = fields.Bool(
        description="Enable contact tracing functionality for the restaurant"
    )
    force_trace = fields.Bool(
        description="Force show the contact tracing popup when the user visits the menu app."
    )
    tracing_key = fields.Str(description="Tracing key generated by tracing.pickeasy.ca")


class PaginationMenuSchema(Schema):
    name = fields.Str(description="Name of the restaurant", example="Hollywood Cafe")
    slug = fields.Str()


pagination_args = {
    "page": fields.Int(description="Page number of table", default=1),
    "limit": fields.Int(description="How many entries per page", default=5),
}

qr_args = {"url": fields.Str(description="url of website to be encoded")}

file_args = {"file": fields.Field()}
