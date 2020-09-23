import boto3
from flask_apispec.views import MethodResource
from marshmallow import Schema, fields

import config


class ErrorResponseSchema(Schema):
    description = fields.Str()


class BaseResource(MethodResource):
    pass


s3 = boto3.client(
    "s3", aws_access_key_id=config.AWS_KEY_ID, aws_secret_access_key=config.AWS_SECRET
)
