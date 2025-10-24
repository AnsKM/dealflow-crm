"""Deal routes."""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.api.deps import get_db_session, get_user_id, get_tenant_id
from app.schemas.deal import DealCreate, DealUpdate, DealResponse, DealListResponse
from app.models.deal import Deal, DealStage
from app.models.activity import Activity, ActivityType
from app.services.ai_service import AIService
from app.services.health_scoring import calculate_deal_health_score
from app.core.logging import get_logger

logger = get_logger(__name__)

router = APIRouter()
ai_service = AIService()


@router.post("", response_model=DealResponse, status_code=status.HTTP_201_CREATED)
async def create_deal(
    deal_data: DealCreate,
    db: Session = Depends(get_db_session),
    user_id: int = Depends(get_user_id),
    tenant_id: int = Depends(get_tenant_id),
):
    """Create a new deal."""
    # Create deal
    deal = Deal(
        tenant_id=tenant_id,
        **deal_data.model_dump(),
    )

    # Calculate initial health score
    deal.health_score = calculate_deal_health_score(deal)

    db.add(deal)
    db.flush()

    # Create system activity
    activity = Activity(
        deal_id=deal.id,
        user_id=user_id,
        activity_type=ActivityType.SYSTEM,
        title="Deal erstellt",
        description=f"Deal '{deal.title}' wurde angelegt",
    )
    db.add(activity)
    db.commit()
    db.refresh(deal)

    logger.info(f"Created deal {deal.id} for tenant {tenant_id}")

    # Get AI recommendations
    response_data = DealResponse.model_validate(deal)
    response_data.next_actions = ai_service.generate_next_actions(deal)

    return response_data


@router.get("", response_model=DealListResponse)
async def list_deals(
    stage: Optional[DealStage] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db_session),
    tenant_id: int = Depends(get_tenant_id),
):
    """List all deals for the tenant."""
    query = db.query(Deal).filter(Deal.tenant_id == tenant_id)

    if stage:
        query = query.filter(Deal.stage == stage)

    total = query.count()
    deals = query.order_by(Deal.updated_at.desc()).offset(skip).limit(limit).all()

    # Add AI recommendations to each deal
    deals_with_actions = []
    for deal in deals:
        deal_response = DealResponse.model_validate(deal)
        deal_response.next_actions = ai_service.generate_next_actions(deal)
        deals_with_actions.append(deal_response)

    return DealListResponse(deals=deals_with_actions, total=total)


@router.get("/{deal_id}", response_model=DealResponse)
async def get_deal(
    deal_id: int,
    db: Session = Depends(get_db_session),
    tenant_id: int = Depends(get_tenant_id),
):
    """Get a specific deal by ID."""
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

    # Add AI recommendations
    response_data = DealResponse.model_validate(deal)
    response_data.next_actions = ai_service.generate_next_actions(deal)

    return response_data


@router.patch("/{deal_id}", response_model=DealResponse)
async def update_deal(
    deal_id: int,
    deal_data: DealUpdate,
    db: Session = Depends(get_db_session),
    user_id: int = Depends(get_user_id),
    tenant_id: int = Depends(get_tenant_id),
):
    """Update a deal."""
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

    # Track stage changes
    old_stage = deal.stage
    update_data = deal_data.model_dump(exclude_unset=True)

    # Update fields
    for field, value in update_data.items():
        setattr(deal, field, value)

    # Update last_contact_at when deal is updated
    deal.last_contact_at = datetime.utcnow()

    # Recalculate health score
    deal.health_score = calculate_deal_health_score(deal)

    # Create activity for stage change
    if "stage" in update_data and old_stage != deal.stage:
        activity = Activity(
            deal_id=deal.id,
            user_id=user_id,
            activity_type=ActivityType.STAGE_CHANGE,
            title="Stage geändert",
            description=f"Stage von '{old_stage.value}' zu '{deal.stage.value}' geändert",
        )
        db.add(activity)

    db.commit()
    db.refresh(deal)

    logger.info(f"Updated deal {deal.id}")

    # Add AI recommendations
    response_data = DealResponse.model_validate(deal)
    response_data.next_actions = ai_service.generate_next_actions(deal)

    return response_data


@router.delete("/{deal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_deal(
    deal_id: int,
    db: Session = Depends(get_db_session),
    tenant_id: int = Depends(get_tenant_id),
):
    """Delete a deal."""
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

    db.delete(deal)
    db.commit()

    logger.info(f"Deleted deal {deal_id}")
