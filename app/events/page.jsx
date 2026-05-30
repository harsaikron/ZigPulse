'use client'
import { useSSE } from '@/hooks/useSSE'
import { useRouter } from 'next/navigation'
import TopBar from '@/components/layout/TopBar'
import { Calendar, MapPin, Users, TrendingUp, Megaphone } from 'lucide-react'
import { motion } from 'framer-motion'

const CATEGORY_COLORS = {
  Sports: 'bg-blue-600',
  Concert: 'bg-purple-600',
  Festival: 'bg-orange-600',
  National: 'bg-red-600',
  Exhibition: 'bg-teal-600',
  Music: 'bg-pink-600',
  Cultural: 'bg-amber-600',
}

export default function EventsPage() {
  const { data } = useSSE('/api/stream/events')
  const events = Array.isArray(data) ? data : []
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Upcoming Events" />
      <div className="p-6">
        <p className="text-[#9CA3AF] text-sm mb-6">
          {events.length} events in the next 60 days — sorted by proximity
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {events.map((event, i) => (
            <motion.div
              key={event.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="bg-[#111827] border border-[#1F2937] rounded-xl p-5 hover:border-[#0057FF] transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs font-bold text-white px-2.5 py-1 rounded-full ${CATEGORY_COLORS[event.category] ?? 'bg-gray-600'}`}>
                  {event.category}
                </span>
                <span className="text-[#F5C400] font-black text-xl tabular-nums">{event.daysUntil}d</span>
              </div>

              <h3 className="text-white font-bold text-lg leading-tight">{event.name}</h3>

              <div className="mt-3 space-y-2">
                <p className="text-[#9CA3AF] text-sm flex items-center gap-2">
                  <Calendar size={14} className="text-[#0057FF] flex-shrink-0" />
                  {new Date(event.date).toLocaleDateString('en-SG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <p className="text-[#9CA3AF] text-sm flex items-center gap-2">
                  <MapPin size={14} className="text-[#0057FF] flex-shrink-0" />
                  <span className="truncate">{event.venue}</span>
                  <span className="text-[#F5C400] flex-shrink-0 font-medium">{event.zone}</span>
                </p>
                <p className="text-[#9CA3AF] text-sm flex items-center gap-2">
                  <Users size={14} className="text-[#0057FF] flex-shrink-0" />
                  ~{event.attendance?.toLocaleString()} attendees expected
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-[#1F2937] flex items-center justify-between">
                <div>
                  <p className="text-green-400 font-bold text-sm flex items-center gap-1">
                    <TrendingUp size={14} /> +{event.demandSurge}% demand
                  </p>
                  <p className="text-[#9CA3AF] text-xs mt-0.5">+{event.recommendedFleet} taxis needed</p>
                </div>
                <button
                  onClick={() => router.push(`/marketing?event=${encodeURIComponent(event.name)}`)}
                  className="flex items-center gap-2 bg-[#0057FF] hover:bg-[#0041CC] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors min-h-[44px]"
                >
                  <Megaphone size={14} /> Campaign
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
