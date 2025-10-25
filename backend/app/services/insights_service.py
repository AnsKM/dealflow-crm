"""
Insights service for deal intelligence and analytics.
"""
from datetime import datetime, timedelta
from typing import List, Dict, Any
from decimal import Decimal
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.deal import Deal, DealStage
from app.core.logging import get_logger

logger = get_logger(__name__)


class InsightsService:
    """Service for generating deal insights and analytics."""

    @staticmethod
    def get_at_risk_deals(db: Session, tenant_id: int) -> List[Deal]:
        """
        Get deals that are at risk.

        Criteria:
        - Health score < 40, OR
        - No contact in last 7+ days and stage is active (not closed)

        Args:
            db: Database session
            tenant_id: Tenant ID to filter deals

        Returns:
            List of at-risk deals
        """
        seven_days_ago = datetime.utcnow() - timedelta(days=7)

        # Deals with low health score or stale contact
        at_risk_deals = (
            db.query(Deal)
            .filter(
                Deal.tenant_id == tenant_id,
                Deal.stage.not_in([DealStage.CLOSED_WON, DealStage.CLOSED_LOST]),
            )
            .filter(
                (Deal.health_score < 40)
                | (
                    (Deal.last_contact_at < seven_days_ago)
                    | (Deal.last_contact_at.is_(None))
                )
            )
            .order_by(Deal.health_score.asc(), Deal.value.desc())
            .all()
        )

        logger.info(f"Found {len(at_risk_deals)} at-risk deals for tenant {tenant_id}")
        return at_risk_deals

    @staticmethod
    def get_high_priority_deals(db: Session, tenant_id: int) -> List[Deal]:
        """
        Get high-priority deals requiring attention.

        Criteria:
        - High value (>100k EUR) AND
        - In negotiation or proposal stage

        Args:
            db: Database session
            tenant_id: Tenant ID to filter deals

        Returns:
            List of high-priority deals
        """
        high_priority = (
            db.query(Deal)
            .filter(
                Deal.tenant_id == tenant_id,
                Deal.stage.in_([DealStage.NEGOTIATION, DealStage.PROPOSAL]),
                Deal.value >= 100000,
            )
            .order_by(Deal.value.desc())
            .all()
        )

        logger.info(f"Found {len(high_priority)} high-priority deals for tenant {tenant_id}")
        return high_priority

    @staticmethod
    def calculate_revenue_at_risk(db: Session, tenant_id: int) -> Decimal:
        """
        Calculate total revenue value at risk.

        Args:
            db: Database session
            tenant_id: Tenant ID to filter deals

        Returns:
            Total value of at-risk deals
        """
        at_risk_deals = InsightsService.get_at_risk_deals(db, tenant_id)
        total_at_risk = sum((deal.value for deal in at_risk_deals), Decimal("0"))

        logger.info(f"Revenue at risk for tenant {tenant_id}: {total_at_risk}")
        return total_at_risk

    @staticmethod
    def get_upcoming_close_dates(db: Session, tenant_id: int, days: int = 14) -> List[Deal]:
        """
        Get deals with expected close dates in the next N days.

        Args:
            db: Database session
            tenant_id: Tenant ID to filter deals
            days: Number of days to look ahead (default 14)

        Returns:
            List of deals closing soon
        """
        today = datetime.utcnow()
        future_date = today + timedelta(days=days)

        upcoming_deals = (
            db.query(Deal)
            .filter(
                Deal.tenant_id == tenant_id,
                Deal.stage.not_in([DealStage.CLOSED_WON, DealStage.CLOSED_LOST]),
                Deal.expected_close_date.isnot(None),
                Deal.expected_close_date >= today,
                Deal.expected_close_date <= future_date,
            )
            .order_by(Deal.expected_close_date.asc())
            .all()
        )

        logger.info(f"Found {len(upcoming_deals)} deals closing in next {days} days for tenant {tenant_id}")
        return upcoming_deals

    @staticmethod
    def get_pipeline_summary(db: Session, tenant_id: int) -> Dict[str, Any]:
        """
        Get comprehensive pipeline summary with key metrics.

        Args:
            db: Database session
            tenant_id: Tenant ID to filter deals

        Returns:
            Dictionary with pipeline metrics
        """
        # Total active deals
        active_deals = (
            db.query(func.count(Deal.id))
            .filter(
                Deal.tenant_id == tenant_id,
                Deal.stage.not_in([DealStage.CLOSED_WON, DealStage.CLOSED_LOST]),
            )
            .scalar()
        )

        # Total pipeline value
        pipeline_value = (
            db.query(func.sum(Deal.value))
            .filter(
                Deal.tenant_id == tenant_id,
                Deal.stage.not_in([DealStage.CLOSED_WON, DealStage.CLOSED_LOST]),
            )
            .scalar()
            or Decimal("0")
        )

        # Average health score
        avg_health = (
            db.query(func.avg(Deal.health_score))
            .filter(
                Deal.tenant_id == tenant_id,
                Deal.stage.not_in([DealStage.CLOSED_WON, DealStage.CLOSED_LOST]),
            )
            .scalar()
            or 0
        )

        # Get insights
        at_risk_count = len(InsightsService.get_at_risk_deals(db, tenant_id))
        revenue_at_risk = InsightsService.calculate_revenue_at_risk(db, tenant_id)
        closing_soon_count = len(InsightsService.get_upcoming_close_dates(db, tenant_id))

        summary = {
            "active_deals": active_deals or 0,
            "pipeline_value": float(pipeline_value),
            "average_health_score": round(float(avg_health), 1),
            "at_risk_count": at_risk_count,
            "revenue_at_risk": float(revenue_at_risk),
            "closing_soon_count": closing_soon_count,
        }

        logger.info(f"Pipeline summary for tenant {tenant_id}: {summary}")
        return summary

    @staticmethod
    def get_stage_conversion_rates(db: Session, tenant_id: int) -> Dict[str, float]:
        """
        Calculate conversion rates between stages.

        Args:
            db: Database session
            tenant_id: Tenant ID to filter deals

        Returns:
            Dictionary with conversion rates per stage
        """
        # Count deals in each stage
        stage_counts = (
            db.query(Deal.stage, func.count(Deal.id))
            .filter(Deal.tenant_id == tenant_id)
            .group_by(Deal.stage)
            .all()
        )

        stage_dict = {stage: count for stage, count in stage_counts}

        # Calculate conversion rates (simplified)
        total_deals = sum(stage_dict.values())
        if total_deals == 0:
            return {}

        conversion_rates = {
            stage.value: round((count / total_deals) * 100, 1)
            for stage, count in stage_dict.items()
        }

        logger.info(f"Conversion rates for tenant {tenant_id}: {conversion_rates}")
        return conversion_rates

    @staticmethod
    def get_weekly_summary(db: Session, tenant_id: int) -> str:
        """
        Generate a human-readable weekly summary.

        Args:
            db: Database session
            tenant_id: Tenant ID to filter deals

        Returns:
            Summary text in German
        """
        at_risk_deals = InsightsService.get_at_risk_deals(db, tenant_id)
        closing_soon = InsightsService.get_upcoming_close_dates(db, tenant_id, days=7)
        high_priority = InsightsService.get_high_priority_deals(db, tenant_id)

        summary_parts = []

        if at_risk_deals:
            summary_parts.append(f"{len(at_risk_deals)} Deals benötigen Aufmerksamkeit")

        if closing_soon:
            summary_parts.append(f"{len(closing_soon)} Deals schließen in den nächsten 7 Tagen")

        if high_priority:
            summary_parts.append(f"{len(high_priority)} hochwertige Deals in Verhandlung")

        if not summary_parts:
            return "Pipeline ist stabil - keine kritischen Aktionen erforderlich"

        return " | ".join(summary_parts)
