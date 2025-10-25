import { Disclosure } from '@headlessui/react';
import { ChevronDown, Target, Brain, BarChart3, AlertTriangle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const AIShowcase = () => {
  const features = [
    {
      icon: Target,
      title: 'Intelligentes Health-Scoring',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Unser 4-Faktor-Algorithmus bewertet jeden Deal automatisch in Echtzeit:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="font-bold text-primary-600 mr-2">40%</span>
              <span>Letzter Kontakt - Wie kürzlich wurde kommuniziert?</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-primary-600 mr-2">30%</span>
              <span>Close-Datum - Wie nah ist der geplante Abschluss?</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-primary-600 mr-2">20%</span>
              <span>Pipeline-Stage - In welcher Phase befindet sich der Deal?</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-primary-600 mr-2">10%</span>
              <span>Deal-Alter - Wie lange ist der Deal bereits aktiv?</span>
            </li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <div className="font-bold text-green-700 mb-2">Beispiel: VW Deal</div>
            <div className="text-3xl font-black text-green-600 mb-1">85% Health</div>
            <p className="text-sm text-gray-600">
              Verhandlung läuft gut → Kürzlicher Kontakt + Realistisches Close-Datum
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: Brain,
      title: 'Kontext-aware Empfehlungen',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            KI analysiert jeden Deal-Kontext und gibt stage-spezifische Empfehlungen:
          </p>
          <div className="space-y-3">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="font-bold text-blue-700 mb-2">🎯 LEAD Stage</div>
              <div className="text-sm text-gray-700">"Erstgespräch vereinbaren"</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="font-bold text-purple-700 mb-2">💬 QUALIFICATION Stage</div>
              <div className="text-sm text-gray-700">"Budget-Diskussion führen"</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="font-bold text-green-700 mb-2">🤝 NEGOTIATION Stage</div>
              <div className="text-sm text-gray-700">"Vertrag finalisieren"</div>
            </div>
          </div>
          <p className="text-sm text-gray-600 italic mt-4">
            Powered by Google Gemini 2.5 Flash - Kontextverständnis auf höchstem Niveau
          </p>
        </div>
      ),
    },
    {
      icon: BarChart3,
      title: 'Automatische Pipeline-Insights',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Keine manuelle Berechnung mehr - alle Metriken werden automatisch aktualisiert:
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-black text-primary-600">€5.3M</div>
              <div className="text-sm text-gray-600">Aktive Pipeline</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-black text-green-600">18</div>
              <div className="text-sm text-gray-600">Aktive Deals</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-black text-orange-600">€1.8M</div>
              <div className="text-sm text-gray-600">At Risk</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-black text-blue-600">28 Tage</div>
              <div className="text-sm text-gray-600">Ø Sales Cycle</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: AlertTriangle,
      title: 'Risiko-Früherkennung',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            DealFlow warnt Sie automatisch bei kritischen Deals:
          </p>
          <div className="space-y-3">
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-red-700">BMW Deal - €380K</span>
                <span className="text-red-600 text-sm">32% Health</span>
              </div>
              <div className="text-sm text-gray-700 mb-2">
                ⚠️ 35 Tage ohne Kontakt
              </div>
              <div className="text-sm text-primary-600 font-semibold">
                → KI Empfehlung: Sofort Follow-up vereinbaren
              </div>
            </div>
            <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-orange-700">SAP Deal - €520K</span>
                <span className="text-orange-600 text-sm">48% Health</span>
              </div>
              <div className="text-sm text-gray-700 mb-2">
                ⚠️ Close-Datum in 3 Tagen
              </div>
              <div className="text-sm text-primary-600 font-semibold">
                → KI Empfehlung: Abschluss-Call schedulen
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: Zap,
      title: 'Bulk-Operationen',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Importieren Sie hunderte Deals in Sekunden - nicht Stunden:
          </p>
          <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
            <div className="text-green-600 mb-2">✓ CSV-Import gestartet...</div>
            <div className="text-green-600 mb-2">✓ 28 Deals erkannt</div>
            <div className="text-green-600 mb-2">✓ Health-Scores berechnet</div>
            <div className="text-green-600 mb-2">✓ KI-Empfehlungen generiert</div>
            <div className="text-green-600 font-bold mt-4">
              ✓ Import abgeschlossen in 30 Sekunden
            </div>
          </div>
          <div className="bg-primary-50 rounded-lg p-4">
            <div className="font-bold text-primary-700 mb-2">Unterstützte Formate:</div>
            <div className="flex flex-wrap gap-2">
              <span className="bg-white px-3 py-1 rounded text-sm">CSV</span>
              <span className="bg-white px-3 py-1 rounded text-sm">Excel</span>
              <span className="bg-white px-3 py-1 rounded text-sm">Pipedrive Export</span>
              <span className="bg-white px-3 py-1 rounded text-sm">HubSpot Export</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="bg-gray-50 py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            KI-Power von Google Gemini 2.5
          </h2>
          <p className="text-xl text-gray-600">
            Nicht nur ein Add-on - KI ist das Herzstück von DealFlow
          </p>
        </motion.div>

        <div className="space-y-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Disclosure>
                {({ open }) => (
                  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                    <Disclosure.Button className="flex justify-between items-center w-full px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg">
                          <feature.icon className="w-6 h-6 text-primary-600" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">{feature.title}</span>
                      </div>
                      <ChevronDown
                        className={`w-6 h-6 text-primary-500 transition-transform duration-200 ${
                          open ? 'transform rotate-180' : ''
                        }`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-6 pb-6">
                      {feature.content}
                    </Disclosure.Panel>
                  </div>
                )}
              </Disclosure>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
