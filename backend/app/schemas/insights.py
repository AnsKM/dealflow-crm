"""Insights schemas."""
from pydantic import BaseModel
from typing import List, Dict
from app.schemas.deal import DealResponse


class PipelineSummary(BaseModel):
    """Pipeline summary statistics."""

    active_deals: int
    pipeline_value: float
    average_health_score: float
    at_risk_count: int
    revenue_at_risk: float
    closing_soon_count: int


class DealInsights(BaseModel):
    """Comprehensive deal insights."""

    summary: PipelineSummary
    weekly_summary: str
    at_risk_deals: List[DealResponse]
    high_priority_deals: List[DealResponse]
    upcoming_close_deals: List[DealResponse]
    stage_conversion_rates: Dict[str, float]
