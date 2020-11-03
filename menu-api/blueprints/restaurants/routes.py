from .controllers import (
    GenerateItemResource,
    GenerateSectionResource,
    ImageResource,
    ItemResource,
    MenuResource,
    QrRestaurantResource,
    RestaurantResource,
    RestaurantsResource,
    SectionResource,
)

resources = [
    (RestaurantResource, "restaurants/<string:slug>", "restaurants", ["GET"]),
    (RestaurantsResource, "restaurants", "restaurant", ["POST", "DELETE", "PATCH"],),
    (QrRestaurantResource, "generate", "QR", ["GET"]),
    (
        MenuResource,
        "restaurants/<string:slug>/menus/<string:menu_name>",
        "menus",
        ["GET", "DELETE", "PATCH"],
    ),
    (MenuResource, "restaurants/<string:slug>/menus", "new menu", ["POST"]),
    (
        SectionResource,
        "restaurants/<string:slug>/menus/<string:menu_name>/sections/<string:section_id>",
        "sections",
        ["PATCH", "DELETE"],
    ),
    (GenerateSectionResource, "sections/new", "new section", ["GET"]),
    (
        ItemResource,
        "restaurants/<string:slug>/menus/<string:menu_name>/items/<string:item_id>",
        "items",
        ["PATCH", "DELETE"],
    ),
    (GenerateItemResource, "items/new", "new item", ["GET"]),
    (
        ImageResource,
        "restaurants/<string:slug>/menus/<string:menu_name>/items/<string:item_id>/picture",
        "picture",
        ["DELETE", "PATCH"],
    ),
]
