from flask import g
from flask_apispec import marshal_with, use_kwargs, doc
from webargs.flaskparser import use_args
import csv
from io import BytesIO
import uuid

import qrcode
from PIL import Image
from marshmallow import Schema, fields

from auth.decorators import firebase_login_required
from helpers import ErrorResponseSchema, upload_image, delete_file
from ..helpers import csv_helper
from ..helpers import qr_helper
from .menus_base_resource import MenusBaseResource
from ..documents import Menu, Item, Section, Tag
from ..schemas import (
    MenuSchema,
    GetMenuSchema,
    pagination_args,
    file_args,
    qr_args,
    SectionItemSchema,
    ItemSchema,
    PaginationMenuSchema,
)


@doc(description="""Menu collection related operations""")
class MenusResource(MenusBaseResource):
    @marshal_with(MenuSchema)
    @use_kwargs(MenuSchema)
    @firebase_login_required
    def post(self, **menu_info):
        """
        Create a new Menu.
        """
        if g.user is None or not g.user.is_admin:
            return {"description": "You do not have permission"}, 401

        menu = Menu(**menu_info).save()
        menu.save()
        return menu


@doc(description="""get all the menus from the database""")
class AllMenuResource(MenusBaseResource):
    class GetAllMenusSchema(Schema):
        menus = fields.List(fields.Nested(PaginationMenuSchema))

    @marshal_with(GetAllMenusSchema)
    @use_args(pagination_args, location="querystring")
    @firebase_login_required
    def get(self, args):
        if g.user is None or not g.user.is_admin:
            return {"description": "You do not have permission"}, 401

        limit = args["limit"]
        page = args["page"]
        menus = [{"slug": menu.slug, "name": menu.name} for menu in Menu.objects()]

        return {"menus": menus[(page - 1) * limit: page * limit]}


@doc(description="""Upload menu to server""")
class ImportMenuResource(MenusBaseResource):
    @marshal_with(GetMenuSchema)
    @use_args(file_args, location="files")
    @firebase_login_required
    def post(self, args, slug):

        if g.user is None or not g.user.has_permission(slug):
            return {"description": "You do not have permission"}, 401

        menu = Menu.objects(slug=slug).first()
        if menu is None:
            return {"description": "Menu not found."}, 404

        file_str = args["file"].read()
        menu_items = self.read(file_str)
        menu.menu_items = menu_items
        menu.sections = [self.all_sections[section] for section in self.all_sections]
        menu.save()
        return menu.sectionized_menu()

    def read(self, file_str):
        reader = csv.DictReader(file_str.decode().splitlines(), skipinitialspace=True)
        menu_items = []
        for row in reader:
            sections = [section.strip() for section in row["Sections"].split("|")]
            self.get_sections(row)
            menu_items.append(
                Item(
                    _id=str(uuid.uuid4()),
                    description=row["Description"],
                    name=row["Name"],
                    price=row["Price"],
                    tags=csv_helper.get_tags(row["Tags"]),
                    sections=[self.all_sections[section]._id for section in sections],
                    image=None,
                )
            )
        return menu_items

    def get_sections(self, row):
        section_list = csv_helper.parse(row["Sections"])
        section_subtitle = csv_helper.parse(row["Section Subtitle"])
        descriptions = csv_helper.parse(row["Section Description"])

        for i in range(len(section_list)):
            if section_list[i] not in self.all_sections:
                self.all_sections[section_list[i]] = Section(
                    name=section_list[i],
                    subtitle=section_subtitle[i],
                    image=row["Section Image"],
                    description=descriptions[i],
                    _id=str(uuid.uuid4()),
                )

            if self.all_sections[section_list[i]].image == "":
                self.all_sections[section_list[i]].image = None

    @marshal_with(GetMenuSchema)
    @use_args(file_args, location="files")
    @firebase_login_required
    def patch(self, args, slug):
        """Append new section items """

        if g.user is None or not g.user.has_permission(slug):
            return {"description": "You do not have permission"}, 401

        menu = Menu.objects(slug=slug).first()
        if menu is None:
            return {"description": "Menu not found."}, 404

        file_str = args["file"].read()
        menu_items = self.read(file_str)
        menu.menu_items = menu.menu_items + menu_items
        menu.sections = menu.sections + [
            self.all_sections[section] for section in self.all_sections
        ]
        menu.save()
        return menu.sectionized_menu()

    def __init__(self):
        self.all_sections = {}


@doc(description="""Menu element related operations""", )
class MenuResource(MenusBaseResource):
    @marshal_with(GetMenuSchema)
    def get(self, slug):
        """
        Return menu that matches slug.
        """
        menu = Menu.objects(slug=slug).first()
        if menu is None:
            return {"description": "Menu not found."}, 404

        return menu.sectionized_menu()

    @marshal_with(GetMenuSchema)
    @use_kwargs(MenuSchema)
    @firebase_login_required
    def patch(self, **kwargs):
        """
        Replace attributes for Menu that matches slug.
        """
        slug = kwargs["slug"]

        if g.user is None or not g.user.has_permission(slug):
            return {"description": "You do not have permission"}, 401

        # modify the user id
        menu = Menu.objects(slug=slug).first()
        if menu is None:
            return {"description": "Menu not found."}, 404

        if kwargs.get("name"):
            menu.name = kwargs["name"]

        if kwargs.get("sections"):
            menu.sections = [
                Section(**section_dict) for section_dict in kwargs["sections"]
            ]

        if kwargs.get("menu_items"):
            menu.menu_items = [Item(**item_dict) for item_dict in kwargs["menu_items"]]

        if kwargs.get("image"):
            menu.image = kwargs["image"]

        if kwargs.get("description"):
            menu.description = kwargs["description"]

        if kwargs.get("external_link"):
            menu.external_link = kwargs.get("external_link")

        if kwargs.get("link_name"):
            menu.link_name = kwargs.get("link_name")

        menu.save()
        return menu.sectionized_menu()

    @marshal_with(ErrorResponseSchema, code=404)
    @marshal_with(MenuSchema)
    @firebase_login_required
    def delete(self, slug):
        """
        Delete menu that matches menu_id.
        """
        if g.user is None or not g.user.is_admin:
            return {"description": "You do not have permission"}, 401
        menu = Menu.objects(slug=slug).first()
        if menu is None:
            return {"description": "Menu not found."}, 404

        menu.delete()

        return menu


@doc(description="""Generate QR code of url on template""")
class QRMenuResource(MenusBaseResource):
    @use_args(qr_args, location="query")
    @firebase_login_required
    def get(self, args):
        """Generate QR code in template"""
        if g.user is None or not g.user.is_admin:
            return {"description": "You do not have permission"}, 401
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


class ImageMenuResource(MenusBaseResource):
    @use_args(file_args, location="files")
    @firebase_login_required
    def patch(self, args, slug, item_id):
        """Upload image to server"""
        if g.user is None or not g.user.has_permission(slug):
            return {"description": "You do not have permission"}, 401
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
        menu = Menu.objects(slug=slug).first()
        item = menu.get_item(item_id)
        if item:
            item.image = upload_image(out_img)
            menu.save()
            return item.image
        return {'description': 'item not found'}, 404

    @firebase_login_required
    @marshal_with(ItemSchema)
    def delete(self, slug, item_id):

        if g.user is None or not g.user.has_permission(slug):
            return {"description": "You do not have permission"}, 401

        menu = Menu.objects(slug=slug).first()

        item = menu.get_item(item_id)
        if item:
            delete_file(item.image)
            item.image = None
            menu.save()
            return item

        return {'description': 'Item not found'}


class SectionMenuResource(MenusBaseResource):
    @marshal_with(SectionItemSchema)
    @use_kwargs(SectionItemSchema)
    @firebase_login_required
    def patch(self, slug, section_id, **kwargs):
        """Edit restaurant section"""

        if g.user is None or not g.user.has_permission(slug):
            return {"description": "You do not have permission"}, 401

        # modify the user id
        menu = Menu.objects(slug=slug).first()
        if menu is None:
            return {"description": "Menu not found."}, 404

        for section in menu.sections:
            if section._id == section_id:
                if "menu_items" in kwargs:
                    menu.rearrange_section(kwargs["menu_items"])

                if "subtitle" in kwargs:
                    section.subtitle = kwargs["subtitle"]

                if "name" in kwargs:
                    section.name = kwargs["name"]

                if "description" in kwargs:
                    section.description = kwargs["description"]

                menu.save()
                for get_section in menu.sectionized_menu()["sections"]:
                    if section._id == get_section["_id"]:
                        return get_section
        return {"description": "Section not found."}, 404


class ItemMenuResource(MenusBaseResource):
    @use_kwargs(ItemSchema)
    @marshal_with(ItemSchema)
    @firebase_login_required
    def patch(self, slug, item_id, **kwargs):
        """Edit menu item"""

        if g.user is None or not g.user.has_permission(slug):
            return {"description": "You do not have permission"}, 401

        # modify the user id
        menu = Menu.objects(slug=slug).first()
        if menu is None:
            return {"description": "Menu not found."}, 404

        for item in menu.menu_items:
            if item._id == item_id:
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

        return {"description": "Item not found"}, 404

    @firebase_login_required
    @marshal_with(ItemSchema)
    def post(self, slug, section_id):
        """Create new menu-item"""

        if g.user is None or not g.user.has_permission(slug):
            return {"description": "You do not have permission"}, 401

        menu = Menu.objects(slug=slug).first()
        if menu is None:
            return {"description": "Menu not found."}, 404

        section_ids = {section._id for section in menu.sections}
        if section_id not in section_ids:
            return {'description': 'Invalid section'}, 404

        item = Item(
            _id=str(uuid.uuid4()),
            name="",
            price="",
            tags=[],
            sections=[section_id],
            description=""
        )
        menu.menu_items.append(item)
        menu.save()
        return item
