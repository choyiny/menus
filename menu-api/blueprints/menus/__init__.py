from flask import Blueprint

bp_name = "menus"
menus_bp = Blueprint(bp_name, __name__, url_prefix="/")
