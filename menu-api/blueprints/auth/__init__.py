from flask import Blueprint

bp_name = "auth"
auth_bp = Blueprint(bp_name, __name__, url_prefix="/")
