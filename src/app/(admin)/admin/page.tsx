export default async function AdminDashboardPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="font-headline-lg text-primary mb-2">Dashboard Overview</h1>
        <p className="font-body-md text-legal-gray">Welcome back. Here's what's happening with the campaign.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Placeholder: Google Analytics */}
        <div className="lg:col-span-2 bg-neutral-white border border-outline-variant rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant">
            <span className="material-symbols-outlined text-secondary text-3xl icon-fill-1">monitoring</span>
            <h2 className="font-headline-md text-primary">Website Traffic</h2>
          </div>
          <div className="h-64 bg-surface-container-low rounded-lg flex items-center justify-center border border-dashed border-outline">
            <p className="font-body-md text-legal-gray italic">Google Analytics data integration pending...</p>
          </div>
        </div>

        {/* Placeholder: Quick Stats */}
        <div className="flex flex-col gap-6">
          <div className="bg-neutral-white border border-outline-variant rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-heritage-gold icon-fill-1">groups</span>
              <h3 className="font-label-bold uppercase tracking-wider text-primary">Total Volunteers</h3>
            </div>
            <p className="font-headline-lg text-4xl text-primary mt-2">--</p>
            <p className="font-body-sm text-legal-gray mt-1">Data integration pending</p>
          </div>
          
          <div className="bg-neutral-white border border-outline-variant rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-secondary icon-fill-1">event_available</span>
              <h3 className="font-label-bold uppercase tracking-wider text-primary">Upcoming Events</h3>
            </div>
            <p className="font-headline-lg text-4xl text-primary mt-2">--</p>
            <p className="font-body-sm text-legal-gray mt-1">Data integration pending</p>
          </div>
        </div>

      </div>
    </div>
  );
}
