'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, Sun, Moon, Monitor, Wifi, WifiOff, Bot, Sparkles, Eye, EyeOff } from 'lucide-react'
import { useTheme } from 'next-themes'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
const REFRESH_OPTIONS = ['30s', '60s', '120s', '300s']

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.35 } }),
}

function SectionCard({ title, children, index }: { title: string; children: React.ReactNode; index: number }) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={CARD_VARIANTS}
      className="rounded-2xl p-6"
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--color-text-1)' }}>
        {title}
      </h3>
      {children}
    </motion.div>
  )
}

function ApiKeyRow({
  label,
  icon: Icon,
  storageKey,
  placeholder,
}: {
  label: string
  icon: React.ElementType
  storageKey: string
  placeholder: string
}) {
  const [value, setValue] = useState('')
  const [show, setShow] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored) setValue(stored)
  }, [storageKey])

  const handleSave = () => {
    localStorage.setItem(storageKey, value)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 w-44 flex-shrink-0">
        <Icon size={14} style={{ color: 'var(--color-text-3)' }} />
        <span className="text-xs font-semibold" style={{ color: 'var(--color-text-2)' }}>{label}</span>
      </div>
      <div className="flex-1 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type={show ? 'text' : 'password'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 rounded-xl text-sm font-mono pr-10"
            style={{
              backgroundColor: 'var(--color-surface-2)',
              color: 'var(--color-text-1)',
              border: '1px solid var(--color-border)',
              outline: 'none',
            }}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--color-text-3)' }}
          >
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        <button
          onClick={handleSave}
          className="px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex-shrink-0"
          style={
            saved
              ? { backgroundColor: 'var(--color-success)', color: '#fff' }
              : { backgroundColor: 'var(--color-primary)', color: '#fff' }
          }
        >
          {saved ? 'Saved ✓' : 'Save'}
        </button>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [refresh, setRefresh] = useState('60s')
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'checking' | 'ok' | 'error'>('idle')

  useEffect(() => {
    setMounted(true)
    const stored = typeof window !== 'undefined' ? localStorage.getItem('zigpulse_refresh') : null
    if (stored) setRefresh(stored)
  }, [])

  const handleRefresh = (val: string) => {
    setRefresh(val)
    localStorage.setItem('zigpulse_refresh', val)
  }

  const testConnection = async () => {
    setConnectionStatus('checking')
    try {
      const res = await fetch(`${API_URL}/command-centre/summary`, { signal: AbortSignal.timeout(5000) })
      setConnectionStatus(res.ok ? 'ok' : 'error')
    } catch {
      setConnectionStatus('error')
    }
  }

  const THEME_OPTIONS = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ]

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Settings" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[800px] mx-auto space-y-6">

            {/* Appearance */}
            <SectionCard title="Appearance" index={0}>
              <p className="text-xs mb-3" style={{ color: 'var(--color-text-3)' }}>Choose your interface theme</p>
              <div className="flex gap-2">
                {mounted && THEME_OPTIONS.map(({ value, label, icon: Icon }) => {
                  const active = theme === value
                  return (
                    <button
                      key={value}
                      onClick={() => setTheme(value)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
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
                      <Icon size={14} />
                      {label}
                      {active && <Check size={13} />}
                    </button>
                  )
                })}
              </div>
            </SectionCard>

            {/* Data & API */}
            <SectionCard title="Data & API" index={1}>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--color-text-2)' }}>
                    API URL
                  </label>
                  <code
                    className="block w-full px-4 py-2.5 rounded-xl text-sm font-mono"
                    style={{
                      backgroundColor: 'var(--color-surface-2)',
                      color: 'var(--color-text-1)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    {API_URL}
                  </code>
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-2" style={{ color: 'var(--color-text-2)' }}>
                    Data Refresh Interval
                  </label>
                  <div className="flex gap-2">
                    {REFRESH_OPTIONS.map((opt) => {
                      const active = refresh === opt
                      return (
                        <button
                          key={opt}
                          onClick={() => handleRefresh(opt)}
                          className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
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
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={testConnection}
                    disabled={connectionStatus === 'checking'}
                    className="px-4 py-2 rounded-xl text-sm font-medium transition-opacity"
                    style={{
                      backgroundColor: 'var(--color-surface-2)',
                      color: 'var(--color-text-1)',
                      border: '1px solid var(--color-border)',
                      opacity: connectionStatus === 'checking' ? 0.6 : 1,
                    }}
                  >
                    {connectionStatus === 'checking' ? 'Testing…' : 'Test Connection'}
                  </button>
                  {connectionStatus === 'ok' && (
                    <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--color-success)' }}>
                      <Wifi size={14} /> Connected
                    </span>
                  )}
                  {connectionStatus === 'error' && (
                    <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--color-danger)' }}>
                      <WifiOff size={14} /> Unreachable
                    </span>
                  )}
                </div>
              </div>
            </SectionCard>

            {/* AI Integrations */}
            <SectionCard title="AI Integrations" index={2}>
              <div className="space-y-4">
                <ApiKeyRow
                  label="OpenAI API Key"
                  icon={Bot}
                  storageKey="OPENAI_API_KEY"
                  placeholder="sk-..."
                />
                <ApiKeyRow
                  label="Gemini API Key"
                  icon={Sparkles}
                  storageKey="GEMINI_API_KEY"
                  placeholder="AIza..."
                />
              </div>
              <p className="text-xs mt-4" style={{ color: 'var(--color-text-3)' }}>
                API keys are stored locally in your browser and never sent to our servers.
              </p>
            </SectionCard>

            {/* Brand Profile */}
            <SectionCard title="Brand Profile" index={3}>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {[
                  { label: 'Organisation', value: 'ComfortDelGro Group' },
                  { label: 'Team', value: 'Marketing Team' },
                  { label: 'Region', value: 'Singapore' },
                  { label: 'User', value: 'CDG' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs mb-0.5" style={{ color: 'var(--color-text-3)' }}>{label}</p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--color-text-1)' }}>{value}</p>
                  </div>
                ))}
              </div>
              <p
                className="text-xs mt-4 px-3 py-2 rounded-xl"
                style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-text-3)' }}
              >
                Profile synced from your organisation account
              </p>
            </SectionCard>

            {/* About */}
            <SectionCard title="About" index={4}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold" style={{ color: 'var(--color-text-1)' }}>ZigPulse AI</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: 'var(--color-primary-dim)', color: 'var(--color-primary)' }}
                  >
                    v1.0.0-phase1
                  </span>
                </div>
                <p className="text-xs" style={{ color: 'var(--color-text-3)' }}>
                  Built with: Next.js · NestJS · PostgreSQL · Claude AI
                </p>
                <div
                  className="flex items-center gap-2 mt-3 px-4 py-3 rounded-xl"
                  style={{ backgroundColor: 'var(--color-ai-dim)', border: '1px solid var(--color-border)' }}
                >
                  <span className="text-xs font-medium" style={{ color: 'var(--color-ai)' }}>
                    Phase 2 coming soon — advanced analytics, predictive scheduling, and multi-channel orchestration.
                  </span>
                  <span
                    className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: 'var(--color-ai)', color: '#fff' }}
                  >
                    SOON
                  </span>
                </div>
              </div>
            </SectionCard>

          </div>
        </main>
      </div>
    </div>
  )
}
