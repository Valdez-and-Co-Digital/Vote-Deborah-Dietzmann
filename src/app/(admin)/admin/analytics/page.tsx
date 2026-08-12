import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import KPICard from '../components/KPICard';

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Mock GA Data
  const topPages = [
    { path: '/', views: 2341, percent: 100 },
    { path: '/about', views: 1204, percent: 51 },
    { path: '/issues', views: 987, percent: 42 },
    { path: '/events', views: 756, percent: 32 },
    { path: '/volunteer', views: 643, percent: 27 },
    { path: '/experience', views: 412, percent: 18 },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-primary mb-2">Site Analytics</h1>
          <p className="font-body-md text-legal-gray">Website performance and traffic insights (Mock Data).</p>
        </div>
        <div className="flex gap-4 items-center">
          <select className="px-3 py-2 border border-outline-variant rounded-md text-sm bg-white focus:outline-none focus:border-primary">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Custom</option>
          </select>
          <button className="btn-secondary py-2 px-4 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Refresh Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard 
          title="Total Visitors" 
          value="3,241" 
          icon="group"
          trend={{ value: '18%', isPositive: true }}
        />
        <KPICard 
          title="Page Views" 
          value="8,472" 
          icon="visibility"
          trend={{ value: '12%', isPositive: true }}
        />
        <KPICard 
          title="Bounce Rate" 
          value="34.2%" 
          icon="exit_to_app"
          trend={{ value: '5%', isPositive: true }} // Green arrow down is positive for bounce rate, we'll map isPositive=true to green in UI
        />
        <KPICard 
          title="Avg Session Duration" 
          value="2m 34s" 
          icon="timer"
          trend={{ value: '8%', isPositive: true }}
        />
      </div>

      {/* Traffic Over Time Placeholder */}
      <div className="bg-neutral-white border border-outline-variant rounded-2xl p-6 shadow-sm mb-8">
        <h3 className="font-headline-sm text-primary mb-4 border-b border-outline-variant pb-2">Traffic Over Time</h3>
        <div className="h-64 bg-surface-container-low rounded-lg flex items-center justify-center border border-dashed border-outline">
          <p className="font-body-sm text-legal-gray italic">Area Chart: Daily Visitors Placeholder (Requires Chart.js or Recharts)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Pages */}
        <div className="bg-neutral-white border border-outline-variant rounded-2xl p-6 shadow-sm">
          <h3 className="font-headline-sm text-primary mb-4 border-b border-outline-variant pb-2">Top Pages</h3>
          <div className="flex flex-col gap-4">
            {topPages.map((page, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-label-bold text-primary">{page.path === '/' ? 'Home' : page.path.substring(1)}</span>
                  <span className="text-legal-gray">{page.views.toLocaleString()}</span>
                </div>
                <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-secondary rounded-full" 
                    style={{ width: `${page.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources & Devices */}
        <div className="flex flex-col gap-8">
          {/* Traffic Sources */}
          <div className="bg-neutral-white border border-outline-variant rounded-2xl p-6 shadow-sm">
            <h3 className="font-headline-sm text-primary mb-4 border-b border-outline-variant pb-2">Traffic Sources</h3>
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 rounded-full border-[16px] border-primary flex items-center justify-center relative">
                {/* CSS Donut placeholder */}
                <div className="absolute inset-0 rounded-full border-[16px] border-secondary" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 50% 100%)' }}></div>
                <div className="absolute inset-0 rounded-full border-[16px] border-heritage-gold" style={{ clipPath: 'polygon(50% 50%, 0 100%, 0 0)' }}></div>
              </div>
              <div className="flex flex-col gap-2 text-sm flex-1">
                <div className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary"></span> Direct</span> <span>40%</span></div>
                <div className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-secondary"></span> Organic</span> <span>25%</span></div>
                <div className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-heritage-gold"></span> Social</span> <span>20%</span></div>
                <div className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-outline"></span> Referral</span> <span>10%</span></div>
              </div>
            </div>
          </div>
          
          {/* Device Breakdown */}
          <div className="bg-neutral-white border border-outline-variant rounded-2xl p-6 shadow-sm">
            <h3 className="font-headline-sm text-primary mb-4 border-b border-outline-variant pb-2">Device Breakdown</h3>
            <div className="flex h-6 rounded-full overflow-hidden mb-3 text-xs text-white font-bold text-center">
              <div className="bg-primary flex items-center justify-center" style={{ width: '55%' }}>55%</div>
              <div className="bg-secondary flex items-center justify-center" style={{ width: '38%' }}>38%</div>
              <div className="bg-heritage-gold flex items-center justify-center" style={{ width: '7%' }}>7%</div>
            </div>
            <div className="flex justify-center gap-6 text-sm text-legal-gray">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">desktop_mac</span> Desktop</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">smartphone</span> Mobile</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">tablet_mac</span> Tablet</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
