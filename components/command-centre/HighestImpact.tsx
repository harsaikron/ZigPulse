'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Users, ArrowRight } from 'lucide-react'
import type { Opportunity, Severity } from '@/lib/types'

const severityColor: Record<Severity, string> = {
  CRITICAL: '#FF5252',
  HIGH: '#FFB300',
  MEDIUM: '#0367FC',
  LOW: '#00C853',
}

function useCountdown(target: string | null | undefined) {
  const [remaining, setRemaining] = useState('')

  useEffect(() => {
    if (!target) return
    const tick = () => {
      const diff = new Date(target).getTime() - Date.now()
      if (diff <= 0) { setRemaining('Now'); return }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      setRemaining(d > 0 ? `${d}d ${h}h` : `${h}h ${m}m`)
    }
    tick()
    const id = setInterval(tick, 60000)
    return () => clearInterval(id)
  }, [target])

  return remaining
}

interface Props {
  opportunity: Opportunity
}

export default function HighestImpact({ opportunity: opp }: Props) {
  const router = useRouter()
  const countdown = useCountdown(opp.startDate)
  const color = severityColor[opp.severity]

  return (
    <div
      className="rounded-2xl p-6 relative overflow-hidden"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderLeft: `4px solid ${color}`,
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded"
              style={{ backgroundColor: `${color}20`, color }}
            >
              {opp.severity}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-text-3)' }}>
              Highest Impact
            </span>
          </div>

          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--color-text-1)' }}>
            {opp.title}
          </h2>

          {opp.location && (
            <p className="text-sm mb-3" style={{ color: 'var(--color-text-2)' }}>
              {opp.location}
            </p>
          )}

          <div className="flex flex-wrap gap-4 mb-4">
            {countdown && (
              <div>
                <p className="text-xs" style={{ color: 'var(--color-text-3)' }}>Starts in</p>
                <p className="text-lg font-black" style={{ color }}>{countdown}</p>
              </div>
            )}
            <div>
              <p className="text-xs" style={{ color: 'var(--color-text-3)' }}>Score</p>
              <p className="text-lg font-black" style={{ color: 'var(--color-text-1)' }}>{opp.score}/100</p>
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--color-text-3)' }}>Potential Reach</p>
              <p className="text-lg font-black flex items-center gap-1" style={{ color: 'var(--color-text-1)' }}>
                <Users size={14} />
                {opp.potentialReach.toLocaleString()}
              </p>
            </div>
          </div>

          <ul className="space-y-1 mb-4">
            {opp.reasons.slice(0, 3).map((r, i) => (
              <li key={i} className="text-sm flex items-start gap-2" style={{ color: 'var(--color-text-2)' }}>
                <span style={{ color }}>•</span> {r}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={() => router.push(`/campaign-studio?opportunity=${opp.id}`)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
        style={{ backgroundColor: color, color: '#fff' }}
      >
        Generate Campaign <ArrowRight size={14} />
      </button>
    </div>
  )
}
