# ClearGateCustoms

ClearGateCustoms is a full-featured landing page for a customs brokerage service. It includes an AI-assisted UKT ZED code selector, a lead submission flow, optional email notifications, and PostgreSQL storage for all submitted requests.

## Tech Stack

- Frontend: React, TypeScript, Vite, and Tailwind CSS
- Backend: FastAPI, SQLAlchemy, and Alembic
- Database: PostgreSQL
- Infrastructure: Docker Compose

## Project Structure

```text
frontend/   React + TypeScript + Vite + Tailwind CSS
backend/    FastAPI + SQLAlchemy + Alembic + PostgreSQL
compose.yaml
```

## Quick Start with Docker

```bash
docker compose up --build
```

After startup, the services are available at:

- Website: http://localhost:5173
- API: http://localhost:8000
- Swagger UI: http://localhost:8000/docs

## Local Development

### PostgreSQL

```bash
docker compose up db -d
```

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

### AI-Assisted UKT ZED Code Selection

Add a server-side key to `backend/.env`:

```dotenv
OPENAI_API_KEY=your_new_key
OPENAI_MODEL=gpt-5.6
```

Never expose the API key in the frontend or commit the `.env` file. With Docker, pass the key through the environment:

```bash
OPENAI_API_KEY=your_new_key docker compose up --build
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Lead Email Notifications

Leads are always stored in PostgreSQL. To also receive them by email, configure the SMTP settings in `backend/.env` using `backend/.env.example` as a template, then set:

```dotenv
EMAIL_NOTIFICATIONS_ENABLED=true
```

For Google Workspace, use `SMTP_HOST=smtp.gmail.com`, port `587`, TLS, and an app password. Set `LEAD_NOTIFICATION_EMAIL` to a dedicated inbox if needed. SMTP delivery failures are logged, but do not prevent the lead from being saved.

## Checks

```bash
cd frontend && npm run build && npm run lint && npm run format:check
cd backend && pytest
```
