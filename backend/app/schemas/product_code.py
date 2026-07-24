from typing import Literal

from pydantic import BaseModel, Field, model_validator


class ProductCodeCandidate(BaseModel):
    code: str = Field(pattern=r"^\d{10}$")
    title_uk: str = Field(min_length=2, max_length=160)
    reason_uk: str = Field(min_length=2, max_length=500)
    confidence: Literal["high", "medium", "low"]


class ProductCodeAIResult(BaseModel):
    product_identified: bool = Field(
        description=(
            "Whether the photo identifies a specific product rather than a scene "
            "or unrelated object"
        )
    )
    identified_product: str = Field(min_length=2, max_length=240)
    candidates: list[ProductCodeCandidate] = Field(max_length=3)
    needs_more_info: bool
    missing_details: list[str] = Field(max_length=5)

    @model_validator(mode="after")
    def validate_candidates_match_identification(self) -> "ProductCodeAIResult":
        if self.product_identified and not self.candidates:
            raise ValueError("At least one candidate is required for an identified product")
        if not self.product_identified and self.candidates:
            raise ValueError("Candidates must be empty when no product is identified")
        return self


class ProductCodeCandidateResponse(BaseModel):
    code: str
    titleUk: str
    reasonUk: str
    confidence: Literal["high", "medium", "low"]
    calculatorSupported: bool


class ProductCodeSuggestionResponse(BaseModel):
    productIdentified: bool
    identifiedProduct: str
    candidates: list[ProductCodeCandidateResponse]
    needsMoreInfo: bool
    missingDetails: list[str]
    disclaimer: str
