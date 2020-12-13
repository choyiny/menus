from .controllers import (ImportMenuResource, QrRestaurantResource,
                          RestaurantResource)

# a list of resources

resources = [
    (
        ImportMenuResource,
        "restaurants/<string:slug>/menus/<string:menu_name>/import",
        "import",
        ["POST", "PATCH"],
    ),
    (QrRestaurantResource, "generate/<string:slug>", "QR", ["GET"]),
    (RestaurantResource, "restaurants", "restaurant", ["GET", "POST"]),
]
