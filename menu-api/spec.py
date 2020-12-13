# Apispec
from apispec import APISpec
from apispec.ext.marshmallow import MarshmallowPlugin

import docs


def format_docstring(docstring):
    """
    Taken from https://github.com/fecgov/openFEC/blob/master/webservices/spec.py
    """
    if not docstring or not docstring.strip():
        return ""

    formatted = []
    lines = docstring.expandtabs().splitlines()

    for line in lines:
        if line == "":
            formatted.append("\n\n")
        else:
            formatted.append(line.strip())

    return " ".join(formatted).strip()


TAGS = [
    {"name": "Menu", "description": format_docstring(docs.MENU_TAG)},
]

APISPEC_SPEC = APISpec(
    title="Menu API",
    version="v1",
    info={"description": format_docstring(docs.API_DESCRIPTION)},
    plugins=[MarshmallowPlugin()],
    produces=["application/json"],
    openapi_version="2.0.0",
    tags=TAGS,
    securityDefinitions={
        "Authorization": {
            "description": "Basic Auth",
            "in": "header",
            "type": "basic",
            "required": True,
        },
    },
)
