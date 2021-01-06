FROM python:3.7-slim

COPY . /usr/src/app

WORKDIR /usr/src/app

RUN apt-get update && \
    # opencv2 related dependencies.
    apt-get install -y ffmpeg libsm6 libxext6 && \
    pip install -r requirements.txt

ENTRYPOINT ["gunicorn","--workers=2", "wsgi:application", "-b", "0.0.0.0:5000"]
