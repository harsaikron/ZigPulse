'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import { api } from '@/lib/api'
import type { Opportunity } from '@/lib/types'
import { Wand2, Sparkles, Copy, Check, Megaphone, Hash, Clock, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const CAMPAIGN_TYPES = ['Push Notification', 'Email Campaign', 'In-App Promo', 'Driver Alert', 'Social Media']
const TONES = ['Urgent', 'Friendly', 'Professional', 'Exciting', 'Informative']
const AUDIENCES = ['All Riders', 'Frequent Riders', 'Business Travellers', 'Airport Users', 'CBD Commuters']

interface GeneratedCampaign {
  headline: string
  subheadline: string
  bodyText: string
  cta: string
  hashtags: string[]
  sendTime: string
  estimatedReach: string
}

function CampaignStudioInner() {
  const searchParams = useSearchParams()
  const oppId = searchParams.get('opportunity')

  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [selectedOppId, setSelectedOppId] = useState<string>('')
  const [campaignType, setCampaignType] = useState('Push Notification')
  const [tone, setTone] = useState('Urgent')
  const [audience, setAudience] = useState('All Riders')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GeneratedCampaign | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.getOpportunities().then(r => {
      setOpportunities(r.data)
      if (oppId) setSelectedOppId(oppId)
      else if (r.data.length > 0) setSelectedOppId(r.data[0].id)
    })
  }, [oppId])

  const selectedOpp = opportunities.find(o => o.id === selectedOppId)

  const generate = async () => {
    if (!selectedOpp) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await fetch('/api/campaign/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunityTitle: selectedOpp.title,
          opportunityType: selectedOpp.type,
          campaignType,
          targetAudience: audience,
          tone,
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data.campaign)
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  const copyAll = () => {
    if (!result) return
    const text = `${result.headline}\n${result.subheadline}\n\n${result.bodyText}\n\n${result.cta}\n\n${result.hashtags.join(' ')}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Campaign Studio" />
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto space-y-6">

            <div>
              <h1 className="text-2xl font-black" style={{ color: 'var(--color-text-1)' }}>Campaign Studio</h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-3)' }}>
                AI-powered campaign copy generator — select an opportunity and generate targeted messaging
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Left: config panel */}
              <div className="space-y-4">

                {/* Opportunity selector */}
                <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                  <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--color-text-3)' }}>Select Opportunity</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {opportunities.map(opp => {
                      const isSelected = opp.id === selectedOppId
                      const color = opp.severity === 'CRITICAL' ? '#FF5252' : opp.severity === 'HIGH' ? '#FFB300' : opp.severity === 'MEDIUM' ? '#0367FC' : '#00C853'
                      return (
                        <button key={opp.id} onClick={() => setSelectedOppId(opp.id)}
                          className="w-full text-left px-3 py-2 rounded-xl text-sm transition-all flex items-center gap-2"
                          style={isSelected
                            ? { backgroundColor: 'var(--color-primary-dim)', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }
                            : { backgroundColor: 'var(--color-surface-2)', border: '1px solid transparent', color: 'var(--color-text-1)' }
                          }>
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                          <span className="truncate">{opp.title}</span>
                          <span className="ml-auto text-xs font-bold flex-shrink-0" style={{ color }}>{opp.score}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Campaign config */}
                <div className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--color-text-3)' }}>Campaign Channel</p>
                    <div className="flex flex-wrap gap-2">
                      {CAMPAIGN_TYPES.map(t => (
                        <button key={t} onClick={() => setCampaignType(t)}
                          className="px-3 py-1 rounded-lg text-xs font-semibold"
                          style={campaignType === t
                            ? { backgroundColor: 'var(--color-primary)', color: '#fff' }
                            : { backgroundColor: 'var(--color-surface-2)', color: 'var(--color-text-2)', border: '1px solid var(--color-border)' }
                          }>{t}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--color-text-3)' }}>Tone</p>
                    <div className="flex flex-wrap gap-2">
                      {TONES.map(t => (
                        <button key={t} onClick={() => setTone(t)}
                          className="px-3 py-1 rounded-lg text-xs font-semibold"
                          style={tone === t
                            ? { backgroundColor: 'var(--color-ai)', color: '#fff' }
                            : { backgroundColor: 'var(--color-surface-2)', color: 'var(--color-text-2)', border: '1px solid var(--color-border)' }
                          }>{t}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--color-text-3)' }}>Target Audience</p>
                    <div className="flex flex-wrap gap-2">
                      {AUDIENCES.map(a => (
                        <button key={a} onClick={() => setAudience(a)}
                          className="px-3 py-1 rounded-lg text-xs font-semibold"
                          style={audience === a
                            ? { backgroundColor: '#FFB300', color: '#fff' }
                            : { backgroundColor: 'var(--color-surface-2)', color: 'var(--color-text-2)', border: '1px solid var(--color-border)' }
                          }>{a}</button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={generate}
                  disabled={loading || !selectedOpp}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: 'var(--color-ai)', color: '#fff' }}
                >
                  {loading ? (
                    <>
                      <Sparkles size={16} className="animate-spin" />
                      Generating with Claude...
                    </>
                  ) : (
                    <>
                      <Wand2 size={16} />
                      Generate Campaign
                    </>
                  )}
                </button>
              </div>

              {/* Right: result */}
              <div>
                <AnimatePresence mode="wait">
                  {loading && (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="rounded-2xl p-6 space-y-3 animate-pulse"
                      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                      {[80, 60, 100, 40].map((w, i) => (
                        <div key={i} className="h-4 rounded" style={{ width: `${w}%`, backgroundColor: 'var(--color-surface-2)' }} />
                      ))}
                    </motion.div>
                  )}
                  {error && !loading && (
                    <motion.div key="error" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl p-5" style={{ backgroundColor: 'rgba(255,82,82,0.08)', border: '1px solid rgba(255,82,82,0.3)' }}>
                      <p className="text-sm font-bold" style={{ color: '#FF5252' }}>Generation failed</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--color-text-2)' }}>{error}</p>
                      <p className="text-xs mt-2" style={{ color: 'var(--color-text-3)' }}>Check ANTHROPIC_API_KEY in .env.local</p>
                    </motion.div>
                  )}
                  {result && !loading && (
                    <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl p-5 space-y-4"
                      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles size={16} style={{ color: 'var(--color-ai)' }} />
                          <span className="text-sm font-bold" style={{ color: 'var(--color-text-1)' }}>Generated Campaign</span>
                        </div>
                        <button onClick={copyAll}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold"
                          style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-text-2)', border: '1px solid var(--color-border)' }}>
                          {copied ? <Check size={12} style={{ color: '#00C853' }} /> : <Copy size={12} />}
                          {copied ? 'Copied!' : 'Copy All'}
                        </button>
                      </div>

                      <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-ai-dim)', border: '1px solid rgba(124,58,237,0.2)' }}>
                        <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--color-ai)' }}>
                          <Megaphone size={11} className="inline mr-1" />Headline
                        </p>
                        <p className="text-xl font-black" style={{ color: 'var(--color-text-1)' }}>{result.headline}</p>
                        <p className="text-sm mt-1" style={{ color: 'var(--color-text-2)' }}>{result.subheadline}</p>
                      </div>

                      <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-surface-2)' }}>
                        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--color-text-3)' }}>Body Copy</p>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-1)' }}>{result.bodyText}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex-1 rounded-xl px-4 py-2 text-center font-bold text-sm"
                          style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
                          {result.cta}
                        </div>
                      </div>

                      {result.hashtags?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {result.hashtags.map(tag => (
                            <span key={tag} className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                              style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-text-2)', border: '1px solid var(--color-border)' }}>
                              <Hash size={9} />{tag.replace('#', '')}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--color-surface-2)' }}>
                          <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: 'var(--color-text-3)' }}>
                            <Clock size={9} className="inline mr-1" />Best Send Time
                          </p>
                          <p className="text-xs font-semibold" style={{ color: 'var(--color-text-1)' }}>{result.sendTime}</p>
                        </div>
                        <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--color-surface-2)' }}>
                          <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: 'var(--color-text-3)' }}>
                            <Users size={9} className="inline mr-1" />Estimated Reach
                          </p>
                          <p className="text-xs font-semibold" style={{ color: 'var(--color-text-1)' }}>{result.estimatedReach}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {!result && !loading && !error && (
                    <div key="empty" className="rounded-2xl p-10 flex flex-col items-center gap-3"
                      style={{ backgroundColor: 'var(--color-surface)', border: '1px dashed var(--color-border)' }}>
                      <Wand2 size={40} style={{ color: 'var(--color-text-3)' }} />
                      <p className="text-sm" style={{ color: 'var(--color-text-3)' }}>
                        Select an opportunity and click Generate
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function CampaignStudioPage() {
  return (
    <Suspense fallback={<div />}>
      <CampaignStudioInner />
    </Suspense>
  )
}
