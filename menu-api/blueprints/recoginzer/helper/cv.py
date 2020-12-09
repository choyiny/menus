import cv2
import numpy as np

from .utils import to_cv2_image


def split_lines(image: bytes):
    """
    Try to split an image into rows, return `(uppers, lowers)` where `uppers` means
    the upper bound of each row and `lowers` means lower bound of each row. Please
    notice that `uppers` sometimes does not necessary have the same size with `lowers`
    because there might be error.

    `image`: The image in bytes
    """
    # Read
    img = to_cv2_image(image)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # Threshold
    th, threshed = cv2.threshold(
        gray, 127, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU
    )
    # MinAreaRect on the nozeros
    pts = cv2.findNonZero(threshed)
    ret = cv2.minAreaRect(pts)

    (cx, cy), (w, h), ang = ret
    if w > h:
        w, h = h, w
        ang += 90

    # Find rotated matrix, do rotation
    M = cv2.getRotationMatrix2D((cx, cy), ang, 1.0)
    rotated = cv2.warpAffine(threshed, M, (img.shape[1], img.shape[0]))

    # find and draw the upper and lower boundary of each lines
    hist = cv2.reduce(threshed, 1, cv2.REDUCE_AVG).reshape(-1)

    th = 2
    H, W = img.shape[:2]
    uppers = [y for y in range(H - 1) if hist[y] <= th and hist[y + 1] > th]
    lowers = [y for y in range(H - 1) if hist[y] > th and hist[y + 1] <= th]

    threshed = cv2.cvtColor(threshed, cv2.COLOR_GRAY2BGR)
    for y in uppers:
        cv2.line(threshed, (0, y), (W, y), (255, 0, 0), 1)

    for y in lowers:
        cv2.line(threshed, (0, y), (W, y), (0, 255, 0), 1)

    return uppers, lowers


def split_grids(image: bytes, iterations=4, ksize=(1, 1)):
    """
    Try to split an image into grids, return an array of rectangles in format
    `[(top_left_x, top_left_y), (bottom_right_x, bottom_right_y)]`.

    `image`: The image in bytes

    `iterations=4`: A parameter for the CV2 image processing

    `ksize=(1,1)`: A parameter for the CV2 image processing
    """
    # Load image, grayscale, Gaussian blur, Otsu's threshold
    image = to_cv2_image(image)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, ksize, 0)
    thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]

    # Create rectangular structuring element and dilate
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
    dilate = cv2.dilate(thresh, kernel, iterations=iterations)

    # Find contours and draw rectangle, also save them
    foundRect = []
    cnts = cv2.findContours(dilate, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = cnts[0] if len(cnts) == 2 else cnts[1]
    for c in cnts:
        x, y, w, h = cv2.boundingRect(c)
        # The two points of rectangle, top left and bottom right.
        foundRect.append([(x, y), (x + w, y + h)])
    return foundRect
