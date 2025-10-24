"""Authentication routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db_session
from app.schemas.user import UserCreate, UserLogin, Token, UserResponse
from app.models.user import User, Tenant
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.logging import get_logger

logger = get_logger(__name__)

router = APIRouter()


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db_session)):
    """Register a new user and tenant."""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Create tenant
    subdomain = user_data.tenant_name.lower().replace(" ", "-")
    tenant = Tenant(name=user_data.tenant_name, subdomain=subdomain)
    db.add(tenant)
    db.flush()

    # Create user
    user = User(
        tenant_id=tenant.id,
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        full_name=user_data.full_name,
        is_admin=True,  # First user is admin
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create access token
    access_token = create_access_token(
        data={"sub": str(user.id), "tenant_id": str(user.tenant_id)}
    )

    logger.info(f"New user registered: {user.email} (tenant: {tenant.name})")

    return Token(
        access_token=access_token,
        user=UserResponse.model_validate(user),
    )


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: Session = Depends(get_db_session)):
    """Login user."""
    # Find user
    user = db.query(User).filter(User.email == credentials.email).first()

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
        )

    # Create access token
    access_token = create_access_token(
        data={"sub": str(user.id), "tenant_id": str(user.tenant_id)}
    )

    logger.info(f"User logged in: {user.email}")

    return Token(
        access_token=access_token,
        user=UserResponse.model_validate(user),
    )
