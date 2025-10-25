import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const ProductDemo = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Dashboard Übersicht',
      description: 'Alle wichtigen Metriken auf einen Blick',
      timestamp: '0:00',
      visual: (
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-8 aspect-video flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📊</div>
            <div className="text-2xl font-bold text-primary-700">Dashboard</div>
            <div className="text-gray-600 mt-2">Pipeline, Health Scores, Insights</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Deal-Liste mit Health Scores',
      description: 'Sofort erkennen, wo Handlungsbedarf besteht',
      timestamp: '0:15',
      visual: (
        <div className="bg-white rounded-lg p-6 space-y-3">
          <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg border border-green-200">
            <div>
              <div className="font-bold text-gray-900">VW SAP-Migration</div>
              <div className="text-sm text-gray-600">€450.000 • Verhandlung</div>
            </div>
            <div className="text-2xl font-black text-green-600">85%</div>
          </div>
          <div className="flex items-center justify-between bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div>
              <div className="font-bold text-gray-900">SAP Oracle-Migration</div>
              <div className="text-sm text-gray-600">€520.000 • Qualifikation</div>
            </div>
            <div className="text-2xl font-black text-orange-600">48%</div>
          </div>
          <div className="flex items-center justify-between bg-red-50 p-4 rounded-lg border border-red-200">
            <div>
              <div className="font-bold text-gray-900">BMW Cloud-Migration</div>
              <div className="text-sm text-gray-600">€380.000 • Proposal</div>
            </div>
            <div className="text-2xl font-black text-red-600">32%</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Deal-Detail mit KI-Empfehlungen',
      description: 'Intelligente Next Actions für jeden Deal',
      timestamp: '0:30',
      visual: (
        <div className="bg-white rounded-lg p-6">
          <div className="mb-4">
            <div className="text-xl font-bold text-gray-900 mb-2">VW SAP-Migration</div>
            <div className="flex items-center gap-2">
              <div className="bg-green-500 text-white px-3 py-1 rounded text-sm font-bold">
                85% Health
              </div>
              <div className="text-gray-600">€450.000</div>
            </div>
          </div>
          <div className="bg-primary-50 rounded-lg p-4 space-y-3">
            <div className="font-bold text-primary-700 mb-2">🤖 KI-Empfehlungen:</div>
            <div className="bg-white p-3 rounded border border-primary-200">
              💡 Vertrag finalisieren - Deal ist bereit für Abschluss
            </div>
            <div className="bg-white p-3 rounded border border-primary-200">
              💡 Follow-up Call schedulen - Momentum nutzen
            </div>
            <div className="bg-white p-3 rounded border border-primary-200">
              💡 Implementierungs-Timeline besprechen
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Analytics & Charts',
      description: 'Automatische Insights ohne manuelle Berechnung',
      timestamp: '0:45',
      visual: (
        <div className="bg-white rounded-lg p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-primary-50 p-4 rounded text-center">
              <div className="text-3xl font-black text-primary-600">€5.3M</div>
              <div className="text-sm text-gray-600">Aktive Pipeline</div>
            </div>
            <div className="bg-green-50 p-4 rounded text-center">
              <div className="text-3xl font-black text-green-600">18</div>
              <div className="text-sm text-gray-600">Offene Deals</div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
            <div className="text-center text-gray-600">
              📈 Pipeline-Trend Chart
            </div>
          </div>
        </div>
      ),
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="bg-gray-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Sehen Sie DealFlow in Aktion
          </h2>
          <p className="text-xl text-gray-400">
            Interaktive Demo - Von Login bis Analytics
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          {/* Carousel */}
          <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-white">{slides[currentSlide].title}</h3>
                <span className="text-primary-400 font-mono">{slides[currentSlide].timestamp}</span>
              </div>
              <p className="text-gray-400">{slides[currentSlide].description}</p>
            </div>

            <div className="relative">
              {slides[currentSlide].visual}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={prevSlide}
                className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSlide
                        ? 'bg-primary-500 w-8'
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Timeline markers */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {slides.map((slide, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`text-left p-4 rounded-lg transition-all ${
                  index === currentSlide
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <div className="text-sm font-mono mb-1">{slide.timestamp}</div>
                <div className="text-sm font-semibold">{slide.title}</div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
