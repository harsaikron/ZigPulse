'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import TopBar from '@/components/layout/TopBar'
import PlatformCard from '@/components/marketing/PlatformCard'
import { getUpcomingEvents } from '@/lib/mock/events'
import { Sparkles, Calendar, MapPin, Users, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

const PLATFORMS = ['instagram', 'tiktok', 'twitter', 'facebook']

function MarketingContent() {
  const params = useSearchParams()
  const events = getUpcomingEvents()
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [genKey, setGenKey] = useState(0)

  useEffect(() => {
    const name = params.get('event')
    if (name) {
      const found = events.find(e => e.name === decodeURIComponent(name))
      if (found) setSelectedEvent(found)
    }
  }, [params])

  const handleGenerate = () => setGenKey(k => k + 1)

  return (
    <div className="p-6 space-y-6">
      {/* Event selector */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h2 className="text-slate-900 font-bold text-lg mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-[#F5C400]" /> Select Event
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {events.slice(0, 6).map(e => (
            <button
              key={e.name}
              onClick={() => setSelectedEvent(e)}
              className={`text-left p-4 rounded-xl border transition-all duration-200 min-h-[88px] ${
                selectedEvent?.name === e.name
                  ? 'border-[#0057FF] bg-blue-50'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
              }`}
            >
              <p className="text-slate-900 font-semibold text-sm leading-tight">{e.name}</p>
              <p className="text-slate-400 text-xs mt-1">{e.zone} · {e.daysUntil}d away</p>
              <p className="text-green-600 text-xs mt-1.5 font-semibold">+{e.demandSurge}% demand surge</p>
            </button>
          ))}
        </div>
      </div>

      {/* Selected event banner */}
      {selectedEvent && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ background: '#0057FF' }}
        >
          <div>
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest">Selected Event</p>
            <h3 className="text-white font-black text-2xl mt-1">{selectedEvent.name}</h3>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-blue-100">
              <span className="flex items-center gap-1.5"><Calendar size={13} />{selectedEvent.date}</span>
              <span className="flex items-center gap-1.5"><MapPin size={13} />{selectedEvent.zone}</span>
              <span className="flex items-center gap-1.5"><Users size={13} />{selectedEvent.attendance?.toLocaleString()}</span>
              <span className="flex items-center gap-1.5 font-bold text-[#F5C400]"><TrendingUp size={13} />+{selectedEvent.demandSurge}%</span>
            </div>
          </div>
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 bg-[#F5C400] hover:bg-[#D4A900] text-[#0057FF] font-black px-6 py-3.5 rounded-xl text-sm transition-colors min-h-[52px] flex-shrink-0 shadow-lg"
          >
            <Sparkles size={16} /> Generate All Campaigns
          </button>
        </motion.div>
      )}

      {/* Platform cards */}
      {selectedEvent && genKey > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PLATFORMS.map((p, i) => (
            <motion.div
              key={`${p}-${genKey}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <PlatformCard platform={p} event={selectedEvent} />
            </motion.div>
          ))}
        </div>
      )}

      {selectedEvent && genKey === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PLATFORMS.map((p, i) => (
            <motion.div key={p} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <PlatformCard platform={p} event={selectedEvent} />
            </motion.div>
          ))}
        </div>
      )}

      {!selectedEvent && (
        <div className="text-center py-24">
          <Sparkles size={48} className="mx-auto mb-4 text-slate-200" />
          <p className="text-slate-500 text-lg">Select an event above to generate AI marketing campaigns</p>
          <p className="text-slate-400 text-sm mt-2">Powered by Claude AI — Instagram, TikTok, X, and Facebook copy in seconds</p>
        </div>
      )}
    </div>
  )
}

export default function MarketingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Marketing Studio" />
      <Suspense fallback={<div className="p-6 text-slate-400">Loading...</div>}>
        <MarketingContent />
      </Suspense>
    </div>
  )
}
