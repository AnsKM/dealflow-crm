import { motion } from 'framer-motion';
import { Zap, Workflow, Settings, Mail, MessageSquare, Calendar } from 'lucide-react';

export const Integrations = () => {
  const integrations = {
    automation: [
      { name: 'Zapier', category: 'Automation', icon: Zap },
      { name: 'Make.com', category: 'Automation', icon: Workflow },
      { name: 'n8n', category: 'Automation', icon: Settings },
    ],
    communication: [
      { name: 'Gmail', category: 'Email', icon: Mail },
      { name: 'Outlook', category: 'Email', icon: Mail },
      { name: 'Slack', category: 'Chat', icon: MessageSquare },
    ],
    calendar: [
      { name: 'Google Calendar', category: 'Kalender', icon: Calendar },
      { name: 'Outlook Calendar', category: 'Kalender', icon: Calendar },
    ],
  };

  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nahtlos in Ihren Workflow integriert
          </h2>
          <p className="text-xl text-gray-600">
            Verbinden Sie DealFlow mit Ihren Lieblingstools
          </p>
        </motion.div>

        {/* Categories */}
        <div className="space-y-12">
          {/* Automation */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Automation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {integrations.automation.map((integration, index) => {
                const Icon = integration.icon;
                return (
                  <motion.div
                    key={integration.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-gray-50 rounded-xl p-8 text-center hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-center mb-4">
                      <Icon className="w-12 h-12 text-primary-600" />
                    </div>
                    <div className="text-xl font-bold text-gray-900">{integration.name}</div>
                    <div className="text-sm text-gray-600 mt-2">{integration.category}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Communication */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Communication</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {integrations.communication.map((integration, index) => {
                const Icon = integration.icon;
                return (
                  <motion.div
                    key={integration.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-gray-50 rounded-xl p-8 text-center hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-center mb-4">
                      <Icon className="w-12 h-12 text-primary-600" />
                    </div>
                    <div className="text-xl font-bold text-gray-900">{integration.name}</div>
                    <div className="text-sm text-gray-600 mt-2">{integration.category}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Calendar */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Kalender</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {integrations.calendar.map((integration, index) => {
                const Icon = integration.icon;
                return (
                  <motion.div
                    key={integration.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-gray-50 rounded-xl p-8 text-center hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-center mb-4">
                      <Icon className="w-12 h-12 text-primary-600" />
                    </div>
                    <div className="text-xl font-bold text-gray-900">{integration.name}</div>
                    <div className="text-sm text-gray-600 mt-2">{integration.category}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* API CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            API-First Design für eigene Integrationen
          </h3>
          <p className="text-primary-100 text-lg mb-6">
            Verbinden Sie DealFlow mit jedem Tool über unsere REST API
          </p>
          <button className="bg-white text-primary-700 px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-shadow">
            API Dokumentation ansehen
          </button>
        </motion.div>
      </div>
    </section>
  );
};
