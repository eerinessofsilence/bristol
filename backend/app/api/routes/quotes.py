from fastapi import APIRouter, HTTPException

from app.schemas.quote import QuoteRequest, QuoteResponse
from app.services.duty_rates import DutyRateNotFoundError
from app.services.quotes import (
    ProductCodeNotFoundError,
    WeightCalculationNotSupportedError,
    calculate_quote,
)

router = APIRouter(prefix="/quotes", tags=["quotes"])


@router.post("/calculate", response_model=QuoteResponse)
def quote(payload: QuoteRequest) -> QuoteResponse:
    try:
        return calculate_quote(payload)
    except ProductCodeNotFoundError as error:
        raise HTTPException(
            status_code=404,
            detail=f"Код УКТ ЗЕД {error.args[0]} не знайдено у довіднику ризиків",
        ) from error
    except WeightCalculationNotSupportedError as error:
        raise HTTPException(
            status_code=422,
            detail=(
                f"Для коду УКТ ЗЕД {error.args[0]} потрібен розрахунок за кількістю одиниць, "
                "а не вагою"
            ),
        ) from error
    except DutyRateNotFoundError as error:
        raise HTTPException(
            status_code=503,
            detail=(
                f"Для коду УКТ ЗЕД {error.args[0]} немає ставки у локальному "
                "довіднику Митного тарифу"
            ),
        ) from error
