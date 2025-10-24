"""Activity model for deal timeline."""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum
from app.db.database import Base


class ActivityType(str, Enum):
    """Types of activities in the deal timeline."""

    NOTE = "note"
    CALL = "call"
    EMAIL = "email"
    MEETING = "meeting"
    STAGE_CHANGE = "stage_change"
    SYSTEM = "system"


class Activity(Base):
    """Activity model for tracking deal history."""

    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    # Activity details
    activity_type = Column(SQLEnum(ActivityType), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(String(2000))

    # Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    deal = relationship("Deal", back_populates="activities")
    user = relationship("User", back_populates="activities")
