import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import EventsClientView from './EventsClientView';
import InteractiveCalendar from './InteractiveCalendar';

export const metadata = {
  title: 'Campaign Events | Deborah Dietzmann for Judge',
  description: 'Join Deborah Dietzmann in the community. See where she\'ll be next and get involved in the movement for fair, experienced leadership in Bexar County.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export default async function EventsPage() {
  // Fetch ALL events for the calendar (so users can navigate any month)
  const { data: allEvents, error: allError } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });

  // Fetch only upcoming events for the sidebar list
  const { data: upcomingEvents, error: upcomingError } = await supabase
    .from('events')
    .select('*')
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true });

  if (allError || upcomingError) {
    console.error('Error fetching events:', allError || upcomingError);
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-primary overflow-hidden flex items-center justify-center border-b border-heritage-gold shadow-lg">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-cover bg-center opacity-20 patriotic-pattern"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent"></div>
        </div>
        <div className="relative z-10 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <h1 className="font-headline-display text-4xl md:text-5xl lg:text-6xl text-heritage-gold mb-6 font-bold tracking-tight uppercase drop-shadow-md">
            Campaign Events &amp; Appearances
          </h1>
          <p className="font-body-lg text-lg md:text-xl lg:text-2xl text-inverse-on-surface opacity-90 max-w-2xl mx-auto leading-relaxed">
            Join Deborah in the community. See where she'll be next and get involved in the movement for fair, experienced leadership.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface">
        <div className="max-w-[1200px] mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column: Calendar UI (Dynamic) */}
            <div className="lg:col-span-2 hidden lg:block">
              <InteractiveCalendar events={allEvents || []} />
            </div>

            {/* Right Column: Upcoming Events List */}
            <div className="lg:col-span-1">
              <h2 className="font-headline-lg text-2xl text-primary mb-6 pb-4 border-b border-outline-variant">Upcoming Events</h2>
              
              <EventsClientView events={upcomingEvents || []} />
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
          </div>
        </div>
      </section>
    </>
  );
}
