MENU_NOT_FOUND = {"description": "Menu not found."}, 404

VERSION_NOT_FOUND = {"description": "Version not found."}, 404

SECTION_NOT_FOUND = {"description": "Section not found."}, 404

ITEM_NOT_FOUND = {"description": "Item not found."}, 404

RESTAURANT_NOT_FOUND = {"description": "Restaurant not found."}, 404

IMAGE_NOT_FOUND = {"description": "Image not found"}, 404

FORBIDDEN = {"description": "You do not have permission"}, 403

NOT_AUTHENTICATED = {"description": "You are not authenticated"}, 401

MENU_ALREADY_EXISTS = {"description": "Menu already exists"}, 409

USER_ALREADY_EXISTS = {"description": "User already exists with that email"}, 400

NUMBER_ALREADY_EXISTS = (
    {"description": "User already exists with that phone-number"},
    400,
)

ANONYMOUS_USER_FORBIDDEN = {"description": "Please connect this account"}, 401


NO_QR_CODE = {"description": "No qr-code found"}

ONE_RESTAURANT_ONLY = {"description": "Only one restaurant per free user"}, 403

INVALID_TOKEN = {"description": "Invalid token"}, 403

USER_NOT_FOUND = {"description": "User not found"}, 404
