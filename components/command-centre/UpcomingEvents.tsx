'use client'
import { useRouter } from 'next/navigation'
import { Users, Wand2 } from 'lucide-react'
import type { Event } from '@/lib/types'

const categoryColor: Record<string, string> = {
  Concert: '#7C3AED',
  Sports: '#0367FC',
  Festival: '#FFB300',
  Exhibition: '#00C853',
  Conference: '#64748B',
}

function daysUntil(date: string) {
  const diff = new Date(date).getTime() - Date.now()
  const d = Math.ceil(diff / 86400000)
  if (d <= 0) return 'Today'
  if (d === 1) return 'Tomorrow'
  return `${d}d`
}

interface Props {
  events: Event[]
}

export default function UpcomingEvents({ events }: Props) {
  const router = useRouter()
  return (
    <div
      className="rounded-2xl p-5 h-full"
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      <h2 className="text-base font-bold mb-4" style={{ color: 'var(--color-text-1)' }}>
        Upcoming Events
      </h2>
      <div className="space-y-3">
        {events.map((event) => {
          const color = categoryColor[event.category] || '#64748B'
          return (
            <div
              key={event.id}
              className="group flex items-start gap-3 p-3 rounded-xl transition-colors cursor-pointer"
              style={{ backgroundColor: 'var(--color-surface-2)' }}
              onClick={() => router.push('/events')}
            >
              <div
                className="text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0 mt-0.5"
                style={{ backgroundColor: `${color}20`, color }}
              >
                {daysUntil(event.startDate)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text-1)' }}>
                  {event.name}
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--color-text-3)' }}>
                  {event.venue}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs flex items-center gap-1" style={{ color: 'var(--color-text-3)' }}>
                    <Users size={10} />
                    {event.attendanceEst.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold" style={{ color }}>
                    Score {event.opportunityScore}
                  </span>
                </div>
              </div>
              <button
                className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs px-2 py-1 rounded-lg flex-shrink-0"
                style={{ backgroundColor: 'var(--color-primary-dim)', color: 'var(--color-primary)' }}
                onClick={(e) => { e.stopPropagation(); router.push('/campaign-studio') }}
              >
                <Wand2 size={10} />
                Generate
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
