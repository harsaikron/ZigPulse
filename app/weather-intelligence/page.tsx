'use client'
import { useState, useEffect } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import type { WeatherSummary, WeatherDay } from '@/lib/types'
import { Sun, Cloud, CloudRain, Droplets, TrendingUp, AlertTriangle, Car } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LineChart, Line, Legend
} from 'recharts'

const conditionIcon = (condition: string) => {
  if (condition.includes('Rain') || condition === 'Thunderstorm') return CloudRain
  if (condition.includes('Cloud')) return Cloud
  return Sun
}

const conditionColor = (condition: string) => {
  if (condition === 'Thunderstorm') return '#FF5252'
  if (condition.includes('Rain')) return '#60A5FA'
  if (condition.includes('Cloud')) return '#94A3B8'
  return '#F5C400'
}

export default function WeatherIntelligencePage() {
  const [weather, setWeather] = useState<WeatherSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/weather/current`)
      .then(r => r.json())
      .then(data => { setWeather(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const chartData = weather?.forecast.map((d, i) => ({
    day: i === 0 ? 'Today' : new Date(d.date).toLocaleDateString('en-SG', { weekday: 'short' }),
    rainProb: d.rainProb,
    high: d.high,
    low: d.low,
    uplift: d.demandUplift,
  })) ?? []

  const today = weather?.today
  const elNino = weather?.elNinoConfidence ?? 0

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Weather Intelligence" />
        <main className="flex-1 p-6 space-y-6">

          <div>
            <h1 className="text-2xl font-black" style={{ color: 'var(--color-text-1)' }}>Weather Intelligence</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-3)' }}>7-day forecast · El Niño monitoring · Demand uplift signals</p>
          </div>

          {/* El Niño warning */}
          {elNino >= 70 && (
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl border"
              style={{ backgroundColor: 'rgba(255,179,0,0.08)', borderColor: 'rgba(255,179,0,0.3)' }}>
              <AlertTriangle size={18} style={{ color: '#FFB300' }} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold" style={{ color: '#FFB300' }}>High El Niño Confidence — {elNino}%</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-2)' }}>
                  Extended wet periods expected. Position additional vehicles in CBD, Orchard, Marina Bay. Forecast demand uplift +15–25%.
                </p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1,2,3].map(i => <div key={i} className="h-32 rounded-2xl animate-pulse" style={{ backgroundColor: 'var(--color-surface-2)' }} />)}
            </div>
          ) : (
            <>
              {/* KPI row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Today High', value: `${today?.high ?? '--'}°C`, sub: `Low ${today?.low ?? '--'}°C`, color: '#F5C400' },
                  { label: 'Rain Probability', value: `${today?.rainProb ?? '--'}%`, sub: today?.rainProb && today.rainProb >= 70 ? 'High risk' : 'Manageable', color: '#60A5FA' },
                  { label: 'El Niño Confidence', value: `${elNino}%`, sub: elNino >= 70 ? 'Elevated risk' : 'Moderate', color: '#FFB300' },
                  { label: 'Demand Uplift', value: `+${today?.demandUplift ?? 0}%`, sub: 'vs baseline', color: '#00C853' },
                ].map(kpi => (
                  <div key={kpi.label} className="rounded-2xl p-4"
                    style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--color-text-3)' }}>{kpi.label}</p>
                    <p className="text-2xl font-black" style={{ color: kpi.color }}>{kpi.value}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-3)' }}>{kpi.sub}</p>
                  </div>
                ))}
              </div>

              {/* 7-day forecast cards */}
              <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <h2 className="text-base font-bold mb-4" style={{ color: 'var(--color-text-1)' }}>7-Day Forecast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                  {weather?.forecast.map((day, i) => {
                    const Icon = conditionIcon(day.condition)
                    const icolor = conditionColor(day.condition)
                    const isToday = i === 0
                    return (
                      <div key={day.id} className="rounded-xl p-3 text-center flex flex-col items-center gap-1"
                        style={isToday
                          ? { backgroundColor: 'var(--color-primary)', color: '#fff' }
                          : { backgroundColor: 'var(--color-surface-2)', border: day.rainProb >= 70 ? '1px solid #FFB30060' : '1px solid transparent' }
                        }>
                        <span className="text-[10px] font-bold uppercase tracking-wide"
                          style={{ color: isToday ? 'rgba(255,255,255,0.7)' : 'var(--color-text-3)' }}>
                          {isToday ? 'TODAY' : new Date(day.date).toLocaleDateString('en-SG', { weekday: 'short' }).toUpperCase()}
                        </span>
                        <Icon size={22} style={{ color: isToday ? '#fff' : icolor }} />
                        <span className="text-xl font-black" style={{ color: isToday ? '#fff' : 'var(--color-text-1)' }}>
                          {day.high}°
                        </span>
                        <span className="text-xs" style={{ color: isToday ? 'rgba(255,255,255,0.6)' : 'var(--color-text-3)' }}>
                          {day.low}° low
                        </span>
                        <span className="text-xs flex items-center gap-0.5 font-semibold"
                          style={{ color: day.rainProb >= 70 ? '#FFB300' : isToday ? 'rgba(255,255,255,0.8)' : '#60A5FA' }}>
                          <Droplets size={10} />{day.rainProb}%
                        </span>
                        {day.demandUplift > 0 && (
                          <span className="text-[10px] font-bold flex items-center gap-0.5"
                            style={{ color: isToday ? '#F5C400' : '#00C853' }}>
                            <Car size={9} />+{day.demandUplift}%
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Rain probability chart */}
              <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <h2 className="text-base font-bold mb-1" style={{ color: 'var(--color-text-1)' }}>Rain Probability & Demand Uplift</h2>
                <p className="text-xs mb-4" style={{ color: 'var(--color-text-3)' }}>7-day forecast — amber line = demand uplift opportunity</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--color-text-3)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-3)' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, fontSize: 12 }}
                      labelStyle={{ color: 'var(--color-text-1)', fontWeight: 700 }}
                    />
                    <Bar dataKey="rainProb" name="Rain %" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={entry.rainProb >= 70 ? '#60A5FA' : 'var(--color-primary-dim)'} stroke={entry.rainProb >= 70 ? '#3B82F6' : 'var(--color-primary)'} strokeWidth={1} />
                      ))}
                    </Bar>
                    <Line type="monotone" dataKey="uplift" name="Demand Uplift %" stroke="#FFB300" strokeWidth={2} dot={{ fill: '#FFB300', r: 4 }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Temperature range chart */}
              <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <h2 className="text-base font-bold mb-4" style={{ color: 'var(--color-text-1)' }}>Temperature Range (°C)</h2>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--color-text-3)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-3)' }} axisLine={false} tickLine={false} domain={[20, 40]} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, fontSize: 12 }}
                      labelStyle={{ color: 'var(--color-text-1)', fontWeight: 700 }} />
                    <Legend wrapperStyle={{ fontSize: 12, color: 'var(--color-text-2)' }} />
                    <Line type="monotone" dataKey="high" name="High °C" stroke="#FF5252" strokeWidth={2} dot={{ fill: '#FF5252', r: 3 }} />
                    <Line type="monotone" dataKey="low" name="Low °C" stroke="#60A5FA" strokeWidth={2} dot={{ fill: '#60A5FA', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
