.PHONY: up down logs ps restart migrate-all shared-install help

help:
	@echo "E-commerce — common commands"
	@echo "  make up             Bring up UI + infra (Postgres x5, Redis, Nginx)"
	@echo "  make down           Stop and remove containers"
	@echo "  make logs           Tail logs for all services"
	@echo "  make ps             Show running containers"
	@echo "  make restart        Restart all containers"
	@echo "  make migrate-all    Run migrations across all Django services (Phase 1+)"
	@echo "  make shared-install Install src/backend/shared/libs in editable mode"

COMPOSE_BACKEND_ENV := $(if $(wildcard src/backend/.env),src/backend/.env,src/backend/.env.example)
COMPOSE_UI_ENV := $(if $(wildcard src/ui/.env),src/ui/.env,$(if $(wildcard src/ui/.env.local),src/ui/.env.local,src/ui/.env.example))
COMPOSE = docker compose --env-file $(COMPOSE_BACKEND_ENV) --env-file $(COMPOSE_UI_ENV)

up:
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps

restart:
	$(COMPOSE) restart

# Placeholder until Django services exist (Phase 1+)
migrate-all:
	@for svc in auth catalog inventory order payment notification; do \
		if [ -f "src/backend/services/$${svc}-service/manage.py" ]; then \
			echo "Migrating $${svc}-service..."; \
			$(COMPOSE) exec $${svc}-service python manage.py migrate --noinput || true; \
		else \
			echo "Skipping $${svc}-service (not scaffolded yet)"; \
		fi; \
	done

shared-install:
	pip install -e ./src/backend/shared/libs
