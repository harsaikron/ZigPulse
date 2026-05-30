'use client'
import { useSSE } from '@/hooks/useSSE'
import LiveTile from './LiveTile'
import { formatNumber } from '@/lib/utils'
import { TrendingUp } from 'lucide-react'

export default function ActiveDemandTile() {
  const { data, status } = useSSE('/api/stream/demand')
  const demand = data?.totalDemand ?? 0
  const supply = data?.totalActive ?? 0
  const topZone = data?.zones?.[0]
  const covered = demand > 0 ? Math.min(100, Math.round((supply / demand) * 100)) : 0

  return (
    <LiveTile
      status={status}
      front={
        <div className="flex-1 flex flex-col justify-between mt-1">
          <div>
            <p className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-widest">Live Demand</p>
            <p className="text-5xl font-black text-white mt-2 tabular-nums">{formatNumber(demand)}</p>
            <p className="text-[#9CA3AF] text-sm mt-2">
              Active taxis: <span className="text-[#F5C400] font-bold">{formatNumber(supply)}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex-1 bg-[#1F2937] rounded-full h-2.5">
              <div
                className="bg-[#0057FF] h-2.5 rounded-full transition-all duration-700"
                style={{ width: `${covered}%` }}
              />
            </div>
            <span className="text-xs text-[#9CA3AF] w-16 text-right">{covered}% covered</span>
          </div>
        </div>
      }
      back={
        <div className="flex-1 flex flex-col justify-center text-white mt-1">
          <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest">Top Demand Zone</p>
          <p className="text-3xl font-black mt-2">{topZone?.name ?? '—'}</p>
          <p className="text-blue-200 mt-1 text-sm">{formatNumber(topZone?.demand ?? 0)} trips/hr</p>
          <p className="text-sm mt-2 flex items-center gap-1 text-blue-100">
            <TrendingUp size={14} />
            Score: <span className="font-bold text-[#F5C400] ml-1">{topZone?.score ?? 0}/100</span>
          </p>
        </div>
      }
    />
  )
}
