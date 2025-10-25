import { Hero } from './Landing/sections/Hero';
import { TrustBanner } from './Landing/sections/TrustBanner';
import { ProblemStatement } from './Landing/sections/ProblemStatement';
import { SolutionFeatures } from './Landing/sections/SolutionFeatures';
import { AIShowcase } from './Landing/sections/AIShowcase';
import { ComparisonTable } from './Landing/sections/ComparisonTable';
import { ProductDemo } from './Landing/sections/ProductDemo';
import { Integrations } from './Landing/sections/Integrations';
import { Pricing } from './Landing/sections/Pricing';
import { Testimonials } from './Landing/sections/Testimonials';
import { FAQ } from './Landing/sections/FAQ';
import { FinalCTA } from './Landing/sections/FinalCTA';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Section 1: Hero */}
      <Hero />

      {/* Section 2: Trust Banner */}
      <TrustBanner />

      {/* Section 3: Problem Statement */}
      <ProblemStatement />

      {/* Section 4: Solution Features */}
      <SolutionFeatures />

      {/* Section 5: AI Showcase */}
      <AIShowcase />

      {/* Section 6: Comparison Table */}
      <ComparisonTable />

      {/* Section 7: Product Demo */}
      <ProductDemo />

      {/* Section 8: Integrations */}
      <Integrations />

      {/* Section 9: Pricing */}
      <Pricing />

      {/* Section 10: Testimonials */}
      <Testimonials />

      {/* Section 11: FAQ */}
      <FAQ />

      {/* Section 12: Final CTA */}
      <FinalCTA />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">DealFlow</h3>
              <p className="text-gray-400">
                Das KI-gesteuerte CRM für deutsche B2B-Teams
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Produkt</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Preise</a></li>
                <li><a href="#integrations" className="hover:text-white transition-colors">Integrationen</a></li>
                <li><a href="#api" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Unternehmen</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">Über uns</a></li>
                <li><a href="#blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#careers" className="hover:text-white transition-colors">Karriere</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Kontakt</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Rechtliches</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#privacy" className="hover:text-white transition-colors">Datenschutz</a></li>
                <li><a href="#terms" className="hover:text-white transition-colors">AGB</a></li>
                <li><a href="#imprint" className="hover:text-white transition-colors">Impressum</a></li>
                <li><a href="#dsgvo" className="hover:text-white transition-colors">DSGVO</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 DealFlow GmbH. Alle Rechte vorbehalten.
            </p>
            <div className="flex gap-6">
              <a href="#linkedin" className="text-gray-400 hover:text-white transition-colors">
                LinkedIn
              </a>
              <a href="#twitter" className="text-gray-400 hover:text-white transition-colors">
                Twitter
              </a>
              <a href="#github" className="text-gray-400 hover:text-white transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
