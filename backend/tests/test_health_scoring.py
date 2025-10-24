"""Tests for health scoring logic."""
from datetime import datetime, timedelta
from decimal import Decimal

from app.models.deal import Deal, DealStage
from app.services.health_scoring import calculate_deal_health_score


def test_health_score_recent_contact():
    """Test that recent contact increases health score."""
    deal = Deal(
        id=1,
        tenant_id=1,
        title="Test",
        company_name="Test Co",
        value=Decimal("10000"),
        stage=DealStage.QUALIFIED,
        last_contact_at=datetime.utcnow() - timedelta(days=1),
        expected_close_date=datetime.utcnow() + timedelta(days=30),
        created_at=datetime.utcnow() - timedelta(days=5),
    )

    score = calculate_deal_health_score(deal)

    # Recent contact + reasonable timeline + mid-stage + fresh deal
    assert score >= 60  # Should be relatively healthy


def test_health_score_old_contact():
    """Test that old contact decreases health score."""
    deal = Deal(
        id=1,
        tenant_id=1,
        title="Test",
        company_name="Test Co",
        value=Decimal("10000"),
        stage=DealStage.LEAD,
        last_contact_at=datetime.utcnow() - timedelta(days=45),
        expected_close_date=datetime.utcnow() + timedelta(days=30),
        created_at=datetime.utcnow() - timedelta(days=120),
    )

    score = calculate_deal_health_score(deal)

    # Old contact + early stage + old deal
    assert score <= 40  # Should be unhealthy


def test_health_score_no_contact():
    """Test that no contact record penalizes score."""
    deal = Deal(
        id=1,
        tenant_id=1,
        title="Test",
        company_name="Test Co",
        value=Decimal("10000"),
        stage=DealStage.LEAD,
        last_contact_at=None,
        expected_close_date=datetime.utcnow() + timedelta(days=30),
        created_at=datetime.utcnow() - timedelta(days=10),
    )

    score = calculate_deal_health_score(deal)

    assert score <= 50  # Should be penalized


def test_health_score_bounds():
    """Test that health score stays between 0 and 100."""
    # Best case scenario
    deal_best = Deal(
        id=1,
        tenant_id=1,
        title="Test",
        company_name="Test Co",
        value=Decimal("10000"),
        stage=DealStage.NEGOTIATION,
        last_contact_at=datetime.utcnow(),
        expected_close_date=datetime.utcnow() + timedelta(days=7),
        created_at=datetime.utcnow() - timedelta(days=2),
    )

    # Worst case scenario
    deal_worst = Deal(
        id=2,
        tenant_id=1,
        title="Test",
        company_name="Test Co",
        value=Decimal("10000"),
        stage=DealStage.CLOSED_LOST,
        last_contact_at=datetime.utcnow() - timedelta(days=200),
        expected_close_date=datetime.utcnow() - timedelta(days=100),
        created_at=datetime.utcnow() - timedelta(days=365),
    )

    score_best = calculate_deal_health_score(deal_best)
    score_worst = calculate_deal_health_score(deal_worst)

    assert 0 <= score_best <= 100
    assert 0 <= score_worst <= 100
    assert score_best > score_worst
