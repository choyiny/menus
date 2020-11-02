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
    (RestaurantResource, "restaurants/<string:slug>", "restaurant", ["GET"]),
    (RestaurantsResource, "restaurants", "restaurants", ["POST", "DELETE", "PATCH"],),
    (
        MenuResource,
        "restaurants/<string:slug>/menus/<string:menu_name>",
        "menus",
        ["GET", "DELETE", "PATCH"],
    ),
    (MenuResource, "restaurants/<string:slug>/menus", "new menu", ["POST"]),
    (
        SectionResource,
        "restaurants/<string:slug>/menus/<string:menu_name>/sections/<string: section_id>",
        "sections",
        ["PATCH", "DELETE"],
    ),
    (GenerateSectionResource, "section/new", "new section", ["POST"]),
    (
        ItemResource,
        "restaurants/<string:slug>/menus/<string:menu_name>/items/",
        "items",
        ["PATCH", "DELETE"],
    ),
    (GenerateItemResource, "items/new", "new item", ["POST"]),
    (
        ImageResource,
        "restaurants/<string:slug>/menus/<string:slug>/items/<string:item_id>/picture",
        "picture",
        ["DELETE", "PATCH"],
    ),
]
