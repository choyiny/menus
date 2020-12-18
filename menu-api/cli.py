from auth.documents.user import User
from click import argument
from flask.cli import AppGroup
from scripts.dumps import dump_description_title, dump_menus
from scripts.migrations import (
    migrate,
    restaurant_migrations,
    restaurant_permission_migrations,
    user_migrations,
)


def register_commands(app):
    """
    Register useful commands to execute.
    """
    # api key management
    auth_cli = AppGroup("auth")

    @auth_cli.command("add_user")
    @argument("is_admin")
    @argument("email")
    def create_user(is_admin, email):
        """
        Example:
        $ flask auth add_user True pick@easy.com
        """
        User.create(is_admin=is_admin, email=email)
        print(f"Created user with email: {email}")

    migration_cli = AppGroup("migrate")

    @migration_cli.command("move_menus_v1_to_v2")
    def migrate_menus():
        migrate()

    @migration_cli.command("move_users_to_v2")
    def migrate_users():
        user_migrations()

    @migration_cli.command("make_restaurants_public")
    def migrate_restaurants():
        restaurant_migrations()

    @migration_cli.command("add_can_upload_to_all_restaurants")
    def migrate_restaurant_permissions():
        restaurant_permission_migrations()

    dump_cli = AppGroup("dump")

    @dump_cli.command("menus")
    def dump_menus_as_json():
        dump_menus()

    @dump_cli.command("description_title")
    @argument("slug")
    def dump_description_and_title(slug: str):
        dump_description_title(slug)

    app.cli.add_command(auth_cli)
    app.cli.add_command(migration_cli)
    app.cli.add_command(dump_cli)
