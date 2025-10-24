"""Seed demo data for testing DealFlow."""
import sys
from datetime import datetime, timedelta, timezone
from decimal import Decimal


def now_utc():
    """Get current UTC time with timezone awareness."""
    return datetime.now(timezone.utc)

from app.db.database import SessionLocal, Base, engine
from app.models.user import User, Tenant
from app.models.deal import Deal, DealStage
from app.models.activity import Activity, ActivityType
from app.core.security import get_password_hash
from app.services.health_scoring import calculate_deal_health_score

# Create tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    # Check if data already exists
    existing_tenant = db.query(Tenant).first()
    if existing_tenant:
        print("⚠️  Demo-Daten existieren bereits. Überspringe Seeding.")
        sys.exit(0)

    print("🌱 Seeding Demo-Daten...")

    # Create tenant
    tenant = Tenant(
        name="Demo Vertrieb GmbH",
        subdomain="demo-vertrieb",
        is_active=True,
    )
    db.add(tenant)
    db.flush()

    print(f"✅ Tenant erstellt: {tenant.name}")

    # Create demo user
    user = User(
        tenant_id=tenant.id,
        email="demo@dealflow.de",
        hashed_password=get_password_hash("demo123"),
        full_name="Max Mustermann",
        is_active=True,
        is_admin=True,
    )
    db.add(user)
    db.flush()

    print(f"✅ User erstellt: {user.email} (Passwort: demo123)")

    # Create demo deals
    deals_data = [
        {
            "title": "CRM-Software für Vertriebsteam",
            "company_name": "TechStart GmbH",
            "contact_person": "Anna Schmidt",
            "contact_email": "a.schmidt@techstart.de",
            "contact_phone": "+49 89 12345678",
            "value": Decimal("25000.00"),
            "stage": DealStage.QUALIFIED,
            "notes": "Großes Interesse an unserer CRM-Lösung. Budget vorhanden.",
            "expected_close_date": now_utc() + timedelta(days=30),
            "last_contact_at": now_utc() - timedelta(days=2),
        },
        {
            "title": "Digitalisierung Vertriebsprozesse",
            "company_name": "Mittelstand AG",
            "contact_person": "Thomas Müller",
            "contact_email": "mueller@mittelstand.de",
            "contact_phone": "+49 30 98765432",
            "value": Decimal("45000.00"),
            "stage": DealStage.PROPOSAL,
            "notes": "Angebot versendet. Wartet auf Feedback vom Vorstand.",
            "expected_close_date": now_utc() + timedelta(days=21),
            "last_contact_at": now_utc() - timedelta(days=5),
        },
        {
            "title": "Sales Analytics Dashboard",
            "company_name": "InnoSales GmbH",
            "contact_person": "Lisa Weber",
            "contact_email": "weber@innosales.de",
            "value": Decimal("18000.00"),
            "stage": DealStage.NEGOTIATION,
            "notes": "Verhandlung über Lizenzmodell. Fast abschlussreif.",
            "expected_close_date": now_utc() + timedelta(days=7),
            "last_contact_at": now_utc() - timedelta(days=1),
        },
        {
            "title": "Lead Management System",
            "company_name": "StartUp Ventures",
            "contact_person": "Jan Becker",
            "contact_email": "becker@startup-ventures.de",
            "value": Decimal("12000.00"),
            "stage": DealStage.LEAD,
            "notes": "Erstkontakt über LinkedIn. Interesse vorhanden.",
            "expected_close_date": now_utc() + timedelta(days=60),
            "last_contact_at": now_utc() - timedelta(days=7),
        },
        {
            "title": "Enterprise CRM Migration",
            "company_name": "Global Solutions SE",
            "contact_person": "Sarah Fischer",
            "contact_email": "fischer@global-solutions.de",
            "value": Decimal("75000.00"),
            "stage": DealStage.QUALIFIED,
            "notes": "Migration von Salesforce zu unserem System. Großprojekt.",
            "expected_close_date": now_utc() + timedelta(days=90),
            "last_contact_at": now_utc() - timedelta(days=3),
        },
        {
            "title": "Sales Automation Tools",
            "company_name": "AutoTech Industries",
            "contact_person": "Michael Wagner",
            "contact_email": "wagner@autotech.de",
            "value": Decimal("32000.00"),
            "stage": DealStage.CLOSED_WON,
            "notes": "Deal erfolgreich abgeschlossen! Onboarding startet nächste Woche.",
            "expected_close_date": now_utc() - timedelta(days=5),
            "last_contact_at": now_utc() - timedelta(days=1),
        },
    ]

    for deal_data in deals_data:
        deal = Deal(
            tenant_id=tenant.id,
            **deal_data,
        )
        db.add(deal)
        db.flush()  # Flush to get created_at timestamp

        # Calculate health score after flush
        deal.health_score = calculate_deal_health_score(deal)

        # Add system activity
        activity = Activity(
            deal_id=deal.id,
            user_id=user.id,
            activity_type=ActivityType.SYSTEM,
            title="Deal erstellt",
            description=f"Deal '{deal.title}' wurde in das System aufgenommen.",
            created_at=deal.created_at,
        )
        db.add(activity)

        print(f"✅ Deal erstellt: {deal.title} ({deal.company_name})")

    # Add some activities to deals
    deals = db.query(Deal).all()

    # Activities for first deal
    if len(deals) > 0:
        activities = [
            Activity(
                deal_id=deals[0].id,
                user_id=user.id,
                activity_type=ActivityType.CALL,
                title="Telefonat mit Ansprechpartner",
                description="Budget und Timeline besprochen. Sehr positives Gespräch.",
                created_at=now_utc() - timedelta(days=2),
            ),
            Activity(
                deal_id=deals[0].id,
                user_id=user.id,
                activity_type=ActivityType.EMAIL,
                title="Produktinformationen versendet",
                description="Detaillierte Unterlagen zu unserer CRM-Lösung per E-Mail geschickt.",
                created_at=now_utc() - timedelta(days=3),
            ),
        ]
        for act in activities:
            db.add(act)

    # Activities for second deal
    if len(deals) > 1:
        activities = [
            Activity(
                deal_id=deals[1].id,
                user_id=user.id,
                activity_type=ActivityType.MEETING,
                title="Präsentation vor Vorstand",
                description="Demo präsentiert. Positive Reaktion, aber Entscheidung dauert noch.",
                created_at=now_utc() - timedelta(days=5),
            ),
        ]
        for act in activities:
            db.add(act)

    db.commit()

    print("\n🎉 Demo-Daten erfolgreich erstellt!")
    print("\n📋 Login-Daten:")
    print(f"   E-Mail: demo@dealflow.de")
    print(f"   Passwort: demo123")
    print(f"\n💼 {len(deals_data)} Deals wurden erstellt")
    print("\n🚀 Sie können sich jetzt anmelden und DealFlow testen!")

except Exception as e:
    print(f"\n❌ Fehler beim Seeding: {str(e)}")
    db.rollback()
    raise
finally:
    db.close()
