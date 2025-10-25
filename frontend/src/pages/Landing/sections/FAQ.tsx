import { FAQItem } from '../../../components/landing/FAQItem';

export const FAQ = () => {
  const faqs = [
    {
      question: 'Wie unterscheidet sich DealFlow von Pipedrive oder Close?',
      answer:
        'DealFlow ist KI-first, nicht KI-added. Während Pipedrive und Close KI als teures Add-on anbieten, ist bei DealFlow automatisches Health-Scoring und KI-Empfehlungen von Tag 1 integriert. Zudem ist DealFlow nativ für den deutschen Markt gebaut (nicht nur übersetzt), DSGVO-konform mit deutscher Datenhaltung, und 40% günstiger (€29 vs. €49/Nutzer).',
    },
    {
      question: 'Ist DealFlow DSGVO-konform?',
      answer:
        'Ja, absolut. DealFlow hostet alle Daten in Deutschland, erfüllt alle DSGVO-Anforderungen, bietet Datenresidenz-Garantien, und hat alle notwendigen Compliance-Zertifizierungen. Sie behalten volle Kontrolle über Ihre Daten und können sie jederzeit exportieren.',
    },
    {
      question: 'Wie lange dauert die Einrichtung?',
      answer:
        'DealFlow ist in 5 Minuten einsatzbereit. Kein komplexes Setup, keine wochenlangen Konfigurationen. Einfach registrieren, Deals importieren (CSV oder manuell), und die KI beginnt sofort mit Health-Scoring und Empfehlungen. Kein Training erforderlich - die intuitive Benutzeroberfläche erklärt sich selbst.',
    },
    {
      question: 'Kann ich meine bestehenden CRM-Daten importieren?',
      answer:
        'Ja! DealFlow unterstützt CSV-Bulk-Import, direkte Exporte von Pipedrive und HubSpot, sowie Excel-Dateien. Unser Support-Team hilft Ihnen kostenlos bei der Migration größerer Datenmengen. Sie können auch die REST API nutzen für programmatische Imports.',
    },
    {
      question: 'Was passiert nach der kostenlosen Testphase?',
      answer:
        'Nach 14 Tagen wählen Sie einen Plan oder die Testphase endet automatisch. Es gibt keine automatischen Abbuchungen - Sie müssen aktiv einen kostenpflichtigen Plan wählen. Ihre Daten bleiben 30 Tage gespeichert, falls Sie später zurückkehren möchten. Sie können Ihre Daten jederzeit vollständig exportieren.',
    },
    {
      question: 'Welche KI-Technologie nutzt DealFlow?',
      answer:
        'DealFlow nutzt Google Gemini 2.5 Flash - eines der fortschrittlichsten KI-Modelle weltweit. Dies ermöglicht kontextbasierte Empfehlungen, präzises Health-Scoring basierend auf 4 Faktoren, Risiko-Früherkennung, und intelligente Pipeline-Insights. Die KI lernt kontinuierlich von Ihren Deals und wird mit der Zeit präziser.',
    },
  ];

  return (
    <section className="bg-gray-50 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Häufig gestellte Fragen
          </h2>
          <p className="text-xl text-gray-600">
            Alles, was Sie über DealFlow wissen müssen
          </p>
        </div>

        <div>
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              delay={index * 0.05}
            />
          ))}
        </div>

        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Noch Fragen?</h3>
          <p className="text-gray-600 mb-6">
            Unser deutsches Support-Team hilft Ihnen gerne weiter
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@dealflow.de"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Email schreiben
            </a>
            <button className="bg-gray-100 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
              Live-Chat starten
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
