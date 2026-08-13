import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import KPICard from './components/KPICard';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Fetch data
  const { count: volunteerCount } = await supabase
    .from('volunteers')
    .select('*', { count: 'exact', head: true });

  const { data: recentVolunteers } = await supabase
    .from('volunteers')
    .select('id, name, email, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  const { count: eventsCount } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .gte('date', new Date().toISOString());

  const { data: upcomingEvents } = await supabase
    .from('events')
    .select('id, title, date, location')
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true })
    .limit(3);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="font-headline-lg text-primary mb-2">Dashboard Overview</h1>
          <p className="font-body-md text-legal-gray">Welcome back. Here's what's happening with the campaign.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/admin/volunteers" className="btn-secondary py-2 px-4 text-sm">Manage Volunteers</Link>
          <Link href="/admin/events" className="btn-primary py-2 px-4 text-sm">Add Event</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard 
          title="Total Volunteers" 
          value={volunteerCount ?? '--'} 
          icon="groups" 
        />
        <KPICard 
          title="Upcoming Events" 
          value={eventsCount ?? '--'} 
          icon="event" 
        />
        <KPICard 
          title="Total Page Views" 
          value="--" 
          icon="visibility" 
        />
        <KPICard 
          title="Avg Session Duration" 
          value="--" 
          icon="timer" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Placeholder: Google Analytics Traffic Chart */}
        <div className="lg:col-span-3 bg-neutral-white border border-outline-variant rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant">
            <span className="material-symbols-outlined text-secondary text-3xl icon-fill-1">monitoring</span>
            <h2 className="font-headline-md text-primary">Website Traffic</h2>
          </div>
          <div className="h-64 bg-surface-container-low rounded-lg flex items-center justify-center border border-dashed border-outline">
            <p className="font-body-md text-legal-gray italic">Google Analytics data integration pending...</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Volunteers */}
        <div className="bg-neutral-white border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-heritage-gold text-2xl icon-fill-1">person_add</span>
              <h2 className="font-headline-md text-primary text-xl">Recent Volunteers</h2>
            </div>
            <Link href="/admin/volunteers" className="text-secondary hover:underline font-label-bold text-sm">View All</Link>
          </div>
          
          <div className="flex-1">
            {recentVolunteers && recentVolunteers.length > 0 ? (
              <ul className="divide-y divide-outline-variant/30">
                {recentVolunteers.map((vol) => (
                  <li key={vol.id} className="py-4 flex justify-between items-center">
                    <div>
                      <p className="font-label-bold text-primary">{vol.name}</p>
                      <p className="text-sm text-legal-gray mt-1">{vol.email}</p>
                    </div>
                    <span className="text-xs text-legal-gray bg-surface-container py-1 px-2 rounded">
                      {new Date(vol.created_at).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-legal-gray italic py-4 text-center">No recent signups found.</p>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-neutral-white border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary text-2xl icon-fill-1">event_upcoming</span>
              <h2 className="font-headline-md text-primary text-xl">Upcoming Events</h2>
            </div>
            <Link href="/admin/events" className="text-secondary hover:underline font-label-bold text-sm">Manage</Link>
          </div>
          
          <div className="flex-1">
            {upcomingEvents && upcomingEvents.length > 0 ? (
              <ul className="divide-y divide-outline-variant/30">
                {upcomingEvents.map((evt) => (
                  <li key={evt.id} className="py-4">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-label-bold text-primary">{evt.title}</p>
                      <span className="text-xs text-primary bg-primary/10 py-1 px-2 rounded border border-primary/20 whitespace-nowrap ml-2">
                        {new Date(evt.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-legal-gray gap-2 mt-2">
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      <span className="truncate">{evt.location}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-legal-gray italic py-4 text-center">No upcoming events scheduled.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
