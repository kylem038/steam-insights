SHELL := /bin/bash

.PHONY: dev stop clean

dev:
	docker compose up -d
	@until docker compose exec -T postgres pg_isready -U postgres 2>/dev/null; do sleep 1; done
	@trap 'kill 0' EXIT; \
	cd backend && npm run dev & \
	cd frontend && npm run dev & \
	wait

stop:
	docker compose down

clean:
	docker compose down -v
