'use client'
import { Bell } from 'lucide-react'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function TopBar({ title }) {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <Image src="/zig-logo-wordmark.svg" alt="Time to zig" width={130} height={38} priority className="hidden sm:block" />
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
          <span className="w-2 h-2 bg-green-500 rounded-full live-pulse" />
          <span className="text-green-600 text-xs font-bold tracking-wide">LIVE</span>
        </div>
        <span className="text-slate-400 text-sm font-mono hidden sm:block">{time}</span>
        <button className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Notifications">
          <Bell size={18} />
        </button>
      </div>
    </header>
  )
}
