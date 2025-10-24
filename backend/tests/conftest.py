"""Test configuration and fixtures."""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.db.database import Base, get_db
from app.core.security import create_access_token

# Test database
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override database dependency for tests."""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="function")
def db():
    """Create test database."""
    Base.metadata.create_all(bind=engine)
    yield TestingSessionLocal()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client():
    """Create test client."""
    return TestClient(app)


@pytest.fixture
def test_user_token(db):
    """Create test user and return JWT token."""
    from app.models.user import User, Tenant
    from app.core.security import get_password_hash

    # Create tenant
    tenant = Tenant(name="Test Tenant", subdomain="test")
    db.add(tenant)
    db.flush()

    # Create user
    user = User(
        tenant_id=tenant.id,
        email="test@example.com",
        hashed_password=get_password_hash("testpassword"),
        full_name="Test User",
        is_active=True,
    )
    db.add(user)
    db.commit()

    # Generate token
    token = create_access_token(
        data={"sub": str(user.id), "tenant_id": str(user.tenant_id)}
    )

    return {"token": token, "user": user, "tenant": tenant}
