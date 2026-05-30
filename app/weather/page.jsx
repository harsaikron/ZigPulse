'use client'
import { useSSE } from '@/hooks/useSSE'
import { useState } from 'react'
import TopBar from '@/components/layout/TopBar'
import ElNinoChart from '@/components/charts/ElNinoChart'
import { Sun, Cloud, CloudRain, Droplets, AlertTriangle, Car } from 'lucide-react'

const WeatherIcon = ({ condition, size = 36 }) => {
  const map = { Sunny: Sun, 'Partly Cloudy': Cloud, Cloudy: Cloud, 'Light Rain': CloudRain, 'Heavy Rain': CloudRain, Thunderstorm: CloudRain }
  const Icon = map[condition] ?? Cloud
  const isRain = condition?.includes('Rain') || condition === 'Thunderstorm'
  return <Icon size={size} className={isRain ? 'text-blue-500' : 'text-[#F5C400]'} />
}

export default function WeatherPage() {
  const { data } = useSSE('/api/stream/weather')
  const [dayRange, setDayRange] = useState(30)
  const elNinoHigh = (data?.elNinoConfidence ?? 0) >= 70

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Weather & El Niño" />
      <div className="p-6 space-y-6">
        {/* El Niño alert banner */}
        {elNinoHigh && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle size={22} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-700 font-bold text-lg">High El Niño Risk — {data.elNinoConfidence}% confidence</p>
              <p className="text-amber-600 text-sm mt-1">
                Extended rain periods expected. Position additional taxis in CBD, Orchard and Marina Bay.
                Forecast demand uplift: +15–25%.
              </p>
            </div>
          </div>
        )}

        {/* 7-day forecast */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-slate-900 font-bold text-lg mb-5">7-Day Forecast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {data?.forecast?.map((day, i) => (
              <div
                key={day.date}
                className={`rounded-xl p-4 text-center ${i === 0 ? '' : 'bg-slate-50 border border-slate-100'}`}
                style={i === 0 ? { background: '#0057FF' } : {}}
              >
                <p className={`text-xs font-semibold mb-3 uppercase tracking-wide ${i === 0 ? 'text-blue-200' : 'text-slate-400'}`}>
                  {i === 0 ? 'TODAY' : new Date(day.date).toLocaleDateString('en-SG', { weekday: 'short' }).toUpperCase()}
                </p>
                <div className="flex justify-center mb-3">
                  <WeatherIcon condition={day.condition} size={32} />
                </div>
                <p className={`text-2xl font-black ${i === 0 ? 'text-white' : 'text-slate-900'}`}>{day.high}°</p>
                <p className={`text-xs mt-1 ${i === 0 ? 'text-blue-200' : 'text-slate-400'}`}>{day.low}° low</p>
                <p className={`text-sm mt-2 font-semibold flex items-center justify-center gap-1 ${day.rainProb > 60 ? 'text-blue-500' : i === 0 ? 'text-blue-200' : 'text-slate-400'}`}>
                  <Droplets size={12} />{day.rainProb}%
                </p>
                {day.demandUplift > 0 && (
                  <p className={`text-xs mt-1 font-bold flex items-center justify-center gap-1 ${i === 0 ? 'text-[#F5C400]' : 'text-green-600'}`}>
                    <Car size={11} />+{day.demandUplift}%
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* El Niño projection */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
            <div>
              <h2 className="text-slate-900 font-bold text-lg">El Niño 2026 Projection</h2>
              <p className="text-slate-400 text-sm mt-1">Rainfall probability & taxi demand uplift over next {dayRange} days</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-slate-400 text-sm">Range:</span>
              <input
                type="range" min={7} max={60} step={7} value={dayRange}
                onChange={e => setDayRange(Number(e.target.value))}
                className="w-32 accent-[#0057FF]"
                aria-label="El Niño projection day range"
              />
              <span className="text-slate-900 font-bold w-16">{dayRange} days</span>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-slate-50 border border-slate-100 rounded-xl px-5 py-3">
              <p className="text-slate-400 text-xs font-semibold uppercase">El Niño Confidence</p>
              <p className="text-[#F5C400] font-black text-3xl mt-1">{data?.elNinoConfidence ?? 0}%</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl px-5 py-3">
              <p className="text-slate-400 text-xs font-semibold uppercase">Avg Demand Uplift</p>
              <p className="text-green-600 font-black text-3xl mt-1">+12%</p>
            </div>
          </div>
          <ElNinoChart data={data?.elNinoProjection} dayRange={dayRange} />
        </div>
      </div>
    </div>
  )
}
