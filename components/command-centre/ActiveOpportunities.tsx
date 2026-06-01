'use client'
import { useRouter } from 'next/navigation'
import { CloudRain, CalendarDays, Train, Sparkles } from 'lucide-react'
import type { Opportunity, OpportunityType, Severity } from '@/lib/types'

const typeIcon: Record<OpportunityType, React.ElementType> = {
  WEATHER: CloudRain,
  EVENT: CalendarDays,
  TRANSPORT: Train,
  HOLIDAY: Sparkles,
}

const severityColor: Record<Severity, string> = {
  CRITICAL: '#FF5252',
  HIGH: '#FFB300',
  MEDIUM: '#0367FC',
  LOW: '#00C853',
}

interface Props {
  opportunities: Opportunity[]
}

export default function ActiveOpportunities({ opportunities }: Props) {
  const router = useRouter()

  return (
    <div
      className="rounded-2xl p-6 h-full"
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-1)' }}>
          Active Opportunities
        </h2>
        <span className="text-2xl font-black" style={{ color: 'var(--color-primary)' }}>
          {opportunities.length}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {opportunities.map((opp) => {
          const Icon = typeIcon[opp.type]
          const color = severityColor[opp.severity]
          return (
            <button
              key={opp.id}
              onClick={() => router.push(`/opportunity-feed?type=${opp.type}`)}
              className="group flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
              style={{
                backgroundColor: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-1)',
              }}
            >
              <Icon size={14} style={{ color }} />
              <span className="max-w-[140px] truncate">{opp.title}</span>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <span
                className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color }}
              >
                {opp.score}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
