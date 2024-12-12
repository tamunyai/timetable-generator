from flask import Flask

from .routes import main


def create_app():
    """
    Factory function to create and configure the Flask application.

    This function initializes the Flask app, registers the main blueprint from 
    the `routes` module, and returns the app instance. The blueprint is used 
    to organize routes and views in a modular fashion.

    Returns:
        Flask: The configured Flask application instance.
    """
    app = Flask(__name__)

    # Register the main blueprint
    app.register_blueprint(main)

    return app
