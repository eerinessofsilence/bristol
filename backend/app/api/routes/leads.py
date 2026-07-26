from fastapi import APIRouter, BackgroundTasks, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.lead import LeadCreate, LeadCreated
from app.services.email_notifications import send_lead_notification
from app.services.leads import create_lead

router = APIRouter(prefix="/leads", tags=["leads"])


@router.post("", response_model=LeadCreated, status_code=status.HTTP_201_CREATED)
def submit_lead(
    payload: LeadCreate,
    background_tasks: BackgroundTasks,
    database: Session = Depends(get_db),
) -> LeadCreated:
    lead = create_lead(database, payload)
    background_tasks.add_task(send_lead_notification, lead)
    return LeadCreated(id=lead.id, message="Заявку прийнято")
