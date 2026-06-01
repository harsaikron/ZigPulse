'use client'
import { useState, useEffect } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import type { Opportunity, Event } from '@/lib/types'
import { api } from '@/lib/api'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'

const SEVERITY_COLOR: Record<string, string> = {
  CRITICAL: '#FF5252', HIGH: '#FFB300', MEDIUM: '#0367FC', LOW: '#00C853',
}
const CATEGORY_COLOR: Record<string, string> = {
  Concert: '#7C3AED', Sports: '#0367FC', Festival: '#FFB300', Exhibition: '#00C853', Conference: '#64748B',
}

type CalendarItem = { date: Date; label: string; color: string; kind: 'opportunity' | 'event' }

export default function CalendarPage() {
  const [opps, setOpps] = useState<Opportunity[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState(() => {
    const now = new Date(); return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [selected, setSelected] = useState<Date | null>(null)

  useEffect(() => {
    Promise.all([
      api.getOpportunities().then(r => r.data),
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/events`).then(r => r.json()),
    ]).then(([o, e]) => { setOpps(o); setEvents(e); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Build calendar items
  const items: CalendarItem[] = [
    ...opps.filter(o => o.startDate).map(o => ({
      date: new Date(o.startDate!),
      label: o.title,
      color: SEVERITY_COLOR[o.severity],
      kind: 'opportunity' as const,
    })),
    ...events.map(e => ({
      date: new Date(e.startDate),
      label: e.name,
      color: CATEGORY_COLOR[e.category] || '#64748B',
      kind: 'event' as const,
    })),
  ]

  const itemsOnDay = (day: Date) =>
    items.filter(i =>
      i.date.getFullYear() === day.getFullYear() &&
      i.date.getMonth() === day.getMonth() &&
      i.date.getDate() === day.getDate()
    )

  // Calendar grid
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const firstDayOfWeek = new Date(month.getFullYear(), month.getMonth(), 1).getDay() // 0=Sun
  const today = new Date()
  const days: (Date | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)),
  ]

  const prevMonth = () => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
  const nextMonth = () => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))

  const selectedItems = selected ? itemsOnDay(selected) : []

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Opportunity Calendar" />
        <main className="flex-1 p-6 space-y-6">

          <div>
            <h1 className="text-2xl font-black" style={{ color: 'var(--color-text-1)' }}>Opportunity Calendar</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-3)' }}>Events and opportunities mapped by date</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

            {/* Calendar */}
            <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              {/* Month nav */}
              <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} className="p-2 rounded-xl transition-colors hover:opacity-70"
                  style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-text-2)' }}>
                  <ChevronLeft size={16} />
                </button>
                <h2 className="text-base font-bold" style={{ color: 'var(--color-text-1)' }}>
                  {month.toLocaleDateString('en-SG', { month: 'long', year: 'numeric' })}
                </h2>
                <button onClick={nextMonth} className="p-2 rounded-xl transition-colors hover:opacity-70"
                  style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-text-2)' }}>
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Weekday headers */}
              <div className="grid grid-cols-7 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="text-center text-xs font-semibold py-1" style={{ color: 'var(--color-text-3)' }}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Days */}
              {loading ? (
                <div className="grid grid-cols-7 gap-1">
                  {Array(35).fill(0).map((_, i) => (
                    <div key={i} className="h-16 rounded-lg animate-pulse" style={{ backgroundColor: 'var(--color-surface-2)' }} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, i) => {
                    if (!day) return <div key={i} />
                    const dayItems = itemsOnDay(day)
                    const isToday = day.toDateString() === today.toDateString()
                    const isSelected = selected?.toDateString() === day.toDateString()
                    const hasItems = dayItems.length > 0
                    return (
                      <button
                        key={i}
                        onClick={() => setSelected(isSelected ? null : day)}
                        className="min-h-[64px] rounded-xl p-1.5 flex flex-col items-start gap-0.5 text-left transition-all"
                        style={isSelected
                          ? { backgroundColor: 'var(--color-primary-dim)', border: '1.5px solid var(--color-primary)' }
                          : isToday
                          ? { backgroundColor: 'var(--color-primary)', border: '1.5px solid transparent' }
                          : { backgroundColor: hasItems ? 'var(--color-surface-2)' : 'transparent', border: '1.5px solid transparent' }
                        }
                      >
                        <span className="text-xs font-bold w-full text-right pr-0.5"
                          style={{ color: isToday ? '#fff' : isSelected ? 'var(--color-primary)' : 'var(--color-text-2)' }}>
                          {day.getDate()}
                        </span>
                        {dayItems.slice(0, 2).map((item, j) => (
                          <span key={j} className="w-full text-[9px] font-semibold px-1 py-0.5 rounded truncate"
                            style={{ backgroundColor: `${item.color}25`, color: item.color }}>
                            {item.label}
                          </span>
                        ))}
                        {dayItems.length > 2 && (
                          <span className="text-[9px] font-semibold" style={{ color: 'var(--color-text-3)' }}>
                            +{dayItems.length - 2} more
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Side panel */}
            <div className="space-y-4">
              {/* Legend */}
              <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--color-text-3)' }}>Legend</p>
                <div className="space-y-2">
                  {[
                    { label: 'Critical opportunity', color: '#FF5252' },
                    { label: 'High opportunity', color: '#FFB300' },
                    { label: 'Medium opportunity', color: '#0367FC' },
                    { label: 'Low opportunity', color: '#00C853' },
                    { label: 'Concert / Event', color: '#7C3AED' },
                  ].map(l => (
                    <div key={l.label} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded flex-shrink-0" style={{ backgroundColor: `${l.color}30`, border: `1px solid ${l.color}` }} />
                      <span className="text-xs" style={{ color: 'var(--color-text-2)' }}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected day detail */}
              {selected && (
                <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                  <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--color-text-3)' }}>
                    {selected.toLocaleDateString('en-SG', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                  {selectedItems.length === 0 ? (
                    <p className="text-sm" style={{ color: 'var(--color-text-3)' }}>No events on this day</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedItems.map((item, i) => (
                        <div key={i} className="rounded-xl px-3 py-2"
                          style={{ backgroundColor: `${item.color}12`, borderLeft: `3px solid ${item.color}` }}>
                          <p className="text-xs font-bold" style={{ color: item.color }}>
                            {item.kind === 'opportunity' ? 'OPPORTUNITY' : 'EVENT'}
                          </p>
                          <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--color-text-1)' }}>{item.label}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* This month summary */}
              {!loading && (
                <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                  <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--color-text-3)' }}>
                    {month.toLocaleDateString('en-SG', { month: 'long' })} Summary
                  </p>
                  {[
                    { label: 'Opportunities', value: items.filter(i => i.kind === 'opportunity' && i.date.getMonth() === month.getMonth()).length, color: 'var(--color-primary)' },
                    { label: 'Events', value: items.filter(i => i.kind === 'event' && i.date.getMonth() === month.getMonth()).length, color: '#7C3AED' },
                    { label: 'Active days', value: new Set(items.filter(i => i.date.getMonth() === month.getMonth()).map(i => i.date.getDate())).size, color: '#FFB300' },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between py-1.5 border-b last:border-b-0"
                      style={{ borderColor: 'var(--color-border)' }}>
                      <span className="text-xs" style={{ color: 'var(--color-text-2)' }}>{s.label}</span>
                      <span className="text-sm font-black" style={{ color: s.color }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
