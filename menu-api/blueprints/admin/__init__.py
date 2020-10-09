from flask import Blueprint

bp_name = "admin"
admin_bp = Blueprint(bp_name, __name__, url_prefix="/admin/")
