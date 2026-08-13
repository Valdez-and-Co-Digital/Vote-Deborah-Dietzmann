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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        {/* Card 1: New This Week */}
        <div className="bg-neutral-white p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-green-50 rounded-full opacity-50 pointer-events-none"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">person_add</span>
            </div>
            <div className="bg-green-50 text-green-700 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">trending_up</span> 12%
            </div>
          </div>
          <div className="relative z-10">
            <p className="font-headline-lg text-[32px] text-primary leading-tight">{newThisWeek}</p>
            <p className="text-legal-gray text-sm font-body-sm mt-1">New This Week</p>
          </div>
        </div>

        {/* Card 2: Contacted */}
        <div className="bg-neutral-white p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-50 rounded-full opacity-50 pointer-events-none"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">chat_bubble_outline</span>
            </div>
            <div className="bg-surface-variant text-on-surface-variant px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">arrow_right_alt</span> 0%
            </div>
          </div>
          <div className="relative z-10">
            <p className="font-headline-lg text-[32px] text-primary leading-tight">{contacted}</p>
            <p className="text-legal-gray text-sm font-body-sm mt-1">Contacted</p>
          </div>
        </div>

        {/* Card 3: Pending Follow-up */}
        <div className="bg-neutral-white p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-50 rounded-full opacity-50 pointer-events-none"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">assignment_late</span>
            </div>
            <div className="bg-error/10 text-error px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">trending_down</span> 5%
            </div>
          </div>
          <div className="relative z-10">
            <p className="font-headline-lg text-[32px] text-primary leading-tight">{pending}</p>
            <p className="text-legal-gray text-sm font-body-sm mt-1">Pending Follow-up</p>
          </div>
        </div>
      </div>

      <VolunteerTable initialVolunteers={volunteers || []} />
    </div>
  );
}
