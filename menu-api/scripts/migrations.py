import uuid

import config as c
from blueprints.menus.documents.menu import Menu
from blueprints.restaurants.documents.menuv2 import Item, MenuV2, Section
from blueprints.restaurants.documents.restaurant import Restaurant
from mongoengine.errors import ValidationError
from pymongo import MongoClient


def migrate():
    """
    Migrates existing menus from apiv1 to restaurants in apiv2
    """
    for menu in Menu.objects():
        sectionized = menu.sectionized_menu()
        new_sections = []
        for section in sectionized["sections"]:
            new_items = []
            for item in section["menu_items"]:
                if not item._id:
                    item._id = str(uuid.uuid4())
                new_item = Item(
                    name=item["name"],
                    price=item["price"],
                    description=item["description"],
                    image=item["image"],
                    _id=item._id,
                    tags=convert_tags(item["tags"]),
                )
                new_items.append(new_item)
            new_section = Section(
                _id=section.get("_id", str(uuid.uuid4())),
                name=section["name"],
                subtitle=section["subtitle"],
                description=section["description"],
            )
            new_section.menu_items = new_items
            new_sections.append(new_section)

        new_menu = MenuV2(name=menu.slug, sections=new_sections)
        try:
            new_menu.save()
        except ValidationError as e:
            print(new_menu.name, e.message)

        restaurant = Restaurant(
            name=sectionized["name"],
            slug=menu["slug"],
            image=menu["image"],
            description=sectionized["description"],
            enable_trace=sectionized["enable_trace"],
            force_trace=sectionized["force_trace"],
            tracing_key=sectionized["tracing_key"],
            menus=[new_menu],
        )
        try:
            restaurant.save()
        except ValidationError as e:
            print(restaurant.name, e.message)


def convert_tags(tags):
    special_tags = {
        "Chef Featured": {
            "text": "Chef's Featured",
            "icon": "Chef Featured",
            "background_color": "black",
        },
        "Recommended": {
            "text": "Recommended",
            "icon": "Recommended",
            "background_color": "black",
        },
        "Spicy": {"text": "", "icon": "Spicy", "background_color": "#EE3353",},
        "Spicy2": {"text": "", "icon": "Spicy2", "background_color": "#EE3353",},
        "Spicy3": {"text": "", "icon": "Spicy3", "background_color": "#ee3353",},
        "Peanut": {
            "text": "May Contain Peanuts",
            "icon": "",
            "background_color": "black",
        },
        "Chef's Choice": {
            "text": "Chef's Choice",
            "icon": "Chef's Choice",
            "background_color": "black",
        },
        "Top Pick": {
            "text": "Top Pick",
            "icon": "Top Pick",
            "background_color": "black",
        },
        "Exquisite Flavor": {
            "text": "Exquisite Flavor",
            "icon": "",
            "background_color": "black",
        },
        "Vegetarian": {
            "text": "Vegetarian",
            "icon": "Vegetarian",
            "background_color": "#18be18",
        },
    }

    new_tags = []
    for tag in tags:
        if tag["text"] in special_tags:
            new_tags.append(special_tags[tag["text"]])
        else:
            new_tags.append(
                {"text": tag["text"], "icon": "", "background_color": "black"}
            )
    return new_tags


def user_migrations():
    client = MongoClient(c.MONGODB_URL)
    collection = client.get_database("menus").user
    user_map = {}
    for user in collection.find({}):
        if "menus" in user and user["menus"]:
            user_map[user["firebase_id"]] = user["menus"]

    for user_id in user_map:
        collection.update(
            {"firebase_id": user_id}, {"$set": {"restaurants": user_map[user_id]}}
        )
    collection.update_many(
        {}, {"$unset": {"menus": ""}},
    )
