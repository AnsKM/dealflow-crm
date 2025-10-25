import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  dealValue?: string;
  delay?: number;
}

export const TestimonialCard = ({
  quote,
  author,
  role,
  company,
  dealValue,
  delay = 0,
}: TestimonialCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
    >
      <Quote className="w-12 h-12 text-primary-200 mb-4" />

      {dealValue && (
        <div className="mb-4">
          <span className="inline-block bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold">
            {dealValue} Deal verwaltet
          </span>
        </div>
      )}

      <blockquote className="text-lg text-gray-700 mb-6 leading-relaxed italic">
        "{quote}"
      </blockquote>

      <div className="border-t border-gray-200 pt-4">
        <p className="font-bold text-gray-900">{author}</p>
        <p className="text-gray-600">{role}</p>
        <p className="text-primary-600 font-semibold">{company}</p>
      </div>
    </motion.div>
  );
};
