from .controllers import (
    AdminTracingResource,
    AdminUserResource,
    ImportMenuResource,
    QrRestaurantResource,
    RestaurantResource,
)

# a list of resources

resources = [
    (AdminTracingResource, "restaurants/<string:slug>/tracing", "tracing", ["PATCH"]),
    (
        ImportMenuResource,
        "restaurants/<string:slug>/menus/<string:menu_name>/import",
        "import",
        ["POST", "PATCH"],
    ),
    (QrRestaurantResource, "generate", "QR", ["GET"]),
    (RestaurantResource, "restaurants", "restaurant", ["GET", "POST"]),
]
