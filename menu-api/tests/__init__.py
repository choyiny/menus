import config
import pytest
from app import create_app
from mongoengine.connection import connect, get_db


@pytest.fixture
def client():
    """
    A pytest fixture that exposes the flask app test client.

    https://flask.palletsprojects.com/en/1.1.x/testing/
    """
    app = create_app()
    with app.test_client() as client:
        yield client

    db = connect(host=config.TEST_MONGODB_URL, alias="test")
    db.drop_database("test")
