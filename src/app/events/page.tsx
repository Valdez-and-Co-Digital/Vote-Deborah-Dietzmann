import Link from 'next/link';

export const metadata = {
  title: 'Campaign Events | Deborah Dietzmann for Judge',
  description: 'Join Deborah Dietzmann in the community. See where she\'ll be next and get involved in the movement for fair, experienced leadership in Bexar County.',
};

export default function EventsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-primary overflow-hidden flex items-center justify-center border-b border-heritage-gold shadow-lg">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-cover bg-center opacity-20 patriotic-pattern"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent"></div>
        </div>
        <div className="relative z-10 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <h1 className="font-headline-display text-headline-lg-mobile md:text-headline-display text-heritage-gold mb-6 uppercase tracking-wider drop-shadow-md">
            Campaign Events &amp; Appearances
          </h1>
          <p className="font-body-lg text-body-lg text-inverse-on-surface opacity-90 max-w-2xl mx-auto leading-relaxed">
            Join Deborah in the community. See where she'll be next and get involved in the movement for fair, experienced leadership.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface">
        <div className="max-w-[1200px] mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column: Calendar UI (Static for now) */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg border border-outline-variant overflow-hidden">
                <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                  <h2 className="font-headline-lg text-2xl text-primary">October 2024</h2>
                  <div className="flex gap-2">
                    <button className="w-10 h-10 border border-outline-variant rounded flex items-center justify-center hover:bg-surface-variant transition-colors text-primary" aria-label="Previous Month">
                      <span className="material-symbols-outlined text-lg">chevron_left</span>
                    </button>
                    <button className="w-10 h-10 border border-outline-variant rounded flex items-center justify-center hover:bg-surface-variant transition-colors text-primary" aria-label="Next Month">
                      <span className="material-symbols-outlined text-lg">chevron_right</span>
                    </button>
                  </div>
                </div>
                
                {/* Calendar Grid */}
                <div className="p-6">
                  {/* Days of week */}
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                      <div key={day} className="text-center font-bold text-xs text-primary uppercase tracking-wider py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-2">
                    {/* Empty padding for days before 1st (assuming Oct 1 is a Tuesday for mockup sake) */}
                    <div className="aspect-square border border-outline-variant/30 rounded p-1 flex flex-col items-end opacity-40 bg-surface">
                      <span className="text-sm">29</span>
                    </div>
                    <div className="aspect-square border border-outline-variant/30 rounded p-1 flex flex-col items-end opacity-40 bg-surface">
                      <span className="text-sm">30</span>
                    </div>
                    
                    {/* Days 1-19 */}
                    {Array.from({ length: 19 }, (_, i) => i + 1).map(day => (
                      <div 
                        key={day} 
                        className={`aspect-square border rounded p-1 flex flex-col ${
                          day === 15 
                            ? 'border-primary bg-primary/5' 
                            : 'border-outline-variant/50 hover:border-primary/50'
                        } relative overflow-hidden transition-colors cursor-pointer group`}
                      >
                        <span className={`text-sm self-end font-medium ${day === 15 ? 'text-primary font-bold' : 'text-on-surface'}`}>
                          {day}
                        </span>
                        
                        {/* Event Indicators */}
                        {day === 2 && (
                          <div className="absolute bottom-1 left-1 right-1 bg-primary text-on-primary text-[9px] font-bold p-1 rounded-sm text-center leading-none truncate">
                            Town Hall
                          </div>
                        )}
                        {day === 11 && (
                          <div className="absolute bottom-1 left-1 right-1 bg-secondary text-on-secondary text-[9px] font-bold p-1 rounded-sm text-center leading-none truncate">
                            Mixer
                          </div>
                        )}
                        {day === 15 && (
                          <div className="absolute bottom-1 left-1 right-1 bg-heritage-gold text-primary text-[9px] font-bold p-1 rounded-sm text-center leading-none truncate group-hover:bg-primary group-hover:text-on-primary transition-colors">
                            Q&amp;A
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Upcoming Events List */}
            <div className="lg:col-span-1">
              <h2 className="font-headline-lg text-2xl text-primary mb-6 pb-4 border-b border-outline-variant">Upcoming Events</h2>
              
              <div className="flex flex-col gap-6">
                
                {/* Event Card 1 */}
                <div className="bg-white rounded-xl shadow-md border-l-4 border-secondary p-5 hover:shadow-lg transition-shadow">
                  <div className="text-secondary font-bold text-xs uppercase tracking-widest mb-2">Oct 2, 2024</div>
                  <h3 className="font-headline-md text-xl text-primary mb-3">Community Town Hall</h3>
                  <div className="flex flex-col gap-2 mb-5">
                    <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      <span>6:00 PM - 8:00 PM</span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      <span>San Antonio Public Library</span>
                    </div>
                  </div>
                  <button className="w-full border border-primary text-primary hover:bg-primary hover:text-on-primary font-bold text-sm uppercase tracking-wider py-3 rounded transition-colors">
                    RSVP
                  </button>
                </div>

                {/* Event Card 2 */}
                <div className="bg-white rounded-xl shadow-md border-l-4 border-heritage-gold p-5 hover:shadow-lg transition-shadow">
                  <div className="text-heritage-gold font-bold text-xs uppercase tracking-widest mb-2">Oct 11, 2024</div>
                  <h3 className="font-headline-md text-xl text-primary mb-3">Legal Professionals Mixer</h3>
                  <div className="flex flex-col gap-2 mb-5">
                    <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      <span>5:30 PM - 7:30 PM</span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      <span>Downtown Bar Association</span>
                    </div>
                  </div>
                  <button className="w-full border border-primary text-primary hover:bg-primary hover:text-on-primary font-bold text-sm uppercase tracking-wider py-3 rounded transition-colors">
                    RSVP
                  </button>
                </div>

                {/* Event Card 3 */}
                <div className="bg-white rounded-xl shadow-md border-l-4 border-primary p-5 hover:shadow-lg transition-shadow">
                  <div className="text-primary font-bold text-xs uppercase tracking-widest mb-2">Oct 15, 2024</div>
                  <h3 className="font-headline-md text-xl text-primary mb-3">Judicial Forum &amp; Q&amp;A</h3>
                  <div className="flex flex-col gap-2 mb-5">
                    <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      <span>12:00 PM - 1:30 PM</span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      <span>Downtown Library Hall</span>
                    </div>
                  </div>
                  <button className="w-full border border-primary text-primary hover:bg-primary hover:text-on-primary font-bold text-sm uppercase tracking-wider py-3 rounded transition-colors">
                    RSVP
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Volunteer Call to Action */}
      <section className="bg-primary text-on-primary py-16 text-center border-t border-heritage-gold">
        <div className="max-w-3xl mx-auto px-5">
          <h2 className="font-headline-lg text-3xl mb-4" style={{ fontFamily: '"Libre Caslon Text", serif' }}>
            Want to Host an Event?
          </h2>
          <p className="text-inverse-on-surface opacity-90 mb-8 max-w-xl mx-auto">
            We are always looking for community members to host meet-and-greets or coffee hours in their neighborhoods.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/volunteer" 
              className="bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary font-bold text-sm uppercase tracking-wider px-8 py-4 rounded shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
              Become a Host
            </Link>
            <Link 
              href="/contact" 
              className="border border-on-primary hover:border-heritage-gold text-on-primary hover:text-heritage-gold font-bold text-sm uppercase tracking-wider px-8 py-4 rounded transition-all flex items-center justify-center gap-2"
            >
              Contact Campaign
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
