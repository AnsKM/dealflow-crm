"""Tests for authentication endpoints."""


def test_register_success(client):
    """Test successful user registration."""
    response = client.post(
        "/api/auth/register",
        json={
            "email": "newuser@example.com",
            "password": "password123",
            "full_name": "New User",
            "tenant_name": "New Company",
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "newuser@example.com"
    assert data["user"]["full_name"] == "New User"


def test_register_duplicate_email(client, test_user_token):
    """Test registration with existing email fails."""
    response = client.post(
        "/api/auth/register",
        json={
            "email": "test@example.com",  # Already exists
            "password": "password123",
            "full_name": "Duplicate User",
            "tenant_name": "Another Company",
        },
    )

    assert response.status_code == 400
    assert "already registered" in response.json()["detail"].lower()


def test_login_success(client, test_user_token):
    """Test successful login."""
    response = client.post(
        "/api/auth/login",
        json={
            "email": "test@example.com",
            "password": "testpassword",
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "test@example.com"


def test_login_wrong_password(client, test_user_token):
    """Test login with wrong password fails."""
    response = client.post(
        "/api/auth/login",
        json={
            "email": "test@example.com",
            "password": "wrongpassword",
        },
    )

    assert response.status_code == 401


def test_login_nonexistent_user(client):
    """Test login with non-existent user fails."""
    response = client.post(
        "/api/auth/login",
        json={
            "email": "nonexistent@example.com",
            "password": "password123",
        },
    )

    assert response.status_code == 401
