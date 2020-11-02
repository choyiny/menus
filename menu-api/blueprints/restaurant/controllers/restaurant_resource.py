from flask_apispec import doc, marshal_with, use_kwargs

from ..documents.restaurant import Restaurant
from ..schemas import (
    GetRestaurantSchema,
    ItemSchema,
    MenuSchema,
    RestaurantSchema,
    SectionSchema,
)
from .restaurant_base_resource import RestaurantBaseResource


class RestaurantResource(RestaurantBaseResource):
    @doc("Get restaurant details")
    @marshal_with(GetRestaurantSchema)
    def get(self, slug):
        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return {"description": "Restaurant not found"}
        return restaurant.to_dict()


class RestaurantsResource(RestaurantBaseResource):
    @doc("Create a new restaurant")
    @use_kwargs(RestaurantSchema)
    @marshal_with(RestaurantSchema)
    def post(self, **kwargs):
        if kwargs.get("slug"):
            restaurant = Restaurant(**kwargs).save()
            return restaurant.to_dict()
        else:
            return {"description": "slug required but missing"}

    @doc("Edit restaurant details")
    @marshal_with(RestaurantSchema)
    @use_kwargs(RestaurantSchema)
    def patch(self, **kwargs):
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

    @doc("Delete restaurant")
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
    @doc("Get menu details")
    @marshal_with(MenuSchema)
    def get(self, slug, menu_name):
        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return {"description": "Restaurant not found"}
        menu = restaurant.get_menu(menu_name)
        if menu is None:
            return {"description": "Menu not found"}
        return menu


class SectionResource(RestaurantBaseResource):
    @doc("Edit section details")
    @use_kwargs(SectionSchema)
    @marshal_with(SectionSchema)
    def patch(self, slug, menu_name, section_id, **kwargs):
        """Edit section details"""
        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return {"description": "Restaurant not found"}
        menu = restaurant.get_menu(menu_name)
        if menu is None:
            return {"description": "Menu not found"}
        section = menu.get_section(section_id)
        if section is None:
            return {"description": "Section not found"}

        if "name" in kwargs:
            section.name = kwargs.get("name")

        if "subtitle" in kwargs:
            section.subtitle = kwargs.get("subtitle")

        if "menu_items" in kwargs:
            section.menu_items = kwargs.get("menu_items")

        if "description" in kwargs:
            section.description = kwargs.get("description")

        menu.save()
        return section

    @doc("Delete section from menu")
    def delete(self, slug, menu_name, section_id):
        """Delete section"""
        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return {"description": "Restaurant not found"}
        menu = restaurant.get_menu(menu_name)
        if menu is None:
            return {"description": "Menu not found"}
        section = menu.get_section(section_id)
        if section is None:
            return {"description": "Section not found"}

        menu.sections.remove(section)
        return section
