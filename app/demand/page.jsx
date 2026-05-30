'use client'
import { useSSE } from '@/hooks/useSSE'
import { generateForecast } from '@/lib/mock/demand'
import { useMemo } from 'react'
import TopBar from '@/components/layout/TopBar'
import DemandForecastChart from '@/components/charts/DemandForecastChart'
import ZoneDemandChart from '@/components/charts/ZoneDemandChart'
import StatusDot from '@/components/tiles/StatusDot'
import { formatNumber } from '@/lib/utils'

export default function DemandPage() {
  const { data, status } = useSSE('/api/stream/demand')
  const forecast = useMemo(() => generateForecast(60), [])

  const kpis = [
    { label: 'Total Demand', value: formatNumber(data?.totalDemand ?? 0), sub: 'trips/hr', accent: '#0057FF' },
    { label: 'Active Taxis', value: formatNumber(data?.totalActive ?? 0), sub: 'vehicles', accent: '#059669' },
    { label: 'Fleet Utilisation', value: `${data?.utilizationRate ?? 0}%`, sub: 'of capacity', accent: '#F59E0B' },
    { label: 'Top Zone', value: data?.zones?.[0]?.name ?? '—', sub: `Score ${data?.zones?.[0]?.score ?? 0}/100`, accent: '#7C3AED' },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Supply & Demand" />
      <div className="p-6 space-y-6">
        {/* KPI strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map(({ label, value, sub, accent }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">{label}</p>
              <p className="text-3xl font-black mt-2" style={{ color: accent }}>{value}</p>
              <p className="text-slate-400 text-sm mt-1">{sub}</p>
            </div>
          ))}
        </div>

        {/* 60-day forecast */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">60-Day Demand Forecast</h2>
              <p className="text-slate-400 text-sm">Demand vs supply projection with event & weather factors</p>
            </div>
            <StatusDot status={status} />
          </div>
          <DemandForecastChart data={forecast} />
        </div>

        {/* Zone breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Zone Demand Breakdown</h2>
            <ZoneDemandChart zones={data?.zones} />
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Live Zone Rankings</h2>
            <div className="space-y-3 overflow-y-auto" style={{ maxHeight: 300 }}>
              {data?.zones?.map((z, i) => (
                <div key={z.name} className="flex items-center gap-3">
                  <span className="text-slate-400 font-mono text-sm w-6 flex-shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-900 font-medium text-sm">{z.name}</span>
                      <span className="text-[#F5C400] font-bold text-sm">{z.score}/100</span>
                    </div>
                    <div className="bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-[#0057FF] h-2 rounded-full transition-all duration-700"
                        style={{ width: `${z.score}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
