import json
from functools import lru_cache
from pathlib import Path

from app.schemas.quote import QuoteRequest, QuoteResponse


class ProductCodeNotFoundError(ValueError):
    pass


class WeightCalculationNotSupportedError(ValueError):
    pass


@lru_cache
def _load_risk_prices() -> tuple[dict[str, float], set[str]]:
    path = Path(__file__).resolve().parents[1] / "data" / "risk_prices.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    prices = {code: float(price) for code, price in data["pricesUsdPerKg"].items()}
    return prices, set(data["nonWeightCodes"])


def calculate_quote(payload: QuoteRequest) -> QuoteResponse:
    prices, non_weight_codes = _load_risk_prices()
    if payload.product_code in non_weight_codes:
        raise WeightCalculationNotSupportedError(payload.product_code)

    critical_price_usd_per_kg = prices.get(payload.product_code)
    if critical_price_usd_per_kg is None:
        raise ProductCodeNotFoundError(payload.product_code)

    customs_value_usd = payload.weight_kg * critical_price_usd_per_kg
    customs_value_uah = customs_value_usd * payload.currency_rate
    duty = 0.0
    vat_base = customs_value_uah + duty
    vat = vat_base * 0.2

    return QuoteResponse(
        productCode=payload.product_code,
        weightKg=round(payload.weight_kg, 3),
        criticalPriceUsdPerKg=round(critical_price_usd_per_kg, 4),
        customsValueUsd=round(customs_value_usd, 2),
        customsValueUah=round(customs_value_uah, 2),
        duty=round(duty, 2),
        vatBase=round(vat_base, 2),
        vat=round(vat, 2),
        total=round(duty + vat, 2),
    )
