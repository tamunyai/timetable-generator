import pytest

from app import create_app


@pytest.fixture
def app():
    app = create_app()
    return app


@pytest.fixture
def client(app):
    return app.test_client()


def test_index(client):
    response = client.get("/")
    assert response.status_code == 200


def test_timetable(client):
    response = client.get("/timetable")
    assert response.status_code == 200


def test_about(client):
    response = client.get("/about")
    assert response.status_code == 200
