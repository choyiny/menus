import os

import mongoengine
import sentry_sdk
from flask import Blueprint, Flask, jsonify
from flask_apispec import FlaskApiSpec
from flask_cors import CORS
from sentry_sdk.integrations.flask import FlaskIntegration
from sentry_sdk.integrations.redis import RedisIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration

import config as c
import loggers
from cli import register_commands
from extensions import logger
from spec import APISPEC_SPEC

project_dir = os.path.dirname(os.path.abspath(__file__))


def create_app(for_celery=False, testing=False):
    """ Application Factory. """
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(c)
    app.config["TESTING"] = testing

    # cors
    CORS(
        app, expose_headers=["Authorization"], resources={"/*": {"origins": c.ORIGINS}}
    )

    app.before_request(loggers.before_request)

    register_commands(app)

    register_extensions(testing)
    register_blueprints(app)
    register_shell(app)
    register_external(skip_sentry=for_celery)

    # Return validation errors as JSON
    @app.errorhandler(422)
    def handle_error(err):
        headers = err.data.get("headers", None)
        messages = err.data.get("messages", ["Invalid request."])
        if headers:
            return jsonify({"errors": messages}), err.code, headers
        else:
            return jsonify({"errors": messages}), err.code

    @app.errorhandler(404)
    def handle_404(err):
        return jsonify({"description": "Not Found"}), err.code

    return app


def register_shell(app: Flask):
    """ Expose more attributes to the Flask Shell. """

    @app.shell_context_processor
    def make_shell_context():
        # make below variables accessible in the shell for testing purposes
        return {"app": app}


def register_extensions(testing: bool):
    """ Register Flask extensions. """

    url = c.MONGODB_URL if not testing else c.TEST_MONGODB_URL
    mongoengine.connect(host=url)


def register_blueprints(app: Flask):
    """ Register Flask blueprints. """
    app.config.update({"APISPEC_SPEC": APISPEC_SPEC})
    docs = FlaskApiSpec(app)

    # menus blueprint
    # admin blueprint
    from blueprints.admin import admin_bp
    from blueprints.admin import bp_name as admin_bp_name
    from blueprints.admin.routes import resources as admin_resources
    # auth blueprint
    from blueprints.auth import auth_bp
    from blueprints.auth import bp_name as auth_bp_name
    from blueprints.auth.routes import resources as auth_resources
    # menu [legacy] blueprints
    from blueprints.menus import bp_name as menu_bp_name
    from blueprints.menus import menus_bp
    from blueprints.menus.routes import resources as menu_resources
    # user dynamic-qr-code blueprint
    from blueprints.qr import bp_name as qr_bp_name
    from blueprints.qr import qr_bp
    from blueprints.qr.routes import resources as qr_resources
    from blueprints.restaurants import bp_name as restaurant_bp_name
    from blueprints.restaurants import restaurant_bp
    from blueprints.restaurants.routes import resources as restaurant_resources
    # user management blueprint
    from blueprints.user_management import bp_name as user_management_bp_name
    from blueprints.user_management import user_management_bp
    from blueprints.user_management.routes import \
        resources as user_management_resources

    set_routes(menu_resources, app, menus_bp, docs, menu_bp_name)
    set_routes(auth_resources, app, auth_bp, docs, auth_bp_name)
    set_routes(admin_resources, app, admin_bp, docs, admin_bp_name)
    set_routes(
        user_management_resources,
        app,
        user_management_bp,
        docs,
        user_management_bp_name,
    )
    set_routes(restaurant_resources, app, restaurant_bp, docs, restaurant_bp_name)
    set_routes(qr_resources, app, qr_bp, docs, qr_bp_name)


def register_external(skip_sentry=False):
    """ Register external integrations. """
    # sentry
    if len(c.SENTRY_DSN) == 0:
        logger.warning("Sentry DSN not set.")
    elif skip_sentry:
        logger.info("Skipping Sentry Initialization for Celery.")
    else:
        sentry_sdk.init(
            c.SENTRY_DSN,
            integrations=[
                FlaskIntegration(),
                RedisIntegration(),
                SqlalchemyIntegration(),
            ],
        )


def set_routes(resources, app: Flask, bp: Blueprint, docs: FlaskApiSpec, bp_name):
    for resource, route, name, methods in resources:
        bp.add_url_rule(route, view_func=resource.as_view(name), methods=methods)

    app.register_blueprint(bp)

    for resource, route, name, methods in resources:
        docs.register(resource, blueprint=bp_name, endpoint=name)
