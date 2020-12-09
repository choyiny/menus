import cv2
import numpy as np


def to_cv2_image(image_bytes: bytes):
    """
    Transform an image in bytes format into CV2 acceptable image.

    `image_bytes`: Image in bytes format, from flask request
    """
    return cv2.imdecode(np.fromstring(image_bytes, np.uint8), cv2.IMREAD_UNCHANGED)


def img_dimension(image_bytes: bytes):
    """
    Get an image dimension `[width, height]`

    `image_bytes`: Image in bytes format
    """
    return to_cv2_image(image_bytes).shape[:2]
