from .controllers.restaurant_resource import RestaurantResource

resources = [(RestaurantResource, "restaurants/<string:slug>", "restaurant", ["GET"])]
