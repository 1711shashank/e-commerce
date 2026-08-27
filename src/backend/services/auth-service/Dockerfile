FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY shared/libs /app/shared/libs
COPY services/auth-service/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY services/auth-service /app

EXPOSE 8001

CMD ["sh", "-c", "python manage.py makemigrations users --noinput && python manage.py migrate --noinput && python manage.py seed_staff && python manage.py collectstatic --noinput && gunicorn auth_service.wsgi:application --bind 0.0.0.0:8001"]
