'use client'
import { useSSE } from '@/hooks/useSSE'
import LiveTile from './LiveTile'
import { AlertTriangle, CheckCircle } from 'lucide-react'

export default function LTAAlertsTile() {
  const { data, status } = useSSE('/api/stream/lta')
  const count = data?.count ?? 0
  const first = data?.alerts?.[0]

  return (
    <LiveTile
      status={status}
      badge={count > 0 ? count : undefined}
      front={
        <div className="flex-1 flex flex-col justify-between mt-1">
          <div className="flex items-center gap-2">
            {count > 0
              ? <AlertTriangle size={18} className="text-red-400" />
              : <CheckCircle size={18} className="text-green-400" />}
            <p className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-widest">LTA Alerts</p>
          </div>
          <div>
            <p className="text-5xl font-black text-white mt-2 tabular-nums">{count}</p>
            <p className="text-[#9CA3AF] text-sm mt-1">
              {count === 0 ? 'All systems normal' : `Active disruption${count > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
      }
      back={
        <div className="flex-1 flex flex-col justify-center text-white mt-1">
          <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest">Affected Line</p>
          {first ? (
            <>
              <p className="text-lg font-bold mt-2 leading-tight">{first.line}</p>
              <p className="text-blue-200 text-sm mt-1">{first.type}</p>
              <p className="text-[#F5C400] text-sm mt-2 font-bold">+{first.demandUplift}% taxi demand</p>
            </>
          ) : (
            <p className="text-blue-200 text-sm mt-2">No disruptions right now</p>
          )}
        </div>
      }
    />
  )
}
