import uuid

import qrcode
from flask_apispec import doc, marshal_with, use_kwargs
from PIL import Image
from webargs.flaskparser import use_args

from ..documents.menu import Item, Menu, Section
from ..documents.restaurant import Restaurant
from ..helpers import qr_helper
from ..schemas import (
    GetRestaurantSchema,
    ItemSchema,
    MenuSchema,
    RestaurantSchema,
    SectionSchema,
    qr_args,
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
    @marshal_with(GetRestaurantSchema)
    def post(self, **kwargs):
        restaurant = Restaurant(**kwargs).save()
        return restaurant.to_dict()

    @doc("Edit restaurant details")
    @marshal_with(RestaurantSchema)
    @use_kwargs(RestaurantSchema)
    def patch(self, **kwargs):
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

    @doc("Delete restaurant")
    @marshal_with(GetRestaurantSchema)
    @use_kwargs(RestaurantSchema)
    def delete(self, **kwargs):
        slug = kwargs.get("slug")
        restaurant = Restaurant.objects(slug=slug)
        if restaurant is None:
            return {"description": "restaurant not found"}
        else:
            restaurant.delete()
            return restaurant


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
    def patch(self, slug: str, menu_name: str, section_id: str, **kwargs):
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


@doc(description="""Generate QR code of url on template""")
class QRestaurantResource(RestaurantBaseResource):
    @use_args(qr_args, location="query")
    def get(self, args):
        """Generate QR code in template"""
        url = args["url"]
        name = args["name"]
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=1,
        )
        qr.add_data(url)
        qr.make(fit=True)
        img = qr.make_image(fill_color="white", back_color="black")
        img = img.resize((950, 950))
        template = Image.open("assets/print_template_huge.png")
        for coord in qr_helper.generate_tuples():
            template.paste(img, coord)
        return qr_helper.serve_pil_image(template, name + ".png")


class GenerateSectionResource(RestaurantBaseResource):
    @marshal_with(SectionSchema)
    def post(self):
        section = Section(_id=uuid.uuid4())
        return section


class GenerateItemResource(RestaurantBaseResource):
    @marshal_with(ItemSchema)
    def post(self):
        item = Item(_id=uuid.uuid4())
        return item
