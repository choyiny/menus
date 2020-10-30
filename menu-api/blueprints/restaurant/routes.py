from .controllers import MenuResource, RestaurantResource, RestaurantsResource

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
]
