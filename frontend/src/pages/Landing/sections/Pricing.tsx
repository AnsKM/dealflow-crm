import { PricingCard } from '../../../components/landing/PricingCard';

export const Pricing = () => {
  const starterFeatures = [
    { text: 'Alle Basis-Features', included: true },
    { text: 'Automatisches Health-Scoring', included: true },
    { text: 'KI-Empfehlungen (10/Tag)', included: true },
    { text: 'Email-Support', included: true },
    { text: 'Unbegrenzte Deals', included: true },
    { text: 'Basis-Analytics', included: true },
    { text: 'Bulk-Operationen', included: false },
    { text: 'Priority Support', included: false },
  ];

  const professionalFeatures = [
    { text: 'Alles aus Starter', included: true },
    { text: 'Unbegrenzte KI-Empfehlungen', included: true },
    { text: 'Bulk-Operationen', included: true },
    { text: 'Erweiterte Analytics', included: true },
    { text: 'Priority Support', included: true },
    { text: 'Webhooks & API', included: true },
    { text: 'Custom Felder', included: true },
    { text: 'Export-Funktionen', included: true },
  ];

  const enterpriseFeatures = [
    { text: 'Alles aus Professional', included: true },
    { text: 'Dedicated Account Manager', included: true },
    { text: 'Custom Integrationen', included: true },
    { text: 'SLA-Garantie (99.9%)', included: true },
    { text: 'Telefon-Support', included: true },
    { text: 'On-Premise Option', included: true },
    { text: 'Custom Training', included: true },
    { text: 'White-Label Option', included: true },
  ];

  return (
    <section className="bg-gray-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Transparente Preise. Keine Überraschungen.
          </h2>
          <p className="text-xl text-gray-600">
            Wählen Sie den Plan, der zu Ihrem Team passt
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <PricingCard
            name="Starter"
            price="€29"
            description="Perfekt für kleine Teams"
            features={starterFeatures}
            delay={0}
          />

          <PricingCard
            name="Professional"
            price="€49"
            description="Für wachsende Vertriebsteams"
            features={professionalFeatures}
            isPopular={true}
            delay={0.1}
          />

          <PricingCard
            name="Enterprise"
            price="Individuell"
            description="Für große Organisationen"
            features={enterpriseFeatures}
            ctaText="Kontakt aufnehmen"
            delay={0.2}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Alle Pläne beinhalten:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl mb-2">✅</div>
              <div className="font-semibold text-gray-900">14 Tage kostenlos testen</div>
              <div className="text-sm text-gray-600">Keine Kreditkarte erforderlich</div>
            </div>
            <div>
              <div className="text-4xl mb-2">✅</div>
              <div className="font-semibold text-gray-900">Jederzeit kündbar</div>
              <div className="text-sm text-gray-600">Keine Vertragsbindung</div>
            </div>
            <div>
              <div className="text-4xl mb-2">✅</div>
              <div className="font-semibold text-gray-900">DSGVO-konform</div>
              <div className="text-sm text-gray-600">Daten in Deutschland</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
