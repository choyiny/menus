import cv2
import numpy as np

from ...helper.vision import detect_text


class BaseTemplate:
    def get_result(self) -> dict:
        """Get json result s"""
        pass

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
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
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
        cv2.warpAffine(threshed, M, (img.shape[1], img.shape[0]))

        # find and draw the upper and lower boundary of each lines
        hist = cv2.reduce(threshed, 1, cv2.REDUCE_AVG).reshape(-1)

        th = 2
        H, W = img.shape[:2]
        uppers = [y for y in range(H - 1) if hist[y] <= th < hist[y + 1]]
        lowers = [y for y in range(H - 1) if hist[y] > th >= hist[y + 1]]

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
        lines = []
        for i in range(len(uppers)):
            upper_y = uppers[i] - self.lines_error
            if i >= len(lowers):
                break
            else:
                lower_y = lowers[i] + self.lines_error
                inline_text = []
                lines.append({"upper": upper_y, "lower": lower_y, "text": inline_text})
                rest_data = []
                for points_text in points:
                    text = points_text["text"]
                    points = points_text["point"]
                    inline = True
                    for p in points:
                        y = p[1]
                        if upper_y <= y <= lower_y:
                            inline = True
                        else:
                            inline = False
                            break
                    if inline:
                        inline_text.append(text)
                    else:
                        rest_data.append(points_text)
                points = rest_data
        return {"lines": lines, "left": points}

    def __init__(self, content: bytes, **kwargs):
        self.lines_error = 10
        self.content = content

        if kwargs.get("line_error"):
            self.lines_error = kwargs.get("line_error")


class GridTemplate(BaseTemplate):
    def split_grids(self, points):
        """
        Split the given image into grids.
        Return a dict as the result.
        """
        KSIZE = (1, 1)

        # Load image, grayscale, Gaussian blur, Otsu's threshold
        nparr = np.fromstring(self.content.decode("utf-8"), np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        blur = cv2.GaussianBlur(gray, KSIZE, 0)
        thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]

        # Create rectangular structuring element and dilate
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
        dilate = cv2.dilate(thresh, kernel, iterations=4)

        # Find contours and draw rectangle, also save them
        foundRect = []
        cnts = cv2.findContours(dilate, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        cnts = cnts[0] if len(cnts) == 2 else cnts[1]
        for c in cnts:
            x, y, w, h = cv2.boundingRect(c)
            # The two points of rectangle, top left and bottom right.
            foundRect.append([(x, y), (x + w, y + h)])
            cv2.rectangle(image, (x, y), (x + w, y + h), (36, 255, 12), 2)

        # This is slow when there are a lot of text and polygons
        result = [{"bound": r, "text": []} for r in foundRect]
        for pIndex in range(len(points)):
            p = points[pIndex]
            text = p["text"]
            textPoints = p["point"]
            # Do not draw the big rectangle
            if pIndex != 0:
                cv2.polylines(
                    image, np.array([p["point"]], np.int32), True, (255, 120, 255), 2
                )
            # For each foundRect, check what polygons belong to it
            for index in range(len(foundRect)):
                r = foundRect[index]
                x_1, y_1 = r[0]
                x_2, y_2 = r[1]
                isInPoly = False
                for tp in textPoints:
                    x = tp[0]
                    y = tp[1]
                    if (x_1 <= x <= x_2) and (y_1 <= y <= y_2):
                        isInPoly = True
                    else:
                        isInPoly = False
                    if not isInPoly:
                        break
                if isInPoly:
                    result[index]["text"].append(text)
        return result

    def get_result(self) -> dict:
        data = detect_text(self.content)[1:]
        return {"result": self.split_grids(data)}

    def __init__(self, content, **kwargs):
        self.content = content
