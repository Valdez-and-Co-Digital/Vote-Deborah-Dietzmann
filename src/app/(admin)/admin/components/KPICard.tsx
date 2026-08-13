interface KPICardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    neutral?: boolean;
  };
  variant?: 'grey' | 'gold';
}

export default function KPICard({ title, value, icon, trend, variant = 'grey' }: KPICardProps) {
  const isGold = variant === 'gold';
  const iconBgClass = isGold ? 'bg-[#fef3c7]' : 'bg-[#e8edf2]';
  const iconColorClass = isGold ? 'text-[#d97706]' : 'text-[#2a4365]';

  return (
    <div className="bg-neutral-white p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col h-full justify-between">
      
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-label-bold text-outline-variant uppercase tracking-wider text-[11px] leading-relaxed w-2/3">
          {title}
        </h3>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBgClass}`}>
          <span className={`material-symbols-outlined text-[20px] ${iconColorClass}`}>{icon}</span>
        </div>
      </div>
      
      <div className="flex flex-col mt-auto">
        <div className="font-headline-lg text-4xl text-primary mb-2">{value}</div>
        {trend && (
          <div className={`flex items-center text-xs ${
            trend.neutral ? 'text-legal-gray' : trend.isPositive ? 'text-[#008a00]' : 'text-error'
          }`}>
            {!trend.neutral && (
              <span className="material-symbols-outlined text-[14px] mr-1">
                {trend.isPositive ? 'trending_up' : 'trending_down'}
              </span>
            )}
            <span className="font-body-md text-xs">{trend.value}</span>
          </div>
        )}
      </div>
    </div>
  );
}
