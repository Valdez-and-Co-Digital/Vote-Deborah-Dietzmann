import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import VolunteerTable from '../components/VolunteerTable';

export default async function VolunteersManagementPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const { data: volunteers } = await supabase
    .from('volunteers')
    .select('*')
    .order('created_at', { ascending: false });

  const total = volunteers?.length || 0;
  
  // Calculate summary stats
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const newThisWeek = volunteers?.filter(v => new Date(v.created_at) >= oneWeekAgo).length || 0;
  const contacted = volunteers?.filter(v => v.status === 'contacted').length || 0;
  const pending = volunteers?.filter(v => !v.status || v.status === 'new').length || 0;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="font-headline-lg text-primary">Volunteer Management</h1>
            <span className="bg-primary/10 text-primary font-label-bold px-3 py-1 rounded-full border border-primary/20 text-sm">
              {total} volunteers
            </span>
          </div>
          <p className="font-body-md text-legal-gray">Review and manage campaign volunteers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-neutral-white p-6 rounded-lg border border-outline-variant/30 shadow-sm flex flex-col items-center text-center">
          <div className="p-3 bg-yellow-100 text-yellow-800 rounded-full mb-3">
            <span className="material-symbols-outlined icon-fill-1">fiber_new</span>
          </div>
          <p className="font-headline-lg text-3xl text-primary">{newThisWeek}</p>
          <p className="font-label-bold uppercase tracking-wider text-legal-gray text-xs mt-1">New This Week</p>
        </div>

        <div className="bg-neutral-white p-6 rounded-lg border border-outline-variant/30 shadow-sm flex flex-col items-center text-center">
          <div className="p-3 bg-blue-100 text-blue-800 rounded-full mb-3">
            <span className="material-symbols-outlined icon-fill-1">how_to_reg</span>
          </div>
          <p className="font-headline-lg text-3xl text-primary">{contacted}</p>
          <p className="font-label-bold uppercase tracking-wider text-legal-gray text-xs mt-1">Contacted</p>
        </div>

        <div className="bg-neutral-white p-6 rounded-lg border border-outline-variant/30 shadow-sm flex flex-col items-center text-center">
          <div className="p-3 bg-red-100 text-red-800 rounded-full mb-3">
            <span className="material-symbols-outlined icon-fill-1">pending_actions</span>
          </div>
          <p className="font-headline-lg text-3xl text-primary">{pending}</p>
          <p className="font-label-bold uppercase tracking-wider text-legal-gray text-xs mt-1">Pending Follow-up</p>
        </div>
      </div>

      <VolunteerTable initialVolunteers={volunteers || []} />
    </div>
  );
}
