from typing import Annotated

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.schemas.product_code import ProductCodeSuggestionResponse
from app.services.product_codes import (
    ProductCodeAnalysisError,
    ProductCodeServiceUnavailableError,
    suggest_product_codes,
)

router = APIRouter(prefix="/product-codes", tags=["product-codes"])

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_IMAGES = 3
MAX_IMAGE_BYTES = 10 * 1024 * 1024


@router.post("/suggest", response_model=ProductCodeSuggestionResponse)
async def suggest(
    images: Annotated[list[UploadFile], File(description="One to three product photos")],
    description: Annotated[str, Form(max_length=1000)] = "",
) -> ProductCodeSuggestionResponse:
    if not 1 <= len(images) <= MAX_IMAGES:
        raise HTTPException(status_code=422, detail="Додайте від одного до трьох фото товару")

    prepared_images: list[tuple[str, bytes]] = []
    for image in images:
        if image.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=415,
                detail="Підтримуються JPG, PNG, WEBP та GIF",
            )

        image_bytes = await image.read(MAX_IMAGE_BYTES + 1)
        if len(image_bytes) > MAX_IMAGE_BYTES:
            raise HTTPException(
                status_code=413, detail="Розмір одного фото не має перевищувати 10 МБ"
            )
        if not image_bytes:
            raise HTTPException(status_code=422, detail="Завантажене фото порожнє")

        prepared_images.append((image.content_type, image_bytes))

    try:
        return await suggest_product_codes(prepared_images, description)
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
