"""Activity routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.api.deps import get_db_session, get_user_id, get_tenant_id
from app.schemas.activity import ActivityCreate, ActivityResponse
from app.models.activity import Activity
from app.models.deal import Deal
from app.core.logging import get_logger

logger = get_logger(__name__)

router = APIRouter()


@router.post("", response_model=ActivityResponse, status_code=status.HTTP_201_CREATED)
async def create_activity(
    activity_data: ActivityCreate,
    db: Session = Depends(get_db_session),
    user_id: int = Depends(get_user_id),
    tenant_id: int = Depends(get_tenant_id),
):
    """Create a new activity."""
    # Verify deal exists and belongs to tenant
    deal = (
        db.query(Deal)
        .filter(Deal.id == activity_data.deal_id, Deal.tenant_id == tenant_id)
        .first()
    )

    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deal not found",
        )

    # Create activity
    activity = Activity(
        user_id=user_id,
        **activity_data.model_dump(),
    )

    # Update deal's last_contact_at
    deal.last_contact_at = datetime.utcnow()

    db.add(activity)
    db.commit()
    db.refresh(activity)

    logger.info(f"Created activity {activity.id} for deal {deal.id}")

    return ActivityResponse.model_validate(activity)


@router.get("/deal/{deal_id}", response_model=List[ActivityResponse])
async def get_deal_activities(
    deal_id: int,
    db: Session = Depends(get_db_session),
    tenant_id: int = Depends(get_tenant_id),
):
    """Get all activities for a deal."""
    # Verify deal exists and belongs to tenant
    deal = (
        db.query(Deal)
        .filter(Deal.id == deal_id, Deal.tenant_id == tenant_id)
        .first()
    )

    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deal not found",
        )

    # Get activities
    activities = (
        db.query(Activity)
        .filter(Activity.deal_id == deal_id)
        .order_by(Activity.created_at.desc())
        .all()
    )

    return [ActivityResponse.model_validate(activity) for activity in activities]
