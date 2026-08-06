import Image from 'next/image';

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary text-on-primary py-20 overflow-hidden">
        <div className="absolute inset-0 patriotic-pattern opacity-30"></div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #00081e, rgba(0,8,30,0.9))' }}></div>
        <div className="relative z-10 max-w-[1200px] mx-auto px-5 md:px-16">
          <div className="text-heritage-gold font-bold text-xs uppercase tracking-widest flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-sm icon-fill-1">star</span>
            Meet the Candidate
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: '"Libre Caslon Text", serif' }}>
            A Lifelong Texan,<br />Dedicated to Justice.
          </h1>
          <div className="w-16 h-1 bg-heritage-gold"></div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-20 px-5 md:px-16 bg-white">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          {/* Photo */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary translate-x-4 translate-y-4 rounded"></div>
            <Image
              src="/headshot-2.jpeg"
              alt="Deborah Dietzmann"
              width={600}
              height={700}
              className="relative z-10 w-full object-cover shadow-xl rounded grayscale-[10%]"
            />
          </div>

          {/* Bio text */}
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3" style={{ fontFamily: '"Libre Caslon Text", serif' }}>
                Born &amp; Raised in San Antonio
              </h2>
              <div className="w-12 h-1 bg-heritage-gold mb-5"></div>
              <p className="text-base text-legal-gray leading-relaxed">
                Deborah Dietzmann was born at <strong className="text-primary">Lackland Air Force Base</strong> in San Antonio, Texas and has been a proud resident of San Antonio for more than 30 years.
              </p>
            </div>

            {/* Education */}
            <div className="border-l-4 border-heritage-gold pl-5 flex flex-col gap-4">
              <h3 className="font-bold text-primary uppercase tracking-wider text-sm">Education</h3>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-heritage-gold text-xl icon-fill-1 flex-shrink-0 mt-0.5">school</span>
                <div>
                  <div className="font-bold text-primary text-sm">Coronado High School</div>
                  <div className="text-legal-gray text-sm">San Antonio, Texas</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-heritage-gold text-xl icon-fill-1 flex-shrink-0 mt-0.5">school</span>
                <div>
                  <div className="font-bold text-primary text-sm">Texas Tech University</div>
                  <div className="text-legal-gray text-sm">B.S. Psychology, minor in English — <em>Magna Cum Laude</em></div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-heritage-gold text-xl icon-fill-1 flex-shrink-0 mt-0.5">gavel</span>
                <div>
                  <div className="font-bold text-primary text-sm">Texas A&amp;M School of Law</div>
                  <div className="text-legal-gray text-sm">Juris Doctor (J.D.) — Member of <em>Phi Delta Phi</em>, International Legal Honor Society</div>
                </div>
              </div>
            </div>

            {/* Quote */}
            <blockquote className="bg-surface-container rounded-xl p-6 border-l-4 border-secondary">
              <p className="text-legal-gray italic text-base leading-relaxed">
                "Dietzmann believes the judiciary must serve the public with integrity, impartiality, and respect for individual rights while strengthening both community safety and public trust."
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Career Timeline */}
      <section className="py-20 px-5 md:px-16 bg-surface-container-low">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3" style={{ fontFamily: '"Libre Caslon Text", serif' }}>25 Years on Both Sides of the Courtroom</h2>
            <div className="w-24 h-1 bg-heritage-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Prosecutor */}
            <div className="bg-white border border-outline-variant rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-heritage-gold text-xl icon-fill-1">policy</span>
              </div>
              <h3 className="font-bold text-primary text-lg" style={{ fontFamily: '"Libre Caslon Text", serif' }}>Assistant District Attorney</h3>
              <p className="text-secondary font-bold text-xs uppercase tracking-wider">Bexar County D.A.'s Office</p>
              <p className="text-legal-gray text-sm leading-relaxed">
                Began her career prosecuting both felony and misdemeanor cases — including drugs, thefts, burglaries, assaults, DWIs, intoxication manslaughter, white-collar crimes, immigration matters, and family violence cases.
              </p>
            </div>

            {/* Private Practice */}
            <div className="bg-white border border-outline-variant rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
              <div className="w-12 h-12 rounded-full bg-heritage-gold flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xl icon-fill-1">balance</span>
              </div>
              <h3 className="font-bold text-primary text-lg" style={{ fontFamily: '"Libre Caslon Text", serif' }}>Private Practitioner</h3>
              <p className="text-heritage-gold font-bold text-xs uppercase tracking-wider">Solo Practice</p>
              <p className="text-legal-gray text-sm leading-relaxed">
                After leaving the D.A.'s Office, Dietzmann opened a private practice and devoted much of her work to <strong>pro bono service</strong> for the community — providing legal help to those who could not otherwise afford representation.
              </p>
            </div>

            {/* Public Defender */}
            <div className="bg-white border border-outline-variant rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xl icon-fill-1">shield</span>
              </div>
              <h3 className="font-bold text-primary text-lg" style={{ fontFamily: '"Libre Caslon Text", serif' }}>Public Defender</h3>
              <p className="text-secondary font-bold text-xs uppercase tracking-wider">Currently Serving</p>
              <p className="text-legal-gray text-sm leading-relaxed">
                Currently serving as a public defender, advocating for the constitutional rights of individuals within the criminal justice system and working toward the betterment of the community as a whole.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Passionate About */}
      <section className="py-20 px-5 md:px-16 bg-primary text-on-primary">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-heritage-gold font-bold text-xs uppercase tracking-widest flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-sm icon-fill-1">favorite</span>
              What She Stands For
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-on-primary mb-6" style={{ fontFamily: '"Libre Caslon Text", serif' }}>
              Community + Courts + Law Enforcement
            </h2>
            <p className="text-base text-inverse-on-surface opacity-90 leading-relaxed">
              Deborah Dietzmann is passionate about public policies that strengthen partnerships between the community, the judiciary, and law enforcement. She believes public safety is best achieved when courts work collaboratively with law enforcement to enforce the law without bias and within the limits of our Constitution.
            </p>
            <p className="text-base text-inverse-on-surface opacity-90 leading-relaxed mt-4">
              Dietzmann values policies that promote accountability, uphold the rule of law, and support officers in safely carrying out their duties.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { icon: 'handshake', label: 'Community Partnerships', desc: 'Strengthening the relationship between courts, citizens, and local organizations.' },
              { icon: 'local_police', label: 'Law Enforcement Support', desc: 'Backing officers who carry out their duties safely and within the Constitution.' },
              { icon: 'account_balance', label: 'Rule of Law', desc: 'Every ruling grounded in law, fact, and the highest ethical standards.' },
              { icon: 'how_to_vote', label: 'Public Trust', desc: 'An accessible, transparent courtroom the community can be proud of.' },
            ].map(({ icon, label, desc }) => (
              <div key={label} className="flex items-start gap-4 bg-on-primary/5 border border-on-primary/10 p-4 rounded-xl">
                <span className="material-symbols-outlined text-2xl text-heritage-gold icon-fill-1 flex-shrink-0 mt-0.5">{icon}</span>
                <div>
                  <div className="font-bold text-on-primary text-sm uppercase tracking-wider">{label}</div>
                  <div className="text-inverse-on-surface opacity-80 text-sm">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
