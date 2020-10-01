from . import bp_name
from .controllers import (
    MenusResource,
    MenuResource,
    ImportMenuResource,
    AllMenuResource,
    QRMenuResource,
    ImageMenuResource,
)

resources = [
    (MenusResource, "/menus/", "users", ["POST"]),
    (MenuResource, "/menus/<string:slug>", "user", ["GET", "PATCH", "DELETE"]),
    (ImportMenuResource, "/menus/<string:slug>/items/import", "import", ["POST"]),
    (AllMenuResource, "menus/all", "all", ["GET"]),
    (QRMenuResource, "menus/generate", "QR", ["GET"]),
    (
        ImageMenuResource,
        "menus/<string:slug>/items/<item_id>/pictures/upload",
        "Image",
        ["POST"],
    ),
]
