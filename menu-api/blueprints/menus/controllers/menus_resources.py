from flask import g
from flask_apispec import marshal_with, use_kwargs, doc
from webargs.flaskparser import use_args
import csv
from io import StringIO

from auth.decorators import with_current_user
from helpers import ErrorResponseSchema
from .menus_base_resource import MenusBaseResource
from ..documents import Menu, Item, Section, Tag
from ..schemas import MenuSchema, GetMenuSchema, import_args


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


@doc(description="""Upload menu to server""")
class ImportMenuResource(MenusBaseResource):
    @use_args(import_args, location="files")
    def post(self, args, slug):
        menu = Menu.objects(slug=slug).first()
        if menu is None:
            return {"description": "Menu not found."}, 404
        file_str = args["csv"].read()
        reader = csv.DictReader(file_str.decode().splitlines(), skipinitialspace=True)
        menu_items = []
        total_sections = set()
        for row in reader:
            sections = [section.strip() for section in row["Sections"].split("|")]

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
            # print(menu_items[-1])
            total_sections = total_sections.union(sections)
        menu.menu_items = menu_items
        menu.sections = [Section(name=section, image=None) for section in total_sections]
        menu.save()
        return "success"

    def get_tags(self, tag_string):
        menu_tags = []
        if tag_string == "":
            return menu_tags
        tags = tag_string.split("|")
        for tag in tags:
            menu_tags.append(Tag(text=tag, icon="no-icon"))
        return menu_tags


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

        return menu.save()

    @marshal_with(ErrorResponseSchema, code=404)
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
