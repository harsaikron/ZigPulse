'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function ZoneDemandChart({ zones }) {
  return (
    <ResponsiveContainer width="100%" height={300} aria-label="Zone demand bar chart">
      <BarChart data={zones?.slice(0, 10)} margin={{ top: 10, right: 10, left: 0, bottom: 50 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
        <XAxis dataKey="name" stroke="#4B5563" tick={{ fill: '#9CA3AF', fontSize: 11 }} angle={-35} textAnchor="end" interval={0} />
        <YAxis stroke="#4B5563" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
        <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1F2937', borderRadius: 12, fontSize: 14 }} />
        <Bar dataKey="demand" name="Demand" radius={[6, 6, 0, 0]} animationDuration={1000}>
          {zones?.slice(0, 10).map((_, i) => (
            <Cell key={i} fill={i === 0 ? '#F5C400' : i < 3 ? '#0057FF' : '#1F2937'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
