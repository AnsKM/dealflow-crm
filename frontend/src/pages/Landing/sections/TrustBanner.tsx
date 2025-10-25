import { motion } from 'framer-motion';
import { CompanyLogo } from '../../../components/landing/CompanyLogo';
import { StatBadge } from '../../../components/landing/StatBadge';

export const TrustBanner = () => {
  const companies = ['VW', 'SAP', 'BMW', 'Deutsche Bank', 'Siemens'];

  return (
    <section className="bg-gray-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Für deutsche B2B-Teams gebaut
          </h2>
          <p className="text-lg text-gray-600">
            DSGVO-konform • Deutscher Support • Sofort einsatzbereit
          </p>
        </motion.div>

        {/* Company Logos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16">
          {companies.map((company, index) => (
            <CompanyLogo key={company} name={company} delay={index * 0.1} />
          ))}
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatBadge value="€6.9M+" label="Pipeline Value verwaltet" animated />
            <StatBadge value="28+" label="Deals im System" animated />
            <StatBadge value="95%" label="Health Score Genauigkeit" animated />
          </div>
        </div>
      </div>
    </section>
  );
};
