"""Tests for deals endpoints."""
from decimal import Decimal


def test_create_deal(client, test_user_token):
    """Test creating a new deal."""
    headers = {"Authorization": f"Bearer {test_user_token['token']}"}

    response = client.post(
        "/api/deals",
        json={
            "title": "Test Deal",
            "company_name": "Test Company",
            "value": 10000.0,
            "stage": "lead",
        },
        headers=headers,
    )

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Deal"
    assert data["company_name"] == "Test Company"
    assert float(data["value"]) == 10000.0
    assert data["stage"] == "lead"
    assert "health_score" in data
    assert "next_actions" in data


def test_list_deals(client, test_user_token):
    """Test listing deals."""
    headers = {"Authorization": f"Bearer {test_user_token['token']}"}

    # Create a deal first
    client.post(
        "/api/deals",
        json={
            "title": "Test Deal 1",
            "company_name": "Company 1",
            "value": 5000.0,
            "stage": "qualified",
        },
        headers=headers,
    )

    # List deals
    response = client.get("/api/deals", headers=headers)

    assert response.status_code == 200
    data = response.json()
    assert "deals" in data
    assert "total" in data
    assert data["total"] >= 1
    assert len(data["deals"]) >= 1


def test_get_deal(client, test_user_token):
    """Test getting a specific deal."""
    headers = {"Authorization": f"Bearer {test_user_token['token']}"}

    # Create a deal
    create_response = client.post(
        "/api/deals",
        json={
            "title": "Get Test Deal",
            "company_name": "Get Test Company",
            "value": 7500.0,
            "stage": "proposal",
        },
        headers=headers,
    )
    deal_id = create_response.json()["id"]

    # Get the deal
    response = client.get(f"/api/deals/{deal_id}", headers=headers)

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == deal_id
    assert data["title"] == "Get Test Deal"


def test_update_deal(client, test_user_token):
    """Test updating a deal."""
    headers = {"Authorization": f"Bearer {test_user_token['token']}"}

    # Create a deal
    create_response = client.post(
        "/api/deals",
        json={
            "title": "Update Test Deal",
            "company_name": "Update Test Company",
            "value": 8000.0,
            "stage": "lead",
        },
        headers=headers,
    )
    deal_id = create_response.json()["id"]

    # Update the deal
    response = client.patch(
        f"/api/deals/{deal_id}",
        json={
            "stage": "qualified",
            "value": 12000.0,
        },
        headers=headers,
    )

    assert response.status_code == 200
    data = response.json()
    assert data["stage"] == "qualified"
    assert float(data["value"]) == 12000.0


def test_delete_deal(client, test_user_token):
    """Test deleting a deal."""
    headers = {"Authorization": f"Bearer {test_user_token['token']}"}

    # Create a deal
    create_response = client.post(
        "/api/deals",
        json={
            "title": "Delete Test Deal",
            "company_name": "Delete Test Company",
            "value": 3000.0,
            "stage": "lead",
        },
        headers=headers,
    )
    deal_id = create_response.json()["id"]

    # Delete the deal
    response = client.delete(f"/api/deals/{deal_id}", headers=headers)

    assert response.status_code == 204

    # Verify it's deleted
    get_response = client.get(f"/api/deals/{deal_id}", headers=headers)
    assert get_response.status_code == 404


def test_unauthorized_access(client):
    """Test that unauthorized requests are rejected."""
    response = client.get("/api/deals")
    assert response.status_code == 403  # No auth header


def test_tenant_isolation(client, test_user_token, db):
    """Test that users can only see their tenant's deals."""
    from app.models.user import User, Tenant
    from app.models.deal import Deal
    from app.core.security import get_password_hash, create_access_token

    # Create second tenant and user
    tenant2 = Tenant(name="Other Tenant", subdomain="other")
    db.add(tenant2)
    db.flush()

    user2 = User(
        tenant_id=tenant2.id,
        email="other@example.com",
        hashed_password=get_password_hash("password"),
        full_name="Other User",
    )
    db.add(user2)
    db.flush()

    # Create deal for second tenant directly in DB
    deal2 = Deal(
        tenant_id=tenant2.id,
        title="Other Tenant Deal",
        company_name="Other Company",
        value=Decimal("5000"),
        stage="lead",
    )
    db.add(deal2)
    db.commit()

    # Try to access as first user
    headers = {"Authorization": f"Bearer {test_user_token['token']}"}
    response = client.get(f"/api/deals/{deal2.id}", headers=headers)

    assert response.status_code == 404  # Should not see other tenant's deal
