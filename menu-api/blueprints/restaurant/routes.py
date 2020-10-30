from .controllers import MenuResource, RestaurantResource

resources = [
    (RestaurantResource, "restaurants/<string:slug>", "restaurant", ["GET"]),
    (
        MenuResource,
        "restaurants/<string:slug>/menus/<string:menu_name>",
        "menus",
        ["GET"],
    ),
]
