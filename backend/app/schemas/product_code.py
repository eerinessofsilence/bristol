from typing import Literal

from pydantic import BaseModel, Field


class ProductCodeCandidate(BaseModel):
    code: str = Field(pattern=r"^\d{10}$")
    title_uk: str = Field(min_length=2, max_length=160)
    reason_uk: str = Field(min_length=2, max_length=500)
    confidence: Literal["high", "medium", "low"]


class ProductCodeAIResult(BaseModel):
    identified_product: str = Field(min_length=2, max_length=240)
    candidates: list[ProductCodeCandidate] = Field(min_length=1, max_length=3)
    needs_more_info: bool
    missing_details: list[str] = Field(max_length=5)


class ProductCodeCandidateResponse(BaseModel):
    code: str
    titleUk: str
    reasonUk: str
    confidence: Literal["high", "medium", "low"]
    calculatorSupported: bool


class ProductCodeSuggestionResponse(BaseModel):
    identifiedProduct: str
    candidates: list[ProductCodeCandidateResponse]
    needsMoreInfo: bool
    missingDetails: list[str]
    disclaimer: str
