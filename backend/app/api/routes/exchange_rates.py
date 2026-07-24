from fastapi import APIRouter, HTTPException, status

from app.schemas.exchange_rate import ExchangeRateResponse
from app.services.exchange_rates import ExchangeRateUnavailableError, get_usd_exchange_rate

router = APIRouter(prefix="/exchange-rates", tags=["exchange-rates"])


@router.get("/usd", response_model=ExchangeRateResponse)
async def usd_exchange_rate() -> ExchangeRateResponse:
    try:
        return await get_usd_exchange_rate()
    except ExchangeRateUnavailableError as error:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Курс USD НБУ тимчасово недоступний",
        ) from error
