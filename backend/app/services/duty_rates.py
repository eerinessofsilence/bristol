import json
from functools import lru_cache
from pathlib import Path


class DutyRateNotFoundError(LookupError):
    pass


@lru_cache
def _load_preferential_rates() -> dict[str, float]:
    path = Path(__file__).resolve().parents[1] / "data" / "duty_rates.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    return {
        code: float(rate["preferentialPercent"])
        for code, rate in data["rates"].items()
    }


def get_preferential_duty_rate(product_code: str) -> float:
    rate = _load_preferential_rates().get(product_code)
    if rate is None:
        raise DutyRateNotFoundError(product_code)
    return rate


def clear_duty_rate_cache() -> None:
    _load_preferential_rates.cache_clear()
