# Bristol

Полноценная версия лендинга Bristol: React/Vite/TailwindCSS на фронтенде, FastAPI на бэкенде и PostgreSQL для хранения заявок.

## Структура

```text
frontend/   React + TypeScript + Vite + TailwindCSS
backend/    FastAPI + SQLAlchemy + Alembic + PostgreSQL
compose.yaml
```

## Быстрый запуск через Docker

```bash
docker compose up --build
```

- сайт: http://localhost:5173
- API: http://localhost:8000
- Swagger: http://localhost:8000/docs

## Локальная разработка

PostgreSQL:

```bash
docker compose up db -d
```

Backend:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Проверки

```bash
cd frontend && npm run build && npm run lint && npm run format:check
cd backend && pytest
```
