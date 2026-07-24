from dataclasses import dataclass
from datetime import date, datetime, timedelta, timezone
from typing import Optional

import httpx

from app.core.config import settings
from app.schemas.exchange_rate import ExchangeRateResponse


class ExchangeRateUnavailableError(RuntimeError):
    pass


@dataclass(frozen=True)
class CachedExchangeRate:
    rate: float
    exchange_date: date
    fetched_at: datetime


_usd_cache: Optional[CachedExchangeRate] = None


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _is_fresh(cached_rate: CachedExchangeRate, now: datetime) -> bool:
    return now - cached_rate.fetched_at < timedelta(hours=settings.nbu_cache_ttl_hours)


def _to_response(cached_rate: CachedExchangeRate, *, is_stale: bool) -> ExchangeRateResponse:
    return ExchangeRateResponse(
        rate=cached_rate.rate,
        exchangeDate=cached_rate.exchange_date,
        fetchedAt=cached_rate.fetched_at,
        isStale=is_stale,
    )


async def _fetch_usd_rate() -> tuple[float, date]:
    timeout = httpx.Timeout(settings.nbu_timeout_seconds)
    async with httpx.AsyncClient(timeout=timeout) as client:
        response = await client.get(settings.nbu_exchange_rate_url)
        response.raise_for_status()

    payload = response.json()
    if not isinstance(payload, list) or not payload:
        raise ValueError("NBU returned an empty exchange-rate response")

    item = payload[0]
    rate = float(item["rate"])
    if rate <= 0:
        raise ValueError("NBU returned an invalid USD rate")

    exchange_date = datetime.strptime(item["exchangedate"], "%d.%m.%Y").date()
    return rate, exchange_date


async def get_usd_exchange_rate() -> ExchangeRateResponse:
    global _usd_cache

    now = _utcnow()
    if _usd_cache is not None and _is_fresh(_usd_cache, now):
        return _to_response(_usd_cache, is_stale=False)

    try:
        rate, exchange_date = await _fetch_usd_rate()
    except (httpx.HTTPError, KeyError, TypeError, ValueError) as error:
        if _usd_cache is not None:
            return _to_response(_usd_cache, is_stale=True)
        raise ExchangeRateUnavailableError("USD exchange rate is unavailable") from error

    _usd_cache = CachedExchangeRate(
        rate=rate,
        exchange_date=exchange_date,
        fetched_at=now,
    )
    return _to_response(_usd_cache, is_stale=False)


def clear_exchange_rate_cache() -> None:
    global _usd_cache
    _usd_cache = None
