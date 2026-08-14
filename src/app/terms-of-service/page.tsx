import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Deborah Dietzmann for Judge',
  description: 'Terms of Service for the Deborah Dietzmann campaign.',
};

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-surface flex flex-col">
      <Navigation />
      
      <div className="flex-grow pt-32 pb-20 px-5 max-w-[800px] mx-auto w-full">
        <h1 className="text-4xl font-bold text-on-surface mb-8" style={{ fontFamily: '"Libre Caslon Text", serif' }}>
          Terms of Service
        </h1>
        
        <div className="prose prose-on-surface opacity-80 space-y-6">
          <p>Last updated: August 14, 2026</p>
          
          <h2 className="text-2xl font-bold text-on-surface mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.
          </p>

          <h2 className="text-2xl font-bold text-on-surface mt-8 mb-4">2. Use of the Site</h2>
          <p>
            This website is provided for informational purposes regarding the Deborah Dietzmann campaign. You agree to use the site only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website.
          </p>

          <h2 className="text-2xl font-bold text-on-surface mt-8 mb-4">3. Donations</h2>
          <p>
            All donations made through this website are final and subject to campaign finance laws. By making a donation, you confirm that your contribution is made from your own funds and complies with all applicable election regulations.
          </p>

          <h2 className="text-2xl font-bold text-on-surface mt-8 mb-4">4. Intellectual Property</h2>
          <p>
            All content on this website, including text, graphics, logos, and images, is the property of the Deborah Dietzmann Campaign or its content suppliers and is protected by intellectual property laws.
          </p>

          <h2 className="text-2xl font-bold text-on-surface mt-8 mb-4">5. Disclaimer of Warranties</h2>
          <p>
            The information provided on this website is provided "as is" without any representations or warranties, express or implied. The campaign makes no representations or warranties in relation to the website or the information and materials provided on it.
          </p>

          <h2 className="text-2xl font-bold text-on-surface mt-8 mb-4">6. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms from time to time at our sole discretion. Therefore, you should review these pages periodically.
          </p>

          <h2 className="text-2xl font-bold text-on-surface mt-8 mb-4">7. Contact Us</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at:<br />
            <a href="mailto:dietzmanncc12@gmail.com" className="text-primary hover:underline">dietzmanncc12@gmail.com</a>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
