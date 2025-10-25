import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import dashboardOverview from '../../../assets/dashboard-mockup-hero.png';
import dealsList from '../../../assets/deals-list.png';
import dealDetail from '../../../assets/deal-detail.png';
import analytics from '../../../assets/analytics.png';

export const ProductDemo = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Dashboard Übersicht',
      description: 'Alle wichtigen Metriken auf einen Blick',
      timestamp: '0:00',
      visual: (
        <div className="rounded-lg overflow-hidden shadow-xl">
          <img
            src={dashboardOverview}
            alt="DealFlow Dashboard mit KI-Insights und Health Scores"
            className="w-full h-auto"
          />
        </div>
      ),
    },
    {
      title: 'Deal-Liste mit Health Scores',
      description: 'Sofort erkennen, wo Handlungsbedarf besteht',
      timestamp: '0:15',
      visual: (
        <div className="rounded-lg overflow-hidden shadow-xl">
          <img
            src={dealsList}
            alt="Deal Pipeline mit automatischen Health Scores"
            className="w-full h-auto"
          />
        </div>
      ),
    },
    {
      title: 'Deal-Detail mit KI-Empfehlungen',
      description: 'Intelligente Next Actions für jeden Deal',
      timestamp: '0:30',
      visual: (
        <div className="rounded-lg overflow-hidden shadow-xl">
          <img
            src={dealDetail}
            alt="Deal-Detailansicht mit KI-generierten Empfehlungen"
            className="w-full h-auto"
          />
        </div>
      ),
    },
    {
      title: 'Analytics & Charts',
      description: 'Automatische Insights ohne manuelle Berechnung',
      timestamp: '0:45',
      visual: (
        <div className="rounded-lg overflow-hidden shadow-xl">
          <img
            src={analytics}
            alt="Analytics Dashboard mit Pipeline-Insights"
            className="w-full h-auto"
          />
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
