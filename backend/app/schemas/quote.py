from pydantic import BaseModel, Field


class QuoteRequest(BaseModel):
    product_code: str = Field(pattern=r"^\d{10}$")
    weight_kg: float = Field(gt=0, le=1_000_000)
    currency_rate: float = Field(gt=0, le=1_000_000)


class QuoteResponse(BaseModel):
    productCode: str
    weightKg: float
    criticalPriceUsdPerKg: float
    customsValueUsd: float
    customsValueUah: float
    dutyRatePercent: float
    duty: float
    vatBase: float
    vat: float
    total: float
