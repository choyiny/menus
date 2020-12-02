import cv2
import numpy as np


class BaseTemplate:
    @staticmethod
    def get_result() -> dict:
        pass

    def __init__(self, content: bytes, points: list, **kwargs):
        self.content = content
        self.points = points
