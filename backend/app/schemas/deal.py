"""Deal schemas."""
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional, List
from decimal import Decimal

from app.models.deal import DealStage


class DealBase(BaseModel):
    """Base deal schema."""

    title: str = Field(..., min_length=1, max_length=255)
    company_name: str = Field(..., min_length=1, max_length=255)
    contact_person: Optional[str] = Field(None, max_length=255)
    contact_email: Optional[str] = Field(None, max_length=255)
    contact_phone: Optional[str] = Field(None, max_length=50)
    value: Decimal = Field(..., gt=0)
    stage: DealStage = DealStage.LEAD
    expected_close_date: Optional[datetime] = None
    notes: Optional[str] = Field(None, max_length=2000)


class DealCreate(DealBase):
    """Schema for creating a deal."""

    pass


class DealUpdate(BaseModel):
    """Schema for updating a deal."""

    title: Optional[str] = Field(None, min_length=1, max_length=255)
    company_name: Optional[str] = Field(None, min_length=1, max_length=255)
    contact_person: Optional[str] = Field(None, max_length=255)
    contact_email: Optional[str] = Field(None, max_length=255)
    contact_phone: Optional[str] = Field(None, max_length=50)
    value: Optional[Decimal] = Field(None, gt=0)
    stage: Optional[DealStage] = None
    expected_close_date: Optional[datetime] = None
    notes: Optional[str] = Field(None, max_length=2000)


class DealResponse(DealBase):
    """Schema for deal response."""

    id: int
    tenant_id: int
    health_score: int
    last_contact_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    next_actions: Optional[List[str]] = None  # AI-generated recommendations

    model_config = ConfigDict(from_attributes=True)


class DealListResponse(BaseModel):
    """Schema for list of deals."""

    deals: List[DealResponse]
    total: int
