from auth.documents.user import User
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

    app.cli.add_command(auth_cli)
