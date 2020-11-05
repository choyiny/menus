import csv
import uuid

import qrcode
from auth.decorators import firebase_login_required
from auth.documents.user import User
from firebase_admin import auth
from firebase_admin._auth_utils import (
    EmailAlreadyExistsError,
    PhoneNumberAlreadyExistsError,
)
from flask import g
from flask_apispec import doc, marshal_with, use_kwargs
from flask_marshmallow import Schema
from marshmallow import fields
from PIL.Image import Image
from utils.errors import (
    FORBIDDEN,
    MENU_NOT_FOUND,
    NUMBER_ALREADY_EXISTS,
    RESTAURANT_NOT_FOUND,
    USER_ALREADY_EXISTS,
)
from webargs.flaskparser import use_args

from ...auth.schemas import UserSchema, UsersSchema
from ...restaurants.documents.menuv2 import Item, Section
from ...restaurants.documents.restaurant import Restaurant
from ...restaurants.schemas import GetRestaurantSchema, MenuV2Schema
from ..helpers import qr_helper
from ..schemas import (
    ContactTracingSchema,
    CreateRestaurantSchema,
    CreateUserSchema,
    PromoteUserSchema,
    file_args,
    pagination_args,
    qr_args,
)
from .admin_base_resource import AdminBaseResource


class AdminUserResource(AdminBaseResource):
    @marshal_with(UsersSchema)
    @firebase_login_required
    def get(self):
        if g.user is None or not g.user.is_admin:
            return FORBIDDEN
        return {"users": [user for user in User.objects()]}

    @use_kwargs(CreateUserSchema)
    @marshal_with(UserSchema)
    @firebase_login_required
    def post(self, **user_info):
        """Create firebase user"""
        if g.user is None or not g.user.is_admin:
            return FORBIDDEN
        try:
            firebase_user = auth.create_user(**user_info)
        except EmailAlreadyExistsError:
            return USER_ALREADY_EXISTS
        except PhoneNumberAlreadyExistsError:
            return NUMBER_ALREADY_EXISTS
        user = User.create(
            firebase_id=firebase_user.uid,
            email=firebase_user.email,
            phone_number=firebase_user.phone_number,
            display_name=firebase_user.display_name,
            photo_url=firebase_user.photo_url,
            menus=[],
            is_admin=False,
        )
        return user

    @doc(description="""Claim Restaurant url for user""")
    @use_kwargs(PromoteUserSchema)
    @marshal_with(UserSchema)
    @firebase_login_required
    def patch(self, **kwargs):
        if g.user is None or not g.user.is_admin:
            return FORBIDDEN
        slug = kwargs["slug"]
        firebase_id = kwargs["firebase_id"]
        user = User.objects(firebase_id=firebase_id).first()
        user.restaurant = slug
        return user.save()


class AdminTracingResource(AdminBaseResource):
    @marshal_with(GetRestaurantSchema)
    @use_kwargs(ContactTracingSchema)
    @firebase_login_required
    def patch(self, slug, **kwargs):
        """Enable/disable contact tracing on menu"""
        if g.user is None or not g.user.is_admin:
            return FORBIDDEN
        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return MENU_NOT_FOUND

        if "enable_trace" in kwargs:
            restaurant.enable_trace = kwargs.get("enable_trace")
        if "force_trace" in kwargs:
            restaurant.force_trace = kwargs.get("force_trace")
        if "tracing_key" in kwargs:
            restaurant.tracing_key = kwargs.get("tracing_key")

        restaurant.save()
        return restaurant.to_dict()


class ImportMenuResource(AdminBaseResource):
    @doc(description="Populate empty menu with sections and menu-items")
    @marshal_with(MenuV2Schema)
    @use_args(file_args, location="files")
    @firebase_login_required
    def post(self, args, slug, menu_name):

        if g.user is None or not g.user.is_admin:
            return FORBIDDEN

        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return RESTAURANT_NOT_FOUND

        menu = restaurant.get_menu(menu_name)
        if menu is None:
            return MENU_NOT_FOUND

        file_str = args["file"].read()
        menu.sections = self.read(file_str)
        menu.save()
        return menu

    @staticmethod
    def read(file_str):
        """Read csv into menu-items"""
        reader = csv.DictReader(file_str.decode().splitlines(), skipinitialspace=True)
        sections = {}
        for row in reader:
            section = ImportMenuResource.get_sections(row, sections)
            section.menu_items.append(
                Item(
                    _id=str(uuid.uuid4()),
                    description=row["Description"],
                    name=row["Name"],
                    price=row["Price"],
                    tags=[],
                )
            )
        return [sections[section] for section in sections]

    @staticmethod
    def get_sections(row, sections) -> Section:
        """Get sections from csv"""
        section = row["Sections"]
        section_subtitle = row["Section Subtitle"]
        description = row["Section Description"]

        if section not in sections:
            new_section = Section(
                name=section,
                subtitle=section_subtitle,
                description=description,
                _id=str(uuid.uuid4()),
                menu_items=[],
            )
            sections[section] = new_section
        return sections[section]

    @marshal_with(MenuV2Schema)
    @use_args(file_args, location="files")
    @doc(
        description="Quickly populate existing menu with new section WARNING SECTIONS ALL MUST BE NEW"
    )
    def patch(self, args, slug, menu_name):
        """Append new section items """

        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return RESTAURANT_NOT_FOUND

        menu = restaurant.get_menu(menu_name)
        if menu is None:
            return MENU_NOT_FOUND

        file_str = args["file"].read()
        menu.sections = menu.sections + self.read(file_str)
        menu.save()
        return menu


class QrRestaurantResource(AdminBaseResource):
    @doc(description="Generate qr code for url and paste qr code to template")
    @use_args(qr_args, location="query")
    @firebase_login_required
    def get(self, args):
        """Generate QR code in template"""
        if g.user is None or not g.user.is_admin:
            return FORBIDDEN
        url = args["url"]
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
        template.show()
        return qr_helper.serve_pil_image(template, "file.png")


class RestaurantResource(AdminBaseResource):
    class AllRestaurantSchema(Schema):
        restaurants = fields.List(fields.Str())

    @doc(description="Create a new restaurants")
    @use_kwargs(CreateRestaurantSchema)
    @marshal_with(GetRestaurantSchema)
    @firebase_login_required
    def post(self, **kwargs):
        if g.user is None or not g.user.is_admin:
            return FORBIDDEN
        restaurant = Restaurant(**kwargs).save()
        return restaurant.to_dict()

    @doc(description="Get all restaurants")
    @use_args(pagination_args, location="query")
    @marshal_with(AllRestaurantSchema)
    @firebase_login_required
    def get(self, args):
        if g.user is None or not g.user.is_admin:
            return {"description": "You do not have permission"}, 401
        limit = args["limit"]
        page = args["page"]
        restaurants = [restaurant.slug for restaurant in Restaurant.objects()]
        return {"restaurants": restaurants[(page - 1) * limit : page * limit]}
