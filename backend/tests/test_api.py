from datetime import date, datetime, timedelta, timezone
from types import SimpleNamespace

import httpx
import pytest
from fastapi.testclient import TestClient
from pydantic import ValidationError
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.session import Base, get_db
from app.main import app
from app.schemas.product_code import ProductCodeAIResult
from app.services import exchange_rates, product_codes

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


def test_quote_calculation_by_weight_and_product_code() -> None:
    response = client.post(
        "/api/v1/quotes/calculate",
        json={"product_code": "0201203000", "weight_kg": 100, "currency_rate": 41.5},
    )
    assert response.status_code == 200
    assert response.json() == {
        "productCode": "0201203000",
        "weightKg": 100.0,
        "criticalPriceUsdPerKg": 2.95,
        "customsValueUsd": 295.0,
        "customsValueUah": 12242.5,
        "duty": 0.0,
        "vatBase": 12242.5,
        "vat": 2448.5,
        "total": 2448.5,
    }


def test_quote_rejects_unknown_product_code() -> None:
    response = client.post(
        "/api/v1/quotes/calculate",
        json={"product_code": "9999999999", "weight_kg": 100, "currency_rate": 41.5},
    )
    assert response.status_code == 404


def test_quote_rejects_product_code_with_non_weight_unit() -> None:
    response = client.post(
        "/api/v1/quotes/calculate",
        json={"product_code": "8512301090", "weight_kg": 100, "currency_rate": 41.5},
    )
    assert response.status_code == 422


def test_product_code_suggestion_from_image(monkeypatch) -> None:
    class FakeResponses:
        async def parse(self, **kwargs):
            assert kwargs["model"] == "gpt-5.6"
            assert kwargs["store"] is False
            assert kwargs["input"][0]["content"][0]["text"].endswith("Шкіряна сумка")
            assert kwargs["input"][0]["content"][1]["image_url"].startswith(
                "data:image/jpeg;base64,"
            )
            return SimpleNamespace(
                output_parsed=ProductCodeAIResult(
                    product_identified=True,
                    identified_product="Шкіряна сумка",
                    candidates=[
                        {
                            "code": "4202210000",
                            "title_uk": "Сумка з лицьовою поверхнею з натуральної шкіри",
                            "reason_uk": "На фото видно ручну сумку зі шкіряною поверхнею.",
                            "confidence": "medium",
                        }
                    ],
                    needs_more_info=True,
                    missing_details=["Підтвердьте матеріал зовнішньої поверхні"],
                )
            )

    class FakeOpenAI:
        def __init__(self, **kwargs):
            assert kwargs["api_key"] == "test-key"
            self.responses = FakeResponses()

    monkeypatch.setattr(product_codes.settings, "openai_api_key", "test-key")
    monkeypatch.setattr(product_codes, "AsyncOpenAI", FakeOpenAI)

    response = client.post(
        "/api/v1/product-codes/suggest",
        files={"images": ("bag.jpg", b"fake-image", "image/jpeg")},
        data={"description": "Шкіряна сумка"},
    )

    assert response.status_code == 200
    assert response.json() == {
        "productIdentified": True,
        "identifiedProduct": "Шкіряна сумка",
        "candidates": [
            {
                "code": "4202210000",
                "titleUk": "Сумка з лицьовою поверхнею з натуральної шкіри",
                "reasonUk": "На фото видно ручну сумку зі шкіряною поверхнею.",
                "confidence": "medium",
                "calculatorSupported": True,
            }
        ],
        "needsMoreInfo": True,
        "missingDetails": ["Підтвердьте матеріал зовнішньої поверхні"],
        "disclaimer": (
            "Результат є попередньою AI-підказкою. Остаточний код залежить від складу, "
            "призначення та технічної документації товару і має бути перевірений фахівцем."
        ),
    }


def test_product_code_suggestion_rejects_non_image() -> None:
    response = client.post(
        "/api/v1/product-codes/suggest",
        files={"images": ("notes.txt", b"not-an-image", "text/plain")},
    )

    assert response.status_code == 415
    assert response.json() == {"detail": "Підтримуються JPG, PNG, WEBP та GIF"}


def test_product_code_suggestion_returns_no_codes_when_product_is_not_identified(
    monkeypatch,
) -> None:
    class FakeResponses:
        async def parse(self, **kwargs):
            return SimpleNamespace(
                output_parsed=ProductCodeAIResult(
                    product_identified=False,
                    identified_product="На фото немає товару для класифікації",
                    candidates=[],
                    needs_more_info=True,
                    missing_details=["Додайте фото самого товару крупним планом"],
                )
            )

    class FakeOpenAI:
        def __init__(self, **kwargs):
            self.responses = FakeResponses()

    monkeypatch.setattr(product_codes.settings, "openai_api_key", "test-key")
    monkeypatch.setattr(product_codes, "AsyncOpenAI", FakeOpenAI)

    response = client.post(
        "/api/v1/product-codes/suggest",
        files={"images": ("warehouse.jpg", b"fake-image", "image/jpeg")},
    )

    assert response.status_code == 200
    assert response.json()["productIdentified"] is False
    assert response.json()["candidates"] == []


def test_product_code_ai_result_rejects_candidates_for_unidentified_product() -> None:
    with pytest.raises(ValidationError, match="Candidates must be empty"):
        ProductCodeAIResult(
            product_identified=False,
            identified_product="На фото склад",
            candidates=[
                {
                    "code": "4202210000",
                    "title_uk": "Сумка",
                    "reason_uk": "Помилковий варіант",
                    "confidence": "low",
                }
            ],
            needs_more_info=True,
            missing_details=["Додайте фото товару"],
        )


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
