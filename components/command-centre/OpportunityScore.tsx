'use client'
import { useEffect, useState } from 'react'

interface Props {
  score: number
  lastUpdated: string
}

function ringColor(score: number) {
  if (score >= 85) return '#FF5252'
  if (score >= 65) return '#FFB300'
  if (score >= 45) return '#0367FC'
  return '#00C853'
}

export default function OpportunityScore({ score, lastUpdated }: Props) {
  const [displayScore, setDisplayScore] = useState(0)
  const [offset, setOffset] = useState(339.29)

  const circumference = 2 * Math.PI * 54

  useEffect(() => {
    const duration = 1200
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayScore(Math.round(eased * score))
      setOffset(circumference - eased * (score / 100) * circumference)
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [score, circumference])

  const color = ringColor(score)
  const updatedAt = new Date(lastUpdated).toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })

  return (
    <div
      className="rounded-2xl p-6 flex flex-col items-center justify-center gap-4 h-full"
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      <div className="relative w-[140px] h-[140px]">
        <svg width="140" height="140" className="-rotate-90">
          <circle
            cx="70" cy="70" r="54"
            fill="none"
            strokeWidth="10"
            style={{ stroke: 'var(--color-surface-2)' }}
          />
          <circle
            cx="70" cy="70" r="54"
            fill="none"
            strokeWidth="10"
            stroke={color}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-black leading-none" style={{ color: 'var(--color-text-1)' }}>
            {displayScore}
          </span>
          <span className="text-xs font-semibold mt-1" style={{ color: 'var(--color-text-3)' }}>
            / 100
          </span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm font-semibold" style={{ color: 'var(--color-text-1)' }}>
          Singapore Opportunity Index
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-3)' }}>
          Updated at {updatedAt}
        </p>
      </div>
    </div>
  )
}
