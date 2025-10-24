"""API dependencies."""
from typing import Generator
from sqlalchemy.orm import Session
from fastapi import Depends

from app.db.database import get_db
from app.core.security import get_current_user_id, get_current_tenant_id


def get_db_session() -> Generator:
    """Get database session."""
    yield from get_db()


def get_user_id(user_id: int = Depends(get_current_user_id)) -> int:
    """Get current user ID."""
    return user_id


def get_tenant_id(tenant_id: int = Depends(get_current_tenant_id)) -> int:
    """Get current tenant ID."""
    return tenant_id
