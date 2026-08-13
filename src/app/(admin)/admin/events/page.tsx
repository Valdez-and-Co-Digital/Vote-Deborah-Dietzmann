import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import EventsManager from '../components/EventsManager';

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
    <div className="p-8 max-w-7xl mx-auto">
      <EventsManager initialUpcoming={upcomingEvents} initialPast={pastEvents} />
    </div>
  );
}
