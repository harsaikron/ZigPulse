'use client'
import { useState, useEffect } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import { useRouter } from 'next/navigation'
import type { Event } from '@/lib/types'
import { Users, MapPin, Clock, Wand2, Calendar } from 'lucide-react'

const CATEGORY_COLOR: Record<string, string> = {
  Concert: '#7C3AED',
  Sports: '#0367FC',
  Festival: '#FFB300',
  Exhibition: '#00C853',
  Conference: '#64748B',
}

const CATEGORIES = ['All', 'Concert', 'Sports', 'Festival', 'Exhibition', 'Conference']

function CountdownBadge({ date }: { date: string }) {
  const diff = new Date(date).getTime() - Date.now()
  const d = Math.ceil(diff / 86400000)
  if (d <= 0) return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Today</span>
  if (d === 1) return <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(3,103,252,0.1)', color: 'var(--color-primary)' }}>Tomorrow</span>
  if (d <= 7) return <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,179,0,0.1)', color: '#FFB300' }}>in {d} days</span>
  return <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-text-3)' }}>in {d} days</span>
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 85 ? '#FF5252' : score >= 65 ? '#FFB300' : score >= 45 ? '#0367FC' : '#00C853'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-border)' }}>
        <div className="h-1.5 rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-bold w-6" style={{ color }}>{score}</span>
    </div>
  )
}

export default function EventsPage() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/events`)
      .then(r => r.json())
      .then(data => { setEvents(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = category === 'All' ? events : events.filter(e => e.category === category)

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Upcoming Events" />
        <main className="flex-1 p-6 space-y-6">

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div>
              <h1 className="text-2xl font-black" style={{ color: 'var(--color-text-1)' }}>Upcoming Events</h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-3)' }}>
                {filtered.length} events · sorted by date
              </p>
            </div>
          </div>

          {/* Category filter */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => {
              const color = CATEGORY_COLOR[cat]
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className="px-4 py-1.5 rounded-xl text-sm font-semibold transition-all"
                  style={category === cat
                    ? { backgroundColor: color || 'var(--color-primary)', color: '#fff' }
                    : { backgroundColor: 'var(--color-surface-2)', color: 'var(--color-text-2)', border: '1px solid var(--color-border)' }
                  }
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* Events list */}
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ backgroundColor: 'var(--color-surface-2)' }} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(event => {
                const color = CATEGORY_COLOR[event.category] || '#64748B'
                return (
                  <div
                    key={event.id}
                    className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                    style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                  >
                    {/* Date column */}
                    <div
                      className="w-16 h-16 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <span className="text-xs font-bold uppercase" style={{ color }}>
                        {new Date(event.startDate).toLocaleDateString('en-SG', { month: 'short' })}
                      </span>
                      <span className="text-2xl font-black leading-none" style={{ color }}>
                        {new Date(event.startDate).getDate()}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${color}20`, color }}
                        >
                          {event.category}
                        </span>
                        <CountdownBadge date={event.startDate} />
                      </div>
                      <p className="text-base font-bold truncate" style={{ color: 'var(--color-text-1)' }}>
                        {event.name}
                      </p>
                      <div className="flex items-center gap-4 mt-1 flex-wrap">
                        <span className="text-xs flex items-center gap-1" style={{ color: 'var(--color-text-3)' }}>
                          <MapPin size={11} /> {event.venue}
                        </span>
                        <span className="text-xs flex items-center gap-1" style={{ color: 'var(--color-text-3)' }}>
                          <Users size={11} /> {event.attendanceEst.toLocaleString()} est.
                        </span>
                        <span className="text-xs flex items-center gap-1" style={{ color: 'var(--color-text-3)' }}>
                          <Clock size={11} /> {new Date(event.startDate).toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="mt-2 w-48">
                        <p className="text-[10px] font-semibold mb-1 uppercase tracking-wide" style={{ color: 'var(--color-text-3)' }}>
                          Opportunity Score
                        </p>
                        <ScoreBar score={event.opportunityScore} />
                      </div>
                    </div>

                    {/* CTA */}
                    <button
                      onClick={() => router.push('/campaign-studio')}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold flex-shrink-0"
                      style={{ backgroundColor: color, color: '#fff' }}
                    >
                      <Wand2 size={14} /> Generate Campaign
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Calendar size={40} style={{ color: 'var(--color-text-3)' }} />
              <p className="text-sm" style={{ color: 'var(--color-text-3)' }}>No events in this category</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
