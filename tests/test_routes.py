import pytest

from app import create_app


@pytest.fixture
def app():
    """
    Fixture to create and return the Flask application instance.

    This fixture initializes the Flask application using the create_app function.
    It is used in the tests to provide the application context.

    Returns:
        Flask: The created Flask application instance.
    """
    app = create_app()
    return app


@pytest.fixture
def client(app):
    """
    Fixture to create and return a test client for the Flask application.

    This fixture uses the Flask application's `test_client` method to simulate
    HTTP requests to the application. It can be used to test endpoints in the app.

    Args:
        app (Flask): The Flask application instance created by the `app` fixture.

    Returns:
        FlaskClient: The Flask test client.
    """
    return app.test_client()


def test_index(client):
    """
    Test the index route ("/").

    This test sends a GET request to the index route ("/") and checks that
    the response status code is 200, indicating the page loads successfully.

    Args:
        client (FlaskClient): The test client to simulate HTTP requests.

    Asserts:
        status_code (int): The HTTP status code of the response should be 200.
    """
    response = client.get("/")
    assert response.status_code == 200


def test_timetable(client):
    """
    Test the timetable route ("/timetable").

    This test sends a GET request to the timetable route ("/timetable") and checks
    that the response status code is 200, indicating the page loads successfully.

    Args:
        client (FlaskClient): The test client to simulate HTTP requests.

    Asserts:
        status_code (int): The HTTP status code of the response should be 200.
    """
    response = client.get("/timetable")
    assert response.status_code == 200


def test_about(client):
    """
    Test the about route ("/about").

    This test sends a GET request to the about route ("/about") and checks
    that the response status code is 200, indicating the page loads successfully.

    Args:
        client (FlaskClient): The test client to simulate HTTP requests.

    Asserts:
        status_code (int): The HTTP status code of the response should be 200.
    """
    response = client.get("/about")
    assert response.status_code == 200
