FROM python:3.11.6-slim-bookworm

WORKDIR /app/splitit
ENV PYTHONPATH=/app

COPY app/requirements.txt /app/requirements.txt
RUN pip install -r /app/requirements.txt

COPY app /app

CMD python /app/manage.py collectstatic --noinput && gunicorn --reload --bind 0.0.0.0:8001 --workers 10 wsgi:application