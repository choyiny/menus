from ..documents import Tag


def parse(string):
    return [elem.strip() for elem in string.split("|")]


def get_tags(tag_string):
    menu_tags = []
    if tag_string == "":
        return menu_tags
    tags = parse(tag_string)
    for tag in tags:
        menu_tags.append(Tag(text=tag, icon="no-icon"))
    return menu_tags
