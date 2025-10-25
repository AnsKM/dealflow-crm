"""Webhook routes for automation integrations (Zapier, Make.com, n8n)."""
from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from typing import Optional
import hmac
import hashlib

from app.api.deps import get_db_session
from app.models.deal import Deal
from app.schemas.deal import DealResponse
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

router = APIRouter()

# Webhook secret for signature validation
WEBHOOK_SECRET = getattr(settings, "WEBHOOK_SECRET", "your-webhook-secret-change-in-production")


def verify_webhook_signature(payload: str, signature: Optional[str]) -> bool:
    """
    Verify webhook signature using HMAC SHA256.

    Args:
        payload: Request body as string
        signature: Signature from X-Webhook-Signature header

    Returns:
        True if signature is valid, False otherwise
    """
    if not signature:
        return False

    expected_signature = hmac.new(
        WEBHOOK_SECRET.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(signature, expected_signature)


@router.post("/deal-updated")
async def webhook_deal_updated(
    deal_id: int,
    db: Session = Depends(get_db_session),
    x_webhook_signature: Optional[str] = Header(None),
):
    """
    Webhook triggered when a deal is updated.

    Use this webhook to:
    - Send Slack notifications on deal stage changes
    - Update external CRM systems
    - Trigger custom workflows in Zapier/Make.com

    Headers:
        X-Webhook-Signature: HMAC SHA256 signature for verification (optional)

    Returns:
        Deal data with tenant_id for routing
    """
    # Note: Signature verification is optional for demo purposes
    # In production, you should enforce signature verification

    deal = db.query(Deal).filter(Deal.id == deal_id).first()

    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deal not found"
        )

    response_data = DealResponse.model_validate(deal)

    logger.info(f"Webhook: deal-updated triggered for deal {deal_id}")

    return {
        "event": "deal.updated",
        "deal": response_data,
        "tenant_id": deal.tenant_id,
        "timestamp": deal.updated_at.isoformat(),
    }


@router.post("/deal-won")
async def webhook_deal_won(
    deal_id: int,
    db: Session = Depends(get_db_session),
    x_webhook_signature: Optional[str] = Header(None),
):
    """
    Webhook triggered when a deal is closed-won.

    Use this webhook to:
    - Send congratulations to sales team
    - Create onboarding tasks
    - Update revenue tracking systems
    - Trigger commission calculations

    Headers:
        X-Webhook-Signature: HMAC SHA256 signature for verification (optional)

    Returns:
        Won deal data with value and customer information
    """
    deal = db.query(Deal).filter(Deal.id == deal_id).first()

    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deal not found"
        )

    response_data = DealResponse.model_validate(deal)

    logger.info(f"Webhook: deal-won triggered for deal {deal_id}, value: {deal.value}")

    return {
        "event": "deal.won",
        "deal": response_data,
        "tenant_id": deal.tenant_id,
        "value": float(deal.value),
        "company": deal.company_name,
        "contact": {
            "name": deal.contact_person,
            "email": deal.contact_email,
            "phone": deal.contact_phone,
        },
        "timestamp": deal.updated_at.isoformat(),
    }


@router.post("/health-alert")
async def webhook_health_alert(
    deal_id: int,
    db: Session = Depends(get_db_session),
    x_webhook_signature: Optional[str] = Header(None),
):
    """
    Webhook triggered when deal health score drops below threshold.

    Use this webhook to:
    - Alert sales managers
    - Schedule urgent follow-ups
    - Create tasks in project management tools
    - Send email reminders

    Headers:
        X-Webhook-Signature: HMAC SHA256 signature for verification (optional)

    Returns:
        At-risk deal data with health score and recommendations
    """
    deal = db.query(Deal).filter(Deal.id == deal_id).first()

    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deal not found"
        )

    response_data = DealResponse.model_validate(deal)

    logger.warning(f"Webhook: health-alert triggered for deal {deal_id}, health score: {deal.health_score}")

    return {
        "event": "deal.health_alert",
        "deal": response_data,
        "tenant_id": deal.tenant_id,
        "health_score": deal.health_score,
        "alert_level": "critical" if deal.health_score < 30 else "warning",
        "recommended_actions": [
            "Schedule immediate follow-up call",
            "Review deal status with team",
            "Update deal notes with current situation",
        ],
        "timestamp": deal.updated_at.isoformat(),
    }


@router.get("/test")
async def test_webhook():
    """
    Test endpoint to verify webhook connectivity.

    Returns:
        Simple success message
    """
    logger.info("Webhook: test endpoint called")

    return {
        "status": "ok",
        "message": "Webhook endpoint is working",
        "available_webhooks": [
            "/api/webhooks/deal-updated",
            "/api/webhooks/deal-won",
            "/api/webhooks/health-alert",
        ],
    }
