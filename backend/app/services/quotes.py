from app.schemas.quote import QuoteRequest, QuoteResponse


def calculate_quote(payload: QuoteRequest) -> QuoteResponse:
    customs_value_uah = payload.customs_value * payload.currency_rate
    duty = customs_value_uah * (payload.duty_rate / 100)
    vat_base = customs_value_uah + duty
    vat = vat_base * 0.2

    return QuoteResponse(
        customsValueUah=round(customs_value_uah, 2),
        duty=round(duty, 2),
        vatBase=round(vat_base, 2),
        vat=round(vat, 2),
        total=round(duty + vat, 2),
    )

