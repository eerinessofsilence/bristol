import base64

from openai import AsyncOpenAI, OpenAIError

from app.core.config import settings
from app.schemas.product_code import ProductCodeAIResult, ProductCodeSuggestionResponse
from app.services.quotes import _load_risk_prices

SYSTEM_PROMPT = """
You are an assistant for preliminary classification of goods under the Ukrainian
UKT ZED nomenclature. Analyze the supplied product photos and optional user
description. Return up to three plausible 10-digit UKT ZED codes, ordered from
most likely to least likely.

This is a preliminary suggestion, not a legally binding customs decision.
Do not overstate confidence. Customs classification may depend on material,
composition, intended use, processing, technical specifications, power, model,
or supporting documents that are not visible in a photo. If essential details
are missing, set needs_more_info to true and list concise follow-up questions in
Ukrainian. Write all product titles and explanations in Ukrainian.
""".strip()

DISCLAIMER = (
    "Результат є попередньою AI-підказкою. Остаточний код залежить від складу, "
    "призначення та технічної документації товару і має бути перевірений фахівцем."
)


class ProductCodeServiceUnavailableError(RuntimeError):
    pass


class ProductCodeAnalysisError(RuntimeError):
    pass


async def suggest_product_codes(
    images: list[tuple[str, bytes]],
    description: str,
) -> ProductCodeSuggestionResponse:
    if not settings.openai_api_key:
        raise ProductCodeServiceUnavailableError

    content: list[dict[str, str]] = [
        {
            "type": "input_text",
            "text": (
                "Визнач можливі коди УКТ ЗЕД для товару на фото. "
                f"Опис користувача: {description.strip() or 'не надано'}"
            ),
        }
    ]
    for content_type, image_bytes in images:
        encoded = base64.b64encode(image_bytes).decode("ascii")
        content.append(
            {
                "type": "input_image",
                "image_url": f"data:{content_type};base64,{encoded}",
                "detail": "high",
            }
        )

    client = AsyncOpenAI(
        api_key=settings.openai_api_key,
        timeout=settings.openai_timeout_seconds,
    )

    try:
        response = await client.responses.parse(
            model=settings.openai_model,
            instructions=SYSTEM_PROMPT,
            input=[{"role": "user", "content": content}],
            text_format=ProductCodeAIResult,
            reasoning={"effort": "medium"},
            store=False,
        )
    except OpenAIError as error:
        raise ProductCodeAnalysisError from error

    result = response.output_parsed
    if result is None:
        raise ProductCodeAnalysisError

    risk_prices, _ = _load_risk_prices()
    candidates = [
        {
            "code": candidate.code,
            "titleUk": candidate.title_uk,
            "reasonUk": candidate.reason_uk,
            "confidence": candidate.confidence,
            "calculatorSupported": candidate.code in risk_prices,
        }
        for candidate in result.candidates
    ]

    return ProductCodeSuggestionResponse(
        identifiedProduct=result.identified_product,
        candidates=candidates,
        needsMoreInfo=result.needs_more_info,
        missingDetails=result.missing_details,
        disclaimer=DISCLAIMER,
    )
