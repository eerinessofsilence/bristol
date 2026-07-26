from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.schemas.product_code import ProductCodeSuggestionResponse
from app.services.image_normalization import ImageNormalizationError, normalize_product_image
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


@router.post("/suggest", response_model=ProductCodeSuggestionResponse)
async def suggest(
    images: Annotated[list[UploadFile], File(description="One to three product photos")],
    description: Annotated[str, Form(max_length=1000)] = "",
) -> ProductCodeSuggestionResponse:
    if not 1 <= len(images) <= MAX_IMAGES:
        raise HTTPException(status_code=422, detail="Додайте від одного до трьох фото товару")

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
                status_code=413, detail="Розмір одного фото не має перевищувати 10 МБ"
            )
        if not image_bytes:
            raise HTTPException(status_code=422, detail="Завантажене фото порожнє")

        try:
            prepared_images.append(normalize_product_image(image_bytes))
        except ImageNormalizationError as error:
            raise HTTPException(
                status_code=422,
                detail="Не вдалося прочитати фото. Завантажте оригінальний файл ще раз",
            ) from error

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


def _is_supported_image(image: UploadFile) -> bool:
    return (
        image.content_type in ALLOWED_IMAGE_TYPES
        or Path(image.filename or "").suffix.lower() in ALLOWED_IMAGE_SUFFIXES
    )
