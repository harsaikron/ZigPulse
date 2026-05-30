'use client'
import { useSSE } from '@/hooks/useSSE'
import { useState } from 'react'
import TopBar from '@/components/layout/TopBar'
import { X, MapPin } from 'lucide-react'
import { formatNumber } from '@/lib/utils'

const ZONE_COORDS = {
  'CBD':            { x: 55, y: 55 },
  'Orchard':        { x: 45, y: 44 },
  'Marina Bay':     { x: 61, y: 59 },
  'Changi Airport': { x: 85, y: 52 },
  'Jurong East':    { x: 18, y: 58 },
  'Woodlands':      { x: 38, y: 18 },
  'Tampines':       { x: 78, y: 47 },
  'Bugis':          { x: 58, y: 48 },
  'Sentosa':        { x: 48, y: 70 },
  'Novena':         { x: 46, y: 37 },
  'Toa Payoh':      { x: 50, y: 34 },
  'Bishan':         { x: 50, y: 27 },
  'Little India':   { x: 52, y: 44 },
  'Chinatown':      { x: 52, y: 58 },
  'Dhoby Ghaut':    { x: 49, y: 48 },
}

function scoreToColor(score) {
  if (score >= 80) return '#EF4444'
  if (score >= 60) return '#F97316'
  if (score >= 40) return '#EAB308'
  return '#22C55E'
}

export default function HeatmapPage() {
  const { data } = useSSE('/api/stream/heatmap')
  const zones = Array.isArray(data) ? data : []
  const [selected, setSelected] = useState(null)
  const zoneMap = Object.fromEntries(zones.map(z => [z.name, z]))

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Area Heatmap" />
      <div className="p-6 flex flex-col lg:flex-row gap-6 flex-1">
        {/* Map */}
        <div className="flex-1 bg-[#111827] border border-[#1F2937] rounded-xl p-5 flex flex-col" style={{ minHeight: 480 }}>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-white font-bold text-lg flex items-center gap-2"><MapPin size={18} className="text-[#0057FF]"/>Singapore Demand Heatmap</h2>
            <div className="flex items-center gap-4 text-xs text-[#9CA3AF]">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"/>Low</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"/>Medium</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500 inline-block"/>High</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"/>Critical</span>
            </div>
          </div>
          <svg viewBox="0 0 100 90" className="w-full flex-1" style={{ maxHeight: 420 }}>
            <rect width="100" height="90" fill="#0A0F1E" rx="3" />
            {/* Singapore rough shape */}
            <polygon
              points="20,25 80,18 90,40 85,65 65,75 48,78 30,70 15,55 12,40"
              fill="#131d2e"
              stroke="#1F2937"
              strokeWidth="0.5"
            />
            {Object.entries(ZONE_COORDS).map(([name, { x, y }]) => {
              const z = zoneMap[name]
              const color = z ? scoreToColor(z.score) : '#374151'
              const isSelected = selected?.name === name
              return (
                <g key={name} onClick={() => setSelected(z ? (selected?.name === name ? null : zoneMap[name]) : null)} style={{ cursor: 'pointer' }}>
                  <circle cx={x} cy={y} r={isSelected ? 7 : 5} fill={color} opacity={0.9} className="transition-all duration-500">
                    <animate attributeName="r" values={isSelected ? "7;8.5;7" : "5;6;5"} dur="3s" repeatCount="indefinite" />
                  </circle>
                  {isSelected && <circle cx={x} cy={y} r={10} fill="none" stroke={color} strokeWidth="0.8" opacity="0.5" />}
                  <text x={x} y={y + 8.5} textAnchor="middle" fontSize="2.2" fill="white" opacity="0.75" style={{ userSelect: 'none' }}>
                    {name.split(' ')[0]}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Side panel */}
        <div className="lg:w-72 bg-[#111827] border border-[#1F2937] rounded-xl p-4 overflow-y-auto" style={{ maxHeight: 560 }}>
          {selected ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg">{selected.name}</h3>
                <button onClick={() => setSelected(null)} className="text-[#9CA3AF] hover:text-white min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg hover:bg-[#1F2937]">
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-3">
                <div className="bg-[#0A0F1E] rounded-xl p-4">
                  <p className="text-[#9CA3AF] text-xs font-semibold uppercase">Demand Score</p>
                  <p className="text-5xl font-black mt-1" style={{ color: scoreToColor(selected.score) }}>
                    {selected.score}<span className="text-base text-[#9CA3AF]">/100</span>
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#0A0F1E] rounded-xl p-3">
                    <p className="text-[#9CA3AF] text-xs">Demand</p>
                    <p className="text-white font-black text-2xl mt-1">{formatNumber(selected.demand)}</p>
                    <p className="text-[#9CA3AF] text-xs">trips/hr</p>
                  </div>
                  <div className="bg-[#0A0F1E] rounded-xl p-3">
                    <p className="text-[#9CA3AF] text-xs">Supply</p>
                    <p className="text-white font-black text-2xl mt-1">{formatNumber(selected.supply)}</p>
                    <p className="text-[#9CA3AF] text-xs">taxis</p>
                  </div>
                </div>
                <div className="bg-[#0057FF] rounded-xl p-4">
                  <p className="text-blue-200 text-xs font-semibold uppercase">Recommendation</p>
                  <p className="text-white font-bold mt-2 text-lg">
                    Deploy {Math.max(0, Math.round((selected.demand - selected.supply) / 10))} more taxis
                  </p>
                  <p className="text-blue-200 text-sm mt-1">to {selected.name}</p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-white font-bold mb-3 text-lg">All Zones</h3>
              <p className="text-[#9CA3AF] text-xs mb-3">Click a zone to see details</p>
              <div className="space-y-1">
                {zones.map(z => (
                  <button
                    key={z.name}
                    onClick={() => setSelected(z)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#1F2937] transition-colors min-h-[48px] text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: scoreToColor(z.score) }} />
                      <span className="text-white text-sm font-medium">{z.name}</span>
                    </div>
                    <span className="text-[#F5C400] font-bold text-sm">{z.score}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
