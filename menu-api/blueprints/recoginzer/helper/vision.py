from google.cloud import vision


def detect_text(content: bytes):
    """
    Detect texts in the file using Google vision, return points array such that
    each of them contains `text`: The actual text within the polygons. `point`:
    Points that form the polygon.
    """

    client = vision.ImageAnnotatorClient.from_service_account_json(
        "gcp_service_account.json"
    )
    image = vision.Image(content=content)
    response = client.text_detection(image=image)
    if response.error.message:
        return {"description": response.error_messsage}

    texts = response.text_annotations
    points_text = []

    for text in texts:
        des = text.description
        points = []
        for vertex in text.bounding_poly.vertices:
            points.append((vertex.x, vertex.y))
        points.append(points[0])
        points_text.append({"text": des, "points": points})

    return points_text
