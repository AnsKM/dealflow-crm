import { motion } from 'framer-motion';
import { Clock, TrendingDown, AlertCircle } from 'lucide-react';

export const ProblemStatement = () => {
  const problems = [
    {
      icon: Clock,
      stat: '20%',
      title: 'der Arbeitszeit',
      description: 'Vertriebsmitarbeiter verschwenden täglich Stunden mit CRM-Admin statt mit Verkaufen',
    },
    {
      icon: TrendingDown,
      stat: '10%',
      title: 'Umsatzverlust',
      description: 'Schlechte Datenqualität und fehlende Insights führen zu verpassten Chancen',
    },
    {
      icon: AlertCircle,
      stat: '30%',
      title: 'Verpasste Follow-ups',
      description: 'Deals sterben in der Pipeline, weil niemand rechtzeitig nachfasst',
    },
  ];

  return (
    <section className="bg-gray-900 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ihr CRM kostet Sie Geld
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Traditionelle CRMs sind zeitfressend, kompliziert und bieten keine echten Insights
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-primary-500 transition-all duration-300"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-red-500 bg-opacity-20 rounded-xl mb-6">
                <problem.icon className="w-8 h-8 text-red-400" />
              </div>

              <div className="text-5xl font-black text-red-400 mb-2">{problem.stat}</div>
              <div className="text-xl font-bold text-white mb-4">{problem.title}</div>
              <p className="text-gray-400 leading-relaxed">{problem.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
