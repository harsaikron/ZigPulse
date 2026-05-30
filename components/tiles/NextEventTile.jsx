'use client'
import { useSSE } from '@/hooks/useSSE'
import LiveTile from './LiveTile'
import { Calendar } from 'lucide-react'

export default function NextEventTile() {
  const { data, status } = useSSE('/api/stream/events')
  const next = Array.isArray(data) ? data[0] : null

  return (
    <LiveTile
      status={status}
      front={
        <div className="flex-1 flex flex-col justify-between mt-1">
          <div>
            <p className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-widest flex items-center gap-1">
              <Calendar size={11} /> Next Event
            </p>
            <p className="text-white font-bold text-lg mt-2 leading-tight line-clamp-2">
              {next?.name ?? 'Loading...'}
            </p>
            <p className="text-[#F5C400] text-sm mt-1 font-medium">{next?.zone}</p>
          </div>
          <div className="text-4xl font-black text-[#F5C400] mt-2">
            {next?.daysUntil ?? '—'}
            <span className="text-base font-normal text-[#9CA3AF] ml-1">days away</span>
          </div>
        </div>
      }
      back={
        <div className="flex-1 flex flex-col justify-center text-white mt-1">
          <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest">Demand Impact</p>
          <p className="text-5xl font-black text-[#F5C400] mt-2">+{next?.demandSurge ?? 0}%</p>
          <p className="text-blue-200 text-sm mt-2">+{next?.recommendedFleet ?? 0} taxis recommended</p>
        </div>
      }
    />
  )
}
