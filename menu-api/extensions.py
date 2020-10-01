"""Extensions module - Set up for additional libraries can go in here."""
import logging
import boto3
import config


# logging
logger = logging.getLogger("flask.general")

# client
s3 = boto3.client(
    "s3", aws_access_key_id=config.AWS_KEY_ID, aws_secret_access_key=config.AWS_SECRET
)