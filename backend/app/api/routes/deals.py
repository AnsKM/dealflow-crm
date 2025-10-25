"""Deal routes."""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime

from app.api.deps import get_db_session, get_user_id, get_tenant_id
from app.schemas.deal import DealCreate, DealUpdate, DealResponse, DealListResponse
from app.schemas.insights import DealInsights, PipelineSummary
from app.models.deal import Deal, DealStage
from app.models.activity import Activity, ActivityType
from app.services.ai_service import AIService
from app.services.health_scoring import calculate_deal_health_score
from app.services.insights_service import InsightsService
from app.core.logging import get_logger

logger = get_logger(__name__)

router = APIRouter()
ai_service = AIService()
insights_service = InsightsService()


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


@router.get("/insights/summary", response_model=DealInsights)
async def get_deal_insights(
    db: Session = Depends(get_db_session),
    tenant_id: int = Depends(get_tenant_id),
):
    """
    Get comprehensive deal insights and analytics.

    Returns:
        - Pipeline summary statistics
        - At-risk deals
        - High-priority deals
        - Upcoming close dates
        - Stage conversion rates
    """
    # Get pipeline summary
    summary = insights_service.get_pipeline_summary(db, tenant_id)

    # Get weekly summary text
    weekly_summary = insights_service.get_weekly_summary(db, tenant_id)

    # Get at-risk deals
    at_risk_deals = insights_service.get_at_risk_deals(db, tenant_id)
    at_risk_responses = []
    for deal in at_risk_deals[:5]:  # Limit to top 5
        response = DealResponse.model_validate(deal)
        response.next_actions = ai_service.generate_next_actions(deal)
        at_risk_responses.append(response)

    # Get high-priority deals
    high_priority_deals = insights_service.get_high_priority_deals(db, tenant_id)
    high_priority_responses = []
    for deal in high_priority_deals[:5]:
        response = DealResponse.model_validate(deal)
        response.next_actions = ai_service.generate_next_actions(deal)
        high_priority_responses.append(response)

    # Get upcoming close deals
    upcoming_close = insights_service.get_upcoming_close_dates(db, tenant_id, days=14)
    upcoming_responses = []
    for deal in upcoming_close:
        response = DealResponse.model_validate(deal)
        response.next_actions = ai_service.generate_next_actions(deal)
        upcoming_responses.append(response)

    # Get stage conversion rates
    conversion_rates = insights_service.get_stage_conversion_rates(db, tenant_id)

    logger.info(f"Generated insights for tenant {tenant_id}")

    return DealInsights(
        summary=PipelineSummary(**summary),
        weekly_summary=weekly_summary,
        at_risk_deals=at_risk_responses,
        high_priority_deals=high_priority_responses,
        upcoming_close_deals=upcoming_responses,
        stage_conversion_rates=conversion_rates,
    )


@router.post("/bulk", response_model=List[DealResponse], status_code=status.HTTP_201_CREATED)
async def bulk_create_deals(
    deals_data: List[DealCreate],
    db: Session = Depends(get_db_session),
    user_id: int = Depends(get_user_id),
    tenant_id: int = Depends(get_tenant_id),
):
    """
    Create multiple deals in a single request.

    Useful for:
    - CSV imports
    - Automation workflows
    - Batch processing from external systems

    Args:
        deals_data: List of deal creation data

    Returns:
        List of created deals
    """
    if not deals_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No deals provided"
        )

    if len(deals_data) > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum 100 deals per bulk request"
        )

    created_deals = []

    for deal_data in deals_data:
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
            description=f"Deal '{deal.title}' wurde per Bulk-Import angelegt",
        )
        db.add(activity)

        created_deals.append(deal)

    db.commit()

    # Refresh and prepare responses
    responses = []
    for deal in created_deals:
        db.refresh(deal)
        response = DealResponse.model_validate(deal)
        response.next_actions = ai_service.generate_next_actions(deal)
        responses.append(response)

    logger.info(f"Bulk created {len(created_deals)} deals for tenant {tenant_id}")

    return responses


@router.patch("/bulk-update", response_model=List[DealResponse])
async def bulk_update_deals(
    updates: List[dict],
    db: Session = Depends(get_db_session),
    user_id: int = Depends(get_user_id),
    tenant_id: int = Depends(get_tenant_id),
):
    """
    Update multiple deals in a single request.

    Each update should include:
    - id: Deal ID to update
    - ...fields to update

    Example:
    [
        {"id": 1, "stage": "negotiation"},
        {"id": 2, "value": 50000}
    ]

    Returns:
        List of updated deals
    """
    if not updates:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No updates provided"
        )

    if len(updates) > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum 100 deals per bulk update"
        )

    updated_deals = []

    for update_data in updates:
        if "id" not in update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Each update must include 'id' field"
            )

        deal_id = update_data.pop("id")

        deal = (
            db.query(Deal)
            .filter(Deal.id == deal_id, Deal.tenant_id == tenant_id)
            .first()
        )

        if not deal:
            logger.warning(f"Deal {deal_id} not found for tenant {tenant_id}, skipping")
            continue

        # Track stage changes
        old_stage = deal.stage

        # Update fields
        for field, value in update_data.items():
            if hasattr(deal, field):
                setattr(deal, field, value)

        # Update last_contact_at
        deal.last_contact_at = datetime.utcnow()

        # Recalculate health score
        deal.health_score = calculate_deal_health_score(deal)

        # Create activity for stage change
        if "stage" in update_data and old_stage != deal.stage:
            activity = Activity(
                deal_id=deal.id,
                user_id=user_id,
                activity_type=ActivityType.STAGE_CHANGE,
                title="Stage geändert (Bulk)",
                description=f"Stage von '{old_stage.value}' zu '{deal.stage.value}' geändert",
            )
            db.add(activity)

        updated_deals.append(deal)

    db.commit()

    # Refresh and prepare responses
    responses = []
    for deal in updated_deals:
        db.refresh(deal)
        response = DealResponse.model_validate(deal)
        response.next_actions = ai_service.generate_next_actions(deal)
        responses.append(response)

    logger.info(f"Bulk updated {len(updated_deals)} deals for tenant {tenant_id}")

    return responses
