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
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Mobile Search Bar */}
      <div className="md:hidden relative mb-6">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">search</span>
        <input 
          type="text" 
          placeholder="Search dashboard..." 
          className="w-full bg-surface-container-low border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="font-headline-lg text-primary text-2xl md:text-3xl mb-1">Dashboard Overview</h1>
          <p className="font-body-md text-legal-gray text-sm md:text-base">Here's what's happening with the campaign today.</p>
        </div>
        <div className="hidden md:flex gap-4">
          <Link href="/admin/volunteers" className="btn-secondary py-2 px-4 text-sm">Manage Volunteers</Link>
          <Link href="/admin/events" className="btn-primary py-2 px-4 text-sm">Add Event</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <KPICard 
          title="Total Volunteers" 
          value={volunteerCount ? volunteerCount.toLocaleString() : '--'} 
          icon="groups" 
          variant="grey"
          trend={{ value: "+12% this week", isPositive: true }}
        />
        <KPICard 
          title="Total Page Views" 
          value="2,341" 
          icon="visibility"
          variant="gold"
          trend={{ value: "+5.2% this month", isPositive: true }} 
        />
        <div className="hidden lg:block">
          <KPICard 
            title="Upcoming Events" 
            value={eventsCount ?? '--'} 
            icon="event"
            variant="grey"
            trend={{ value: "Next event in 3 days", neutral: true }} 
          />
        </div>
        <div className="hidden lg:block">
          <KPICard 
            title="Avg Session Duration" 
            value="2m 34s" 
            icon="timer"
            variant="gold"
            trend={{ value: "-0.4% this week", isPositive: false }} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
        {/* Placeholder: Google Analytics Traffic Chart */}
        <div className="lg:col-span-3 bg-neutral-white border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-headline-md text-primary text-xl">Traffic Overview</h2>
            <Link href="/admin/analytics" className="text-heritage-gold hover:underline font-label-bold text-sm">View All</Link>
          </div>
          <div className="h-48 flex items-end justify-between px-2 text-outline-variant relative">
            {/* Mock chart area just for visuals */}
            <div className="w-full absolute bottom-8 flex justify-between text-xs text-outline font-body-md">
              <span>Mon</span><span>Tue</span><span className="text-primary font-bold">Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
            <p className="w-full text-center font-body-md text-legal-gray italic absolute top-1/2 -translate-y-1/2">Google Analytics data integration pending...</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Recent Volunteers */}
        <div className="bg-neutral-white border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-headline-md text-primary text-xl">Recent Volunteers</h2>
            <Link href="/admin/volunteers" className="text-heritage-gold hover:underline font-label-bold text-sm">Manage</Link>
          </div>
          
          <div className="flex-1">
            {recentVolunteers && recentVolunteers.length > 0 ? (
              <ul className="divide-y divide-outline-variant/20">
                {recentVolunteers.map((vol, index) => {
                  const initials = vol.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
                  const colors = ['bg-blue-100 text-blue-700', 'bg-green-100 text-green-700', 'bg-purple-100 text-purple-700', 'bg-orange-100 text-orange-700'];
                  const colorClass = colors[index % colors.length];
                  
                  return (
                    <li key={vol.id} className="py-4 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${colorClass}`}>
                          {initials}
                        </div>
                        <div>
                          <p className="font-label-bold text-primary">{vol.name}</p>
                          <p className="text-sm text-legal-gray font-body-md">Volunteer Request</p>
                        </div>
                      </div>
                      <span className="text-xs text-outline font-body-md">
                        {Math.floor(Math.random() * 24 + 1)}h ago
                      </span>
                    </li>
                  )
                })}
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
