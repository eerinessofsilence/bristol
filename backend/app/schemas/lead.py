from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class LeadCreate(BaseModel):
    first_name: str = Field(min_length=1, max_length=80)
    last_name: str = Field(min_length=1, max_length=80)
    phone: str = Field(min_length=7, max_length=40)
    email: Optional[EmailStr] = None
    source: str = Field(default="website_callback", max_length=80)


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
