import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  // Fetch next 3 upcoming events
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true })
    .limit(3);

  if (error) {
    console.error('Error fetching events:', error);
  }
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-primary overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-cover bg-center opacity-40 patriotic-pattern"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-transparent"></div>
        </div>
        <div className="relative z-10 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-2 gap-y-8 md:gap-gutter items-center">
          <div className="contents md:flex md:flex-col md:gap-stack-lg">
            <div className="space-y-4 order-1 pt-12 md:pt-0 text-center md:text-left">
              <div className="flex justify-center md:justify-start mb-6 md:mb-4">
                <h2 className="bg-heritage-gold text-primary font-bold text-xs md:text-sm uppercase tracking-widest px-4 py-2 rounded flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">how_to_vote</span>
                  For Judge County Court 12
                </h2>
              </div>
              <h1 className="font-headline-display text-5xl md:text-headline-display text-on-primary uppercase leading-tight drop-shadow-md">
                Vote <br className="hidden md:block"/>
                <span className="text-heritage-gold">Deborah</span> <br/>
                Dietzmann
              </h1>
              <p className="font-body-lg text-lg md:text-xl text-inverse-on-surface opacity-90 max-w-xl mx-auto md:mx-0">
                Over 25 years of criminal trial experience, dedicated to keeping Bexar County safe while preserving the rights of its citizens.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 order-3 md:order-2 pb-12 md:pb-0 justify-center md:justify-start w-full">
              <Link href="/volunteer" className="bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary font-label-bold text-label-bold uppercase px-8 py-4 rounded shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
                <span>Get Involved</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <Link href="/issues" className="border border-on-primary hover:border-heritage-gold text-on-primary hover:text-heritage-gold font-label-bold text-label-bold uppercase px-8 py-4 rounded transition-all duration-200 text-center">
                Read Platform
              </Link>
            </div>
          </div>
          <div className="order-2 md:order-none flex justify-center md:justify-end relative h-[400px] md:h-[600px] w-full">
            <div className="relative w-[300px] md:w-[450px] h-[400px] md:h-[600px]">
              <Image 
                src="/headshot-1.jpeg" 
                alt="Deborah Dietzmann Portrait" 
                width={500}
                height={700}
                className="absolute bottom-0 w-full object-contain z-10 drop-shadow-2xl h-[120%] object-bottom" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Voter Registration Urgency Banner */}
      <section className="bg-secondary text-on-secondary py-4 px-5 md:px-16">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl icon-fill-1 flex-shrink-0">campaign</span>
            <p className="font-bold text-sm uppercase tracking-wider">
              <span className="opacity-80">Election Day:</span> <strong>November 3, 2026</strong>
              <span className="mx-3 opacity-40">|</span>
              <span className="opacity-80">Voter Reg Deadline:</span> <strong>October 5, 2026</strong>
            </p>
          </div>
          <a
            href="https://www.bexar.org/elections"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 bg-on-secondary text-secondary font-bold text-xs px-5 py-2 rounded hover:opacity-90 transition-opacity uppercase tracking-wider whitespace-nowrap"
          >
            Check Your Registration →
          </a>
        </div>
      </section>

      {/* Ballotpedia Section */}
      <section className="py-12 px-5 md:px-16 bg-surface-container-lowest">
        <div className="max-w-[1200px] mx-auto bg-primary text-on-primary rounded-2xl shadow-xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
             <span className="material-symbols-outlined text-[150px] icon-fill-1">history_edu</span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10 w-full md:w-auto text-center md:text-left">
            <div className="w-20 h-20 bg-heritage-gold rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="material-symbols-outlined text-4xl text-primary icon-fill-1">menu_book</span>
            </div>
            <div>
              <h3 className="font-headline-md text-3xl font-bold mb-2 text-heritage-gold" style={{ fontFamily: '"Libre Caslon Text", serif' }}>
                Research on Ballotpedia
              </h3>
              <p className="text-inverse-on-surface opacity-90 text-body-lg max-w-2xl">
                An informed voter is our best asset. Learn more about Deborah's qualifications, experience, and the race for County Court 12 on Ballotpedia.
              </p>
            </div>
          </div>
          <a
            href="https://ballotpedia.org/Deborah_Dietzmann"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 bg-heritage-gold hover:opacity-90 text-primary font-bold px-8 py-4 rounded-lg shadow-md transition-all uppercase tracking-wider text-sm flex items-center justify-center gap-2 relative z-10 w-full md:w-auto"
          >
            View Candidate Profile
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </a>
        </div>
      </section>

      {/* Experience Section (Bento Grid) */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto bg-surface-container-lowest">
        <div className="text-center mb-10">
          <h2 className="font-extrabold text-4xl md:text-5xl lg:text-6xl text-primary mb-4 tracking-tight">Unmatched Legal Experience</h2>
          <div className="w-24 h-1 bg-heritage-gold mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-primary text-on-primary rounded-xl p-8 relative overflow-hidden flex flex-col justify-end shadow-md border border-legal-gray group hover:shadow-lg transition-shadow min-h-[220px]">
            <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 opacity-10 group-hover:opacity-20 transition-all duration-300 transform group-hover:scale-105 group-hover:-rotate-12 pointer-events-none">
              <span className="material-symbols-outlined text-[180px] icon-fill-1">gavel</span>
            </div>
            <div className="relative z-10 mt-auto">
              <h3 className="font-headline-display text-4xl md:text-5xl text-heritage-gold mb-2">25+ Years</h3>
              <p className="font-body-lg text-body-lg text-inverse-on-surface">Of dedicated criminal trial experience serving the community.</p>
            </div>
          </div>
          
          <div className="bg-surface text-on-surface rounded-xl p-8 flex flex-col justify-center shadow-md border border-legal-gray min-h-[220px]">
            <span className="material-symbols-outlined text-4xl text-secondary mb-3">balance</span>
            <h3 className="font-headline-display text-3xl md:text-4xl text-primary font-bold mb-2">1,000s</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">Cases litigated as both Prosecutor and Defense Attorney.</p>
          </div>
          
          <div className="bg-surface text-on-surface rounded-xl p-8 shadow-md border border-legal-gray flex flex-col justify-end min-h-[220px]">
            <span className="material-symbols-outlined text-5xl text-heritage-gold mb-4">home</span>
            <div>
              <h3 className="font-headline-display text-3xl md:text-4xl text-primary font-bold mb-2">30+ Years</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Proudly calling San Antonio home. A lifelong Texan.</p>
            </div>
          </div>
          
          <div className="md:col-span-2 bg-surface text-on-surface rounded-xl p-8 shadow-md border border-legal-gray flex flex-col justify-center min-h-[220px]">
            <h3 className="font-headline-display text-3xl md:text-4xl text-primary font-bold mb-3">Comprehensive Expertise</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Experienced in both felony and misdemeanor level cases encompassing violent and serious offenses ranging from Intoxication Manslaughter and White-Collar crimes to DWI, Drug Offenses, Burglaries, Theft, Assaults, and Immigration Matters.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-section-gap relative overflow-hidden bg-primary text-on-primary">
        <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay hero-pattern"></div>
        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-heritage-gold mb-4">Core Values</h2>
            <p className="font-body-lg text-body-lg text-inverse-on-surface max-w-2xl mx-auto">Determined to ensure that justice is both swift and fair.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            <div className="bg-on-primary/5 backdrop-blur-md border border-on-primary/10 rounded-xl p-8 hover:bg-on-primary/10 transition-colors">
              <div className="w-12 h-12 rounded-full bg-heritage-gold/20 flex items-center justify-center mb-6 text-heritage-gold">
                <span className="material-symbols-outlined text-2xl icon-fill-1">done_all</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-primary mb-3">Decisive &amp; Results-Driven</h3>
              <p className="font-body-md text-body-md text-inverse-on-surface opacity-90">Committed to clear, firm rulings based on a deep understanding of the law and a history of effective trial execution.</p>
            </div>
            <div className="bg-on-primary/5 backdrop-blur-md border border-on-primary/10 rounded-xl p-8 hover:bg-on-primary/10 transition-colors">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-6 text-secondary">
                <span className="material-symbols-outlined text-2xl icon-fill-1">shield</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-primary mb-3">Protecting Citizens</h3>
              <p className="font-body-md text-body-md text-inverse-on-surface opacity-90">Dedicated to keeping Bexar County safe while vigorously preserving the constitutional rights of every individual.</p>
            </div>
            <div className="bg-on-primary/5 backdrop-blur-md border border-on-primary/10 rounded-xl p-8 hover:bg-on-primary/10 transition-colors md:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 rounded-full bg-primary-fixed-dim/20 flex items-center justify-center mb-6 text-primary-fixed-dim">
                <span className="material-symbols-outlined text-2xl icon-fill-1">scale</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-primary mb-3">Swift &amp; Fair Justice</h3>
              <p className="font-body-md text-body-md text-inverse-on-surface opacity-90">Ensuring the courts operate efficiently without compromising the integrity or fairness of the judicial process.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-extrabold text-4xl md:text-5xl lg:text-6xl text-primary mb-4 tracking-tight">Upcoming Events</h2>
            <div className="w-24 h-1 bg-heritage-gold mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {!events || events.length === 0 ? (
              <div className="col-span-3 text-center py-8 text-legal-gray">
                No upcoming events scheduled right now.
              </div>
            ) : (
              events.map((event) => {
                const dateObj = new Date(event.date);
                const monthShort = dateObj.toLocaleDateString('en-US', { month: 'short', timeZone: 'America/Chicago' });
                const day = dateObj.toLocaleDateString('en-US', { day: 'numeric', timeZone: 'America/Chicago' });
                const timeFormatted = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Chicago' });
                const endTimeFormatted = event.end_time 
                  ? new Date(event.end_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Chicago' })
                  : null;

                return (
                  <div key={event.id} className="bg-white rounded-xl shadow-md border border-outline-variant p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
                    <div className="flex gap-4 items-start mb-6">
                      <div className="bg-primary text-on-primary rounded-lg text-center flex flex-col overflow-hidden w-[72px] min-w-[72px] flex-shrink-0">
                        <span className="text-[11px] font-bold uppercase tracking-wider bg-primary/80 text-on-primary py-1">{monthShort}</span>
                        <span className="text-2xl font-bold py-1.5">{day}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-headline-sm text-headline-sm text-primary leading-tight mt-1 break-words">{event.title}</h3>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 mb-6">
                      <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        <span>{timeFormatted} {endTimeFormatted ? `- ${endTimeFormatted}` : ''}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                          <span className="material-symbols-outlined text-sm">location_on</span>
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                    <Link href="/events" className="text-secondary font-bold text-xs uppercase tracking-wider hover:text-secondary-container transition-colors">
                      View Details
                    </Link>
                  </div>
                );
              })
            )}
          </div>
          
          <div className="mt-10 text-center">
            <Link href="/events" className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary font-bold text-xs uppercase tracking-widest px-8 py-3 rounded hover:bg-primary hover:text-on-primary transition-all duration-200">
              View All Events <span className="material-symbols-outlined text-sm">calendar_month</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Voter Registration Full Section */}
      <section className="py-20 px-5 md:px-16 bg-surface-container-low border-t border-outline-variant">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Key Dates */}
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3" style={{ fontFamily: '"Libre Caslon Text", serif' }}>
                  Your Vote <span className="text-secondary">Matters.</span>
                </h2>
                <div className="w-16 h-1 bg-heritage-gold mb-5"></div>
                <p className="text-legal-gray text-base leading-relaxed">
                  Make sure you're registered and ready. Every vote in Bexar County counts — especially for local judicial races that directly impact your community.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4 bg-white border-l-4 border-heritage-gold p-4 rounded-r-xl shadow-sm">
                  <span className="material-symbols-outlined text-3xl text-heritage-gold icon-fill-1 flex-shrink-0">event</span>
                  <div>
                    <div className="font-bold text-primary text-sm uppercase tracking-wider">Voter Registration Deadline</div>
                    <div className="text-2xl font-bold text-secondary" style={{ fontFamily: '"Libre Caslon Text", serif' }}>October 5, 2026</div>
                    <div className="text-legal-gray text-xs">Last day to register or update name/address</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white border-l-4 border-primary p-4 rounded-r-xl shadow-sm">
                  <span className="material-symbols-outlined text-3xl text-primary icon-fill-1 flex-shrink-0">how_to_vote</span>
                  <div>
                    <div className="font-bold text-primary text-sm uppercase tracking-wider">Election Day</div>
                    <div className="text-2xl font-bold text-primary" style={{ fontFamily: '"Libre Caslon Text", serif' }}>November 3, 2026</div>
                    <div className="text-legal-gray text-xs">Bexar County Court at Law No. 12 — Vote Dietzmann</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white border-l-4 border-outline-variant p-4 rounded-r-xl shadow-sm">
                  <span className="material-symbols-outlined text-3xl text-legal-gray icon-fill-1 flex-shrink-0">phone</span>
                  <div>
                    <div className="font-bold text-primary text-sm uppercase tracking-wider">Bexar County Elections</div>
                    <div className="text-base font-bold text-legal-gray">210-335-VOTE (8683)</div>
                    <div className="text-legal-gray text-xs">For questions about registration or polling locations</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Box */}
            <div className="bg-primary text-on-primary rounded-2xl p-8 md:p-10 flex flex-col gap-6 shadow-xl">
              <div className="text-center">
                <span className="material-symbols-outlined text-6xl text-heritage-gold icon-fill-1">how_to_vote</span>
                <h3 className="text-xl md:text-2xl font-bold text-on-primary mt-3" style={{ fontFamily: '"Libre Caslon Text", serif' }}>
                  Are You Registered?
                </h3>
                <p className="text-inverse-on-surface opacity-80 text-sm mt-2">
                  Confirm your registration status before the October 5th deadline.
                </p>
              </div>
              <a
                href="https://www.bexar.org/elections"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-heritage-gold hover:opacity-90 text-primary font-bold text-sm px-6 py-4 rounded shadow-md transition-all duration-200 flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                Check Registration at Bexar.org
              </a>
              <div className="border-t border-on-primary/10 pt-5 flex flex-col gap-3">
                <p className="text-inverse-on-surface opacity-70 text-xs text-center uppercase tracking-wider">Also support the campaign</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/volunteer" className="flex-1 bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary font-bold text-xs px-4 py-3 rounded text-center uppercase tracking-wider transition-all">
                    Get Involved
                  </Link>
                  <a href="mailto:dietzmanncc12@gmail.com" className="flex-1 border border-on-primary/30 hover:border-heritage-gold text-on-primary hover:text-heritage-gold font-bold text-xs px-4 py-3 rounded text-center uppercase tracking-wider transition-all">
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Follow Me on Facebook */}
      <section className="py-20 px-5 md:px-16 bg-white border-t border-outline-variant">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* Left: Header + CTA */}
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3" style={{ fontFamily: '"Libre Caslon Text", serif' }}>Follow Me</h2>
                <div className="w-16 h-1 bg-heritage-gold mb-5"></div>
                <p className="text-legal-gray text-base leading-relaxed">
                  Stay up to date with campaign events, endorsements, and community updates. Follow Deborah on Facebook for the latest news.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://www.facebook.com/profile.php?id=61582742332373"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-[#1877F2] hover:bg-[#1565d8] text-white font-bold text-sm px-6 py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 w-fit"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Follow on Facebook
                </a>
                <a
                  href="https://www.instagram.com/deborah_dietzmann_for_judge/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] text-white font-bold text-sm px-6 py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 w-fit hover:opacity-90"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  Follow on Instagram
                </a>
              </div>

            </div>

            {/* Right: Facebook Page Plugin embed */}
            <div className="flex justify-center">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-outline-variant w-full max-w-[380px]">
                <iframe
                  src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D61582742332373&tabs=timeline&width=380&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                  width="380"
                  height="500"
                  style={{ border: 'none', overflow: 'hidden' }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  title="Deborah Dietzmann Facebook Page"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hashtag Banner */}
      <section className="bg-primary text-on-primary py-16 px-5 md:px-16 text-center">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-8">
          <h2
            className="text-4xl md:text-6xl font-bold text-on-primary tracking-tight"
            style={{ fontFamily: '"Libre Caslon Text", serif' }}
          >
            <span className="text-heritage-gold">#</span>VoteDietzmann
          </h2>
          <p className="text-inverse-on-surface opacity-70 text-sm uppercase tracking-widest">Share. Spread the Word. Make a Difference.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.facebook.com/profile.php?id=61582742332373"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-heritage-gold text-heritage-gold hover:bg-heritage-gold hover:text-primary font-bold text-xs px-6 py-3 rounded-full transition-all duration-200 uppercase tracking-wider"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Follow on Facebook
            </a>
            <a
              href="https://www.instagram.com/deborah_dietzmann_for_judge/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-heritage-gold text-heritage-gold hover:bg-heritage-gold hover:text-primary font-bold text-xs px-6 py-3 rounded-full transition-all duration-200 uppercase tracking-wider"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              Follow on Instagram
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
