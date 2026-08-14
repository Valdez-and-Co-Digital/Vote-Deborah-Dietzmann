import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Deborah Dietzmann for Judge',
  description: 'Terms of Service for the Deborah Dietzmann campaign.',
};

export default function TermsOfService() {
  return (
    <div className="bg-surface-container-lowest pt-32 pb-20 px-5 flex-grow w-full">
      <div className="max-w-[900px] mx-auto w-full">
        
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2" style={{ fontFamily: '"Libre Caslon Text", serif' }}>
          Terms of Service
        </h1>
        <p className="text-legal-gray text-sm mb-8">Last Updated: October 24, 2024</p>
        <div className="w-full h-px bg-outline-variant opacity-50 mb-12"></div>
        
        <div className="bg-neutral-white border border-outline-variant shadow-sm p-8 md:p-14">
          <div className="prose prose-on-surface opacity-90 max-w-none text-sm md:text-base leading-relaxed">
            <p className="mb-4">
              Welcome to the Deborah Dietzmann Campaign website. Please read these Terms of Service completely using deborahdietzmann.com which is owned and operated by the Deborah Dietzmann Campaign. This Agreement documents the legally binding terms and conditions attached to the use of the Site at deborahdietzmann.com.
            </p>
            <p className="mb-8">
              By using or accessing the Site in any way, viewing or browsing the Site, or adding your own content to the Site, you are agreeing to be bound by these Terms of Service.
            </p>

            <h2 className="text-2xl font-bold text-primary flex items-center gap-2 mt-8 mb-4" style={{ fontFamily: '"Libre Caslon Text", serif' }}>
              <span className="material-symbols-outlined text-heritage-gold">gavel</span>
              Acceptance of Terms
            </h2>
            <p className="mb-8">
              By accessing our website, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree with any part of these Terms, you must not use our website.
            </p>

            <h2 className="text-2xl font-bold text-primary flex items-center gap-2 mt-8 mb-4" style={{ fontFamily: '"Libre Caslon Text", serif' }}>
              <span className="material-symbols-outlined text-heritage-gold">shield</span>
              User Conduct
            </h2>
            <p className="mb-4">
              You agree to use the website only for lawful purposes. You agree not to take any action that might compromise the security of the website, render the website inaccessible to others or otherwise cause damage to the website or its content. You specifically agree to the following guidelines:
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

            <h2 className="text-2xl font-bold text-primary flex items-center gap-2 mt-8 mb-4" style={{ fontFamily: '"Libre Caslon Text", serif' }}>
              <span className="material-symbols-outlined text-heritage-gold">copyright</span>
              Intellectual Property
            </h2>
            <p className="mb-8">
              The Site and all of its original content are the sole property of the Deborah Dietzmann Campaign and are, as such, fully protected by the appropriate international copyright and other intellectual property rights laws. Campaign logos, photographs, and text may only be used with explicit written permission from the Campaign.
            </p>

            <h2 className="text-2xl font-bold text-primary flex items-center gap-2 mt-8 mb-4" style={{ fontFamily: '"Libre Caslon Text", serif' }}>
              <span className="material-symbols-outlined text-heritage-gold">warning</span>
              Disclaimers
            </h2>
            <div className="bg-surface-container-low p-6 rounded text-sm italic mb-8 border border-outline-variant/30">
              <p>
                The information provided on this website is for general informational purposes related to the political campaign of Deborah Dietzmann. It does not constitute legal advice. While we strive to keep the information up to date and correct, we make no representations or warranties of any kind about the completeness, accuracy, reliability, suitability or availability with respect to the website.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
