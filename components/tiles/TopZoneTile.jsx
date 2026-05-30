'use client'
import { useSSE } from '@/hooks/useSSE'
import LiveTile from './LiveTile'
import { MapPin } from 'lucide-react'
import { formatNumber } from '@/lib/utils'

export default function TopZoneTile() {
  const { data, status } = useSSE('/api/stream/demand')
  const top = data?.zones?.[0]
  const second = data?.zones?.[1]

  return (
    <LiveTile
      status={status}
      front={
        <div className="flex-1 flex items-center justify-between mt-1 gap-2">
          <div className="min-w-0">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest flex items-center gap-1">
              <MapPin size={11} /> Top Zone
            </p>
            <p className="text-3xl font-black text-slate-900 mt-2 leading-tight truncate">{top?.name ?? '—'}</p>
            <p className="text-[#0057FF] font-bold text-sm mt-1">Score: {top?.score ?? 0}/100</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-slate-400 text-xs">2nd</p>
            <p className="text-xl font-bold text-slate-700 mt-1">{second?.name ?? '—'}</p>
            <p className="text-slate-400 text-sm">{second?.score ?? 0}</p>
          </div>
        </div>
      }
      back={
        <div className="flex-1 flex flex-col justify-center text-white mt-1">
          <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest">Recommended Action</p>
          <p className="text-lg font-bold mt-2">Reposition to {top?.name ?? '—'}</p>
          <p className="text-blue-200 text-sm mt-1">
            Gap: {top ? formatNumber(Math.max(0, top.demand - top.supply)) : 0} unmet trips/hr
          </p>
          <p className="text-[#F5C400] text-sm mt-2 font-bold">
            ↑ Deploy {top ? Math.round(Math.max(0, (top.demand - top.supply) / 10)) : 0} more taxis
          </p>
        </div>
      }
    />
  )
}
