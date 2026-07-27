from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile
from starlette.concurrency import run_in_threadpool

from app.core.config import settings
from app.schemas.product_code import ProductCodeSuggestionResponse
from app.services.image_normalization import ImageNormalizationError, normalize_product_image
from app.services.product_code_limits import (
    ProductCodeCapacityError,
    ProductCodeRateLimitError,
    ProductCodeRequestGuard,
)
from app.services.product_codes import (
    ProductCodeAnalysisError,
    ProductCodeServiceUnavailableError,
    suggest_product_codes,
)

router = APIRouter(prefix="/product-codes", tags=["product-codes"])

ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/heic",
    "image/heif",
}
ALLOWED_IMAGE_SUFFIXES = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic", ".heif"}
MAX_IMAGES = 3
MAX_IMAGE_BYTES = 10 * 1024 * 1024
request_guard = ProductCodeRequestGuard(
    requests_per_window=settings.product_code_ai_requests_per_minute,
    window_seconds=60,
    max_concurrent=settings.product_code_ai_max_concurrent,
)


@router.post("/suggest", response_model=ProductCodeSuggestionResponse)
async def suggest(
    request: Request,
    images: Annotated[list[UploadFile], File(description="One to three product photos")],
    description: Annotated[str, Form(max_length=1000)] = "",
) -> ProductCodeSuggestionResponse:
    try:
        async with request_guard.permit(_client_key(request)):
            if not 1 <= len(images) <= MAX_IMAGES:
                raise HTTPException(
                    status_code=422, detail="Додайте від одного до трьох фото товару"
                )

            prepared_images: list[tuple[str, bytes]] = []
            for image in images:
                if not _is_supported_image(image):
                    raise HTTPException(
                        status_code=415,
                        detail="Підтримуються JPG, PNG, WEBP, GIF, HEIC та HEIF",
                    )

                image_bytes = await image.read(MAX_IMAGE_BYTES + 1)
                if len(image_bytes) > MAX_IMAGE_BYTES:
                    raise HTTPException(
                        status_code=413,
                        detail="Розмір одного фото не має перевищувати 10 МБ",
                    )
                if not image_bytes:
                    raise HTTPException(status_code=422, detail="Завантажене фото порожнє")

                try:
                    normalized_image = await run_in_threadpool(normalize_product_image, image_bytes)
                    prepared_images.append(normalized_image)
                except ImageNormalizationError as error:
                    raise HTTPException(
                        status_code=422,
                        detail="Не вдалося прочитати фото. Завантажте оригінальний файл ще раз",
                    ) from error

            return await suggest_product_codes(prepared_images, description)
    except ProductCodeRateLimitError as error:
        raise HTTPException(
            status_code=429,
            detail="Забагато запитів на AI-підбір. Спробуйте трохи пізніше",
            headers={"Retry-After": str(error.retry_after_seconds)},
        ) from error
    except ProductCodeCapacityError as error:
        raise HTTPException(
            status_code=429,
            detail="AI-підбір уже обробляє максимальну кількість запитів",
            headers={"Retry-After": "5"},
        ) from error
    except ProductCodeServiceUnavailableError as error:
        raise HTTPException(
            status_code=503,
            detail="AI-підбір тимчасово не налаштований",
        ) from error
    except ProductCodeAnalysisError as error:
        raise HTTPException(
            status_code=502,
            detail="Не вдалося проаналізувати фото. Спробуйте ще раз",
        ) from error


def _is_supported_image(image: UploadFile) -> bool:
    return (
        image.content_type in ALLOWED_IMAGE_TYPES
        or Path(image.filename or "").suffix.lower() in ALLOWED_IMAGE_SUFFIXES
    )


def _client_key(request: Request) -> str:
    # The backend is only exposed through the project's trusted nginx proxy.
    forwarded_client = request.headers.get("x-real-ip")
    if forwarded_client:
        return forwarded_client
    if request.client:
        return request.client.host
    return "unknown"
