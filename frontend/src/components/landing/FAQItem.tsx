import { Disclosure } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface FAQItemProps {
  question: string;
  answer: string;
  delay?: number;
}

export const FAQItem = ({ question, answer, delay = 0 }: FAQItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
    >
      <Disclosure>
        {({ open }) => (
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 mb-4">
            <Disclosure.Button className="flex justify-between items-center w-full px-6 py-5 text-left">
              <span className="text-lg font-semibold text-gray-900">{question}</span>
              <ChevronDown
                className={`w-5 h-5 text-primary-500 transition-transform duration-200 ${
                  open ? 'transform rotate-180' : ''
                }`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-6 pb-5 text-gray-600 leading-relaxed">
              {answer}
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>
    </motion.div>
  );
};
