import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import dashboardHero from '../../../assets/dashboard-hero.png';

export const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center px-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-primary-400 opacity-10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-primary-800 opacity-10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto w-full py-20">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Das KI-gesteuerte CRM,<br />
              das Verkäufer lieben
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-xl md:text-2xl text-primary-50 mb-4 max-w-4xl mx-auto leading-relaxed">
              <span className="font-bold text-white">40% weniger Admin-Aufwand.</span>{' '}
              <span className="font-bold text-white">100% mehr Zeit für Verkauf.</span>
            </p>
            <p className="text-lg md:text-xl text-primary-100 mb-12 max-w-3xl mx-auto">
              Automatisches Health-Scoring für jeden Deal. Powered by modernster KI-Technologie.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <Link
              to="/login"
              className="group bg-white text-primary-700 px-8 py-4 rounded-lg text-lg font-bold hover:shadow-2xl transition-all duration-200 flex items-center gap-2 hover:scale-105"
            >
              Kostenlos starten
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-white hover:text-primary-700 transition-all duration-200 flex items-center gap-2">
              <Play className="w-5 h-5" />
              Demo ansehen
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-primary-100 text-sm"
          >
            ✓ Keine Kreditkarte erforderlich • ✓ 14 Tage kostenlos • ✓ Jederzeit kündbar
          </motion.div>

          {/* Hero Visual - Real Dashboard Screenshot */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 max-w-5xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-2 transform perspective-1000 rotate-x-2">
              <img
                src={dashboardHero}
                alt="DealFlow Dashboard mit KI-Insights und Health Scores"
                className="rounded-xl w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
