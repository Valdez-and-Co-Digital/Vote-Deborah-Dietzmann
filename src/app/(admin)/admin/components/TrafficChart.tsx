'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TrafficChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 bg-surface-container-lowest border-2 border-dashed border-outline-variant/30 rounded-xl flex items-center justify-center text-legal-gray">
        No traffic data available.
      </div>
    );
  }
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d4af37" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#9CA3AF', fontSize: 12}} 
            dy={10} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#9CA3AF', fontSize: 12}} 
          />
          <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#0a1f44', fontWeight: 'bold' }}
            cursor={{ stroke: '#d4af37', strokeWidth: 1, strokeDasharray: '3 3' }}
          />
          <Area 
            type="monotone" 
            dataKey="visitors" 
            stroke="#d4af37" 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#colorVisitors)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
