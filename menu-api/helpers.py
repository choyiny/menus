import uuid

import config
from extensions import s3
from flask_apispec.views import MethodResource
from marshmallow import Schema, fields


class ErrorResponseSchema(Schema):
    description = fields.Str()


class BaseResource(MethodResource):
    pass


def upload_image(file):
    filename = str(uuid.uuid4()) + ".png"
    s3.put_object(
        Bucket=config.S3_BUCKET_NAME,
        Key=filename,
        Body=file,
        ACL="public-read",
        ContentType="image/png",
    )
    return f"https://{config.S3_BUCKET_NAME}.s3.{config.AWS_REGION}.amazonaws.com/{filename}"


def delete_file(image_url):
    # last 40 characters is {uuid.png}, filename
    # example
    # https://pickeasy-restaurant-images.s3.us-east-1.amazonaws.com/0b1b04d7-b410-44b8-92b9-30dfa4c8a45b.png
    s3.delete_object(Bucket=config.S3_BUCKET_NAME, Key=image_url[-40:])
