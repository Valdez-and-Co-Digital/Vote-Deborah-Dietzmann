import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Deborah Dietzmann for Judge',
  description: 'Privacy Policy for the Deborah Dietzmann campaign.',
};

export default function PrivacyPolicy() {
  return (
    <div className="bg-surface-container-lowest pt-32 pb-20 px-5 flex-grow w-full">
      <div className="max-w-[900px] mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2" style={{ fontFamily: '"Libre Caslon Text", serif' }}>
          Privacy Policy
        </h1>
        <p className="text-legal-gray text-sm mb-8">Last Updated: October 26, 2023</p>

        <div className="w-full h-px bg-outline-variant opacity-50 mb-12"></div>

        <div className="bg-neutral-white border border-outline-variant shadow-sm p-8 md:p-14">
          <div className="prose prose-on-surface opacity-90 max-w-none text-sm md:text-base leading-relaxed">
            <p className="mb-4">
              The Deborah Dietzmann Campaign ("we", "us", or "our") operates this website. This Privacy Policy informs you of our policies regarding the collection, use, and disclosure of personal data when you use our website and the choices you have associated with that data.
            </p>
            <p className="mb-8">
              We use your data to provide and improve the Campaign's services and communications. By using the website, you agree to the collection and use of information in accordance with this policy.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-8 mb-4" style={{ fontFamily: '"Libre Caslon Text", serif' }}>Information We Collect</h2>
            <p className="mb-4">
              We collect several different types of information for various purposes to provide and improve our service to you.
            </p>

            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mt-6 mb-2">Personal Data</h3>
            <p className="mb-4">
              While using our website, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-6 text-legal-gray">
              <li>Email address</li>
              <li>First name and last name</li>
              <li>Phone number</li>
              <li>Address, State, Province, ZIP/Postal code, City</li>
              <li>Cookies and Usage Data</li>
            </ul>

            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mt-6 mb-2">Usage Data</h3>
            <p className="mb-8">
              We may also collect information how the website is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our website that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-8 mb-4" style={{ fontFamily: '"Libre Caslon Text", serif' }}>How We Use Your Information</h2>
            <p className="mb-4">
              The Deborah Dietzmann Campaign uses the collected data for various purposes:
            </p>
            <ul className="space-y-4 mb-8">
              {[
                "To provide and maintain our website and campaign communications.",
                "To notify you about changes to our campaign or events.",
                "To allow you to participate in interactive features of our website when you choose to do so.",
                "To provide supporter care and response.",
                "To gather analysis or valuable information so that we can improve our outreach."
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-xl flex-shrink-0">check_circle</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-bold text-primary mt-8 mb-4" style={{ fontFamily: '"Libre Caslon Text", serif' }}>Analytics and Tracking</h2>
            <p className="mb-4">
              We use Google Analytics to monitor and analyze the use of our service. Google Analytics is a web analytics service offered by Google that tracks and reports website traffic.
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-8 text-legal-gray">
              <li><strong>What data we collect:</strong> We collect usage data such as your device type, operating system, general location (on a region or city level), and browsing behavior across our site.</li>
              <li><strong>Why we collect it:</strong> This information is used solely for understanding our traffic, improving website performance, and enhancing our campaign's digital outreach efforts.</li>
              <li><strong>How you can opt out:</strong> You have the right to opt out of tracking. You can decline analytical cookies via our cookie consent banner upon your first visit. Additionally, you can install the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline font-medium">Google Analytics Opt-out Browser Add-on</a> to prevent your data from being collected by Google Analytics.</li>
            </ul>

            <h2 className="text-2xl font-bold text-primary mt-8 mb-4" style={{ fontFamily: '"Libre Caslon Text", serif' }}>Security of Data</h2>
            <p className="mb-8">
              The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security. We employ standard institutional security practices to safeguard information collected during our campaign operations.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-8 mb-4" style={{ fontFamily: '"Libre Caslon Text", serif' }}>Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>

            <div className="bg-surface-container-low p-6 rounded mt-6">
              <div className="flex flex-col gap-3">
                <a href="mailto:info@deborahdietzmann.com" className="flex items-center gap-3 text-primary hover:text-secondary transition-colors">
                  <span className="material-symbols-outlined text-legal-gray">mail</span>
                  dietzmanncc12@gmail.com
                </a>
                <div className="flex items-center gap-3 text-on-surface opacity-80">
                  <span className="material-symbols-outlined text-legal-gray">location_on</span>
                  P.O. Box 12345, Local City, TX 75000
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
