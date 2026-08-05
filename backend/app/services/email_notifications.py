from __future__ import annotations

import logging
import smtplib
import time
from email.message import EmailMessage
from html import escape

from app.core.config import settings
from app.models.lead import Lead

logger = logging.getLogger(__name__)

SMTP_SEND_ATTEMPTS = 3


def send_lead_notification(lead: Lead) -> None:
    """Send a best-effort notification without exposing SMTP errors to site visitors."""
    if not settings.email_notifications_enabled:
        return

    required_settings = {
        "SMTP_HOST": settings.smtp_host,
        "SMTP_USERNAME": settings.smtp_username,
        "SMTP_PASSWORD": settings.smtp_password,
        "SMTP_FROM_EMAIL": settings.smtp_from_email,
        "LEAD_NOTIFICATION_EMAIL": settings.lead_notification_email,
    }
    missing = [name for name, value in required_settings.items() if not value]
    if missing:
        logger.error(
            "Lead email notification is enabled but missing settings: %s", ", ".join(missing)
        )
        return

    full_name = f"{lead.first_name} {lead.last_name}"
    message = EmailMessage()
    message["Subject"] = f"Нова заявка з сайту — {full_name}"
    message["From"] = settings.smtp_from_email
    message["To"] = settings.lead_notification_email
    message["Reply-To"] = lead.email or settings.smtp_from_email
    message.set_content(
        "Нова заявка з сайту ClearGateCustoms\n\n"
        f"Ім'я: {full_name}\n"
        f"Телефон: {lead.phone}\n"
        f"Email: {lead.email or 'не вказано'}\n"
        f"Джерело: {lead.source}\n"
        f"Отримано: {lead.created_at.strftime('%d.%m.%Y %H:%M UTC')}\n"
        f"ID заявки: {lead.id}\n"
    )
    message.add_alternative(
        "<h2>Нова заявка з сайту ClearGateCustoms</h2>"
        "<table>"
        f"<tr><td><b>Ім'я</b></td><td>{escape(full_name)}</td></tr>"
        f"<tr><td><b>Телефон</b></td><td>{escape(lead.phone)}</td></tr>"
        f"<tr><td><b>Email</b></td><td>{escape(lead.email or 'не вказано')}</td></tr>"
        f"<tr><td><b>Джерело</b></td><td>{escape(lead.source)}</td></tr>"
        "<tr><td><b>Отримано</b></td>"
        f"<td>{lead.created_at.strftime('%d.%m.%Y %H:%M UTC')}</td></tr>"
        f"<tr><td><b>ID заявки</b></td><td>{lead.id}</td></tr>"
        "</table>",
        subtype="html",
    )

    for attempt in range(1, SMTP_SEND_ATTEMPTS + 1):
        try:
            with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10) as smtp:
                if settings.smtp_use_tls:
                    smtp.starttls()
                smtp.login(settings.smtp_username, settings.smtp_password)
                smtp.send_message(message)
            return
        except (OSError, smtplib.SMTPException) as error:
            if attempt == SMTP_SEND_ATTEMPTS:
                logger.exception(
                    "Could not send lead notification for lead %s after %s attempts",
                    lead.id,
                    SMTP_SEND_ATTEMPTS,
                )
                return

            retry_delay_seconds = attempt
            logger.warning(
                "Could not send lead notification for lead %s on attempt %s/%s: %s; "
                "retrying in %s seconds",
                lead.id,
                attempt,
                SMTP_SEND_ATTEMPTS,
                error,
                retry_delay_seconds,
            )
            time.sleep(retry_delay_seconds)
