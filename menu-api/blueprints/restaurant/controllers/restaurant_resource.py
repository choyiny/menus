import uuid
from io import BytesIO

import qrcode
from flask_apispec import doc, marshal_with, use_kwargs
from helpers import delete_file, upload_image
from PIL import Image
from utils.errors import (
    FORBIDDEN,
    IMAGE_NOT_FOUND,
    ITEM_NOT_FOUND,
    MENU_ALREADY_EXISTS,
    MENU_NOT_FOUND,
    RESTAURANT_NOT_FOUND,
    SECTION_NOT_FOUND,
)
from webargs.flaskparser import use_args

from ..documents.menu import Item, Menu, Section, Tag
from ..documents.restaurant import Restaurant
from ..helpers import qr_helper
from ..schemas import (
    GetRestaurantSchema,
    ItemSchema,
    MenuSchema,
    RestaurantSchema,
    SectionSchema,
    file_args,
    qr_args,
)
from .restaurant_base_resource import RestaurantBaseResource


class RestaurantResource(RestaurantBaseResource):
    @doc("Get restaurant details")
    @marshal_with(GetRestaurantSchema)
    def get(self, slug: str):
        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return RESTAURANT_NOT_FOUND
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
            return RESTAURANT_NOT_FOUND

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
    def get(self, slug: str, menu_name: str):
        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return RESTAURANT_NOT_FOUND
        menu = restaurant.get_menu(menu_name)
        if menu is None:
            return MENU_NOT_FOUND
        return menu

    @doc("Edit menu details, checks for duplicate menus")
    @marshal_with(MenuSchema)
    @use_kwargs(MenuSchema)
    def patch(self, slug: str, menu_name: str, **kwargs):
        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return RESTAURANT_NOT_FOUND
        menu = restaurant.get_menu(menu_name)
        if menu is None:
            return MENU_NOT_FOUND
        name = kwargs.get("name")
        if name in restaurant.menus:
            return MENU_ALREADY_EXISTS
        menu.name = name
        menu.save()
        return menu

    @doc("Delete menu")
    @marshal_with(MenuSchema)
    def delete(self, slug: str, menu_name: str):
        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return RESTAURANT_NOT_FOUND
        menu = restaurant.get_menu(menu_name)
        if menu is None:
            return MENU_NOT_FOUND
        restaurant.menus.remove(menu)
        restaurant.save()
        return restaurant

    @doc("Add new menu, check for duplicates")
    @marshal_with(MenuSchema)
    @use_kwargs(MenuSchema)
    def post(self, slug: str, **kwargs):
        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return RESTAURANT_NOT_FOUND
        name = kwargs.get("name")
        if name in restaurant.menus:
            return MENU_ALREADY_EXISTS
        menu = Menu(name=name)
        restaurant.menus.append(menu)
        restaurant.save()


class SectionResource(RestaurantBaseResource):
    @doc("Edit section details")
    @use_kwargs(SectionSchema)
    @marshal_with(SectionSchema)
    def patch(self, slug: str, menu_name: str, section_id: str, **kwargs):
        """Edit section details"""
        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return RESTAURANT_NOT_FOUND
        menu = restaurant.get_menu(menu_name)
        if menu is None:
            return MENU_NOT_FOUND
        section = menu.get_section(section_id)
        if section is None:
            return SECTION_NOT_FOUND

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
    def delete(self, slug: str, menu_name: str, section_id: str):
        """Delete section"""
        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return RESTAURANT_NOT_FOUND
        menu = restaurant.get_menu(menu_name)
        if menu is None:
            return MENU_NOT_FOUND
        section = menu.get_section(section_id)
        if section is None:
            return SECTION_NOT_FOUND

        menu.sections.remove(section)
        return section


class ItemResource(RestaurantBaseResource):
    @doc("Edit Item details")
    @use_kwargs(ItemSchema)
    @marshal_with(ItemSchema)
    def patch(self, slug: str, menu_name: str, item_id: str, **kwargs):
        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return RESTAURANT_NOT_FOUND
        menu = restaurant.get_menu(menu_name)
        if menu is None:
            return MENU_NOT_FOUND

        item = menu.get_item(item_id)
        if item is None:
            return ITEM_NOT_FOUND

        if "name" in kwargs:
            item.name = kwargs["name"]

        if "price" in kwargs:
            item.price = kwargs["price"]

        if "description" in kwargs:
            item.description = kwargs["description"]

        if "tags" in kwargs:
            item.tags = [Tag(**tag) for tag in kwargs["tags"]]

        menu.save()
        return item

    @doc("Delete item from menu")
    def delete(self, slug: str, menu_name: str, item_id: str):
        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return RESTAURANT_NOT_FOUND
        menu = restaurant.get_menu(menu_name)
        if menu is None:
            return MENU_NOT_FOUND

        for section in menu.sections:
            for item in section.menu_items:
                if item._id == item_id:
                    section.remove(item)
                    menu.save()
                    return item
        return ITEM_NOT_FOUND


class QRestaurantResource(RestaurantBaseResource):
    @doc("Generate qr code for url and paste qr code to template")
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
    @doc("Server generated section with an id")
    @marshal_with(SectionSchema)
    def post(self):
        section = Section(_id=uuid.uuid4())
        return section


class GenerateItemResource(RestaurantBaseResource):
    @doc("Server generates item with an id")
    @marshal_with(ItemSchema)
    def post(self):
        item = Item(_id=uuid.uuid4())
        return item


class ImageResource(RestaurantBaseResource):
    @doc("Upload image to s3 bucket")
    @use_args(file_args, location="files")
    def patch(self, args, slug, menu_name, item_id):
        image_bytes = args["file"].read()
        loaded_image = Image.open(BytesIO(image_bytes))
        width, height = loaded_image.size
        if width > 600:
            width = 600
            height = 600
        loaded_image = loaded_image.resize((width, height))
        out_img = BytesIO()
        loaded_image.save(out_img, "PNG")
        out_img.seek(0)
        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return RESTAURANT_NOT_FOUND
        menu = restaurant.get_menu(menu_name)
        item = menu.get_item(item_id)
        if item:
            item.image = upload_image(out_img)
            menu.save()
            return item.image
        return ITEM_NOT_FOUND

    @doc("Delete image form s3 bucket")
    @marshal_with(ItemSchema)
    def delete(self, slug, item_id):
        menu = Menu.objects(slug=slug).first()

        item = menu.get_item(item_id)
        if item:
            if item.image:
                delete_file(item.image)
                item.image = None
                menu.save()
                return item
            else:
                return IMAGE_NOT_FOUND

        return ITEM_NOT_FOUND
