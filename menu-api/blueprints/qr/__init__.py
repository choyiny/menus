from flask import Blueprint

bp_name = "qr-code"
qr_bp = Blueprint(bp_name, __name__, url_prefix="/qr/")
