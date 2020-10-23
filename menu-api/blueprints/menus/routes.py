from .controllers import (
    MenusResource,
    MenuResource,
    ImportMenuResource,
    AllMenuResource,
    QRMenuResource,
    ImageMenuResource,
    SectionMenuResource,
    ItemMenuResource,
)

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
        "Delete",
        ["DELETE", "PATCH"],
    ),
    (
        SectionMenuResource,
        "menus/<string:slug>/sections/<string:section_id>",
        "edit_section",
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
        "edit_item",
        ["PATCH", "DELETE"],
    ),
    (
        ItemMenuResource,
        "menus/<string:slug>/sections/<string:section_id>/add_item",
        "add_item",
        ["POST"],
    )
]
