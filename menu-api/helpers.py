import boto3
from flask_apispec.views import MethodResource
from marshmallow import Schema, fields
import uuid

import config


class ErrorResponseSchema(Schema):
    description = fields.Str()


class BaseResource(MethodResource):
    pass


s3 = boto3.client(
    "s3", aws_access_key_id=config.AWS_KEY_ID, aws_secret_access_key=config.AWS_SECRET
)


def upload_image(file):
    filename = str(uuid.uuid4()) + ".png"
    s3.put_object(
        Bucket=config.S3_BUCKET_NAME,
        Key=filename,
        Body=file,
        ACL="public-read",
        ContentType="image/png",
    )
    return "https://%s.s3.%s.amazonaws.com/%s" % (
        config.S3_BUCKET_NAME,
        config.AWS_REGION,
        filename,
    )
