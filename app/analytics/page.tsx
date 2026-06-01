'use client'
import { useState, useEffect } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import type { Opportunity } from '@/lib/types'
import { api } from '@/lib/api'
import { BarChart3, TrendingUp, Users, Zap } from 'lucide-react'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const TYPE_COLOR: Record<string, string> = {
  EVENT: '#0367FC',
  WEATHER: '#60A5FA',
  TRANSPORT: '#FFB300',
  HOLIDAY: '#7C3AED',
}

const SEVERITY_COLOR: Record<string, string> = {
  CRITICAL: '#FF5252',
  HIGH: '#FFB300',
  MEDIUM: '#0367FC',
  LOW: '#00C853',
}

export default function AnalyticsPage() {
  const [opps, setOpps] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getOpportunities().then(r => { setOpps(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  // Derived data
  const byType = ['EVENT', 'WEATHER', 'TRANSPORT', 'HOLIDAY'].map(t => ({
    name: t,
    value: opps.filter(o => o.type === t).length,
    color: TYPE_COLOR[t],
  })).filter(d => d.value > 0)

  const bySeverity = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(s => ({
    name: s,
    count: opps.filter(o => o.severity === s).length,
    avgScore: Math.round(opps.filter(o => o.severity === s).reduce((a, o) => a + o.score, 0) / (opps.filter(o => o.severity === s).length || 1)),
    color: SEVERITY_COLOR[s],
  }))

  const scoreDistribution = [
    { range: '0–20', count: opps.filter(o => o.score <= 20).length },
    { range: '21–40', count: opps.filter(o => o.score > 20 && o.score <= 40).length },
    { range: '41–60', count: opps.filter(o => o.score > 40 && o.score <= 60).length },
    { range: '61–80', count: opps.filter(o => o.score > 60 && o.score <= 80).length },
    { range: '81–100', count: opps.filter(o => o.score > 80).length },
  ]

  const totalReach = opps.reduce((s, o) => s + o.potentialReach, 0)
  const avgScore = opps.length ? Math.round(opps.reduce((s, o) => s + o.score, 0) / opps.length) : 0
  const topType = byType.sort((a, b) => b.value - a.value)[0]?.name ?? '—'

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Analytics" />
        <main className="flex-1 p-6 space-y-6">

          <div>
            <h1 className="text-2xl font-black" style={{ color: 'var(--color-text-1)' }}>Analytics</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-3)' }}>Opportunity distribution · Score analysis · Reach metrics</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ backgroundColor: 'var(--color-surface-2)' }} />)}
            </div>
          ) : (
            <>
              {/* KPI row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Opportunities', value: opps.length, sub: 'active right now', icon: Zap, color: 'var(--color-primary)' },
                  { label: 'Average Score', value: avgScore, sub: 'opportunity index', icon: TrendingUp, color: '#FFB300' },
                  { label: 'Total Potential Reach', value: totalReach.toLocaleString(), sub: 'combined reach', icon: Users, color: '#00C853' },
                  { label: 'Top Category', value: topType, sub: 'most opportunities', icon: BarChart3, color: '#7C3AED' },
                ].map(kpi => (
                  <div key={kpi.label} className="rounded-2xl p-4 flex items-start gap-3"
                    style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${kpi.color}20` }}>
                      <kpi.icon size={18} style={{ color: kpi.color }} />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-3)' }}>{kpi.label}</p>
                      <p className="text-xl font-black mt-0.5" style={{ color: kpi.color }}>{kpi.value}</p>
                      <p className="text-[10px]" style={{ color: 'var(--color-text-3)' }}>{kpi.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Type breakdown pie */}
                <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                  <h2 className="text-base font-bold mb-4" style={{ color: 'var(--color-text-1)' }}>Opportunities by Type</h2>
                  <div className="flex items-center gap-6">
                    <ResponsiveContainer width={160} height={160}>
                      <PieChart>
                        <Pie data={byType} cx="50%" cy="50%" innerRadius={45} outerRadius={72}
                          dataKey="value" paddingAngle={3}>
                          {byType.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2">
                      {byType.map(d => (
                        <div key={d.name} className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                          <span className="text-xs font-medium" style={{ color: 'var(--color-text-2)' }}>{d.name}</span>
                          <span className="text-xs font-bold ml-auto" style={{ color: d.color }}>{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Severity breakdown */}
                <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                  <h2 className="text-base font-bold mb-4" style={{ color: 'var(--color-text-1)' }}>By Severity</h2>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={bySeverity} barSize={28}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-text-3)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-3)' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }} />
                      <Bar dataKey="count" name="Count" radius={[6,6,0,0]}>
                        {bySeverity.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Score distribution */}
              <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <h2 className="text-base font-bold mb-4" style={{ color: 'var(--color-text-1)' }}>Score Distribution</h2>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={scoreDistribution} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="range" tick={{ fontSize: 12, fill: 'var(--color-text-3)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-3)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="count" name="Opportunities" radius={[6,6,0,0]} fill="var(--color-primary)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Top opportunities table */}
              <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <h2 className="text-base font-bold mb-4" style={{ color: 'var(--color-text-1)' }}>Top Opportunities by Score</h2>
                <div className="space-y-2">
                  {[...opps].sort((a, b) => b.score - a.score).slice(0, 5).map((opp, i) => {
                    const color = SEVERITY_COLOR[opp.severity]
                    return (
                      <div key={opp.id} className="flex items-center gap-3 px-3 py-2 rounded-xl"
                        style={{ backgroundColor: 'var(--color-surface-2)' }}>
                        <span className="text-sm font-black w-5 text-center" style={{ color: 'var(--color-text-3)' }}>
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text-1)' }}>{opp.title}</p>
                          <p className="text-xs" style={{ color: 'var(--color-text-3)' }}>{opp.type} · {opp.location}</p>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded font-bold flex-shrink-0"
                          style={{ backgroundColor: `${color}20`, color }}>
                          {opp.severity}
                        </span>
                        <span className="text-lg font-black w-10 text-right flex-shrink-0" style={{ color }}>
                          {opp.score}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
