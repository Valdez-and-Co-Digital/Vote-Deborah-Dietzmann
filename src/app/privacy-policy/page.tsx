import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Deborah Dietzmann for Judge',
  description: 'Privacy Policy for the Deborah Dietzmann campaign.',
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-surface flex flex-col">
      <Navigation />
      
      <div className="flex-grow pt-32 pb-20 px-5 max-w-[800px] mx-auto w-full">
        <h1 className="text-4xl font-bold text-on-surface mb-8" style={{ fontFamily: '"Libre Caslon Text", serif' }}>
          Privacy Policy
        </h1>
        
        <div className="prose prose-on-surface opacity-80 space-y-6">
          <p>Last updated: August 14, 2026</p>
          
          <h2 className="text-2xl font-bold text-on-surface mt-8 mb-4">1. Information We Collect</h2>
          <p>
            The Deborah Dietzmann Campaign ("we", "our", or "us") collects information that you provide directly to us, such as when you volunteer, donate, sign up for our newsletter, or communicate with us. This information may include your name, email address, phone number, postal address, and any other information you choose to provide.
          </p>

          <h2 className="text-2xl font-bold text-on-surface mt-8 mb-4">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Send you updates about the campaign and upcoming events.</li>
            <li>Process your donations and maintain compliance with campaign finance laws.</li>
            <li>Respond to your comments, questions, and requests.</li>
            <li>Coordinate volunteer efforts.</li>
          </ul>

          <h2 className="text-2xl font-bold text-on-surface mt-8 mb-4">3. Information Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except as required by law (e.g., campaign finance reporting). We may share information with trusted third-party service providers who assist us in operating our website, processing donations, or communicating with you, provided those parties agree to keep this information confidential.
          </p>

          <h2 className="text-2xl font-bold text-on-surface mt-8 mb-4">4. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party sites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
          </p>

          <h2 className="text-2xl font-bold text-on-surface mt-8 mb-4">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:<br />
            <a href="mailto:dietzmanncc12@gmail.com" className="text-primary hover:underline">dietzmanncc12@gmail.com</a>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
