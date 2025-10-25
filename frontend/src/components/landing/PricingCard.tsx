import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: PricingFeature[];
  isPopular?: boolean;
  ctaText?: string;
  delay?: number;
}

export const PricingCard = ({
  name,
  price,
  period = '/Nutzer/Monat',
  description,
  features,
  isPopular = false,
  ctaText = 'Kostenlos starten',
  delay = 0,
}: PricingCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`relative bg-white rounded-2xl shadow-lg p-8 ${
        isPopular ? 'border-4 border-primary-500 transform scale-105' : 'border border-gray-200'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary-500 to-primary-700 text-white px-6 py-2 rounded-full text-sm font-bold">
          BELIEBTESTE
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-baseline justify-center">
          <span className="text-5xl font-black text-gray-900">{price}</span>
          {price !== 'Individuell' && (
            <span className="text-gray-600 ml-2">{period}</span>
          )}
        </div>
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${
              feature.included ? 'text-green-500' : 'text-gray-300'
            }`} />
            <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      <Link
        to="/login"
        className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
          isPopular
            ? 'bg-gradient-to-r from-primary-500 to-primary-700 text-white hover:shadow-lg'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}
      >
        {ctaText}
      </Link>

      <p className="text-center text-sm text-gray-500 mt-4">
        14 Tage kostenlos • Keine Kreditkarte • Jederzeit kündbar
      </p>
    </motion.div>
  );
};
