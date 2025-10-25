"""Health scoring logic for deals."""
from datetime import datetime, timedelta, timezone
from app.models.deal import Deal, DealStage
from app.core.logging import get_logger

logger = get_logger(__name__)


def now_utc():
    """Get current UTC time with timezone awareness."""
    return datetime.now(timezone.utc)


def calculate_deal_health_score(deal: Deal) -> int:
    """
    Calculate health score for a deal (0-100).

    Factors:
    - Days since last contact (40 points)
    - Days until expected close (30 points)
    - Stage progression (20 points)
    - Deal age (10 points)

    Args:
        deal: The deal to score

    Returns:
        Health score from 0-100
    """
    score = 0

    # Factor 1: Last contact (40 points max)
    if deal.last_contact_at:
        # Make last_contact_at timezone-aware if it isn't
        last_contact = deal.last_contact_at
        if last_contact.tzinfo is None:
            from datetime import timezone
            last_contact = last_contact.replace(tzinfo=timezone.utc)
        days_since_contact = (now_utc() - last_contact).days

        if days_since_contact <= 3:
            score += 40
        elif days_since_contact <= 7:
            score += 30
        elif days_since_contact <= 14:
            score += 20
        elif days_since_contact <= 30:
            score += 10
        # else: 0 points
    else:
        # No contact recorded - penalize
        score += 5

    # Factor 2: Expected close date (30 points max)
    if deal.expected_close_date:
        # Make expected_close_date timezone-aware if it isn't
        close_date = deal.expected_close_date
        if close_date.tzinfo is None:
            from datetime import timezone
            close_date = close_date.replace(tzinfo=timezone.utc)
        days_until_close = (close_date - now_utc()).days

        if days_until_close < 0:
            # Overdue - bad sign
            score += 0
        elif days_until_close <= 7:
            # Very soon - good if in late stage, bad if early stage
            if deal.stage in [DealStage.NEGOTIATION, DealStage.PROPOSAL]:
                score += 30
            else:
                score += 10
        elif days_until_close <= 30:
            score += 25
        elif days_until_close <= 90:
            score += 20
        else:
            score += 15
    else:
        # No expected close date
        score += 10

    # Factor 3: Stage progression (20 points max)
    stage_scores = {
        DealStage.LEAD: 5,
        DealStage.QUALIFIED: 10,
        DealStage.PROPOSAL: 15,
        DealStage.NEGOTIATION: 20,
        DealStage.CLOSED_WON: 20,
        DealStage.CLOSED_LOST: 0,
    }
    score += stage_scores.get(deal.stage, 0)

    # Factor 4: Deal age (10 points max)
    if deal.created_at:
        # Make created_at timezone-aware if it isn't
        created_at = deal.created_at
        if created_at.tzinfo is None:
            from datetime import timezone
            created_at = created_at.replace(tzinfo=timezone.utc)
        deal_age_days = (now_utc() - created_at).days
    else:
        # New deal with no created_at timestamp, treat as very fresh
        deal_age_days = 0

    if deal_age_days <= 7:
        # Fresh deal
        score += 10
    elif deal_age_days <= 30:
        # Normal
        score += 8
    elif deal_age_days <= 90:
        # Getting old
        score += 5
    else:
        # Very old - might be stuck
        score += 2

    # Ensure score is between 0 and 100
    score = max(0, min(100, score))

    logger.debug(f"Calculated health score for deal {deal.id}: {score}")
    return score
