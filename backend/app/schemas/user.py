"""User schemas."""
from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime


class UserBase(BaseModel):
    """Base user schema."""

    email: EmailStr
    full_name: str


class UserCreate(UserBase):
    """Schema for creating a user."""

    password: str
    tenant_name: str


class UserLogin(BaseModel):
    """Schema for user login."""

    email: EmailStr
    password: str


class UserResponse(UserBase):
    """Schema for user response."""

    id: int
    tenant_id: int
    is_active: bool
    is_admin: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    """Schema for JWT token response."""

    access_token: str
    token_type: str = "bearer"
    user: UserResponse
