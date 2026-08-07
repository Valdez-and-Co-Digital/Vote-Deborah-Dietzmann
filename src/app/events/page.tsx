import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import EventsClientView from './EventsClientView';

export const metadata = {
  title: 'Campaign Events | Deborah Dietzmann for Judge',
  description: 'Join Deborah Dietzmann in the community. See where she\'ll be next and get involved in the movement for fair, experienced leadership in Bexar County.',
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function EventsPage() {
  // Fetch events from Supabase, ordered by date ascending
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .gte('date', new Date().toISOString()) // Only show upcoming events
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
  }

  // Calendar Logic for Current Month
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthName = monthNames[currentMonth];

  const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
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
            
            {/* Left Column: Calendar UI (Dynamic) */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg border border-outline-variant overflow-hidden">
                <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                  <h2 className="font-headline-lg text-2xl text-primary">{monthName} {currentYear}</h2>
                  <div className="flex gap-2">
                    <button className="w-10 h-10 border border-outline-variant rounded flex items-center justify-center hover:bg-surface-variant transition-colors text-primary opacity-50 cursor-not-allowed" aria-label="Previous Month" disabled>
                      <span className="material-symbols-outlined text-lg">chevron_left</span>
                    </button>
                    <button className="w-10 h-10 border border-outline-variant rounded flex items-center justify-center hover:bg-surface-variant transition-colors text-primary opacity-50 cursor-not-allowed" aria-label="Next Month" disabled>
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
                    {/* Padding days before the 1st */}
                    {paddingDays.map((pad) => (
                      <div key={`pad-${pad}`} className="aspect-square border border-outline-variant/30 rounded p-1 flex flex-col items-end opacity-40 bg-surface"></div>
                    ))}
                    
                    {/* Actual Days */}
                    {monthDays.map(day => {
                      // Check if this day has events
                      const dayEvents = (events || []).filter(e => {
                        const eDate = new Date(e.date);
                        return eDate.getDate() === day && eDate.getMonth() === currentMonth && eDate.getFullYear() === currentYear;
                      });
                      const hasEvents = dayEvents.length > 0;

                      return (
                        <div 
                          key={day} 
                          className={`aspect-square border rounded p-1 flex flex-col ${
                            hasEvents 
                              ? 'border-primary bg-primary/5 shadow-sm' 
                              : 'border-outline-variant/50 hover:border-primary/50'
                          } relative overflow-hidden transition-colors cursor-pointer group`}
                        >
                          <span className={`text-sm self-end font-medium ${hasEvents ? 'text-primary font-bold' : 'text-on-surface'}`}>
                            {day}
                          </span>
                          
                          {/* Event Indicators */}
                          <div className="flex flex-col gap-1 mt-auto w-full">
                            {dayEvents.slice(0, 2).map((e, idx) => (
                              <div key={e.id} className="w-full bg-primary text-on-primary text-[9px] font-bold p-1 rounded-sm text-center leading-none truncate group-hover:bg-primary-fixed-variant transition-colors">
                                {e.title}
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <div className="text-[9px] text-primary font-bold text-center">
                                +{dayEvents.length - 2} more
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Upcoming Events List */}
            <div className="lg:col-span-1">
              <h2 className="font-headline-lg text-2xl text-primary mb-6 pb-4 border-b border-outline-variant">Upcoming Events</h2>
              
              <EventsClientView events={events || []} />
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
