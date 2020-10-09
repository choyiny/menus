"""Extensions module - Set up for additional libraries can go in here."""
import logging
import boto3
import config
from firebase_admin import credentials
import firebase_admin

cred = credentials.Certificate("firebase.json")
firebase_admin.initialize_app(cred)

# logging
logger = logging.getLogger("flask.general")

# client
s3 = boto3.client(
    "s3", aws_access_key_id=config.AWS_KEY_ID, aws_secret_access_key=config.AWS_SECRET
)
