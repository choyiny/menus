from flask import Blueprint

bp_name = "restaurant"
restaurant_bp = Blueprint(bp_name, __name__, url_prefix="/api/v2/")
