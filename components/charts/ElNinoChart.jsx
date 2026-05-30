'use client'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function ElNinoChart({ data, dayRange }) {
  const sliced = data?.slice(0, dayRange) ?? []
  return (
    <ResponsiveContainer width="100%" height={280} aria-label="El Niño projection chart">
      <AreaChart data={sliced} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0057FF" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#0057FF" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F5C400" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#F5C400" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
        <XAxis dataKey="day" stroke="#4B5563" tick={{ fill: '#9CA3AF', fontSize: 12 }} tickFormatter={v => `Day ${v}`} />
        <YAxis stroke="#4B5563" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
        <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1F2937', borderRadius: 12, fontSize: 14 }} />
        <Legend wrapperStyle={{ color: '#9CA3AF', fontSize: 14, paddingTop: 12 }} />
        <Area type="monotone" dataKey="rainProb" stroke="#0057FF" fill="url(#rainGrad)" name="Rain Prob %" strokeWidth={2} animationDuration={1200} />
        <Area type="monotone" dataKey="demandUplift" stroke="#F5C400" fill="url(#demandGrad)" name="Demand Uplift %" strokeWidth={2} animationDuration={1400} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
