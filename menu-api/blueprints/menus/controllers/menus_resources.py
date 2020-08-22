from flask_apispec import marshal_with, use_kwargs, doc

from helpers import ErrorResponseSchema
from .menus_base_resource import MenusBaseResource
from ..documents import Menu, Item, Section
from ..schemas import MenuSchema, GetMenuSchema


@doc(description="""Menu collection related operations""",)
class MenusResource(MenusBaseResource):
    @marshal_with(MenuSchema)
    @use_kwargs(MenuSchema)
    def post(self, **menu_info):
        """
        Create a new Menu.
        """
        menu = Menu(**menu_info).save()

        return menu


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
    def patch(self, **kwargs):
        """
        Replace attributes for Menu that matches slug.
        """
        # modify the user id
        menu = Menu.objects(slug=kwargs["slug"]).first()
        if menu is None:
            return {"description": "Menu not found."}, 404

        if kwargs.get("name"):
            menu.name = kwargs["name"]

        if kwargs.get("sections"):
            menu.sections = [Section(**section_dict) for section_dict in kwargs["sections"]]

        if kwargs.get("menu_items"):
            menu.menu_items = [Item(**item_dict) for item_dict in kwargs["menu_items"]]

        return menu.save()

    @marshal_with(ErrorResponseSchema, code=404)
    def delete(self, slug):
        """
        Delete User that matches user_id.
        """
        menu = Menu.objects(slug=slug).first()
        if menu is None:
            return {"description": "Menu not found."}, 404

        menu.delete()

        return menu
