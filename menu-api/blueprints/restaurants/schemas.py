from marshmallow import Schema
from webargs import fields


class TagV2Schema(Schema):
    icon = fields.Str(example="fas-star", allow_none=True)
    text = fields.Str(example="Chef Featured", allow_none=True)
    background_color = fields.Str(example="black", allow_none=True)


class ItemV2Schema(Schema):
    _id = fields.Str(example="da95f757-603a-41a8-aa62-dede4484a601")
    image = fields.Url(
        example="https://via.placeholder.com/150", allow_none=True, missing=None
    )
    name = fields.Str(example="Meatball Pasta", allow_none=True)
    price = fields.Str(example="$6.99", allow_none=True)
    tags = fields.List(fields.Nested(TagV2Schema))
    description = fields.Str(example="A Pasta with Meatballs", allow_none=True)


class SectionV2Schema(Schema):
    _id = fields.Str(example="da95f757-603a-41a8-aa62-dede4484a601")
    name = fields.Str(
        description="Name of section", example="A la carte", allow_none=True
    )
    menu_items = fields.List(fields.Nested(ItemV2Schema))
    description = fields.Str(
        description="Name of section", example="Piece by piece", allow_none=True
    )
    subtitle = fields.Str(description="Headers for section anchors", allow_none=True)


class MenuV2Schema(Schema):
    name = fields.Str(description="Name of the menu", example="lunch", required=True)
    sections = fields.List(fields.Nested(SectionV2Schema, required=True))


class EditMenuV2Schema(Schema):
    name = fields.Str(description="Name of the menu", example="lunch")
    sections = fields.List(fields.Nested(SectionV2Schema, required=True))


class GetRestaurantSchema(Schema):
    name = fields.Str(description="Name of the restaurant", example="Hollywood Cafe")
    image = fields.Url(example="https://via.placeholder.com/150")
    description = fields.Str(example="A cafe in Hollywood")
    enable_trace = fields.Bool(
        description="Enable contact tracing functionality for the restaurant"
    )
    force_trace = fields.Bool(
        description="Force show the contact tracing popup when the user visits the menu app."
    )
    tracing_key = fields.Str(description="Tracing key generated by tracing.pickeasy.ca")
    menus = fields.List(
        fields.Str(), example=["lunch"], description="list of menu names"
    )


class RestaurantSchema(Schema):
    slug = fields.Str(description="Slug of the menu", example="hollywood")
    name = fields.Str(
        description="Name of the restaurant", example="Hollywood Cafe", allow_none=True
    )
    image = fields.Url(example="https://via.placeholder.com/150", allow_none=True)
    description = fields.Str(example="A cafe in Hollywood", allow_none=True)
