from blueprints.menus.documents.menu import Menu
from blueprints.restaurant.documents.menu import Item
from blueprints.restaurant.documents.menu import Menu as NewMenu
from blueprints.restaurant.documents.menu import Section
from blueprints.restaurant.documents.restaurant import Restaurant


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
                new_item = Item(
                    name=item["name"],
                    price=item["price"],
                    description=item["description"],
                    image=item["image"],
                    _id=item["_id"],
                )
                new_items.append(new_item)
            new_section = Section(
                _id=section["_id"],
                name=section["name"],
                subtitle=section["subtitle"],
                description=section["description"],
            )
            new_section.menu_items = new_items
            new_sections.append(new_section)

        new_menu = NewMenu(name=menu.slug, sections=new_sections)
        new_menu.save()
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
        restaurant.save()
