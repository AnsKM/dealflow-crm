import { motion } from 'framer-motion';
import { Check, X, AlertCircle } from 'lucide-react';

export const ComparisonTable = () => {
  const features = [
    {
      category: 'Setup & Onboarding',
      items: [
        { label: 'Setup-Zeit', pipedrive: '2-3 Tage' as const, close: '1 Tag' as const, dealflow: '5 Minuten' as const, dealflowBest: true },
        { label: 'Training erforderlich', pipedrive: true as const, close: true as const, dealflow: false as const, dealflowBest: false },
        { label: 'Sofort einsatzbereit', pipedrive: false as const, close: false as const, dealflow: true as const, dealflowBest: false },
      ],
    },
    {
      category: 'KI-Features',
      items: [
        { label: 'Automatisches Health-Scoring', pipedrive: false as const, close: false as const, dealflow: true as const, dealflowBest: false },
        { label: 'KI-Empfehlungen', pipedrive: 'paid' as const, close: 'paid' as const, dealflow: true as const, dealflowBest: false },
        { label: 'Risiko-Früherkennung', pipedrive: false as const, close: false as const, dealflow: true as const, dealflowBest: false },
      ],
    },
    {
      category: 'Lokalisierung',
      items: [
        { label: 'Deutsche Oberfläche', pipedrive: 'translated' as const, close: 'translated' as const, dealflow: 'native' as const, dealflowBest: false },
        { label: 'Deutscher Support', pipedrive: true as const, close: false as const, dealflow: true as const, dealflowBest: false },
        { label: 'DSGVO-konform', pipedrive: true as const, close: 'partial' as const, dealflow: true as const, dealflowBest: false },
        { label: 'Deutsche Datenhaltung', pipedrive: false as const, close: false as const, dealflow: true as const, dealflowBest: false },
      ],
    },
    {
      category: 'Preis',
      items: [
        { label: 'Preis pro Nutzer', pipedrive: '€49' as const, close: '$99' as const, dealflow: '€29' as const, dealflowBest: true },
      ],
    },
  ];

  const renderCell = (value: string | boolean, isBest?: boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-6 h-6 text-green-500 mx-auto" />
      ) : (
        <X className="w-6 h-6 text-red-400 mx-auto" />
      );
    }

    if (value === 'paid') {
      return (
        <div className="flex items-center justify-center gap-1 text-orange-600">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">Add-on</span>
        </div>
      );
    }

    if (value === 'translated') {
      return (
        <div className="flex items-center justify-center gap-1 text-yellow-600">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">Übersetzt</span>
        </div>
      );
    }

    if (value === 'native') {
      return (
        <div className="flex items-center justify-center">
          <Check className="w-6 h-6 text-green-500 mr-1" />
          <span className="text-sm font-semibold text-green-600">Nativ</span>
        </div>
      );
    }

    if (value === 'partial') {
      return (
        <div className="flex items-center justify-center gap-1 text-yellow-600">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">Teilweise</span>
        </div>
      );
    }

    return (
      <span className={`text-sm font-semibold ${isBest ? 'text-primary-600' : 'text-gray-700'}`}>
        {value}
      </span>
    );
  };

  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            DealFlow vs. Traditionelle CRMs
          </h2>
          <p className="text-xl text-gray-600">
            Warum führende deutsche Unternehmen zu DealFlow wechseln
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="overflow-x-auto"
        >
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow-lg rounded-2xl">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Pipedrive</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Close</th>
                    <th className="px-6 py-4 text-center text-sm font-bold bg-primary-50 text-primary-700">
                      DealFlow
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {features.map((category, catIndex) => (
                    <>
                      <tr key={`cat-${catIndex}`} className="bg-gray-100">
                        <td colSpan={4} className="px-6 py-3 text-sm font-bold text-gray-900">
                          {category.category}
                        </td>
                      </tr>
                      {category.items.map((item, itemIndex) => (
                        <tr
                          key={`item-${catIndex}-${itemIndex}`}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-gray-700">{item.label}</td>
                          <td className="px-6 py-4 text-center">
                            {renderCell(item.pipedrive)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {renderCell(item.close)}
                          </td>
                          <td className="px-6 py-4 text-center bg-primary-50">
                            {renderCell(item.dealflow, item.dealflowBest)}
                          </td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            40% günstiger. 100% deutscher. Unendlich intelligenter.
          </h3>
          <p className="text-primary-100 text-lg">
            DealFlow wurde von Grund auf für den deutschen B2B-Markt entwickelt
          </p>
        </motion.div>
      </div>
    </section>
  );
};
