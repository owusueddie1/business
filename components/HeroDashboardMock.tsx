"use client";

import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
  { month: 'Jan', revenue: 120 },
  { month: 'Feb', revenue: 180 },
  { month: 'Mar', revenue: 230 },
  { month: 'Apr', revenue: 300 },
  { month: 'May', revenue: 360 },
  { month: 'Jun', revenue: 420 },
];

export default function HeroDashboardMock() {
  return (
    <div className="rounded-2xl bg-white/6 backdrop-blur-md p-4 shadow-soft">
      <div className="h-40 w-[520px] max-w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#cbd5e1' }} />
            <YAxis tick={{ fill: '#cbd5e1' }} />
            <Tooltip wrapperStyle={{ background: '#0A192F', borderRadius: 6 }} />
            <Bar dataKey="revenue" fill="#D4AF37" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 h-24 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 0, right: 12, left: -10, bottom: 0 }}>
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
            <YAxis tick={{ fill: '#94a3b8' }} />
            <Tooltip wrapperStyle={{ background: '#0A192F', borderRadius: 6 }} />
            <Line type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
