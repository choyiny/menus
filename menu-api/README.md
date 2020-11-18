# Menu API
Version: 1.0

## Development
### Setup

Note: This project *requires* Python 3.7+ installed. For Mac users, ensure you are using the correct version of Python because the OS preinstalls Python 2.7 and default `pip` and `python` commands execute in v2.7 rather than v3.x.

1. Clone this repo or create a new one with this as a template.

1. Create a virtual environment for the project and activate it. Run `pip3 install virtualenv` if virtualenv is not installed on Python3.7+
    ```
    $ cd flask-api-starter  # or your repo name
    $ virtualenv venv --python=python
    $ source venv/bin/activate
    ```

4. Install the required dependencies, and setup automatic code quality checking with `black`.
    ```
    (flask-starter-venv) $ pip install -r requirements.txt
    (flask-starter-venv) $ pip install -r requirements-dev.txt
    (flask-starter-venv) $ pre-commit install
    ```

5. Edit `config.py.bak` with the proper credentials and move it to `config.py`.
6. Run Migrations
    ```
    (flask-starter-venv) $ flask db upgrade
    ```
    
### Run Locally
Remember to fill any necessary fields in `config.py`.
1. Make sure you are in your virtualenv that you setup
    ```
    $ source flask-starter-venv/bin/activate
    ```
2. Start server
    ```
    (flask-starter-venv) $ flask run
    ```
