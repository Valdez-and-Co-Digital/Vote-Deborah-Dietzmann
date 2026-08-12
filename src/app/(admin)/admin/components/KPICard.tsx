interface KPICardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export default function KPICard({ title, value, icon, trend }: KPICardProps) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/30 shadow-sm flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-body-md text-on-surface-variant uppercase tracking-wider text-sm">{title}</h3>
        <div className="p-2 bg-primary/5 rounded-full text-primary">
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
      </div>
      
      <div className="flex items-end gap-3 mt-auto">
        <div className="font-headline-lg text-3xl text-on-surface">{value}</div>
        {trend && (
          <div className={`flex items-center text-sm font-label-bold mb-1 ${trend.isPositive ? 'text-green-700' : 'text-error'}`}>
            <span className="material-symbols-outlined text-sm">
              {trend.isPositive ? 'arrow_upward' : 'arrow_downward'}
            </span>
            <span>{trend.value}</span>
          </div>
        )}
      </div>
    </div>
  );
}
