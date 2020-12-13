import csv
import uuid

import config as c
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
from PIL import Image
from utils.errors import (
    FORBIDDEN,
    MENU_ALREADY_EXISTS,
    MENU_NOT_FOUND,
    NO_QR_CODE,
    NUMBER_ALREADY_EXISTS,
    RESTAURANT_NOT_FOUND,
    USER_ALREADY_EXISTS,
)
from webargs.flaskparser import use_args

from ...auth.schemas import UserSchema, UsersSchema
from ...menus.documents import Menu
from ...restaurants.documents.menuv2 import Item, MenuV2, Section
from ...restaurants.documents.restaurant import Restaurant
from ...restaurants.schemas import GetRestaurantSchema, MenuV2Schema, RestaurantSchema
from ..helpers import qr_helper
from ..schemas import (
    CreateRestaurantSchema,
    CreateUserSchema,
    PromoteUserSchema,
    file_args,
    pagination_args,
    qr_args,
)
from .admin_base_resource import AdminBaseResource


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

        menu = MenuV2(name=menu_name)

        file_str = args["file"].read()
        menu.sections = self.read(file_str)
        menu.save()
        restaurant.menus.append(menu)
        restaurant.save()
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
    @firebase_login_required
    def get(self, slug):
        """Generate QR code in template"""
        if g.user is None or not g.user.has_permission(slug):
            return FORBIDDEN
        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return RESTAURANT_NOT_FOUND
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=1,
        )
        if restaurant.enable_trace or restaurant.force_trace:
            qr.add_data(f"{c.QR_CODE_ROOT_URL}/{slug}?trace=true")
        else:
            qr.add_data(f"{c.QR_CODE_ROOT_URL}/{slug}")
        qr.make(fit=True)
        img = qr.make_image(fill_color="white", back_color="black")
        img = img.resize((950, 950))
        template = Image.open("assets/print_template_huge.png")
        for coord in qr_helper.generate_tuples():
            template.paste(img, coord)
        return qr_helper.serve_pil_image(template, "file.png")
        return NO_QR_CODE


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
