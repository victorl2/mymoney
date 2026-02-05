# ── Backend ──
install-backend:
	cd backend && pip install -e ".[dev]"

run-backend:
	cd backend && uvicorn app.main:app --reload --port 8000

migrate:
	cd backend && alembic upgrade head

new-migration:
	cd backend && alembic revision --autogenerate -m "$(msg)"

export-schema:
	cd backend && python -c "from app.graphql.schema import schema; print(schema.as_str())" > schema/schema.graphql

seed:
	cd backend && python -m app.seed

test-backend:
	cd backend && pytest -v

# ── Frontend ──
install-frontend:
	cd frontend && npm install

run-frontend:
	cd frontend && npm run dev

codegen:
	cd frontend && npm run codegen

# ── Combined ──
install: install-backend install-frontend

dev:
	$(MAKE) run-backend & $(MAKE) run-frontend

test: test-backend
