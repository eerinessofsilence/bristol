from fastapi import APIRouter

from app.schemas.quote import QuoteRequest, QuoteResponse
from app.services.quotes import calculate_quote

router = APIRouter(prefix="/quotes", tags=["quotes"])


@router.post("/calculate", response_model=QuoteResponse)
def quote(payload: QuoteRequest) -> QuoteResponse:
    return calculate_quote(payload)

