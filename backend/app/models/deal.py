"""Deal model."""
from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum
from app.db.database import Base


class DealStage(str, Enum):
    """Deal stages in the sales pipeline."""

    LEAD = "lead"
    QUALIFIED = "qualified"
    PROPOSAL = "proposal"
    NEGOTIATION = "negotiation"
    CLOSED_WON = "closed_won"
    CLOSED_LOST = "closed_lost"


class Deal(Base):
    """Deal model representing a sales opportunity."""

    __tablename__ = "deals"

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)

    # Deal information
    title = Column(String(255), nullable=False)
    company_name = Column(String(255), nullable=False)
    contact_person = Column(String(255))
    contact_email = Column(String(255))
    contact_phone = Column(String(50))

    # Deal value and stage
    value = Column(Numeric(precision=12, scale=2), nullable=False)
    stage = Column(SQLEnum(DealStage), default=DealStage.LEAD, nullable=False, index=True)

    # Health and metadata
    health_score = Column(Integer, default=50)  # 0-100 score
    last_contact_at = Column(DateTime(timezone=True))
    expected_close_date = Column(DateTime(timezone=True))
    notes = Column(String(2000))

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    tenant = relationship("Tenant", back_populates="deals")
    activities = relationship("Activity", back_populates="deal", cascade="all, delete-orphan")
