from io import BytesIO

from PIL import Image, ImageOps, UnidentifiedImageError
from pillow_heif import register_heif_opener

register_heif_opener()

MAX_IMAGE_SIDE = 2048
MAX_IMAGE_PIXELS = 40_000_000
JPEG_QUALITY = 90


class ImageNormalizationError(ValueError):
    pass


def normalize_product_image(image_bytes: bytes) -> tuple[str, bytes]:
    """Make mobile and desktop uploads safe and consistent for vision analysis."""
    try:
        with Image.open(BytesIO(image_bytes)) as source:
            if source.width * source.height > MAX_IMAGE_PIXELS:
                raise ValueError("Image pixel count exceeds the supported limit")

            image = ImageOps.exif_transpose(source)
            image.thumbnail((MAX_IMAGE_SIDE, MAX_IMAGE_SIDE), Image.Resampling.LANCZOS)
            if image.mode != "RGB":
                image = image.convert("RGB")

            normalized = BytesIO()
            image.save(
                normalized,
                format="JPEG",
                quality=JPEG_QUALITY,
                optimize=True,
            )
    except (Image.DecompressionBombError, OSError, UnidentifiedImageError, ValueError) as error:
        raise ImageNormalizationError from error

    return "image/jpeg", normalized.getvalue()
