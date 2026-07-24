from datetime import date, datetime, timedelta, timezone

import httpx
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.session import Base, get_db
from app.main import app
from app.services import exchange_rates

engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSession = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
Base.metadata.create_all(bind=engine)


def override_get_db():
    database = TestingSession()
    try:
        yield database
    finally:
        database.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(autouse=True)
def reset_exchange_rate_cache():
    exchange_rates.clear_exchange_rate_cache()
    yield
    exchange_rates.clear_exchange_rate_cache()


def test_health() -> None:
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_quote_calculation() -> None:
    response = client.post(
        "/api/v1/quotes/calculate",
        json={"customs_value": 1000, "currency_rate": 41.5, "duty_rate": 5},
    )
    assert response.status_code == 200
    assert response.json()["total"] == 10790


def test_lead_creation() -> None:
    response = client.post(
        "/api/v1/leads",
        json={
            "first_name": "Олена",
            "last_name": "Коваль",
            "phone": "+380501234567",
            "email": "olena@example.com",
            "source": "test",
        },
    )
    assert response.status_code == 201
    assert response.json()["message"] == "Заявку прийнято"


def test_usd_exchange_rate_is_cached_for_twelve_hours(monkeypatch) -> None:
    fetched_at = datetime(2026, 7, 24, 9, 0, tzinfo=timezone.utc)
    calls = 0

    async def fetch_rate() -> tuple[float, date]:
        nonlocal calls
        calls += 1
        return 41.2345, date(2026, 7, 24)

    monkeypatch.setattr(exchange_rates, "_utcnow", lambda: fetched_at)
    monkeypatch.setattr(exchange_rates, "_fetch_usd_rate", fetch_rate)

    first_response = client.get("/api/v1/exchange-rates/usd")
    second_response = client.get("/api/v1/exchange-rates/usd")

    assert first_response.status_code == 200
    assert second_response.status_code == 200
    assert first_response.json() == {
        "currency": "USD",
        "rate": 41.2345,
        "exchangeDate": "2026-07-24",
        "fetchedAt": "2026-07-24T09:00:00Z",
        "isStale": False,
    }
    assert second_response.json() == first_response.json()
    assert calls == 1


def test_eur_exchange_rate_is_cached_for_twelve_hours(monkeypatch) -> None:
    fetched_at = datetime(2026, 7, 24, 9, 0, tzinfo=timezone.utc)
    calls = 0

    async def fetch_rate() -> tuple[float, date]:
        nonlocal calls
        calls += 1
        return 48.5678, date(2026, 7, 24)

    monkeypatch.setattr(exchange_rates, "_utcnow", lambda: fetched_at)
    monkeypatch.setattr(exchange_rates, "_fetch_eur_rate", fetch_rate)

    first_response = client.get("/api/v1/exchange-rates/eur")
    second_response = client.get("/api/v1/exchange-rates/eur")

    assert first_response.status_code == 200
    assert second_response.status_code == 200
    assert first_response.json() == {
        "currency": "EUR",
        "rate": 48.5678,
        "exchangeDate": "2026-07-24",
        "fetchedAt": "2026-07-24T09:00:00Z",
        "isStale": False,
    }
    assert second_response.json() == first_response.json()
    assert calls == 1


def test_usd_exchange_rate_uses_stale_cache_when_nbu_fails(monkeypatch) -> None:
    current_time = datetime(2026, 7, 24, 9, 0, tzinfo=timezone.utc)

    async def fetch_rate() -> tuple[float, date]:
        return 41.2345, date(2026, 7, 24)

    monkeypatch.setattr(exchange_rates, "_utcnow", lambda: current_time)
    monkeypatch.setattr(exchange_rates, "_fetch_usd_rate", fetch_rate)

    successful_response = client.get("/api/v1/exchange-rates/usd")
    assert successful_response.status_code == 200

    current_time += timedelta(hours=13)

    async def fail_to_fetch_rate() -> tuple[float, date]:
        request = httpx.Request("GET", "https://bank.gov.ua")
        raise httpx.ConnectError("NBU is unavailable", request=request)

    monkeypatch.setattr(exchange_rates, "_fetch_usd_rate", fail_to_fetch_rate)
    stale_response = client.get("/api/v1/exchange-rates/usd")

    assert stale_response.status_code == 200
    assert stale_response.json()["rate"] == 41.2345
    assert stale_response.json()["exchangeDate"] == "2026-07-24"
    assert stale_response.json()["isStale"] is True


def test_usd_exchange_rate_returns_503_without_cache(monkeypatch) -> None:
    async def fail_to_fetch_rate() -> tuple[float, date]:
        request = httpx.Request("GET", "https://bank.gov.ua")
        raise httpx.ConnectError("NBU is unavailable", request=request)

    monkeypatch.setattr(exchange_rates, "_fetch_usd_rate", fail_to_fetch_rate)

    response = client.get("/api/v1/exchange-rates/usd")

    assert response.status_code == 503
    assert response.json() == {"detail": "Курс USD НБУ тимчасово недоступний"}
