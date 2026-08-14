import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import EventsManager from '../components/EventsManager';
import EventMediaTool from '../components/EventMediaTool';

export default async function EventsManagementPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const now = new Date().toISOString();
  
  // Fetch upcoming
  const { data: upcoming } = await supabase
    .from('events')
    .select('*, rsvps(count)')
    .gte('date', now)
    .order('date', { ascending: true });
    
  // Fetch past
  const { data: past } = await supabase
    .from('events')
    .select('*, rsvps(count)')
    .lt('date', now)
    .order('date', { ascending: false });

  // Map to flat RSVP count
  const upcomingEvents = (upcoming || []).map(e => ({
    ...e,
    rsvp_count: e.rsvps?.[0]?.count || 0
  }));

  const pastEvents = (past || []).map(e => ({
    ...e,
    rsvp_count: e.rsvps?.[0]?.count || 0
  }));

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto pt-16 md:pt-8">
      <EventsManager initialUpcoming={upcomingEvents} initialPast={pastEvents} />

      {/* Event Media Collapsible */}
      <details className="mt-8 bg-neutral-white border border-outline-variant/30 rounded-2xl shadow-sm group">
        <summary className="font-headline-md text-primary text-xl p-6 cursor-pointer list-none flex items-center justify-between hover:bg-surface-container-low transition-colors rounded-2xl group-open:rounded-b-none group-open:border-b border-outline-variant/30">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl">auto_awesome</span>
            AI Event Media Analyzer
          </div>
          <span className="material-symbols-outlined transition-transform duration-300 group-open:rotate-180">
            expand_more
          </span>
        </summary>
        <div className="p-6">
          <EventMediaTool />
        </div>
      </details>
    </div>
  );
}
