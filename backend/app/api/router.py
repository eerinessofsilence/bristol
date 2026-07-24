from fastapi import APIRouter

from app.api.routes import exchange_rates, health, leads, quotes

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(health.router)
api_router.include_router(leads.router)
api_router.include_router(quotes.router)
api_router.include_router(exchange_rates.router)
