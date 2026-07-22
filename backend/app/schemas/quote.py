from pydantic import BaseModel, Field


class QuoteRequest(BaseModel):
    customs_value: float = Field(ge=0, le=1_000_000_000)
    currency_rate: float = Field(gt=0, le=1_000_000)
    duty_rate: float = Field(ge=0, le=100)


class QuoteResponse(BaseModel):
    customsValueUah: float
    duty: float
    vatBase: float
    vat: float
    total: float

