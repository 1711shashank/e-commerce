FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY shared/libs /app/shared/libs
COPY services/catalog-service/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY services/catalog-service /app

EXPOSE 8002

CMD ["sh", "-c", "python manage.py makemigrations products --noinput && python manage.py migrate --noinput && python manage.py seed_admin && python manage.py collectstatic --noinput && gunicorn catalog_service.wsgi:application --bind 0.0.0.0:8002"]
