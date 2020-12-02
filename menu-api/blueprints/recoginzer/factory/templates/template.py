import cv2
import numpy as np

from ...helper.vision import detect_text


class BaseTemplate:
    @staticmethod
    def get_result() -> dict:
        """Get json result s"""
        pass

    def __init__(self, content: bytes, **kwargs):
        self.content = content

    def draw_image(self):
        pass


class RowTemplate(BaseTemplate):
    def split_lines(self, points):
        """
            Try to split lines for every row, the upper bounds of rows are blue and
            the lower bound of them are green. If `points` is given, also draw polygons
            on the image.
            Return uppers and lowers representing each upper bound and lower bound for
            every line.
            """
        # Read
        nparr = np.fromstring(self.content.decode("utf-8"), np.uint8)
        img = cv2.imdecode(nparr, cv2.CV_LOAD_IMAGE_COLOR)
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

        for p in points:
            point = p["point"]
            for i in point:
                cv2.polylines(
                    threshed, np.array([point], np.int32), True, (0, 0, 255), 1
                )

        return uppers, lowers

    def get_result(self) -> dict:
        points = detect_text(self.content)[1:]
        uppers, lowers = self.split_lines(points)
