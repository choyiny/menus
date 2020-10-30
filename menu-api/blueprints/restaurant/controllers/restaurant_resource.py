from flask_apispec import doc, marshal_with, use_kwargs

from ..documents.restaurant import Restaurant
from ..schemas import GetRestaurant
from .restaurant_base_resource import RestaurantBaseResource


class RestaurantResource(RestaurantBaseResource):
    @marshal_with(GetRestaurant)
    def get(self, slug):
        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return {"description": "Restaurant not found"}
        return restaurant.__dict__()
