'use client'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function ElNinoChart({ data, dayRange }) {
  const sliced = data?.slice(0, dayRange) ?? []
  return (
    <ResponsiveContainer width="100%" height={280} aria-label="El Niño projection chart">
      <AreaChart data={sliced} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0057FF" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#0057FF" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F5C400" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#F5C400" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis dataKey="day" stroke="#CBD5E1" tick={{ fill: '#94A3B8', fontSize: 12 }} tickFormatter={v => `Day ${v}`} />
        <YAxis stroke="#CBD5E1" tick={{ fill: '#94A3B8', fontSize: 12 }} />
        <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, fontSize: 14, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }} />
        <Legend wrapperStyle={{ color: '#64748B', fontSize: 14, paddingTop: 12 }} />
        <Area type="monotone" dataKey="rainProb" stroke="#0057FF" fill="url(#rainGrad)" name="Rain Prob %" strokeWidth={2} animationDuration={1200} />
        <Area type="monotone" dataKey="demandUplift" stroke="#F5C400" fill="url(#demandGrad)" name="Demand Uplift %" strokeWidth={2} animationDuration={1400} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
