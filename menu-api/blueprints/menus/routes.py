from .controllers import (AllMenuResource, ImageMenuResource,
                          ImportMenuResource, ItemMenuResource, MenuResource,
                          MenusResource, QRMenuResource, SectionMenuResource)

resources = [
    (MenusResource, "/menus/", "users", ["POST"]),
    (MenuResource, "/menus/<string:slug>", "user", ["GET", "PATCH", "DELETE"]),
    (
        ImportMenuResource,
        "/menus/<string:slug>/items/import",
        "import",
        ["POST", "PATCH"],
    ),
    (AllMenuResource, "menus/all", "all", ["GET"]),
    (QRMenuResource, "menus/generate", "QR", ["GET"]),
    (
        ImageMenuResource,
        "menus/<string:slug>/items/<string:item_id>/picture",
        "picture",
        ["DELETE", "PATCH"],
    ),
    (
        SectionMenuResource,
        "menus/<string:slug>/sections/<string:section_id>",
        "section",
        ["PATCH"],
    ),
    (
        SectionMenuResource,
        "menus/<string:slug>/sections/add_section",
        "add_section",
        ["POST"],
    ),
    (
        ItemMenuResource,
        "menus/<string:slug>/items/<string:item_id>",
        "menu_items",
        ["PATCH", "DELETE"],
    ),
    (
        ItemMenuResource,
        "menus/<string:slug>/sections/<string:section_id>/add_item",
        "add_item",
        ["POST"],
    ),
]
