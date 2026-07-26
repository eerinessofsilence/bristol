from __future__ import annotations

import re
import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

UKRAINIAN_MOBILE_PHONE = re.compile(
    r"^\+380(?:39|50|63|66|67|68|73|75|77|91|92|93|94|95|96|97|98|99)\d{7}$"
)


class LeadCreate(BaseModel):
    first_name: str = Field(min_length=1, max_length=80)
    last_name: str = Field(min_length=1, max_length=80)
    phone: str
    email: Optional[EmailStr] = None
    source: str = Field(default="website_callback", max_length=80)

    @field_validator("phone", mode="before")
    @classmethod
    def normalize_ukrainian_mobile_phone(cls, value: object) -> str:
        if not isinstance(value, str):
            raise ValueError("Вкажіть номер мобільного телефону")

        digits = re.sub(r"\D", "", value)
        if digits.startswith("380"):
            digits = digits[3:]
        elif digits.startswith("0"):
            digits = digits[1:]

        normalized = f"+380{digits}"
        if not UKRAINIAN_MOBILE_PHONE.fullmatch(normalized):
            raise ValueError("Вкажіть український мобільний номер у форматі +380 XX XXX XX XX")

        return normalized


class LeadResponse(BaseModel):
    id: uuid.UUID
    first_name: str
    last_name: str
    phone: str
    email: Optional[EmailStr]
    source: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LeadCreated(BaseModel):
    id: uuid.UUID
    message: str
