'use client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Sparkles, Wand2 } from 'lucide-react'
import type { AIRecommendation } from '@/lib/types'

const campaignTypeLabel: Record<string, string> = {
  PUSH_NOTIFICATION: 'Push',
  DRIVER_ALERT: 'Driver Alert',
  EMAIL_CAMPAIGN: 'Email',
  IN_APP_PROMO: 'In-App',
}

interface Props {
  recommendations: AIRecommendation[]
  loading?: boolean
}

function ShimmerCard() {
  return (
    <div
      className="flex-shrink-0 w-72 rounded-2xl p-5 animate-pulse"
      style={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
    >
      <div className="w-24 h-3 rounded mb-3" style={{ backgroundColor: 'var(--color-border)' }} />
      <div className="w-full h-4 rounded mb-2" style={{ backgroundColor: 'var(--color-border)' }} />
      <div className="w-3/4 h-3 rounded mb-4" style={{ backgroundColor: 'var(--color-border)' }} />
      <div className="w-20 h-7 rounded-lg" style={{ backgroundColor: 'var(--color-border)' }} />
    </div>
  )
}

export default function AIRecommendations({ recommendations, loading }: Props) {
  const router = useRouter()

  return (
    <div
      className="rounded-2xl p-5"
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={18} style={{ color: 'var(--color-ai)' }} />
        <h2 className="text-base font-bold" style={{ color: 'var(--color-text-1)' }}>
          AI Recommendations
        </h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {loading
          ? [1, 2, 3].map((i) => <ShimmerCard key={i} />)
          : recommendations.map((rec, i) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: 'easeOut' }}
                className="flex-shrink-0 w-72 rounded-2xl p-5"
                style={{
                  backgroundColor: 'var(--color-ai-dim)',
                  border: '1px solid rgba(124,58,237,0.2)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} style={{ color: 'var(--color-ai)' }} />
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded"
                    style={{ backgroundColor: 'rgba(124,58,237,0.15)', color: 'var(--color-ai)' }}
                  >
                    {campaignTypeLabel[rec.campaignType] || rec.campaignType}
                  </span>
                </div>
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-1)' }}>
                  {rec.title}
                </p>
                <p className="text-xs mb-4" style={{ color: 'var(--color-text-2)' }}>
                  {rec.reason}
                </p>
                <button
                  onClick={() => router.push('/campaign-studio')}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: 'var(--color-ai)', color: '#fff' }}
                >
                  <Wand2 size={12} /> Generate
                </button>
              </motion.div>
            ))}
      </div>
    </div>
  )
}
