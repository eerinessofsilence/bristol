from sqlalchemy.orm import Session

from app.models.lead import Lead
from app.schemas.lead import LeadCreate


def create_lead(database: Session, payload: LeadCreate) -> Lead:
    lead = Lead(**payload.model_dump())
    database.add(lead)
    database.commit()
    database.refresh(lead)
    return lead

