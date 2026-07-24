# ClearGateCustoms

Полноценная версия лендинга ClearGateCustoms: React/Vite/TailwindCSS на фронтенде, FastAPI на бэкенде и PostgreSQL для хранения заявок.

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

Для AI-подбора кода УКТ ЗЕД добавьте новый серверный ключ в `backend/.env`:

```dotenv
OPENAI_API_KEY=your_new_key
OPENAI_MODEL=gpt-5.6
```

Не добавляйте ключ во frontend и не коммитьте файл `.env`.

Frontend:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

При запуске через Docker передайте ключ через окружение:

```bash
OPENAI_API_KEY=your_new_key docker compose up --build
```

## Проверки

```bash
cd frontend && npm run build && npm run lint && npm run format:check
cd backend && pytest
```
