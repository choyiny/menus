from abc import abstractmethod, ABC
from .helper.vision import detect_text
from .helper.cv import split_grids, split_lines
from .helper.utils import img_dimension


def recognizer_factory(name):
    """
    A simple recognizers factory that return the class based on the given name. Return
    None if the recognizer with name cannot be found.

    `name`: Name of the recognizer
    """
    recognizers = {
        'row': RowRecognizer,
        'grid': GridRecognizer
    }
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
        return detect_text(image)

    @abstractmethod
    def recognize(self, image):
        """
        Override this for each recognizer to implement different recognize logic.

        Return format should be a dict with format `{result: [{ bound: [...], text: [...] }], unrecognized: [...]}`.
        Where `result` is the recognized result that contains `bound`: The bound of the polygon, each element
        should be a point `(x, y)`, `text`: An array of texts that are inside the polygon.
        `unrecognized` is an array of texts that are detected but not in any polygons.

        `image`: An image that is in bytes format
        """
        pass


class RowRecognizer(BaseRecognizer):
    def __init__(self, config):
        super().__init__(config)
    
    def recognize(self, image):
        data = self.detect_text(image)
        uppers, lowers = split_lines(image)
        img_width = img_dimension(image)[0]

        # Check if each detected word is between the line
        cp_data = data[:]
        result = []
        lines_error = 10
        img_width # TODO
        for i in range(len(uppers)):
            upper_y = uppers[i] - lines_error
            if i >= len(lowers):
                break
            else:
                lower_y = lowers[i] + lines_error
                inline_text = []
                lines.append({ 'bound': [(0, upper_y), (img_width, lower_y)], 'text' : inline_text })
                rest_data = []
                for points_text in data:
                    text = points_text['text']
                    points = points_text['point']
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
        return {'result': lines, 'unrecognized': data}


class GridRecognizer(BaseRecognizer):
    def __init__(self, config):
        super().__init__(config)
    
    def recognize(self, image):
        data = self.detect_text(image)
        grids = split_grids(image, data)
        result = [{'bound': r, 'text': []} for r in grids]
        all_ = set()
        identified = set()

        # Check if each detected word is in the grid
        for pIndex in range(len(data)):
            text = points[pIndex]['text']
            textPoints = points[pIndex]['point']
            all_.add(text)
            for index in range(len(grids)):
                r = grids[index]
                x_1, y_1 = r[0]
                x_2, y_2 = r[1]
                isInPoly = False
                # Check if every point of the text is inside the grid
                for tp in textPoints:
                    x = tp[0]
                    y = tp[1]
                    if (x_1 <= x <= x_2) and (y_1 <= y <= y_2):
                        isInPoly = True
                    else:
                        isInPoly = False
                        break
                if isInPoly:
                    identified.add(text)
                    result[index]['text'].append(text)
                    break
        return {'result': result, 'unrecognized': list(all_.difference(identified))}
