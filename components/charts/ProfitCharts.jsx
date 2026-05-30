'use client'
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

export function ProfitLineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={240} aria-label="Daily profit projection chart">
      <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
        <XAxis dataKey="date" stroke="#4B5563" tick={{ fill: '#9CA3AF', fontSize: 11 }} tickFormatter={v => v.slice(5)} />
        <YAxis stroke="#4B5563" tick={{ fill: '#9CA3AF', fontSize: 11 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
        <Tooltip
          contentStyle={{ background: '#111827', border: '1px solid #1F2937', borderRadius: 12, fontSize: 14 }}
          formatter={v => [`$${v.toLocaleString()}`, 'Revenue']}
        />
        <Line type="monotone" dataKey="revenue" stroke="#0057FF" strokeWidth={2.5} dot={false} animationDuration={1000} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function RevenueDonut({ normal, event, rain }) {
  const d = [
    { name: 'Normal Days', value: Math.max(0, normal) },
    { name: 'Event Days', value: Math.max(0, event) },
    { name: 'Rainy Days', value: Math.max(0, rain) },
  ]
  const COLORS = ['#0057FF', '#F5C400', '#22C55E']
  return (
    <ResponsiveContainer width="100%" height={200} aria-label="Revenue split donut chart">
      <PieChart>
        <Pie data={d} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value" animationDuration={800}>
          {d.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
        </Pie>
        <Tooltip
          contentStyle={{ background: '#111827', border: '1px solid #1F2937', borderRadius: 12, fontSize: 14 }}
          formatter={v => [`$${v.toLocaleString()}`, '']}
        />
        <Legend wrapperStyle={{ color: '#9CA3AF', fontSize: 13 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
