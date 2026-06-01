'use client'
import { useState, useEffect } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import { useRouter } from 'next/navigation'
import type { TransportAlert, Severity } from '@/lib/types'
import { Train, AlertTriangle, Clock, TrendingUp, Wand2, MapPin, Construction } from 'lucide-react'

const SEVERITY_COLOR: Record<Severity, string> = {
  CRITICAL: '#FF5252',
  HIGH: '#FFB300',
  MEDIUM: '#0367FC',
  LOW: '#00C853',
}

const TYPE_ICON: Record<string, React.ElementType> = {
  MRT_DISRUPTION: Train,
  ROAD_CLOSURE: MapPin,
  MAINTENANCE: Construction,
}

const TYPE_LABEL: Record<string, string> = {
  MRT_DISRUPTION: 'MRT Disruption',
  ROAD_CLOSURE: 'Road Closure',
  MAINTENANCE: 'Maintenance',
}

const FILTERS = ['All', 'MRT_DISRUPTION', 'ROAD_CLOSURE', 'MAINTENANCE']

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('en-SG', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

export default function TransportPage() {
  const router = useRouter()
  const [alerts, setAlerts] = useState<TransportAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState('All')

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/transport/alerts`)
      .then(r => r.json())
      .then(data => { setAlerts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = typeFilter === 'All' ? alerts : alerts.filter(a => a.type === typeFilter)

  const totalUplift = alerts.reduce((s, a) => s + a.demandUplift, 0)
  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL' || a.severity === 'HIGH').length

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Transport Intelligence" />
        <main className="flex-1 p-6 space-y-6">

          <div>
            <h1 className="text-2xl font-black" style={{ color: 'var(--color-text-1)' }}>Transport Intelligence</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-3)' }}>MRT disruptions · Road closures · Maintenance windows</p>
          </div>

          {/* KPI row */}
          {!loading && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--color-text-3)' }}>Active Alerts</p>
                <p className="text-3xl font-black" style={{ color: 'var(--color-danger)' }}>{alerts.length}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-3)' }}>{criticalCount} high severity</p>
              </div>
              <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--color-text-3)' }}>Combined Uplift</p>
                <p className="text-3xl font-black" style={{ color: '#00C853' }}>+{totalUplift}%</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-3)' }}>taxi demand opportunity</p>
              </div>
              <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--color-text-3)' }}>Data Source</p>
                <p className="text-base font-bold" style={{ color: 'var(--color-text-1)' }}>LTA DataMall</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-3)' }}>Phase 2 live feed</p>
              </div>
            </div>
          )}

          {/* Filter */}
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map(f => (
              <button key={f} onClick={() => setTypeFilter(f)}
                className="px-4 py-1.5 rounded-xl text-sm font-semibold transition-all"
                style={typeFilter === f
                  ? { backgroundColor: 'var(--color-primary)', color: '#fff' }
                  : { backgroundColor: 'var(--color-surface-2)', color: 'var(--color-text-2)', border: '1px solid var(--color-border)' }
                }>
                {f === 'All' ? 'All' : TYPE_LABEL[f]}
                {f !== 'All' && (
                  <span className="ml-1.5 text-xs opacity-70">{alerts.filter(a => a.type === f).length}</span>
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-36 rounded-2xl animate-pulse" style={{ backgroundColor: 'var(--color-surface-2)' }} />)}
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(alert => {
                const color = SEVERITY_COLOR[alert.severity]
                const Icon = TYPE_ICON[alert.type] || AlertTriangle
                return (
                  <div key={alert.id} className="rounded-2xl p-5"
                    style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderLeft: `4px solid ${color}` }}>

                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${color}15` }}>
                        <Icon size={20} style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-bold px-2 py-0.5 rounded"
                            style={{ backgroundColor: `${color}20`, color }}>
                            {alert.severity}
                          </span>
                          <span className="text-xs font-medium" style={{ color: 'var(--color-text-3)' }}>
                            {TYPE_LABEL[alert.type] || alert.type}
                          </span>
                        </div>
                        <p className="text-sm font-bold" style={{ color: 'var(--color-text-1)' }}>
                          {alert.affectedLine || alert.affectedRoad || 'General Alert'}
                        </p>
                        <p className="text-xs mt-1" style={{ color: 'var(--color-text-2)' }}>{alert.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                      <div className="rounded-lg p-2" style={{ backgroundColor: 'var(--color-surface-2)' }}>
                        <p className="text-[10px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: 'var(--color-text-3)' }}>
                          <Clock size={9} className="inline mr-1" />Start
                        </p>
                        <p className="text-xs font-medium" style={{ color: 'var(--color-text-1)' }}>{formatTime(alert.startTime)}</p>
                      </div>
                      {alert.endTime && (
                        <div className="rounded-lg p-2" style={{ backgroundColor: 'var(--color-surface-2)' }}>
                          <p className="text-[10px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: 'var(--color-text-3)' }}>
                            <Clock size={9} className="inline mr-1" />End
                          </p>
                          <p className="text-xs font-medium" style={{ color: 'var(--color-text-1)' }}>{formatTime(alert.endTime)}</p>
                        </div>
                      )}
                      {alert.demandUplift > 0 && (
                        <div className="rounded-lg p-2" style={{ backgroundColor: 'rgba(0,200,83,0.08)' }}>
                          <p className="text-[10px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#00C853' }}>
                            <TrendingUp size={9} className="inline mr-1" />Demand Uplift
                          </p>
                          <p className="text-sm font-black" style={{ color: '#00C853' }}>+{alert.demandUplift}%</p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => router.push('/campaign-studio')}
                      className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl"
                      style={{ backgroundColor: color, color: '#fff' }}>
                      <Wand2 size={13} /> Generate Campaign for This Alert
                    </button>
                  </div>
                )
              })}
              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Train size={40} style={{ color: 'var(--color-text-3)' }} />
                  <p className="text-sm" style={{ color: 'var(--color-text-3)' }}>No alerts of this type</p>
                </div>
              )}
            </div>
          )}

          {/* Phase 2 data sources note */}
          <div className="rounded-2xl p-4 border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
            <p className="text-xs font-bold mb-2" style={{ color: 'var(--color-text-2)' }}>Phase 2 Live Data Sources</p>
            <div className="flex flex-wrap gap-3">
              {['LTA DataMall API', 'LTA Newsroom RSS', 'SMRT Travel Updates', 'SBS Transit Updates'].map(src => (
                <span key={src} className="text-xs px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-text-3)', border: '1px solid var(--color-border)' }}>
                  {src}
                </span>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}
