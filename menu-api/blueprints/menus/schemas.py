from marshmallow import Schema, fields


class ItemSchema(Schema):
    image_url = fields.Url()
    name = fields.Str(example="Meatball Pasta")
    price = fields.Str(example="$6.99")
    tags = fields.List(fields.Str(), example=["Halal", "Vegan"])
    sections = fields.List(fields.Str(), example=["A la carte"])


class MenuSchema(Schema):
    slug = fields.Str()
    name = fields.Str()
    menu_items = fields.List(fields.Nested(ItemSchema))
    sections = fields.List(fields.Str())
