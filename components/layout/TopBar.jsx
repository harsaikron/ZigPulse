'use client'
import { Bell } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function TopBar({ title }) {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-[#1F2937] bg-[#0A0F1E] sticky top-0 z-30">
      <h1 className="text-xl font-bold text-white">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full live-pulse" />
          <span className="text-green-400 text-sm font-semibold">LIVE</span>
        </div>
        <span className="text-[#9CA3AF] text-sm font-mono hidden sm:block">{time}</span>
        <button className="p-2 rounded-lg hover:bg-[#111827] text-[#9CA3AF] hover:text-white transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center" aria-label="Notifications">
          <Bell size={18} />
        </button>
      </div>
    </header>
  )
}
