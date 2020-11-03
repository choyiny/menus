import csv
import uuid

from auth.decorators import firebase_login_required
from auth.documents.user import User
from firebase_admin import auth
from firebase_admin._auth_utils import (
    EmailAlreadyExistsError,
    PhoneNumberAlreadyExistsError,
)
from flask import g
from flask_apispec import doc, marshal_with, use_kwargs
from utils.errors import FORBIDDEN, MENU_NOT_FOUND, RESTAURANT_NOT_FOUND
from webargs.flaskparser import use_args

from ...auth.schemas import UserSchema, UsersSchema
from ...menus.documents import Menu
from ...menus.schemas import GetMenuSchema
from ...restaurants.documents.menuv2 import Item, Section
from ...restaurants.documents.restaurant import Restaurant
from ...restaurants.schemas import MenuV2Schema, file_args
from ..schemas import ContactTracingSchema, CreateUserSchema, PromoteUserSchema
from .admin_base_resource import AdminBaseResource


class AdminUserResource(AdminBaseResource):
    @marshal_with(UsersSchema)
    @firebase_login_required
    def get(self):
        if g.user is None or not g.user.is_admin:
            return {"description": "You do not have permission"}, 401
        return {"users": [user for user in User.objects()]}

    @use_kwargs(CreateUserSchema)
    @marshal_with(UserSchema)
    @firebase_login_required
    def post(self, **user_info):
        """Create firebase user"""
        if g.user is None or not g.user.is_admin:
            return {"description": "You do not have permission"}, 401
        try:
            firebase_user = auth.create_user(**user_info)
        except EmailAlreadyExistsError:
            return {"description": "User already exists with that email"}, 400
        except PhoneNumberAlreadyExistsError:
            return {"description": "User already exists with that phone-number"}, 400
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
            return {"description": "You do not have permission"}, 401
        slug = kwargs["slug"]
        firebase_id = kwargs["firebase_id"]
        user = User.objects(firebase_id=firebase_id).first()
        if slug not in user.menus:
            user.menus.append(slug)
        return user.save()


class AdminTracingResource(AdminBaseResource):
    @marshal_with(GetMenuSchema)
    @use_kwargs(ContactTracingSchema)
    @firebase_login_required
    def patch(self, slug, **kwargs):
        """Enable/disable contact tracing on menu"""
        if g.user is None or not g.user.is_admin:
            return {"description": "You do not have permission"}, 401
        menu = Menu.objects(slug=slug).first()
        if menu is None:
            return {"description": "Menu not found"}

        if "enable_trace" in kwargs:
            menu.enable_trace = kwargs.get("enable_trace")
        if "force_trace" in kwargs:
            menu.force_trace = kwargs.get("force_trace")
        if "tracing_key" in kwargs:
            menu.tracing_key = kwargs.get("tracing_key")

        menu.save()
        return menu.sectionized_menu()


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
