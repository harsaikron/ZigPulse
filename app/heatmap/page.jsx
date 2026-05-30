'use client'
import { useSSE } from '@/hooks/useSSE'
import { useState } from 'react'
import TopBar from '@/components/layout/TopBar'
import { X, MapPin, TrendingUp, Car, AlertTriangle } from 'lucide-react'
import { formatNumber } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

// Singapore planning areas with approximate SVG coordinates (viewBox 0 0 500 400)
const ZONES = [
  // Central
  { name: 'CBD',           x: 248, y: 230, r: 22, region: 'Central' },
  { name: 'Marina Bay',    x: 272, y: 248, r: 18, region: 'Central' },
  { name: 'Orchard',       x: 218, y: 202, r: 20, region: 'Central' },
  { name: 'Bugis',         x: 262, y: 204, r: 16, region: 'Central' },
  { name: 'Dhoby Ghaut',   x: 238, y: 208, r: 14, region: 'Central' },
  { name: 'Chinatown',     x: 248, y: 248, r: 15, region: 'Central' },
  { name: 'Little India',  x: 248, y: 192, r: 15, region: 'Central' },
  { name: 'Novena',        x: 218, y: 182, r: 16, region: 'Central' },
  // North
  { name: 'Woodlands',     x: 175, y:  72, r: 20, region: 'North'   },
  { name: 'Yishun',        x: 218, y:  88, r: 18, region: 'North'   },
  { name: 'Sembawang',     x: 192, y:  72, r: 14, region: 'North'   },
  { name: 'Bishan',        x: 228, y: 152, r: 16, region: 'North'   },
  { name: 'Toa Payoh',     x: 238, y: 168, r: 16, region: 'Central' },
  // East
  { name: 'Tampines',      x: 368, y: 192, r: 20, region: 'East'    },
  { name: 'Changi Airport',x: 418, y: 218, r: 22, region: 'East'    },
  { name: 'Pasir Ris',     x: 392, y: 172, r: 16, region: 'East'    },
  { name: 'Bedok',         x: 332, y: 232, r: 18, region: 'East'    },
  // West
  { name: 'Jurong East',   x:  88, y: 238, r: 20, region: 'West'    },
  { name: 'Boon Lay',      x:  62, y: 252, r: 15, region: 'West'    },
  { name: 'Clementi',      x: 132, y: 248, r: 16, region: 'West'    },
  // South
  { name: 'Sentosa',       x: 232, y: 298, r: 16, region: 'South'   },
  { name: 'Harbourfront',  x: 222, y: 272, r: 14, region: 'South'   },
]

const REGION_COLORS = {
  Central: '#0057FF',
  North:   '#7C3AED',
  East:    '#059669',
  West:    '#D97706',
  South:   '#DB2777',
}

function scoreToFill(score) {
  if (score >= 85) return '#EF4444'
  if (score >= 65) return '#F97316'
  if (score >= 45) return '#EAB308'
  return '#22C55E'
}

function scoreLabel(score) {
  if (score >= 85) return 'Critical'
  if (score >= 65) return 'High'
  if (score >= 45) return 'Medium'
  return 'Low'
}

function DemandBar({ label, value, max, color }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-500 font-medium">{label}</span>
        <span className="text-gray-800 font-bold">{formatNumber(value)}</span>
      </div>
      <div className="bg-gray-100 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-700"
          style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: color }}
        />
      </div>
    </div>
  )
}

export default function HeatmapPage() {
  const { data, status } = useSSE('/api/stream/heatmap')
  const zones = Array.isArray(data) ? data : []
  const [selected, setSelected] = useState(null)
  const [hoveredZone, setHoveredZone] = useState(null)

  const zoneMap = Object.fromEntries(zones.map(z => [z.name, z]))

  // Top 5 zones by score
  const topZones = [...zones].sort((a, b) => b.score - a.score).slice(0, 5)
  const maxDemand = Math.max(...zones.map(z => z.demand), 1)

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0F1E]">
      <TopBar title="Area Heatmap" />
      <div className="p-6 flex flex-col xl:flex-row gap-5 flex-1">

        {/* ── LEFT: Map ── */}
        <div className="flex-1 flex flex-col gap-5">
          {/* Legend + status */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-5">
              {[['Critical', '#EF4444'], ['High', '#F97316'], ['Medium', '#EAB308'], ['Low', '#22C55E']].map(([lbl, col]) => (
                <div key={lbl} className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: col }} />
                  <span className="text-gray-400 text-xs font-medium">{lbl}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-2 h-2 bg-green-400 rounded-full live-pulse" />
              Live · updates every 60s
            </div>
          </div>

          {/* Map card */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl overflow-hidden flex-1" style={{ minHeight: 460 }}>
            {/* Map header */}
            <div className="px-5 py-4 border-b border-[#1F2937] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#0057FF]" />
                <span className="text-white font-bold">Singapore — Live Demand Map</span>
              </div>
              <div className="flex gap-2">
                {Object.entries(REGION_COLORS).map(([r, c]) => (
                  <span key={r} className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: `${c}22`, color: c }}>
                    {r}
                  </span>
                ))}
              </div>
            </div>

            {/* SVG map */}
            <svg
              viewBox="0 0 500 360"
              className="w-full"
              style={{ maxHeight: 420 }}
              aria-label="Singapore demand heatmap"
            >
              {/* Dark ocean background */}
              <rect width="500" height="360" fill="#0d1526" />

              {/* Singapore island — rough polygon */}
              <polygon
                points="80,110 120,70 165,55 210,48 255,45 300,50 345,65 390,85 430,110 445,140 448,170 440,200 420,230 390,250 355,268 310,278 265,282 220,278 175,265 140,250 108,232 85,208 72,180 70,150"
                fill="#131d30"
                stroke="#1e2d42"
                strokeWidth="1"
              />

              {/* Johor (north) */}
              <rect x="0" y="0" width="500" height="50" fill="#0d1526" opacity="0.4" />
              <text x="250" y="28" textAnchor="middle" fontSize="9" fill="#2a3a52" fontWeight="600">JOHOR BAHRU, MALAYSIA</text>
              <line x1="0" y1="48" x2="500" y2="48" stroke="#1e2d42" strokeWidth="0.5" strokeDasharray="4,4" />

              {/* Sea label */}
              <text x="460" y="290" textAnchor="middle" fontSize="8" fill="#1e2d42" fontWeight="500">SOUTH CHINA SEA</text>

              {/* Causeway */}
              <line x1="168" y1="48" x2="175" y2="72" stroke="#2a3a52" strokeWidth="2" />
              <text x="155" y="62" fontSize="6.5" fill="#2a3a52">Causeway</text>

              {/* MRT lines (simplified) */}
              {/* NS Line */}
              <polyline points="218,88 228,120 228,152 238,168 238,192 248,230" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.35" strokeLinecap="round" />
              {/* EW Line */}
              <polyline points="62,252 88,238 132,248 178,240 218,232 248,230 290,230 332,232 368,220" fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.35" strokeLinecap="round" />
              {/* CC Line */}
              <polyline points="218,182 228,168 248,160 272,168 288,190 290,220" fill="none" stroke="#f97316" strokeWidth="1.5" opacity="0.35" strokeLinecap="round" />
              {/* DT Line */}
              <polyline points="175,72 192,110 218,148 238,168 252,190 272,204 300,218" fill="none" stroke="#0057FF" strokeWidth="1.5" opacity="0.35" strokeLinecap="round" />

              {/* Zone circles */}
              {ZONES.map(zone => {
                const zd = zoneMap[zone.name]
                const score = zd?.score ?? 0
                const fill = zd ? scoreToFill(score) : '#374151'
                const isSelected = selected?.name === zone.name
                const isHovered = hoveredZone === zone.name

                return (
                  <g
                    key={zone.name}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelected(zd ? (selected?.name === zone.name ? null : { ...zd, name: zone.name, region: zone.region }) : null)}
                    onMouseEnter={() => setHoveredZone(zone.name)}
                    onMouseLeave={() => setHoveredZone(null)}
                  >
                    {/* Pulse ring for high demand */}
                    {score >= 65 && (
                      <circle cx={zone.x} cy={zone.y} r={zone.r + 6} fill={fill} opacity="0.12">
                        <animate attributeName="r" values={`${zone.r + 4};${zone.r + 10};${zone.r + 4}`} dur="2.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.15;0.03;0.15" dur="2.5s" repeatCount="indefinite" />
                      </circle>
                    )}

                    {/* Selection ring */}
                    {isSelected && (
                      <circle cx={zone.x} cy={zone.y} r={zone.r + 7} fill="none" stroke="white" strokeWidth="1.5" opacity="0.6" />
                    )}

                    {/* Main circle */}
                    <circle
                      cx={zone.x} cy={zone.y} r={isHovered || isSelected ? zone.r + 2 : zone.r}
                      fill={fill}
                      opacity={isHovered || isSelected ? 1 : 0.82}
                      className="transition-all duration-200"
                    />

                    {/* Score label inside circle */}
                    {zone.r >= 16 && (
                      <text x={zone.x} y={zone.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize="8" fontWeight="700" fill="white">
                        {score}
                      </text>
                    )}

                    {/* Zone name */}
                    <text
                      x={zone.x} y={zone.y + zone.r + 9}
                      textAnchor="middle"
                      fontSize={isHovered || isSelected ? "7.5" : "6.5"}
                      fontWeight={isHovered || isSelected ? "700" : "500"}
                      fill={isHovered || isSelected ? "white" : "#9CA3AF"}
                      className="transition-all duration-150"
                      style={{ userSelect: 'none' }}
                    >
                      {zone.name.length > 9 ? zone.name.split(' ')[0] : zone.name}
                    </text>
                  </g>
                )
              })}

              {/* Hover tooltip */}
              {hoveredZone && !selected && (() => {
                const z = ZONES.find(z => z.name === hoveredZone)
                const zd = zoneMap[hoveredZone]
                if (!z || !zd) return null
                const tx = z.x > 380 ? z.x - 90 : z.x + z.r + 8
                const ty = z.y > 280 ? z.y - 50 : z.y - 10
                return (
                  <g>
                    <rect x={tx} y={ty} width="85" height="44" rx="6" fill="#1F2937" stroke="#374151" strokeWidth="0.5" />
                    <text x={tx + 8} y={ty + 14} fontSize="8" fontWeight="700" fill="white">{hoveredZone}</text>
                    <text x={tx + 8} y={ty + 25} fontSize="7" fill="#9CA3AF">Demand: {formatNumber(zd.demand)}</text>
                    <text x={tx + 8} y={ty + 35} fontSize="7" fill="#9CA3AF">Score: {zd.score}/100</text>
                  </g>
                )
              })()}
            </svg>
          </div>

          {/* Region summary pills */}
          <div className="grid grid-cols-5 gap-3">
            {Object.entries(REGION_COLORS).map(([region, color]) => {
              const regionZones = zones.filter(z => ZONES.find(zc => zc.name === z.name && zc.region === region))
              const avgScore = regionZones.length ? Math.round(regionZones.reduce((s, z) => s + z.score, 0) / regionZones.length) : 0
              return (
                <div key={region} className="bg-[#111827] border border-[#1F2937] rounded-xl p-3 text-center">
                  <div className="w-6 h-6 rounded-full mx-auto mb-2" style={{ background: `${color}33`, border: `2px solid ${color}` }}>
                    <span className="sr-only">{region}</span>
                  </div>
                  <p className="text-gray-400 text-xs font-medium">{region}</p>
                  <p className="text-white font-black text-lg mt-0.5" style={{ color }}>{avgScore}</p>
                  <p className="text-gray-500 text-xs">avg score</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── RIGHT: Demand panel ── */}
        <div className="xl:w-80 flex flex-col gap-4">

          {/* Selected zone detail */}
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="bg-[#111827] border border-[#1F2937] rounded-2xl overflow-hidden"
              >
                {/* Zone header */}
                <div className="p-5 border-b border-[#1F2937]" style={{ background: `${REGION_COLORS[selected.region]}18` }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${REGION_COLORS[selected.region]}33`, color: REGION_COLORS[selected.region] }}>
                        {selected.region} Region
                      </span>
                      <h3 className="text-white font-black text-2xl mt-2">{selected.name}</h3>
                    </div>
                    <button
                      onClick={() => setSelected(null)}
                      className="w-8 h-8 rounded-lg bg-[#1F2937] hover:bg-[#374151] text-gray-400 hover:text-white flex items-center justify-center transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  {/* Score badge */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="text-4xl font-black" style={{ color: scoreToFill(selected.score) }}>
                      {selected.score}
                      <span className="text-base text-gray-500 font-normal">/100</span>
                    </div>
                    <span className="text-sm font-bold px-2.5 py-1 rounded-full" style={{ background: `${scoreToFill(selected.score)}22`, color: scoreToFill(selected.score) }}>
                      {scoreLabel(selected.score)}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-5">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#0A0F1E] rounded-xl p-3">
                      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Demand</p>
                      <p className="text-white font-black text-2xl mt-1">{formatNumber(selected.demand)}</p>
                      <p className="text-gray-500 text-xs mt-0.5">trips / hr</p>
                    </div>
                    <div className="bg-[#0A0F1E] rounded-xl p-3">
                      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Supply</p>
                      <p className="text-white font-black text-2xl mt-1">{formatNumber(selected.supply)}</p>
                      <p className="text-gray-500 text-xs mt-0.5">taxis active</p>
                    </div>
                  </div>

                  {/* Coverage bar */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-500 font-medium">Coverage rate</span>
                      <span className="text-white font-bold">{Math.min(100, Math.round((selected.supply / selected.demand) * 100))}%</span>
                    </div>
                    <div className="bg-[#1F2937] rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min(100, (selected.supply / selected.demand) * 100)}%`,
                          background: scoreToFill(selected.score),
                        }}
                      />
                    </div>
                  </div>

                  {/* Gap & recommendation */}
                  <div className="rounded-xl p-4" style={{ background: '#0057FF18', border: '1px solid #0057FF44' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Car size={14} className="text-[#0057FF]" />
                      <p className="text-[#0057FF] text-xs font-bold uppercase tracking-wide">Fleet Recommendation</p>
                    </div>
                    <p className="text-white font-bold text-lg">
                      Deploy +{Math.max(0, Math.round((selected.demand - selected.supply) / 10))} taxis
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Unmet demand: {formatNumber(Math.max(0, selected.demand - selected.supply))} trips/hr
                    </p>
                  </div>

                  {selected.score >= 65 && (
                    <div className="rounded-xl p-3 flex items-start gap-2" style={{ background: '#EF444418', border: '1px solid #EF444444' }}>
                      <AlertTriangle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-red-300 text-xs font-medium">High demand zone — prioritise repositioning immediately</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#111827] border border-[#1F2937] rounded-2xl p-5 text-center"
              >
                <MapPin size={28} className="mx-auto text-[#1F2937] mb-2" />
                <p className="text-gray-500 text-sm">Click any zone on the map to see detailed demand data</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top 5 hot zones */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-[#F5C400]" />
              <h3 className="text-white font-bold">Top 5 Hot Zones</h3>
            </div>
            <div className="space-y-3">
              {topZones.map((z, i) => (
                <button
                  key={z.name}
                  onClick={() => setSelected(selected?.name === z.name ? null : { ...z, region: ZONES.find(zc => zc.name === z.name)?.region ?? 'Central' })}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left min-h-[56px] ${selected?.name === z.name ? 'bg-[#0057FF]/10 border border-[#0057FF]/30' : 'hover:bg-[#1F2937]'}`}
                >
                  <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0" style={{ background: i === 0 ? '#F5C400' : '#1F2937', color: i === 0 ? '#0057FF' : '#9CA3AF' }}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{z.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-[#0A0F1E] rounded-full h-1.5">
                        <div className="h-1.5 rounded-full" style={{ width: `${z.score}%`, background: scoreToFill(z.score) }} />
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-black flex-shrink-0" style={{ color: scoreToFill(z.score) }}>{z.score}</span>
                </button>
              ))}
            </div>
          </div>

          {/* All zones demand bars */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-5">
            <h3 className="text-white font-bold mb-4">Zone Demand Overview</h3>
            <div className="space-y-3 overflow-y-auto" style={{ maxHeight: 280 }}>
              {[...zones].sort((a, b) => b.demand - a.demand).map(z => (
                <DemandBar
                  key={z.name}
                  label={z.name}
                  value={z.demand}
                  max={maxDemand}
                  color={scoreToFill(z.score)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
