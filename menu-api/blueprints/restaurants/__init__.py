from flask import Blueprint

bp_name = "restaurants"
restaurant_bp = Blueprint(bp_name, __name__, url_prefix="/api/v2/")
