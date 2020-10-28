from flask import Blueprint

bp_name = "user_management"
user_management_bp = Blueprint(bp_name, __name__, url_prefix="/")
