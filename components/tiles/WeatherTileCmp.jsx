'use client'
import { useSSE } from '@/hooks/useSSE'
import LiveTile from './LiveTile'
import { CloudRain, Sun, Cloud } from 'lucide-react'

const icons = {
  Sunny: Sun,
  'Partly Cloudy': Cloud,
  Cloudy: Cloud,
  'Light Rain': CloudRain,
  'Heavy Rain': CloudRain,
  Thunderstorm: CloudRain,
}

export default function WeatherTileCmp() {
  const { data, status } = useSSE('/api/stream/weather')
  const current = data?.current
  const Icon = icons[current?.condition] ?? Cloud
  const isRain = current?.condition?.includes('Rain') || current?.condition === 'Thunderstorm'

  return (
    <LiveTile
      status={status}
      front={
        <div className="flex-1 flex flex-col justify-between mt-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-widest">Weather</p>
              <p className="text-white font-bold text-lg mt-2">{current?.condition ?? '—'}</p>
              <p className="text-5xl font-black text-white mt-1">
                {current?.high ?? '—'}°<span className="text-2xl text-[#9CA3AF]">C</span>
              </p>
            </div>
            <Icon size={44} className={`mt-2 ${isRain ? 'text-blue-400' : 'text-[#F5C400]'}`} />
          </div>
          <p className="text-sm text-[#9CA3AF]">
            Rain probability: <span className="text-white font-semibold">{current?.rainProb ?? 0}%</span>
          </p>
        </div>
      }
      back={
        <div className="flex-1 flex flex-col justify-center text-white mt-1">
          <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest">El Niño Risk</p>
          <p className="text-5xl font-black text-[#F5C400] mt-2">{data?.elNinoConfidence ?? 0}%</p>
          <div className="bg-[#0041CC] rounded-full h-2.5 mt-3">
            <div className="bg-[#F5C400] h-2.5 rounded-full transition-all" style={{ width: `${data?.elNinoConfidence ?? 0}%` }} />
          </div>
          <p className="text-blue-200 text-xs mt-2">Confidence Level</p>
        </div>
      }
    />
  )
}
