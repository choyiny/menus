import uuid

from flask_apispec.views import MethodResource
from marshmallow import Schema, fields
from extensions import s3

import config


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
