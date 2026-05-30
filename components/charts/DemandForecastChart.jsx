'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-4 text-sm min-w-[160px]">
      <p className="text-[#9CA3AF] mb-2 font-medium">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-bold text-base">
          {p.name}: {p.value?.toLocaleString()}
        </p>
      ))}
    </div>
  )
}

export default function DemandForecastChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={320} aria-label="Demand and supply forecast chart">
      <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
        <XAxis dataKey="date" stroke="#4B5563" tick={{ fill: '#9CA3AF', fontSize: 12 }} tickFormatter={v => v.slice(5)} />
        <YAxis stroke="#4B5563" tick={{ fill: '#9CA3AF', fontSize: 12 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ color: '#9CA3AF', fontSize: 14, paddingTop: 12 }} />
        <Line type="monotone" dataKey="demand" stroke="#0057FF" strokeWidth={2.5} dot={false} name="Demand" animationDuration={1200} />
        <Line type="monotone" dataKey="supply" stroke="#F5C400" strokeWidth={2.5} dot={false} name="Supply" animationDuration={1400} />
      </LineChart>
    </ResponsiveContainer>
  )
}
