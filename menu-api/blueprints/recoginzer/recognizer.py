from abc import ABC, abstractmethod

from .helper.cv import split_grids, split_lines
from .helper.utils import img_dimension
from .helper.vision import detect_text


def recognizer_factory(name):
    """
    A simple recognizers factory that return the class based on the given name. Return
    None if the recognizer with name cannot be found.

    `name`: Name of the recognizer
    """
    recognizers = {"row": RowRecognizer, "grid": GridRecognizer}
    return recognizers[name] if name in recognizers else None


class BaseRecognizer(ABC):
    def __init__(self, config):
        """
        Initialize a recognizer.

        `config={}`: Config is a parameter that contains configurations for the recognizer. Each recognizer
        might have different parameter, such as `error` that allows some error when processing the image.
        """
        self.config = config

    def detect_text(self, image):
        """
        Detecing all texts in the given image using Google Cloud Vision. The return format will be an array of
        `{text: [...], points: [...]}` where `text` are the text identified and `points` are the points that form
        a polygon.

        `image`: The image in bytes format
        """
        pass

    @abstractmethod
    def recognize(self, image):
        """
        Override this for each recognizer to implement different recognize logic.

        Return format should be a dict with format `{results: [{ bounds: [...], text: [...] }], unrecognized: [...]}`.
        Where `results` is the recognized result that contains `bounds`: The bound of the polygon, each element
        should be a point `(x, y)`, `text`: An array of texts that are inside the polygon.
        `unrecognized` is an array of texts that are detected but not in any polygons.

        `image`: An image that is in bytes format
        """
        pass


class RowRecognizer(BaseRecognizer):
    def __init__(self, config):
        super().__init__(config)

    def recognize(self, image):
        # The first results returned by Google Vision is the big box, ignore it
        data = self.detect_text(image)[1:]
        uppers, lowers = split_lines(image)
        img_width = img_dimension(image)[0]

        # Check if each detected word is between the line
        lines_error = 10
        lines = []
        for i in range(len(uppers)):
            upper_y = uppers[i] - lines_error
            if i >= len(lowers):
                break
            else:
                lower_y = lowers[i] + lines_error
                inline_text = []
                lines.append(
                    {
                        "bounds": [(0, upper_y), (img_width, lower_y)],
                        "text": inline_text,
                    }
                )
                rest_data = []
                for points_text in data:
                    text = points_text["text"]
                    points = points_text["points"]
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
                data = rest_data
        return {"results": lines, "unrecognized": data}


class GridRecognizer(BaseRecognizer):
    def __init__(self, config):
        super().__init__(config)

    def recognize(self, image):
        # The first results returned by Google Vision is the big box, ignore it
        data = self.detect_text(image)[1:]
        grids = split_grids(image)
        results = [{"bounds": r, "text": []} for r in grids]
        all_ = set()
        identified = set()

        # Check if each detected word is in the grid
        for pIndex in range(len(data)):
            text = data[pIndex]["text"]
            text_points = data[pIndex]["points"]
            all_.add(text)
            for index in range(len(grids)):
                r = grids[index]
                x_1, y_1 = r[0]
                x_2, y_2 = r[1]
                is_in_poly = False
                # Check if every point of the text is inside the grid
                for tp in text_points:
                    x = tp[0]
                    y = tp[1]
                    if (x_1 <= x <= x_2) and (y_1 <= y <= y_2):
                        is_in_poly = True
                    else:
                        is_in_poly = False
                        break
                if is_in_poly:
                    identified.add(text)
                    results[index]["text"].append(text)
                    break
        return {"results": results, "unrecognized": list(all_.difference(identified))}
