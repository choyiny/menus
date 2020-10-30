from .controllers import CreateRestaurantResource, MenuResource, RestaurantResource

resources = [
    (RestaurantResource, "restaurants/<string:slug>", "restaurant", ["GET"]),
    (
        MenuResource,
        "restaurants/<string:slug>/menus/<string:menu_name>",
        "menus",
        ["GET"],
    ),
    (CreateRestaurantResource, "restaurants", "create_restaurant", ["POST"]),
]
