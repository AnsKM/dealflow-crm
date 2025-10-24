"""AI service for next-action recommendations using Gemini."""
import google.generativeai as genai
from typing import List
from datetime import datetime

from app.core.config import settings
from app.core.logging import get_logger
from app.models.deal import Deal, DealStage

logger = get_logger(__name__)

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)


class AIService:
    """Service for AI-powered features using Gemini."""

    def __init__(self):
        """Initialize AI service with Gemini model."""
        self.model = genai.GenerativeModel(settings.GEMINI_MODEL)

    def generate_next_actions(self, deal: Deal) -> List[str]:
        """
        Generate next action recommendations for a deal.

        Args:
            deal: The deal to analyze

        Returns:
            List of recommended next actions
        """
        try:
            # Build context about the deal
            days_since_last_contact = None
            if deal.last_contact_at:
                days_since_last_contact = (datetime.utcnow() - deal.last_contact_at).days

            days_until_close = None
            if deal.expected_close_date:
                days_until_close = (deal.expected_close_date - datetime.utcnow()).days

            # Create prompt for Gemini
            prompt = f"""Du bist ein erfahrener Sales-Coach für den deutschen B2B-Vertrieb.
Analysiere folgende Deal-Information und gib 3-5 konkrete, sofort umsetzbare Handlungsempfehlungen auf Deutsch.

Deal-Details:
- Titel: {deal.title}
- Firma: {deal.company_name}
- Wert: {deal.value} EUR
- Stage: {deal.stage.value}
- Health Score: {deal.health_score}/100
- Letzter Kontakt: {"vor " + str(days_since_last_contact) + " Tagen" if days_since_last_contact is not None else "unbekannt"}
- Erwarteter Abschluss: {"in " + str(days_until_close) + " Tagen" if days_until_close is not None else "nicht festgelegt"}
- Notizen: {deal.notes or "keine"}

Beachte:
- Empfehlungen sollen spezifisch und actionable sein
- Berücksichtige die aktuelle Sales-Stage
- Fokus auf zeitkritische Aktionen bei niedrigem Health Score
- Sprache: Deutsch, professionell aber direkt

Gib nur die Handlungsempfehlungen zurück, keine zusätzlichen Erklärungen. Format: Jede Empfehlung als Stichpunkt."""

            # Call Gemini
            response = self.model.generate_content(prompt)

            # Parse response into list of actions
            actions_text = response.text.strip()
            actions = [
                line.strip().lstrip("-•*").strip()
                for line in actions_text.split("\n")
                if line.strip() and not line.strip().startswith("#")
            ]

            # Limit to 5 actions
            actions = actions[:5]

            logger.info(f"Generated {len(actions)} next actions for deal {deal.id}")
            return actions

        except Exception as e:
            logger.error(f"Error generating next actions: {str(e)}")
            # Return fallback actions based on stage
            return self._get_fallback_actions(deal)

    def _get_fallback_actions(self, deal: Deal) -> List[str]:
        """Get fallback actions if AI fails."""
        fallback_actions = {
            DealStage.LEAD: [
                "Erstgespräch vereinbaren",
                "Bedarfsanalyse durchführen",
                "Entscheidungsträger identifizieren",
            ],
            DealStage.QUALIFIED: [
                "Produktdemo vorbereiten",
                "Budget und Timeline klären",
                "Pain Points dokumentieren",
            ],
            DealStage.PROPOSAL: [
                "Angebot nachfassen",
                "Fragen zum Proposal klären",
                "Entscheider-Meeting ansetzen",
            ],
            DealStage.NEGOTIATION: [
                "Vertragsdetails finalisieren",
                "Final Approval einholen",
                "Onboarding-Prozess vorbereiten",
            ],
            DealStage.CLOSED_WON: [
                "Onboarding starten",
                "Customer Success übergeben",
                "Testimonial anfragen",
            ],
            DealStage.CLOSED_LOST: [
                "Lost-Analyse dokumentieren",
                "Follow-up für Zukunft planen",
                "Lessons Learned festhalten",
            ],
        }

        return fallback_actions.get(deal.stage, ["Deal-Status überprüfen"])
