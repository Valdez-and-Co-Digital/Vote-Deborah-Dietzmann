import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Deborah Dietzmann for Judge',
  description: 'Terms of Service for the Deborah Dietzmann campaign.',
};

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-surface-container-lowest flex flex-col">
      <Navigation />
      
      <div className="flex-grow pt-32 pb-20 px-5 max-w-[900px] mx-auto w-full">
        
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2" style={{ fontFamily: '"Libre Caslon Text", serif' }}>
          Terms of Service
        </h1>
        <p className="text-legal-gray text-sm mb-8">Last Updated: October 24, 2024</p>
        <div className="w-full h-px bg-outline-variant opacity-50 mb-12"></div>
        
        <div className="bg-neutral-white border border-outline-variant shadow-sm p-8 md:p-14">
          <div className="prose prose-on-surface opacity-90 max-w-none text-sm md:text-base leading-relaxed">
            
            <div className="flex items-center gap-3 mt-4 mb-4">
              <span className="material-symbols-outlined text-heritage-gold icon-fill-1 text-2xl">gavel</span>
              <h2 className="text-2xl font-bold text-primary !m-0" style={{ fontFamily: '"Libre Caslon Text", serif' }}>Acceptance of Terms</h2>
            </div>
            <p className="mb-4">
              By accessing and using the Deborah Dietzmann campaign website (the "Site"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>
            <p className="mb-10">
              Any participation in this service will constitute acceptance of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>

            <div className="flex items-center gap-3 mt-10 mb-4">
              <span className="material-symbols-outlined text-heritage-gold icon-fill-1 text-2xl">verified_user</span>
              <h2 className="text-2xl font-bold text-primary !m-0" style={{ fontFamily: '"Libre Caslon Text", serif' }}>User Conduct</h2>
            </div>
            <p className="mb-4">
              You agree to use the Site only for lawful purposes. You agree not to take any action that might compromise the security of the Site, render the Site inaccessible to others or otherwise cause damage to the Site or the Content. You agree not to add to, subtract from, or otherwise modify the Content, or to attempt to access any Content that is not intended for you.
            </p>
            <ul className="space-y-3 mb-10 pl-2 border-l-2 border-heritage-gold/30 ml-2">
              {[
                "Respectful discourse in any interactive forums or submission forms.",
                "No distribution of malicious software or automated scripts.",
                "Compliance with all applicable local, state, and federal laws regarding political contributions and online conduct."
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-lg flex-shrink-0 mt-0.5">check_circle</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3 mt-10 mb-4">
              <span className="material-symbols-outlined text-heritage-gold icon-fill-1 text-2xl">copyright</span>
              <h2 className="text-2xl font-bold text-primary !m-0" style={{ fontFamily: '"Libre Caslon Text", serif' }}>Intellectual Property</h2>
            </div>
            <p className="mb-4">
              The Site and its original content, features, and functionality are owned by the Deborah Dietzmann campaign and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
            </p>
            <p className="mb-10">
              You may not copy, reproduce, distribute, publish, display, perform, modify, create derivative works, transmit, or in any way exploit any such content, nor may you distribute any part of this content over any network, including a local area network, sell or offer it for sale, or use such content to construct any kind of database.
            </p>

            <div className="flex items-center gap-3 mt-10 mb-4">
              <span className="material-symbols-outlined text-heritage-gold icon-fill-1 text-2xl">warning</span>
              <h2 className="text-2xl font-bold text-primary !m-0" style={{ fontFamily: '"Libre Caslon Text", serif' }}>Disclaimers</h2>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-lg mb-10">
              <p className="mb-4">
                This Site is provided on an "as is" and "as available" basis. The campaign makes no representations or warranties of any kind, express or implied, as to the operation of this site or the information, content, materials, or products included on this site.
              </p>
              <p className="mb-0">
                To the full extent permissible by applicable law, the campaign disclaims all warranties, express or implied, including, but not limited to, implied warranties of merchantability and fitness for a particular purpose.
              </p>
            </div>
            
            <div className="w-full h-px bg-outline-variant my-8"></div>
            
            <p className="text-center text-sm">
              Questions about these terms? <strong className="text-primary font-bold">Contact our campaign team.</strong>
            </p>
            
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
