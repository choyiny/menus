from flask import g
from flask_apispec import marshal_with, use_kwargs, doc
from webargs.flaskparser import use_args
from flask import send_file
import csv
from io import BytesIO

import qrcode
from PIL import Image
from marshmallow import Schema, fields

from auth.decorators import with_current_user
from helpers import ErrorResponseSchema, s3
from .menus_base_resource import MenusBaseResource
from ..documents import Menu, Item, Section, Tag
from ..schemas import (
    MenuSchema,
    GetMenuSchema,
    import_args,
    pagination_args,
    image_args,
)
import config
import uuid


@doc(description="""Menu collection related operations""")
class MenusResource(MenusBaseResource):
    @marshal_with(MenuSchema)
    @use_kwargs(MenuSchema)
    @with_current_user
    def post(self, **menu_info):
        """
        Create a new Menu.
        """
        if g.user is None:
            return {"description": "You do not have permission"}, 401

        menu = Menu(**menu_info).save()

        return menu


@doc(description="""get all the menus from the database""")
class AllMenuResource(MenusBaseResource):
    class GetAllMenusSchema(Schema):
        menus = fields.List(fields.Nested(MenuSchema))

    @marshal_with(GetAllMenusSchema)
    @use_args(pagination_args, location="querystring")
    def get(self, args):
        limit = args["limit"]
        page = args["page"]
        menus = [menu for menu in Menu.objects()]
        return {"menus": menus[(page - 1) * limit : page * limit]}


@doc(description="""Upload menu to server""")
class ImportMenuResource(MenusBaseResource):
    @marshal_with(GetMenuSchema)
    @use_args(import_args, location="files")
    def post(self, args, slug):
        menu = Menu.objects(slug=slug).first()
        if menu is None:
            return {"description": "Menu not found."}, 404
        file_str = args["csv"].read()
        reader = csv.DictReader(file_str.decode().splitlines(), skipinitialspace=True)
        menu_items = []
        for row in reader:
            sections = [section.strip() for section in row["Sections"].split("|")]
            self.get_sections(row)
            menu_items.append(
                Item(
                    description=row["Description"],
                    name=row["Name"],
                    price=row["Price"],
                    tags=self.get_tags(row["Tags"]),
                    sections=sections,
                    image=None,
                )
            )
        menu.menu_items = menu_items
        menu.sections = [self.all_sections[section] for section in self.all_sections]
        menu.save()
        menu.reload()
        return menu.sectionized_menu()

    @staticmethod
    def parse(string):
        return [elem.strip() for elem in string.split("|")]

    def get_tags(self, tag_string):
        menu_tags = []
        if tag_string == "":
            return menu_tags
        tags = self.parse(tag_string)
        for tag in tags:
            menu_tags.append(Tag(text=tag, icon="no-icon"))
        return menu_tags

    def get_sections(self, row):
        section_list = self.parse(row["Sections"])
        descriptions = self.parse(row["Section Description"])

        for i in range(len(section_list)):
            if section_list[i] not in self.all_sections:
                self.all_sections[section_list[i]] = Section(
                    name=section_list[i],
                    image=row["Section Image"],
                    description=descriptions[i],
                )

            if self.all_sections[section_list[i]].image == "":
                self.all_sections[section_list[i]].image = None
            if self.all_sections[section_list[i]].description == "":
                self.all_sections[section_list[i]].description = None

    def __init__(self):
        self.all_sections = {}


@doc(description="""Menu element related operations""",)
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

        if g.user is None:
            return {"description": "You do not have permission"}, 401

        # modify the user id
        menu = Menu.objects(slug=kwargs["slug"]).first()
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

        return menu.save()

    @marshal_with(ErrorResponseSchema, code=404)
    @marshal_with(MenuSchema)
    @with_current_user
    def delete(self, slug):
        """
        Delete User that matches user_id.
        """
        if g.user is None:
            return {"description": "You do not have permission"}, 401
        menu = Menu.objects(slug=slug).first()
        if menu is None:
            return {"description": "Menu not found."}, 404

        menu.delete()

        return menu


@doc(description="""Generate QR code of url on template""")
class QRMenuResource(MenusBaseResource):
    def get(self, slug):
        """Generate QR code in template"""
        url = config.QR_CODE_ROOT_URL + slug
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
        for coord in self.generate_tuples():
            template.paste(img, coord)
        return self.serve_pil_image(template, slug + ".png")

    @staticmethod
    def generate_tuples():
        """Mathematically generate coordinate tuple"""
        coords = []

        def boxify(x, y):
            return tuple((x, y, x + 950, y + 950))

        coords_x = [1070, 3560, 6020]
        coords_y = [820, 3840]

        for x in coords_x:
            for y in coords_y:
                coords.append(boxify(x, y))
        return coords

    @staticmethod
    def serve_pil_image(pil_img, image_name):
        img_io = BytesIO()
        pil_img.save(img_io, "png", quality=70)
        img_io.seek(0)
        return send_file(
            img_io, mimetype="png", attachment_filename=image_name, as_attachment=True
        )


class ImageMenuResource(MenusBaseResource):
    @use_args(image_args, location="files")
    @with_current_user
    def post(self, args, slug, item_id):
        """Upload image to server"""
        image_bytes = args["image"].read()
        loaded_image = Image.open(BytesIO(image_bytes))
        out_img = BytesIO()
        loaded_image.save(out_img, "PNG")
        out_img.seek(0)
        menu = Menu.objects(slug=slug).first()
        for item in menu.menu_items:
            if item.name == item_id:
                item.image = self.upload_file(out_img)
                menu.save()
                return item.image

    @staticmethod
    def upload_file(file):
        filename = str(uuid.uuid4()) + ".png"
        s3.put_object(
            Bucket=config.S3_BUCKET_NAME,
            Key=filename,
            Body=file,
            ACL="public-read",
            ContentType="image/png",
        )
        return "https://%s.s3.%s.amazonaws.com/%s" % (
            config.S3_BUCKET_NAME,
            config.AWS_REGION,
            filename,
        )
