from io import BytesIO
from flask import send_file


def generate_tuples():
    """Mathematically generate coordinate tuple"""
    coords = []

    coords_x = [1070, 3560, 6020]
    coords_y = [820, 3840]

    for x in coords_x:
        for y in coords_y:
            coords.append(boxify(x, y))
    return coords


def boxify(x, y):
    return tuple((x, y, x + 950, y + 950))


def serve_pil_image(pil_img, image_name):
    img_io = BytesIO()
    pil_img.save(img_io, "png", quality=70)
    img_io.seek(0)
    return send_file(
        img_io, mimetype="png", attachment_filename=image_name, as_attachment=True
    )
