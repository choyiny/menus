from flask_apispec import doc, marshal_with, use_kwargs

from ..documents.restaurant import Restaurant
from ..schemas import GetRestaurantSchema, MenuSchema, RestaurantSchema
from .restaurant_base_resource import RestaurantBaseResource


class RestaurantResource(RestaurantBaseResource):
    @marshal_with(GetRestaurantSchema)
    def get(self, slug):
        """Get restaurant details"""
        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return {"description": "Restaurant not found"}
        return restaurant.to_dict()


class RestaurantsResource(RestaurantBaseResource):
    @use_kwargs(RestaurantSchema)
    @marshal_with(RestaurantSchema)
    def post(self, **kwargs):
        if kwargs.get("slug"):
            restaurant = Restaurant(**kwargs).save()
            return restaurant.to_dict()
        else:
            return {"description": "slug required but missing"}

    @marshal_with(RestaurantSchema)
    @use_kwargs(RestaurantSchema)
    def patch(self, **kwargs):
        """edit restaurant details"""
        if kwargs.get("slug"):
            slug = kwargs.get("slug")
            restaurant = Restaurant.objects(slug=slug).first()
            if restaurant is None:
                return {"description": "Restaurant not found"}, 404

            if "description" in kwargs:
                restaurant.description = kwargs.get("description")

            if "name" in kwargs:
                restaurant.name = kwargs.get("name")

            if "image" in kwargs:
                restaurant.image = kwargs.get("image")

            restaurant.save()
            return restaurant
        else:
            return {"description": "slug missing but required"}, 422

    @marshal_with(GetRestaurantSchema)
    @use_kwargs(RestaurantSchema)
    def delete(self, **kwargs):
        if kwargs.get("slug"):
            slug = kwargs.get("slug")
            restaurant = Restaurant.objects(slug=slug)
            if restaurant is None:
                return {"description": "restaurant not found"}
            else:
                restaurant.delete()
                return restaurant
        else:
            return {"description": "slug missing but required"}, 422


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
