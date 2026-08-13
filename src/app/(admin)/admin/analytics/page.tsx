import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import KPICard from '../components/KPICard';
import { getAnalyticsData } from '@/app/actions/analytics';

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Fetch real Google Analytics Data (last 7 days by default)
  const gaData = await getAnalyticsData(7);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto pt-16 md:pt-8">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center gap-4 mb-6">
        <span className="material-symbols-outlined text-primary text-2xl">arrow_back</span>
        <h1 className="font-headline-md text-primary text-lg font-bold tracking-widest uppercase">Site Analytics</h1>
      </div>

      {/* Mobile Date Range */}
      <div className="md:hidden bg-neutral-white border border-outline-variant/30 rounded-xl p-4 flex justify-between items-center mb-6 shadow-sm">
        <span className="text-primary font-body-md">Date Range</span>
        <span className="text-primary font-label-bold flex items-center gap-1">
          Last 7 days <span className="material-symbols-outlined text-[18px]">expand_more</span>
        </span>
      </div>

      <div className="hidden md:flex mb-6 justify-between items-end">
        <div>
          <h1 className="font-headline-lg text-primary text-2xl md:text-3xl mb-1">Site Analytics</h1>
        </div>
        <div className="flex gap-4 items-center">
          <select className="bg-surface-container-low border border-outline-variant/30 rounded-xl py-2 px-4 text-sm focus:outline-none">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>This Year</option>
          </select>
          <button className="btn-secondary py-2 px-4 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Refresh Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <KPICard 
          title="Total Visitors" 
          value={gaData.visitors.value} 
          icon="" 
          variant="grey"
          trend={gaData.visitors.trend}
        />
        <KPICard 
          title="Page Views" 
          value={gaData.pageViews.value} 
          icon=""
          variant="grey"
          trend={gaData.pageViews.trend} 
        />
        <KPICard 
          title="Bounce Rate" 
          value={gaData.bounceRate.value} 
          icon=""
          variant="grey"
          trend={gaData.bounceRate.trend} 
        />
        <KPICard 
          title="Avg Session Duration" 
          value={gaData.avgSession.value} 
          icon=""
          variant="grey"
          trend={gaData.avgSession.trend} 
        />
      </div>

      {/* AI Insights Section */}
      <div className="mb-6 md:mb-8">
        <h2 className="font-headline-md text-primary text-xl font-bold mb-4">AI Insights</h2>
        <div className="space-y-4">
          {gaData.insights && gaData.insights.length > 0 ? (
            gaData.insights.map((insight: any, i: number) => (
              <div key={i} className={`border rounded-2xl p-4 shadow-sm flex items-start gap-4 ${insight.type === 'warning' ? 'bg-error/5 border-error/20' : 'bg-neutral-white border-outline-variant/30'}`}>
                <span className={`material-symbols-outlined mt-1 text-2xl ${insight.type === 'warning' ? 'text-error' : 'text-heritage-gold icon-fill-1'}`} style={insight.type !== 'warning' ? {fontVariationSettings: "'FILL' 1"} : {}}>
                  {insight.type === 'warning' ? 'warning' : 'lightbulb'}
                </span>
                <div>
                  <h3 className="font-headline-sm text-primary font-bold mb-1">{insight.title}</h3>
                  <p className="text-sm font-body-sm text-legal-gray leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-neutral-white border border-outline-variant/30 rounded-2xl p-4 shadow-sm flex items-start gap-4">
              <span className="material-symbols-outlined text-heritage-gold mt-1 icon-fill-1 text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>lightbulb</span>
              <div>
                <h3 className="font-headline-sm text-primary font-bold mb-1">Checking Insights</h3>
                <p className="text-sm font-body-sm text-legal-gray leading-relaxed">
                  No new insights available at this time. We need a bit more data to analyze!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-neutral-white border border-outline-variant/30 rounded-2xl p-6 shadow-sm mb-6 md:mb-8">
        <h2 className="font-headline-md text-primary text-xl mb-6">Traffic Over Time</h2>
        <div className="h-64 bg-surface-container-lowest border-2 border-dashed border-outline-variant/30 rounded-xl flex items-center justify-center text-legal-gray">
          Area Chart Visualization: Daily Visitors
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
        <div className="bg-neutral-white border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
          <h2 className="font-headline-md text-primary text-xl mb-6">Top Pages</h2>
          <div className="space-y-4">
            {gaData.topPages.map((page: { name: string; views: string; pct: number }) => (
              <div key={page.name}>
                <div className="flex justify-between text-sm font-body-sm text-primary mb-1 truncate gap-2">
                  <span className="truncate">{page.name}</span>
                  <span className="text-legal-gray shrink-0">{page.views}</span>
                </div>
                <div className="w-full bg-surface-container-lowest rounded-full h-2">
                  <div className="bg-[#0a1f44] h-2 rounded-full" style={{ width: `${page.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-neutral-white border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
          <h2 className="font-headline-md text-primary text-xl mb-6">Traffic Sources</h2>
          <div className="flex flex-col md:flex-row items-center gap-8 justify-center h-full pb-8">
            <div className="w-48 h-48 rounded-full border-[24px] border-[#0a1f44] relative flex items-center justify-center border-t-heritage-gold border-r-heritage-gold border-b-[#4285F4] border-l-[#9CA3AF]">
              <div className="absolute w-full text-center">
                <span className="text-xs text-legal-gray">Donut Chart</span>
              </div>
            </div>
            <div className="space-y-3 w-full md:w-auto flex-1">
              {gaData.trafficSources.map((source: { name: string; color: string; pct: string }) => (
                <div key={source.name} className="flex justify-between items-center text-sm font-body-sm">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${source.color}`}></span>
                    <span className="text-primary">{source.name}</span>
                  </div>
                  <span className="font-label-bold">{source.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-neutral-white border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
        <h2 className="font-headline-md text-primary text-xl mb-6">Device Breakdown</h2>
        <div className="flex w-full h-8 rounded-md overflow-hidden mb-4 text-xs font-bold text-white">
          <div className="bg-[#0a1f44] flex items-center justify-center transition-all duration-500" style={{ width: `${gaData.deviceBreakdown.desktop}%` }}>{gaData.deviceBreakdown.desktop > 0 ? `${gaData.deviceBreakdown.desktop}%` : ''}</div>
          <div className="bg-heritage-gold flex items-center justify-center transition-all duration-500" style={{ width: `${gaData.deviceBreakdown.mobile}%` }}>{gaData.deviceBreakdown.mobile > 0 ? `${gaData.deviceBreakdown.mobile}%` : ''}</div>
          <div className="bg-[#D1D5DB] flex items-center justify-center text-primary transition-all duration-500" style={{ width: `${gaData.deviceBreakdown.tablet}%` }}>{gaData.deviceBreakdown.tablet > 0 ? `${gaData.deviceBreakdown.tablet}%` : ''}</div>
        </div>
        <div className="flex justify-center gap-8 text-sm text-legal-gray">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">computer</span> Desktop
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">smartphone</span> Mobile
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">tablet_mac</span> Tablet
          </div>
        </div>
      </div>
    </div>
  );
}
