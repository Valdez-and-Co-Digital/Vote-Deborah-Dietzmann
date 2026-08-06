import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary text-on-primary border-t border-heritage-gold">
      <div className="max-w-[1200px] mx-auto px-5 md:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined icon-fill-1 text-heritage-gold text-3xl">gavel</span>
              <span className="text-heritage-gold font-bold uppercase tracking-wider" style={{ fontFamily: '"Libre Caslon Text", serif' }}>
                Deborah Dietzmann
              </span>
            </div>
            <p className="text-inverse-on-surface opacity-70 text-sm leading-relaxed">
              Candidate for Bexar County Court at Law No. 12. Experienced. Fair. Decisive.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/profile.php?id=61582742332373"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-heritage-gold hover:text-on-primary transition-colors text-sm font-bold uppercase tracking-wider"
                aria-label="Deborah Dietzmann on Facebook"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-heritage-gold font-bold uppercase tracking-wider text-xs mb-2">Quick Links</h3>
            {[
              { href: '/about', label: 'Meet Deborah' },
              { href: '/experience', label: 'Legal Experience' },
              { href: '/issues', label: 'Platform & Issues' },
              { href: '/endorsements', label: 'Endorsements' },
              { href: '/volunteer', label: 'Get Involved' },
              { href: '/contact', label: 'Contact' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="text-inverse-on-surface opacity-70 hover:opacity-100 hover:text-heritage-gold transition-colors text-sm">
                {label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h3 className="text-heritage-gold font-bold uppercase tracking-wider text-xs mb-2">Contact the Campaign</h3>
            <a href="mailto:dietzmanncc12@gmail.com" className="flex items-center gap-2 text-inverse-on-surface opacity-70 hover:opacity-100 hover:text-heritage-gold transition-colors text-sm">
              <span className="material-symbols-outlined text-sm">mail</span>
              dietzmanncc12@gmail.com
            </a>
            <div className="flex items-center gap-2 text-inverse-on-surface opacity-70 text-sm">
              <span className="material-symbols-outlined text-sm">location_on</span>
              Bexar County, Texas
            </div>
            <div className="flex items-center gap-2 text-inverse-on-surface opacity-70 text-sm">
              <span className="material-symbols-outlined text-sm">how_to_vote</span>
              Election Day: November 3, 2026
            </div>
            <a
              href="https://www.bexar.org/elections"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-heritage-gold hover:underline text-xs font-bold uppercase tracking-wider mt-1"
            >
              <span className="material-symbols-outlined text-xs">open_in_new</span>
              Check Voter Registration
            </a>
          </div>
        </div>

        <div className="border-t border-on-primary/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-center">
          <div className="flex flex-col gap-1">
            <p className="text-inverse-on-surface opacity-50 text-xs">
              © 2026 Deborah Dietzmann for Judge. All Rights Reserved.
            </p>
            <p className="text-inverse-on-surface opacity-40 text-xs">
              Pol. Adv. Paid for by the Deborah Dietzmann campaign. [Treasurer Name], Treas.
            </p>
          </div>
          <a
            href="https://ballotpedia.org/Deborah_Dietzmann"
            target="_blank"
            rel="noopener noreferrer"
            className="text-inverse-on-surface opacity-40 hover:opacity-70 text-xs transition-opacity"
          >
            Ballotpedia Profile
          </a>
        </div>
      </div>
    </footer>
  );
}
