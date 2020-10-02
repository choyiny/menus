from flask import g
from flask_apispec import marshal_with, use_kwargs, doc
from webargs.flaskparser import use_args
import csv
from io import BytesIO
import uuid

import qrcode
from PIL import Image
from marshmallow import Schema, fields

from auth.decorators import with_current_user
from helpers import ErrorResponseSchema, upload_image
from ..helpers import csv_helper
from ..helpers import qr_helper
from .menus_base_resource import MenusBaseResource
from ..documents import Menu, Item, Section
from ..schemas import MenuSchema, GetMenuSchema, pagination_args, file_args, qr_args


@doc(description="""Menu collection related operations""")
class MenusResource(MenusBaseResource):
    @marshal_with(MenuSchema)
    @use_kwargs(MenuSchema)
    @with_current_user
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
        menus = fields.List(fields.Nested(MenuSchema))

    @marshal_with(GetAllMenusSchema)
    @use_args(pagination_args, location="querystring")
    @with_current_user
    def get(self, args):
        if g.user is None or not g.user.is_admin:
            return {"description": "You do not have permission"}, 401

        limit = args["limit"]
        page = args["page"]
        menus = [menu for menu in Menu.objects()]
        return {"menus": menus[(page - 1) * limit: page * limit]}


@doc(description="""Upload menu to server""")
class ImportMenuResource(MenusBaseResource):
    @marshal_with(GetMenuSchema)
    @use_args(file_args, location="files")
    @with_current_user
    def post(self, args, slug):

        if g.user is None or not g.user.has_permission(slug):
            return {"description": "You do not have permission"}, 401

        menu = Menu.objects(slug=slug).first()
        if menu is None:
            return {"description": "Menu not found."}, 404

        file_str = args["file"].read()
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
                    sections=sections,
                    image=None,
                )
            )
        menu.menu_items = menu_items
        menu.sections = [self.all_sections[section] for section in self.all_sections]
        menu.save()
        menu.reload()
        return menu.sectionized_menu()

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
                )

            if self.all_sections[section_list[i]].image == "":
                self.all_sections[section_list[i]].image = None

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

    @marshal_with(MenuSchema)
    @use_kwargs(MenuSchema)
    @with_current_user
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

        if kwargs.get('external_link') and kwargs.get('external_link') != '':
            menu.external_link = kwargs.get('external_link')

        if kwargs.get('link_name') and kwargs.get('link_name') != '':
            menu.link_name = kwargs.get('link_name')

        return menu.save()

    @marshal_with(ErrorResponseSchema, code=404)
    @marshal_with(MenuSchema)
    @with_current_user
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
    @with_current_user
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
        template = Image.open("menu-api/assets/print template huge.png")
        for coord in qr_helper.generate_tuples():
            template.paste(img, coord)
        return qr_helper.serve_pil_image(template, name + ".png")


class ImageMenuResource(MenusBaseResource):
    @use_args(file_args, location="files")
    @with_current_user
    def post(self, args, slug, item_id):
        """Upload image to server"""
        if g.user is None or not g.user.has_permission(slug):
            return {"description": "You do not have permission"}, 401
        image_bytes = args["file"].read()
        loaded_image = Image.open(BytesIO(image_bytes))
        out_img = BytesIO()
        loaded_image.save(out_img, "PNG")
        out_img.seek(0)
        menu = Menu.objects(slug=slug).first()
        for item in menu.menu_items:
            if item._id == item_id:
                item.image = upload_image(out_img)
                menu.save()
                return item.image
