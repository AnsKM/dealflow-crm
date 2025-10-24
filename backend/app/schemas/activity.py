"""Activity schemas."""
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional

from app.models.activity import ActivityType


class ActivityBase(BaseModel):
    """Base activity schema."""

    activity_type: ActivityType
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=2000)


class ActivityCreate(ActivityBase):
    """Schema for creating an activity."""

    deal_id: int


class ActivityResponse(ActivityBase):
    """Schema for activity response."""

    id: int
    deal_id: int
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
