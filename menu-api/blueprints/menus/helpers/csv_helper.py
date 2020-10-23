from ..documents import Tag
from config import CSV_FIELDS


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


def clean_row(row: dict) -> dict:
    """Cleans row in csv"""
    cleaned_row = {}
    for key in row:
        cleaned_row[key.strip()] = row[key]
    return cleaned_row


def inspect_row(fields: list):
    """Inspects csvs for errors"""
    fields = {field.strip() for field in fields}
    for csv_field in CSV_FIELDS:
        if csv_field not in fields:
            return {'description': f'${csv_field} required but is missing'}

    return {'description': 'Good'}
