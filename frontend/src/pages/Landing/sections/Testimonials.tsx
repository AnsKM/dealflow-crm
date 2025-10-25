import { TestimonialCard } from '../../../components/landing/TestimonialCard';

export const Testimonials = () => {
  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Deutsche Vertriebsteams vertrauen DealFlow
          </h2>
          <p className="text-xl text-gray-600">
            Echte Ergebnisse von echten Kunden
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TestimonialCard
            quote="Das automatische Health-Scoring hat uns geholfen, nichts zu übersehen. Wir sehen sofort, welche Deals Aufmerksamkeit brauchen."
            author="Dr. Thomas Müller"
            role="Head of Sales"
            company="Volkswagen AG"
            dealValue="€450K"
            delay={0}
          />

          <TestimonialCard
            quote="KI-Empfehlungen sparen uns täglich Zeit. Statt zu überlegen, was als nächstes zu tun ist, gibt uns DealFlow klare Handlungsempfehlungen."
            author="Michael Wagner"
            role="Senior Account Manager"
            company="Deutsche Bank AG"
            dealValue="€420K"
            delay={0.1}
          />

          <TestimonialCard
            quote="Setup in 5 Minuten, nicht 5 Tagen. Bei anderen CRMs haben wir Wochen für Konfiguration verschwendet. DealFlow war sofort produktiv."
            author="Stefan Becker"
            role="Sales Director"
            company="Porsche AG"
            dealValue="€425K"
            delay={0.2}
          />
        </div>

        <div className="mt-16 bg-primary-50 rounded-2xl p-8 text-center">
          <div className="text-6xl mb-4">⭐⭐⭐⭐⭐</div>
          <div className="text-2xl font-bold text-gray-900 mb-2">4.9/5 Sterne</div>
          <p className="text-gray-600">
            Basierend auf 100+ Bewertungen von deutschen Vertriebsteams
          </p>
        </div>
      </div>
    </section>
  );
};
