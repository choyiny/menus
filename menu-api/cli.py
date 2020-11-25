from auth.documents.user import User
from click import argument
from flask.cli import AppGroup
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
    def migrate_menus():
        migrate()

    @migration_cli.command("users")
    def migrate_users():
        user_migrations()

    @migration_cli.command("restaurants")
    def migrate_restaurants():
        restaurant_migrations()

    @migration_cli.command("add_can_upload_to_all_restaurants")
    def migrate_restaurant_permissions():
        restaurant_permission_migrations()

    app.cli.add_command(auth_cli)
    app.cli.add_command(migration_cli)
