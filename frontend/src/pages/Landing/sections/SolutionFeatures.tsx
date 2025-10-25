import { Target, Sparkles, Clock } from 'lucide-react';
import { FeatureCard } from '../../../components/landing/FeatureCard';

export const SolutionFeatures = () => {
  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            KI erledigt die Arbeit. Sie schließen die Deals ab.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            DealFlow nutzt KI, um Ihnen die zeitraubenden Aufgaben abzunehmen
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Target}
            title="Automatisches Health-Scoring"
            description="Sofort sehen, welche Deals Aufmerksamkeit brauchen. Unser 4-Faktor-Algorithmus analysiert Kontakt, Close-Datum, Stage und Deal-Alter."
            visual={
              <div className="flex items-center justify-center">
                <div className="bg-green-500 text-white px-6 py-3 rounded-lg text-2xl font-bold shadow-lg">
                  85% Health
                </div>
              </div>
            }
            delay={0}
          />

          <FeatureCard
            icon={Sparkles}
            title="KI-Empfehlungen für jeden Deal"
            description="Kontextbasierte Next-Actions in Echtzeit. Powered by fortgeschrittener KI für intelligente, situationsgerechte Vorschläge."
            visual={
              <div className="space-y-2 text-left">
                <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg text-sm">
                  💡 Erstgespräch vereinbaren
                </div>
                <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg text-sm">
                  💡 Budget-Diskussion führen
                </div>
                <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg text-sm">
                  💡 Vertrag finalisieren
                </div>
              </div>
            }
            delay={0.1}
          />

          <FeatureCard
            icon={Clock}
            title="40% weniger Admin-Zeit"
            description="Automatisches Tracking, intelligente Insights. 4 Stunden pro Woche mehr für aktiven Verkauf statt Daten-Pflege."
            visual={
              <div className="text-center">
                <div className="text-4xl font-black text-primary-600 mb-2">4h/Woche</div>
                <div className="text-sm text-gray-600">Zeit gespart pro Mitarbeiter</div>
              </div>
            }
            delay={0.2}
          />
        </div>
      </div>
    </section>
  );
};
