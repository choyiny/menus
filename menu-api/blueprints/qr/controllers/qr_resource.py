from flask import redirect
from flask_apispec import doc

from ...restaurants.documents.restaurant import Restaurant
from .qr_base_resource import QrBaseResource


class DynamicQrResource(QrBaseResource):
    @doc(description="""redirect user to restaurant's qrcode link""")
    def get(self, slug):
        restaurant = Restaurant.objects(slug=slug).first()
        if restaurant.qrcode_link:
            return redirect(restaurant.qrcode_link, 301)
        else:
            # PickEasy not found page?
            return {"description": "not-found"}
