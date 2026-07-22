from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.lead import LeadCreate, LeadCreated
from app.services.leads import create_lead

router = APIRouter(prefix="/leads", tags=["leads"])


@router.post("", response_model=LeadCreated, status_code=status.HTTP_201_CREATED)
def submit_lead(payload: LeadCreate, database: Session = Depends(get_db)) -> LeadCreated:
    lead = create_lead(database, payload)
    return LeadCreated(id=lead.id, message="Заявку прийнято")

