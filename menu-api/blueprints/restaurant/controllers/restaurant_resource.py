from flask_apispec import doc, marshal_with, use_kwargs

from ..documents.restaurant import Restaurant
from ..schemas import GetRestaurantSchema, MenuSchema, RestaurantSchema
from .restaurant_base_resource import RestaurantBaseResource


class RestaurantResource(RestaurantBaseResource):
    @marshal_with(GetRestaurantSchema)
    def get(self, slug):
        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return {"description": "Restaurant not found"}
        return restaurant.to_dict()


class CreateRestaurantResource(RestaurantBaseResource):
    @use_kwargs(RestaurantSchema)
    @marshal_with(GetRestaurantSchema)
    def post(self, **kwargs):
        restaurant = Restaurant(**kwargs).save()
        return restaurant


class MenuResource(RestaurantBaseResource):
    @marshal_with(MenuSchema)
    def get(self, slug, menu_name):
        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return {"description": "Restaurant not found"}
        menu = restaurant.get_menu(menu_name)
        if menu is None:
            return {"description": "Menu not found"}
        return menu
