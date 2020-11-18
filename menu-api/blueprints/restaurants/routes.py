from .controllers import (
    GenerateItemResource,
    GenerateSectionResource,
    ImageResource,
    ItemResource,
    MenuResource,
    OnboardingRestaurantResource,
    PublishRestaurantResource,
    RestaurantResource,
    RestaurantsResource,
    SectionResource,
)

resources = [
    (
        RestaurantResource,
        "restaurants/<string:slug>",
        "restaurants",
        ["GET", "DELETE", "PATCH"],
    ),
    (RestaurantsResource, "restaurants", "create_restaurants", ["POST"]),
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
    (
        PublishRestaurantResource,
        "restaurants/<string:slug>/publish",
        "publish",
        ["PATCH"],
    ),
    (OnboardingRestaurantResource, "restaurants/onboard", "onboard", ["POST"]),
    (
        OnboardingRestaurantResource,
        "restaurants/<string:slug>/onboard",
        "onboard_patch",
        ["PATCH"],
    ),
]
