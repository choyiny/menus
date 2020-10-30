from .controllers import (
    MenuResource,
    RestaurantResource,
    RestaurantsResource,
    SectionResource,
)

resources = [
    (RestaurantResource, "restaurants/<string:slug>", "restaurant", ["GET"]),
    (
        MenuResource,
        "restaurants/<string:slug>/menus/<string:menu_name>",
        "menus",
        ["GET"],
    ),
    (
        RestaurantsResource,
        "restaurants",
        "create_restaurant",
        ["POST", "DELETE", "PATCH"],
    ),
    (SectionResource, "sections", "edit_sections", ["PATCH", "DELETE"]),
]
