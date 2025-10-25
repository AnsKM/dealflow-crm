import { motion } from 'framer-motion';

interface CompanyLogoProps {
  name: string;
  delay?: number;
}

export const CompanyLogo = ({ name, delay = 0 }: CompanyLogoProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="flex items-center justify-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <span className="text-2xl font-bold text-gray-700">{name}</span>
    </motion.div>
  );
};
