from flask_apispec import doc, marshal_with, use_kwargs

from ..documents.restaurant import Restaurant
from ..schemas import Restaurant
from .restaurant_base_resource import RestaurantBaseResource


class RestaurantResource(RestaurantBaseResource):
    @marshal_with(Restaurant)
    def get(self, slug):
        restaurant = Restaurant.objects(slug=slug)
        if restaurant is None:
            return {"description": "Restaurant not found"}
        return restaurant
