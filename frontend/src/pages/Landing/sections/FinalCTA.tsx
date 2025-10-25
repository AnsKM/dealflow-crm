import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';

export const FinalCTA = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 py-32 px-4 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-1/2 -right-1/4 w-full h-full bg-primary-500 opacity-10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.3, 1, 1.3],
            rotate: [0, -180, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-1/2 -left-1/4 w-full h-full bg-primary-900 opacity-10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Bereit, weniger zu tippen<br />
            und mehr zu verkaufen?
          </h2>
          <p className="text-xl md:text-2xl text-primary-100 mb-12 max-w-3xl mx-auto">
            Schließen Sie sich über 100 deutschen Vertriebsteams an,<br />
            die mit DealFlow mehr Deals in weniger Zeit abschließen
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8"
        >
          <Link
            to="/login"
            className="group bg-white text-primary-700 px-10 py-5 rounded-xl text-xl font-bold hover:shadow-2xl transition-all duration-200 flex items-center gap-3 hover:scale-105"
          >
            Kostenlos starten
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>

          <button className="bg-transparent border-2 border-white text-white px-10 py-5 rounded-xl text-xl font-bold hover:bg-white hover:text-primary-700 transition-all duration-200 flex items-center gap-3">
            <Calendar className="w-6 h-6" />
            Persönliche Demo buchen
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-3"
        >
          <p className="text-primary-100 text-lg">
            Über 100 deutsche Vertriebsteams vertrauen DealFlow
          </p>
          <p className="text-primary-200 text-sm">
            ✓ Keine Kreditkarte erforderlich • ✓ 14 Tage kostenlos • ✓ Jederzeit kündbar
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
            <div className="text-4xl font-black text-white mb-2">40%</div>
            <div className="text-primary-100">Weniger Admin-Zeit</div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
            <div className="text-4xl font-black text-white mb-2">5 Min</div>
            <div className="text-primary-100">Setup-Zeit</div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
            <div className="text-4xl font-black text-white mb-2">€29</div>
            <div className="text-primary-100">Pro Nutzer/Monat</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
