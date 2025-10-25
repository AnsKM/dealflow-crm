"""
Enhanced seed data script for DealFlow CRM.
Creates realistic B2B German deals with activities.
"""
import sys
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from random import randint, choice, uniform


def now_utc():
    """Get current UTC time with timezone awareness."""
    return datetime.now(timezone.utc)


from app.db.database import SessionLocal, Base, engine
from app.models.user import User, Tenant
from app.models.deal import Deal, DealStage
from app.models.activity import Activity, ActivityType
from app.core.security import get_password_hash
from app.services.health_scoring import calculate_deal_health_score


# Realistic German B2B companies
COMPANIES = [
    "Siemens AG",
    "Bosch GmbH",
    "SAP Deutschland",
    "Deutsche Telekom AG",
    "BMW Group",
    "Volkswagen AG",
    "BASF SE",
    "Daimler AG",
    "Continental AG",
    "ThyssenKrupp AG",
    "Deutsche Bank AG",
    "Allianz SE",
    "Bayer AG",
    "Porsche AG",
    "Infineon Technologies",
    "Henkel AG",
    "RWE AG",
    "E.ON SE",
    "Metro AG",
    "Adidas AG",
]

# German first and last names
FIRST_NAMES = [
    "Michael", "Thomas", "Andreas", "Peter", "Klaus", "Stefan",
    "Christian", "Markus", "Julia", "Anna", "Sabine", "Petra",
    "Claudia", "Martina", "Susanne", "Nicole",
]
LAST_NAMES = [
    "Müller", "Schmidt", "Schneider", "Fischer", "Weber", "Meyer",
    "Wagner", "Becker", "Schulz", "Hoffmann", "Koch", "Richter",
    "Klein", "Wolf", "Schröder", "Neumann",
]

# Deal titles by stage
DEAL_TITLES = {
    DealStage.LEAD: [
        "Erstgespräch IT-Infrastruktur", "Anfrage Digitalisierungsprojekt",
        "Kontakt CRM-Lösung", "Interesse Cloud-Migration", "Bedarfsanalyse angefragt",
    ],
    DealStage.QUALIFIED: [
        "ERP-System Modernisierung", "Prozessautomatisierung", "Digitale Transformation",
        "Cloud-Infrastruktur Upgrade", "Cybersecurity Beratung",
    ],
    DealStage.PROPOSAL: [
        "Angebot SAP S/4HANA Migration", "Proposal Cloud-Lösung",
        "Offerte Managed Services", "Angebot IT-Outsourcing",
    ],
    DealStage.NEGOTIATION: [
        "Vertragsverhandlung IT-Projekt", "Finale Abstimmung Konditionen",
        "Verhandlung Enterprise Lizenz",
    ],
    DealStage.CLOSED_WON: ["Projektstart Digitalisierung", "Gewonnen: Cloud Migration"],
    DealStage.CLOSED_LOST: ["Verloren an Wettbewerber"],
}

# Activity templates
ACTIVITY_TEMPLATES = {
    ActivityType.CALL: [
        "Telefonat mit {contact} - positives Feedback",
        "Follow-up Call - nächste Schritte besprochen",
        "Entscheider-Call - Budget-Freigabe diskutiert",
    ],
    ActivityType.EMAIL: [
        "Angebot per E-Mail versendet",
        "Follow-up E-Mail mit zusätzlichen Informationen",
        "Dokumentation zugeschickt",
    ],
    ActivityType.MEETING: [
        "Kick-off Meeting durchgeführt",
        "Produktdemo präsentiert - positives Feedback",
        "Workshop zur Bedarfsanalyse",
    ],
    ActivityType.NOTE: [
        "Internes Meeting zur Deal-Strategie",
        "Budget für Q1 bestätigt",
        "Wettbewerber-Angebot liegt vor",
    ],
}


def create_contact_name():
    return f"{choice(FIRST_NAMES)} {choice(LAST_NAMES)}"


def create_email(name, company):
    first, last = name.split()
    domain = company.lower().replace(" ", "").replace("ag", "").replace("gmbh", "").replace("se", "")[:15]
    return f"{first.lower()}.{last.lower()}@{domain}.de"


# Create tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    # Check if demo user already exists
    existing_user = db.query(User).filter(User.email == "demo@dealflow.de").first()

    if existing_user:
        print("⚠️  Demo-Benutzer existiert bereits. Lösche alte Deals...")
        db.query(Deal).filter(Deal.tenant_id == existing_user.tenant_id).delete()
        db.commit()
        tenant = existing_user.tenant
        user = existing_user
    else:
        print("🌱 Erstelle Demo-Tenant und Benutzer...")
        tenant = Tenant(name="Demo Company", subdomain="demo", is_active=True)
        db.add(tenant)
        db.flush()

        user = User(
            tenant_id=tenant.id,
            email="demo@dealflow.de",
            hashed_password=get_password_hash("demo123"),
            full_name="Demo User",
            is_active=True,
            is_admin=True,
        )
        db.add(user)
        db.flush()

    print(f"✅ Tenant: {tenant.name} (ID: {tenant.id})")
    print(f"✅ User: {user.email} (ID: {user.id})")

    # Define deal distribution by stage
    deal_distribution = {
        DealStage.LEAD: 6,
        DealStage.QUALIFIED: 5,
        DealStage.PROPOSAL: 4,
        DealStage.NEGOTIATION: 3,
        DealStage.CLOSED_WON: 1,
        DealStage.CLOSED_LOST: 1,
    }

    print(f"\n📊 Erstelle {sum(deal_distribution.values())} Deals...")

    deals_created = 0
    activities_created = 0
    used_companies = set()

    # Create deals for each stage
    for stage, count in deal_distribution.items():
        print(f"  Erstelle {count} Deals in Stage: {stage.value}")

        for i in range(count):
            # Select unique company
            company = choice([c for c in COMPANIES if c not in used_companies])
            used_companies.add(company)

            contact_name = create_contact_name()
            days_ago = randint(5, 90)
            created_at = now_utc() - timedelta(days=days_ago)

            # Value ranges by stage
            value_ranges = {
                DealStage.LEAD: (25000, 100000),
                DealStage.QUALIFIED: (50000, 200000),
                DealStage.PROPOSAL: (75000, 300000),
                DealStage.NEGOTIATION: (100000, 500000),
                DealStage.CLOSED_WON: (150000, 500000),
                DealStage.CLOSED_LOST: (30000, 150000),
            }
            min_val, max_val = value_ranges[stage]
            value = Decimal(str(round(uniform(min_val, max_val), 2)))

            # Last contact timing
            if stage in [DealStage.CLOSED_WON, DealStage.CLOSED_LOST]:
                last_contact_days = randint(10, 30)
            elif stage == DealStage.NEGOTIATION:
                last_contact_days = randint(1, 7)
            elif stage == DealStage.PROPOSAL:
                last_contact_days = randint(2, 14)
            else:
                last_contact_days = randint(5, 20)

            last_contact_at = now_utc() - timedelta(days=last_contact_days)

            # Expected close date
            if stage in [DealStage.CLOSED_WON, DealStage.CLOSED_LOST]:
                expected_close_date = created_at + timedelta(days=randint(30, 60))
            elif stage == DealStage.NEGOTIATION:
                expected_close_date = now_utc() + timedelta(days=randint(5, 20))
            elif stage == DealStage.PROPOSAL:
                expected_close_date = now_utc() + timedelta(days=randint(15, 45))
            else:
                expected_close_date = now_utc() + timedelta(days=randint(30, 90))

            # Create deal
            deal = Deal(
                tenant_id=tenant.id,
                title=choice(DEAL_TITLES[stage]),
                company_name=company,
                contact_person=contact_name,
                contact_email=create_email(contact_name, company),
                contact_phone=f"+49 {randint(30, 99)} {randint(1000, 9999)} {randint(1000, 9999)}",
                value=value,
                stage=stage,
                last_contact_at=last_contact_at,
                expected_close_date=expected_close_date,
                notes=f"Projekt für {company}. Entscheider: {contact_name}. Konkurrenz: 2-3 Anbieter.",
                created_at=created_at,
                updated_at=last_contact_at,
            )
            db.add(deal)
            db.flush()

            # Calculate health score
            deal.health_score = calculate_deal_health_score(deal)

            # Create 2-5 activities per deal
            num_activities = randint(2, 5)

            # System activity first
            db.add(Activity(
                deal_id=deal.id,
                user_id=user.id,
                activity_type=ActivityType.SYSTEM,
                title="Deal erstellt",
                description=f"Deal '{deal.title}' wurde angelegt",
                created_at=created_at,
            ))
            activities_created += 1

            # Random activities
            time_span = (last_contact_at - created_at).days
            for _ in range(num_activities - 1):
                activity_type = choice([ActivityType.CALL, ActivityType.EMAIL, ActivityType.MEETING, ActivityType.NOTE])
                days_offset = randint(0, max(1, time_span))
                activity_time = created_at + timedelta(days=days_offset)

                template = choice(ACTIVITY_TEMPLATES[activity_type])
                description = template.format(contact=contact_name)

                db.add(Activity(
                    deal_id=deal.id,
                    user_id=user.id,
                    activity_type=activity_type,
                    title=activity_type.value.replace("_", " ").title(),
                    description=description,
                    created_at=activity_time,
                ))
                activities_created += 1

            deals_created += 1

    db.commit()

    print(f"\n✅ {deals_created} Deals erfolgreich erstellt")
    print(f"✅ {activities_created} Activities erstellt")
    print(f"\n🎉 Seeding abgeschlossen!")
    print(f"\n📝 Demo-Zugangsdaten:")
    print(f"   E-Mail: demo@dealflow.de")
    print(f"   Passwort: demo123")

except Exception as e:
    print(f"\n❌ Fehler beim Seeding: {str(e)}")
    db.rollback()
    raise
finally:
    db.close()
