from flask import redirect
from flask_apispec import doc

import config as c
from utils.errors import RESTAURANT_NOT_FOUND

from ...restaurants.documents.restaurant import Restaurant
from .qr_base_resource import QrBaseResource


class DynamicQrResource(QrBaseResource):
    @doc(description="""redirect user to restaurant's qrcode link""")
    def get(self, slug):
        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant is None:
            return RESTAURANT_NOT_FOUND
        if restaurant.qrcode_link:
            return redirect(restaurant.qrcode_link, 302)
        else:
            return redirect(f"{c.FRONTEND_URL}/restaurants/{slug}", 302)
