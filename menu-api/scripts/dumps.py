from bson.json_util import dumps
import json

from blueprints.restaurants.documents.menuv2 import MenuV2
from blueprints.restaurants.documents.restaurant import Restaurant


def dump_menus():
    """Dump all objects in db as json"""
    menus = []
    for menu in MenuV2.objects():
        menu = json.loads(menu.to_json())
        menus.append(json.loads(dumps(menu)))
    with open("menus.json", "w") as fp:
        json.dump({"menus": menus}, fp)


def dump_description_title(slug: str):
    """Dump all title and description into txt"""
    output = []
    restaurant = Restaurant.objects(slug=slug).first()
    menu = restaurant.menus[0]
    for section in menu.sections:
        for item in section.menu_items:
            output.append(f"{item.name}\n")
            output.append(f"{item.description}\n")

    f = open("output.txt", "w")
    for out in output:
        f.write(out)
    f.close()
