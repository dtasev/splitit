FROM python:3.11.6-slim-bookworm

WORKDIR /app/
COPY app/requirements.txt /app/requirements.txt
RUN pip install -r /app/requirements.txt

COPY app /app

ENV PYTHONPATH=/app
# ENV GOOGLE_CLIENT_ID=
# ENV GOOGLE_CLIENT_SECRET=

CMD python /app/manage.py collectstatic --noinput \
    && python /app/manage.py migrate --noinput \
    && gunicorn --reload --bind 0.0.0.0:8001 --workers 10 wsgi:application