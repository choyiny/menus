from auth.documents.user import User
from blueprints.menus.documents.menu import Menu
from blueprints.restaurant.documents.restaurant import Item
from blueprints.restaurant.documents.restaurant import Menu as NewMenu
from blueprints.restaurant.documents.restaurant import Restaurant, Section
from click import argument
from flask.cli import AppGroup


def register_commands(app):
    """
    Register useful commands to execute.
    """
    # api key management
    auth_cli = AppGroup("auth")

    @auth_cli.command("add_user")
    @argument("username")
    @argument("password")
    def create_user(username, password):
        """
        Example:
        $ flask auth add_user support@verto.ca temppass
        """
        User.create(username, password)
        print(f"Created user with username: {username}")

    migration_cli = AppGroup("migrate")

    @migration_cli.command("menus")
    def migrate():
        """
        Migrates existing menus from apiv1 to restaurants in apiv2
        """
        for menu in Menu.objects():
            sectionized = menu.sectionized_menu()
            new_sections = []
            for section in sectionized["sections"]:
                new_items = []
                for item in section["menu_items"]:
                    new_item = Item(
                        name=item["name"],
                        price=item["price"],
                        description=item["description"],
                        image=item["image"],
                        _id=item["_id"],
                    )
                    new_items.append(new_item)
                new_section = Section(
                    _id=section["_id"],
                    name=section["name"],
                    subtitle=section["subtitle"],
                    description=section["description"],
                )
                new_section.menu_items = new_items
                new_sections.append(new_section)

            new_menu = NewMenu(name=menu.slug, sections=new_sections)
            new_menu.save()
            restaurant = Restaurant(
                name=sectionized["name"],
                slug=menu["slug"],
                image=menu["image"],
                description=sectionized["description"],
                enable_trace=sectionized["enable_trace"],
                force_trace=sectionized["force_trace"],
                tracing_key=sectionized["tracing_key"],
                menus=[new_menu],
            )
            restaurant.save()

    app.cli.add_command(auth_cli)
    app.cli.add_command(migration_cli)
