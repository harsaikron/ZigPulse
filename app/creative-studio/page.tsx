'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Paintbrush, Copy, Check } from 'lucide-react'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'

type Variant = {
  tone: 'Professional' | 'Casual' | 'Urgent'
  headline: string
  body: string
  cta: string
  hashtags: string[]
}

const PLATFORMS = ['Social Media', 'Digital OOH', 'Push Notification', 'Email']

const TONE_STYLES: Record<string, { bg: string; text: string }> = {
  Professional: { bg: 'var(--color-primary-dim)', text: 'var(--color-primary)' },
  Casual: { bg: 'rgba(34,197,94,0.15)', text: 'rgb(22,163,74)' },
  Urgent: { bg: 'rgba(239,68,68,0.15)', text: 'rgb(220,38,38)' },
}

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 animate-pulse"
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      <div className="w-24 h-5 rounded-full" style={{ backgroundColor: 'var(--color-surface-2)' }} />
      <div className="w-full h-6 rounded-lg" style={{ backgroundColor: 'var(--color-surface-2)' }} />
      <div className="w-full h-4 rounded-lg" style={{ backgroundColor: 'var(--color-surface-2)' }} />
      <div className="w-4/5 h-4 rounded-lg" style={{ backgroundColor: 'var(--color-surface-2)' }} />
      <div className="w-24 h-8 rounded-xl mt-2" style={{ backgroundColor: 'var(--color-surface-2)' }} />
    </div>
  )
}

function VariantCard({ variant, index }: { variant: Variant; index: number }) {
  const [copied, setCopied] = useState(false)
  const toneStyle = TONE_STYLES[variant.tone] ?? TONE_STYLES.Professional

  const handleCopy = () => {
    const text = `${variant.headline}\n\n${variant.body}\n\n${variant.cta}\n\n${variant.hashtags.join(' ')}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{ backgroundColor: toneStyle.bg, color: toneStyle.text }}
        >
          {variant.tone}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors"
          style={{ color: 'var(--color-text-3)', backgroundColor: 'var(--color-surface-2)' }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <h3 className="text-base font-bold leading-snug" style={{ color: 'var(--color-text-1)' }}>
        {variant.headline}
      </h3>

      <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-2)' }}>
        {variant.body}
      </p>

      <div
        className="text-sm font-semibold px-4 py-2 rounded-xl text-center mt-1 w-fit"
        style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
      >
        {variant.cta}
      </div>

      {variant.hashtags && variant.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {variant.hashtags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'var(--color-ai-dim)', color: 'var(--color-ai)' }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default function CreativeStudioPage() {
  const [brief, setBrief] = useState('')
  const [brand, setBrand] = useState('ComfortDelGro')
  const [platforms, setPlatforms] = useState<string[]>(['Social Media'])
  const [variants, setVariants] = useState<Variant[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const togglePlatform = (p: string) => {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    )
  }

  const generate = async () => {
    if (!brief.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/creative/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief, brand, platforms }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setVariants(data.variants ?? [])
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Creative Studio" />

        <main className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">
          {/* Left panel — Brief */}
          <div
            className="lg:w-[40%] flex-shrink-0 flex flex-col gap-5 p-6 border-r overflow-y-auto"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div>
              <h2 className="text-base font-bold mb-1" style={{ color: 'var(--color-text-1)' }}>
                Campaign Brief
              </h2>
              <p className="text-xs" style={{ color: 'var(--color-text-3)' }}>
                Describe your goal, audience, and message
              </p>
            </div>

            <textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              rows={7}
              placeholder="Describe your campaign goal, target audience, and key message..."
              className="w-full resize-none rounded-2xl p-4 text-sm outline-none transition-colors"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-1)',
              }}
            />

            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--color-text-2)' }}>
                Product / Brand
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-1)',
                }}
              />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-2" style={{ color: 'var(--color-text-2)' }}>
                Platforms
              </label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => {
                  const active = platforms.includes(p)
                  return (
                    <button
                      key={p}
                      onClick={() => togglePlatform(p)}
                      className="text-xs px-3 py-1.5 rounded-full font-medium transition-colors"
                      style={
                        active
                          ? { backgroundColor: 'var(--color-primary)', color: '#fff' }
                          : {
                              backgroundColor: 'var(--color-surface-2)',
                              color: 'var(--color-text-2)',
                              border: '1px solid var(--color-border)',
                            }
                      }
                    >
                      {p}
                    </button>
                  )
                })}
              </div>
            </div>

            <button
              onClick={generate}
              disabled={!brief.trim() || loading}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold transition-opacity"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                opacity: !brief.trim() || loading ? 0.5 : 1,
                cursor: !brief.trim() || loading ? 'not-allowed' : 'pointer',
              }}
            >
              <Sparkles size={16} />
              Generate 3 Variants
            </button>

            {error && (
              <p className="text-xs rounded-xl px-4 py-3" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--color-danger)' }}>
                {error}
              </p>
            )}
          </div>

          {/* Right panel — Variants */}
          <div className="flex-1 p-6 overflow-y-auto">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 xl:grid-cols-3 gap-4"
                >
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </motion.div>
              ) : variants.length > 0 ? (
                <motion.div
                  key="variants"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 xl:grid-cols-3 gap-4"
                >
                  {variants.map((v, i) => (
                    <VariantCard key={i} variant={v} index={i} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 text-center"
                >
                  <Paintbrush size={56} style={{ color: 'var(--color-text-3)' }} />
                  <div>
                    <p className="text-base font-semibold" style={{ color: 'var(--color-text-2)' }}>
                      Generate your first variant
                    </p>
                    <p className="text-sm mt-1" style={{ color: 'var(--color-text-3)' }}>
                      Fill in your brief on the left and hit Generate
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}
