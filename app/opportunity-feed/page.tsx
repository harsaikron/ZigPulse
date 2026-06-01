'use client'
import { useState, useEffect } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import { api } from '@/lib/api'
import type { Opportunity, OpportunityType, Severity } from '@/lib/types'
import { CloudRain, CalendarDays, Train, Sparkles, Users, ArrowRight, Search, Filter } from 'lucide-react'
import { useRouter } from 'next/navigation'

const TYPE_FILTERS: { label: string; value: OpportunityType | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Events', value: 'EVENT' },
  { label: 'Weather', value: 'WEATHER' },
  { label: 'Transport', value: 'TRANSPORT' },
  { label: 'Holidays', value: 'HOLIDAY' },
]

const SEVERITY_COLOR: Record<Severity, string> = {
  CRITICAL: '#FF5252',
  HIGH: '#FFB300',
  MEDIUM: '#0367FC',
  LOW: '#00C853',
}

const TYPE_ICON: Record<OpportunityType, React.ElementType> = {
  WEATHER: CloudRain,
  EVENT: CalendarDays,
  TRANSPORT: Train,
  HOLIDAY: Sparkles,
}

function ScoreRing({ score, size = 48 }: { score: number; size?: number }) {
  const r = (size / 2) - 5
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 85 ? '#FF5252' : score >= 65 ? '#FFB300' : score >= 45 ? '#0367FC' : '#00C853'
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" strokeWidth="4" style={{ stroke: 'var(--color-surface-2)' }} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" strokeWidth="4" stroke={color} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-black" style={{ color }}>{score}</span>
      </div>
    </div>
  )
}

function daysUntil(date: string | null | undefined) {
  if (!date) return null
  const diff = new Date(date).getTime() - Date.now()
  const d = Math.ceil(diff / 86400000)
  if (d <= 0) return 'Today'
  if (d === 1) return 'Tomorrow'
  return `in ${d}d`
}

export default function OpportunityFeedPage() {
  const router = useRouter()
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState<OpportunityType | 'ALL'>('ALL')
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.getOpportunities(1).then(r => {
      setOpportunities(r.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filtered = opportunities.filter(o => {
    if (typeFilter !== 'ALL' && o.type !== typeFilter) return false
    if (search && !o.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Opportunity Feed" />
        <main className="flex-1 p-6 space-y-6">

          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div>
              <h1 className="text-2xl font-black" style={{ color: 'var(--color-text-1)' }}>Opportunities</h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-3)' }}>
                {filtered.length} active opportunities sorted by score
              </p>
            </div>
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-3)' }} />
              <input
                type="text"
                placeholder="Search opportunities..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl text-sm border outline-none w-64"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text-1)' }}
              />
            </div>
          </div>

          {/* Type filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {TYPE_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setTypeFilter(f.value)}
                className="px-4 py-1.5 rounded-xl text-sm font-semibold transition-all"
                style={typeFilter === f.value
                  ? { backgroundColor: 'var(--color-primary)', color: '#fff' }
                  : { backgroundColor: 'var(--color-surface-2)', color: 'var(--color-text-2)', border: '1px solid var(--color-border)' }
                }
              >
                {f.label}
                {f.value !== 'ALL' && (
                  <span className="ml-1.5 text-xs opacity-70">
                    {opportunities.filter(o => o.type === f.value).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Cards grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-44 rounded-2xl animate-pulse" style={{ backgroundColor: 'var(--color-surface-2)' }} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map(opp => {
                const Icon = TYPE_ICON[opp.type]
                const color = SEVERITY_COLOR[opp.severity]
                const due = daysUntil(opp.startDate)
                return (
                  <div
                    key={opp.id}
                    className="rounded-2xl p-5 flex flex-col gap-3"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderLeft: `4px solid ${color}`,
                    }}
                  >
                    {/* Top row */}
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${color}15` }}>
                        <Icon size={18} style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide"
                            style={{ backgroundColor: `${color}20`, color }}>
                            {opp.severity}
                          </span>
                          <span className="text-[10px] font-medium uppercase tracking-wide"
                            style={{ color: 'var(--color-text-3)' }}>
                            {opp.type}
                          </span>
                          {due && (
                            <span className="text-[10px] font-semibold" style={{ color: 'var(--color-text-3)' }}>
                              · {due}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-bold truncate" style={{ color: 'var(--color-text-1)' }}>
                          {opp.title}
                        </p>
                        {opp.location && (
                          <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--color-text-3)' }}>
                            {opp.location}
                          </p>
                        )}
                      </div>
                      <ScoreRing score={opp.score} size={48} />
                    </div>

                    {/* Reasons */}
                    <ul className="space-y-0.5">
                      {opp.reasons.slice(0, 2).map((r, i) => (
                        <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: 'var(--color-text-2)' }}>
                          <span style={{ color }}>·</span> {r}
                        </li>
                      ))}
                    </ul>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-1 border-t"
                      style={{ borderColor: 'var(--color-border)' }}>
                      <span className="text-xs flex items-center gap-1" style={{ color: 'var(--color-text-3)' }}>
                        <Users size={11} /> {opp.potentialReach.toLocaleString()} reach
                      </span>
                      <button
                        onClick={() => router.push(`/campaign-studio?opportunity=${opp.id}`)}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
                        style={{ backgroundColor: color, color: '#fff' }}
                      >
                        Generate Campaign <ArrowRight size={11} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Filter size={40} style={{ color: 'var(--color-text-3)' }} />
              <p className="text-sm" style={{ color: 'var(--color-text-3)' }}>No opportunities match your filter</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
