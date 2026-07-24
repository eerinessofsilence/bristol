from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, Field


class ExchangeRateResponse(BaseModel):
    currency: Literal["USD", "EUR"]
    rate: float = Field(gt=0)
    exchangeDate: date
    fetchedAt: datetime
    isStale: bool
