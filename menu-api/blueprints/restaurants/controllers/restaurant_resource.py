import random
import re
import string
import uuid
from datetime import datetime
from io import BytesIO

from auth.decorators import firebase_login_preferred, firebase_login_required
from flask import g
from flask_apispec import doc, marshal_with, use_kwargs
from helpers import delete_file, upload_image
from PIL import Image
from utils.errors import (
    ANONYMOUS_USER_FORBIDDEN,
    FORBIDDEN,
    IMAGE_NOT_FOUND,
    ITEM_NOT_FOUND,
    MENU_ALREADY_EXISTS,
    MENU_NOT_FOUND,
    NOT_AUTHENTICATED,
    RESTAURANT_NOT_FOUND,
    SECTION_NOT_FOUND,
    VERSION_NOT_FOUND,
)
from webargs.flaskparser import use_args

from ...admin.schemas import CreateRestaurantSchema, file_args
from ..documents.menuv2 import Item, MenuV2, MenuVersion, Section, Tag
from ..documents.restaurant import Restaurant
from ..schemas import (
    EditMenuV2Schema,
    GetRestaurantSchema,
    ItemV2Schema,
    ListMenuVersionSchema,
    MenuV2Schema,
    MenuVersionSchema,
    OnboardingSchema,
    RestaurantSchema,
    SectionV2Schema,
)
from .restaurant_base_resource import RestaurantBaseResource


class RestaurantResource(RestaurantBaseResource):
    @doc(description="Get restaurants details")
    @marshal_with(GetRestaurantSchema)
    @firebase_login_preferred
    def get(self, slug: str):
        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return RESTAURANT_NOT_FOUND
        if restaurant.public or (g.user and g.user.has_permission(restaurant.slug)):
            return restaurant.to_dict()
        return RESTAURANT_NOT_FOUND

    @doc(description="Edit restaurants details")
    @marshal_with(GetRestaurantSchema)
    @use_kwargs(RestaurantSchema)
    @firebase_login_required
    def patch(self, slug, **kwargs):
        if g.user is None:
            return NOT_AUTHENTICATED

        if not g.user.has_permission(slug):
            return FORBIDDEN

        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return RESTAURANT_NOT_FOUND

        if "description" in kwargs:
            restaurant.description = kwargs.get("description")

        if "name" in kwargs:
            restaurant.name = kwargs.get("name")

        if "image" in kwargs:
            restaurant.image = kwargs.get("image")

        if "public" in kwargs:
            if g.user.is_anon:
                return ANONYMOUS_USER_FORBIDDEN
            else:
                restaurant.public = kwargs.get("public")

        if g.user.is_admin:
            if "enable_trace" in kwargs:
                restaurant.enable_trace = kwargs.get("enable_trace")
            if "force_trace" in kwargs:
                restaurant.force_trace = kwargs.get("force_trace")
            if "tracing_key" in kwargs:
                restaurant.tracing_key = kwargs.get("tracing_key")
            if "qrcode_link" in kwargs:
                restaurant.qrcode_link = kwargs.get("qrcode_link")
            if "can_upload" in kwargs:
                restaurant.can_upload = kwargs.get("can_upload")

        restaurant.save()
        return restaurant.to_dict()

    @doc(description="Delete restaurants")
    @marshal_with(GetRestaurantSchema)
    @use_kwargs(RestaurantSchema)
    @firebase_login_required
    def delete(self, slug):

        if g.user is None:
            return NOT_AUTHENTICATED

        if not g.user.has_permission(slug):
            return FORBIDDEN

        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return {"description": "restaurants not found"}
        else:
            for menu in restaurant.menus:
                menu.delete()
            restaurant.delete()
            return restaurant.to_dict()


class RestaurantsResource(RestaurantBaseResource):
    @doc(description="Create a new restaurant")
    @use_kwargs(CreateRestaurantSchema)
    @marshal_with(GetRestaurantSchema)
    @firebase_login_required
    def post(self, **kwargs):
        if g.user is None:
            return FORBIDDEN

        restaurant = Restaurant(**kwargs)
        restaurant.public = False
        if not g.user.restaurants:
            g.user.restaurants.append(restaurant.slug)
        g.user.save()
        restaurant.save()
        return restaurant.to_dict()


class MenuResource(RestaurantBaseResource):
    @doc(description="Get menu details")
    @marshal_with(MenuV2Schema)
    def get(self, slug: str, menu_name: str):
        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return RESTAURANT_NOT_FOUND
        menu = restaurant.get_menu(menu_name)
        if menu is None:
            return MENU_NOT_FOUND
        if not restaurant.can_upload:
            menu.hide_images()
        return menu

    @doc(description="Edit menu details, checks for duplicate menus")
    @marshal_with(MenuV2Schema)
    @use_kwargs(EditMenuV2Schema)
    @firebase_login_required
    def patch(self, slug: str, menu_name: str, **kwargs):

        if g.user is None:
            return NOT_AUTHENTICATED

        if not g.user.has_permission(slug):
            return FORBIDDEN

        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return RESTAURANT_NOT_FOUND
        menu = restaurant.get_menu(menu_name)
        if menu is None:
            return MENU_NOT_FOUND
        if kwargs.get("name") and kwargs.get("name") != menu_name:
            name = kwargs.get("name")
            if name in restaurant.to_dict()["menus"]:
                return MENU_ALREADY_EXISTS
            menu.name = name

        if "footnote" in kwargs:
            menu.footnote = kwargs.get("footnote")
        if "sections" in kwargs:
            # temporary fix so db gets updated, not sure why changes aren't detected otherwise
            menu.sections = []
            menu.save()
            menu.sections = [
                Section(**section_dict) for section_dict in kwargs.get("sections")
            ]

        if "start" in kwargs:
            menu.start = kwargs.get("start")

        if "end" in kwargs:
            menu.end = kwargs.get("end")
        # create saves menu for you at the end so no need to save again
        MenuVersion.create(menu)
        return menu

    @doc(description="Delete menu")
    @marshal_with(MenuV2Schema)
    @firebase_login_required
    def delete(self, slug: str, menu_name: str):

        if g.user is None:
            return NOT_AUTHENTICATED

        if not g.user.has_permission(slug):
            return FORBIDDEN

        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return RESTAURANT_NOT_FOUND
        menu = restaurant.get_menu(menu_name)
        if menu is None:
            return MENU_NOT_FOUND

        restaurant.menus.remove(menu)

        menu.delete()
        restaurant.save()
        return restaurant.to_dict()

    @doc(description="Add new menu, check for duplicates")
    @marshal_with(MenuV2Schema)
    @use_kwargs(MenuV2Schema)
    @firebase_login_required
    def post(self, slug: str, **kwargs):

        if g.user is None:
            return NOT_AUTHENTICATED

        if not g.user.has_permission(slug):
            return FORBIDDEN

        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return RESTAURANT_NOT_FOUND

        # If menu name is already used, add (n) to it
        # Lunch -> Lunch (1)
        name = kwargs.get("name")
        name_set = set(menu["name"] for menu in restaurant.to_dict()["menus"])
        if name in name_set:
            names = [elem for elem in name_set if re.match(rf"^{name} \(\d+\)$", elem)]
            n_list = [
                int(re.search(r"\(\d+\)$", elem).group()[1:-1]) for elem in names
            ] + [0]
            n = max(n_list)
            name = f"{name} ({n + 1})"

        menu = MenuV2(name=name)

        if kwargs.get("sections"):
            menu.sections = [
                Section(**section_dict) for section_dict in kwargs.get("sections")
            ]

        if "start" in kwargs:
            menu.start = kwargs.get("start")

        if "end" in kwargs:
            menu.end = kwargs.get("end")

        if "footnote" in kwargs:
            menu.footnote = kwargs.get("footnote")
        menu.save()

        restaurant.menus.append(menu)
        restaurant.save()
        return menu


class SectionResource(RestaurantBaseResource):
    @doc(description="Edit section details")
    @use_kwargs(SectionV2Schema)
    @marshal_with(SectionV2Schema)
    @firebase_login_required
    def patch(self, slug: str, menu_name: str, section_id: str, **kwargs):
        """Edit section details"""

        if g.user is None:
            return NOT_AUTHENTICATED

        if not g.user.has_permission(slug):
            return FORBIDDEN
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
            section.menu_items = [
                Item(**item_dict) for item_dict in kwargs["menu_items"]
            ]

        if "description" in kwargs:
            section.description = kwargs.get("description")
        MenuVersion.create(menu)
        return section

    @doc(description="Delete section from menu")
    @marshal_with(MenuV2Schema)
    @firebase_login_required
    def delete(self, slug: str, menu_name: str, section_id: str):
        """Delete section"""
        if g.user is None:
            return NOT_AUTHENTICATED

        if not g.user.has_permission(slug):
            return FORBIDDEN

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
        MenuVersion.create(menu)
        return menu


class ItemResource(RestaurantBaseResource):
    @doc(description="Edit Item details")
    @use_kwargs(ItemV2Schema)
    @marshal_with(ItemV2Schema)
    @firebase_login_required
    def patch(self, slug: str, menu_name: str, item_id: str, **kwargs):
        if g.user is None:
            return NOT_AUTHENTICATED

        if not g.user.has_permission(slug):
            return FORBIDDEN
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
        MenuVersion.create(menu)
        return item

    @doc(description="Delete item from menu")
    @marshal_with(SectionV2Schema)
    @firebase_login_required
    def delete(self, slug: str, menu_name: str, item_id: str):

        if g.user is None:
            return NOT_AUTHENTICATED

        if not g.user.has_permission(slug):
            return FORBIDDEN

        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return RESTAURANT_NOT_FOUND
        menu = restaurant.get_menu(menu_name)
        if menu is None:
            return MENU_NOT_FOUND

        for section in menu.sections:
            for item in section.menu_items:
                if item._id == item_id:
                    section.menu_items.remove(item)
                    MenuVersion.create(menu)
                    return section
        return ITEM_NOT_FOUND


class GenerateSectionResource(RestaurantBaseResource):
    @doc(description="Server generated section with an id")
    @marshal_with(SectionV2Schema)
    @firebase_login_required
    def get(self):
        if g.user is None:
            return NOT_AUTHENTICATED
        section = Section(_id=uuid.uuid4(), name="New section")
        return section


class GenerateItemResource(RestaurantBaseResource):
    @doc(description="Server generates item with an id")
    @marshal_with(ItemV2Schema)
    @firebase_login_required
    def get(self):
        if g.user is None:
            return NOT_AUTHENTICATED

        item = Item(_id=uuid.uuid4(), name="")
        return item


class MenuVersionSummaryResource(RestaurantBaseResource):
    @doc(description="get a list of version summaries")
    @marshal_with(ListMenuVersionSchema)
    @firebase_login_required
    def get(self, slug: str, menu_name: str):
        restaurant = Restaurant.objects(slug=slug).first()
        if g.user is None:
            return NOT_AUTHENTICATED
        if not g.user.is_admin:
            return FORBIDDEN
        if restaurant is None:
            return RESTAURANT_NOT_FOUND
        menu = restaurant.get_menu(menu_name)
        if menu is None:
            return MENU_NOT_FOUND

        return {"versions": [v.fetch() for v in menu.versions]}


class MenuVersionResource(RestaurantBaseResource):
    @doc(description="get version details")
    @marshal_with(MenuVersionSchema)
    @firebase_login_required
    def get(self, slug: str, menu_name: str, version_id: str):
        restaurant = Restaurant.objects(slug=slug).first()
        if g.user is None:
            return NOT_AUTHENTICATED
        if not g.user.is_admin:
            return FORBIDDEN
        if restaurant is None:
            return RESTAURANT_NOT_FOUND
        menu = restaurant.get_menu(menu_name)
        if menu is None:
            return MENU_NOT_FOUND
        version = menu.get_version(version_id)

        if version is None:
            return VERSION_NOT_FOUND

        return version


class ImageResource(RestaurantBaseResource):
    @doc(description="Upload image to s3 bucket")
    @use_args(file_args, location="files")
    @firebase_login_required
    def patch(self, args, slug, menu_name, item_id):
        if g.user is None:
            return NOT_AUTHENTICATED

        if not g.user.has_permission(slug):
            return FORBIDDEN

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
        if not restaurant.can_upload:
            return FORBIDDEN

        menu = restaurant.get_menu(menu_name)
        item = menu.get_item(item_id)
        if item:
            item.image = upload_image(out_img)
            menu.save()
            return item.image
        return ITEM_NOT_FOUND

    @doc(description="Delete image form s3 bucket")
    @marshal_with(ItemV2Schema)
    @firebase_login_required
    def delete(self, slug, menu_name, item_id):

        if g.user is None:
            return NOT_AUTHENTICATED

        if not g.user.has_permission(slug):
            return FORBIDDEN

        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return RESTAURANT_NOT_FOUND
        menu = restaurant.get_menu(menu_name)
        if menu is None:
            return MENU_NOT_FOUND

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


class RestaurantHeaderImageResource(RestaurantBaseResource):
    @doc(description="""Update restaurant header image with uploaded image""")
    @firebase_login_required
    @use_args(file_args, location="files")
    @marshal_with(GetRestaurantSchema)
    def patch(self, args, slug):

        if g.user is None:
            return NOT_AUTHENTICATED

        if not g.user.has_permission(slug):
            return FORBIDDEN

        image_bytes = args["file"].read()
        loaded_image = Image.open(BytesIO(image_bytes))
        max_length = max(loaded_image.size)
        if max_length > 1500:
            ratio = 1500 / max_length
            width, height = loaded_image.size
            loaded_image = loaded_image.resize(
                (int(width * ratio), int(height * ratio))
            )
        out_img = BytesIO()
        loaded_image.save(out_img, "PNG")
        out_img.seek(0)

        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return RESTAURANT_NOT_FOUND

        restaurant.image = upload_image(out_img)
        restaurant.save()
        return restaurant.to_dict()


class OnboardingRestaurantResource(RestaurantBaseResource):
    @doc(description="""Generate random restaurant with menu 'Menu'""")
    @firebase_login_required
    def post(self):

        if g.user is None:
            return NOT_AUTHENTICATED

        if g.user.restaurants:
            return g.user.restaurants[0]

        menu = MenuV2(name="Menu")
        # create saves menu for you at the end so no need to save again
        MenuVersion.create(menu)

        random_slug = "".join(
            random.choices(string.ascii_uppercase + string.digits, k=7)
        )
        g.user.restaurants.append(random_slug)
        g.user.save()
        restaurant = Restaurant(
            menus=[menu], slug=random_slug, name="Menu 1", public=False
        ).save()

        return restaurant.slug

    @doc(description="""Onboard user's first restaurant""")
    @use_kwargs(OnboardingSchema)
    @firebase_login_required
    @marshal_with(MenuV2Schema)
    def patch(self, slug, **kwargs):

        if g.user is None:
            return NOT_AUTHENTICATED

        if not g.user.has_permission(slug):
            return FORBIDDEN

        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return RESTAURANT_NOT_FOUND

        menu = restaurant.get_menu("Menu")

        if menu is None:
            return MENU_NOT_FOUND

        item = Item(_id=str(uuid.uuid4()))

        if kwargs.get("item_name"):
            item.name = kwargs.get("item_name")

        if kwargs.get("item_price"):
            item.price = kwargs.get("item_price")

        if kwargs.get("item_description"):
            item.description = kwargs.get("item_description")

        if kwargs.get("name"):
            restaurant.name = kwargs.get("name")

        section = Section(_id=str(uuid.uuid4()), menu_items=[item])

        if kwargs.get("section_name"):
            section.name = kwargs.get("section_name")

        menu.sections = [section]
        menu.save()
        restaurant.save()
        return menu
