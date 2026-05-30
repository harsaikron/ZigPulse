'use client'
import { useSSE } from '@/hooks/useSSE'
import LiveTile from './LiveTile'
import { formatSGD } from '@/lib/utils'

export default function ProfitTodayTile() {
  const { data, status } = useSSE('/api/stream/demand')
  const revenue = data ? Math.round(data.totalActive * 14 * 12 * 0.4) : 0
  const netProfit = Math.round(revenue * 0.28)

  return (
    <LiveTile
      status={status}
      front={
        <div className="flex-1 flex flex-col justify-between mt-1">
          <p className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-widest">Today's Revenue</p>
          <div>
            <p className="text-2xl font-black text-white mt-2">{formatSGD(revenue)}</p>
            <p className="text-green-400 text-sm mt-1 font-semibold flex items-center gap-1">
              ↑ 8.3% vs yesterday
            </p>
          </div>
        </div>
      }
      back={
        <div className="flex-1 flex flex-col justify-center text-white mt-1">
          <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest">Net Profit Est.</p>
          <p className="text-2xl font-black text-[#F5C400] mt-2">{formatSGD(netProfit)}</p>
          <p className="text-blue-200 text-sm mt-1">~28% margin</p>
        </div>
      }
    />
  )
}
