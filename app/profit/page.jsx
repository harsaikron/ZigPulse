'use client'
import { useState, useMemo } from 'react'
import TopBar from '@/components/layout/TopBar'
import { ProfitLineChart, RevenueDonut } from '@/components/charts/ProfitCharts'
import { formatSGD, formatNumber } from '@/lib/utils'
import { generateForecast } from '@/lib/mock/demand'
import { getUpcomingEvents } from '@/lib/mock/events'

function RangeSlider({ label, value, min, max, step, onChange, format }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-[#9CA3AF] text-sm font-medium">{label}</label>
        <span className="text-white font-bold text-base">{format ? format(value) : value}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-[#0057FF] h-2"
        aria-label={label}
      />
      <div className="flex justify-between text-xs text-[#4B5563]">
        <span>{format ? format(min) : min}</span>
        <span>{format ? format(max) : max}</span>
      </div>
    </div>
  )
}

function Toggle({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between min-h-[48px]">
      <span className="text-[#9CA3AF] text-sm font-medium">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#F5C400] ${value ? 'bg-[#0057FF]' : 'bg-[#374151]'}`}
        role="switch"
        aria-checked={value}
        aria-label={label}
      >
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${value ? 'translate-x-6' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )
}

export default function ProfitPage() {
  const [fleet, setFleet] = useState(10000)
  const [trips, setTrips] = useState(12)
  const [fare, setFare] = useState(14)
  const [fuelAdj, setFuelAdj] = useState(0)
  const [days, setDays] = useState(30)
  const [useEvents, setUseEvents] = useState(true)
  const [useWeather, setUseWeather] = useState(true)
  const [useElNino, setUseElNino] = useState(true)

  const forecast = useMemo(() => generateForecast(60), [])
  const events = useMemo(() => getUpcomingEvents(), [])

  const profitData = useMemo(() => {
    return forecast.slice(0, days).map(d => {
      let multiplier = 1
      if (useEvents && d.eventDay) multiplier *= 1.3
      if (useWeather && Math.random() < 0.3) multiplier *= 1.15
      if (useElNino) multiplier *= 1.08
      const revenue = fleet * trips * fare * multiplier * (1 - fuelAdj / 200)
      return { ...d, revenue: Math.round(revenue) }
    })
  }, [fleet, trips, fare, fuelAdj, days, useEvents, useWeather, useElNino, forecast])

  const totalRevenue = profitData.reduce((s, d) => s + d.revenue, 0)
  const netProfit = Math.round(totalRevenue * 0.28)
  const peakDay = profitData.length ? profitData.reduce((a, b) => a.revenue > b.revenue ? a : b) : null
  const eventRevenue = profitData.filter(d => d.eventDay).reduce((s, d) => s + d.revenue, 0)
  const normalRevenue = Math.max(0, totalRevenue - eventRevenue)
  const rainRevenue = Math.round(totalRevenue * 0.18)

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Profit Estimator" />
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls panel */}
          <div className="lg:col-span-1 bg-[#111827] border border-[#1F2937] rounded-xl p-6 space-y-5">
            <h2 className="text-white font-bold text-lg">Scenario Controls</h2>

            <RangeSlider label="Date Range (days)" value={days} min={7} max={60} step={7} onChange={setDays} />
            <RangeSlider label="Active Fleet" value={fleet} min={1000} max={20000} step={500} onChange={setFleet} format={formatNumber} />
            <RangeSlider label="Trips / day per Taxi" value={trips} min={5} max={30} step={1} onChange={setTrips} />
            <RangeSlider label="Avg Fare (SGD)" value={fare} min={8} max={25} step={1} onChange={setFare} format={v => `$${v}`} />
            <RangeSlider label="Fuel Cost Adj %" value={fuelAdj} min={-20} max={50} step={5} onChange={setFuelAdj} format={v => `${v > 0 ? '+' : ''}${v}%`} />

            <div className="space-y-1 pt-3 border-t border-[#1F2937]">
              <Toggle label="Event Multiplier" value={useEvents} onChange={setUseEvents} />
              <Toggle label="Weather Multiplier" value={useWeather} onChange={setUseWeather} />
              <Toggle label="El Niño Factor" value={useElNino} onChange={setUseElNino} />
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-5">
            {/* KPI cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-5">
                <p className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-wide">Gross Revenue</p>
                <p className="text-2xl font-black text-white mt-2">{formatSGD(totalRevenue)}</p>
                <p className="text-[#9CA3AF] text-xs mt-1">{days}-day period</p>
              </div>
              <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-5">
                <p className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-wide">Net Profit</p>
                <p className="text-2xl font-black text-green-400 mt-2">{formatSGD(netProfit)}</p>
                <p className="text-[#9CA3AF] text-xs mt-1">~28% margin</p>
              </div>
              <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-5">
                <p className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-wide">Peak Day</p>
                <p className="text-2xl font-black text-[#F5C400] mt-2">{peakDay?.date?.slice(5) ?? '—'}</p>
                <p className="text-[#9CA3AF] text-xs mt-1">{formatSGD(peakDay?.revenue ?? 0)}</p>
              </div>
            </div>

            {/* Revenue chart */}
            <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-5">
              <h3 className="text-white font-bold mb-3">Daily Revenue Projection</h3>
              <ProfitLineChart data={profitData} />
            </div>

            {/* Split + events */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-5">
                <h3 className="text-white font-bold mb-3">Revenue Split</h3>
                <RevenueDonut normal={normalRevenue} event={eventRevenue} rain={rainRevenue} />
              </div>
              <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-5">
                <h3 className="text-white font-bold mb-4">Top Event Opportunities</h3>
                <div className="space-y-3">
                  {events.slice(0, 5).map(e => (
                    <div key={e.name} className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{e.name}</p>
                        <p className="text-[#9CA3AF] text-xs">{e.zone} · in {e.daysUntil}d</p>
                      </div>
                      <span className="text-[#F5C400] font-bold text-sm flex-shrink-0">+{e.demandSurge}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
