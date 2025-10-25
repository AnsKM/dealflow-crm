import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  visual?: React.ReactNode;
  delay?: number;
}

export const FeatureCard = ({ icon: Icon, title, description, visual, delay = 0 }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 hover:-translate-y-2"
    >
      <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl mb-6">
        <Icon className="w-8 h-8 text-white" />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>

      {visual && (
        <div className="mb-6 rounded-lg overflow-hidden bg-gray-50 p-4">
          {visual}
        </div>
      )}

      <p className="text-lg text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
};
