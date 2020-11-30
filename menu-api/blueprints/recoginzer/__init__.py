from flask import Blueprint

bp_name = "recognizer"
recognizer_bp = Blueprint(bp_name, __name__, url_prefix="/")
