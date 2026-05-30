'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, TrendingUp, Calendar, Map,
  CloudSun, DollarSign, Megaphone, ChevronLeft, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/', label: 'Command Centre', icon: LayoutDashboard },
  { href: '/demand', label: 'Supply & Demand', icon: TrendingUp },
  { href: '/events', label: 'Upcoming Events', icon: Calendar },
  { href: '/heatmap', label: 'Area Heatmap', icon: Map },
  { href: '/weather', label: 'Weather & El Niño', icon: CloudSun },
  { href: '/profit', label: 'Profit Estimator', icon: DollarSign },
  { href: '/marketing', label: 'Marketing Studio', icon: Megaphone },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={cn(
      'flex flex-col h-screen sticky top-0 transition-all duration-300 z-40',
      'border-r border-[#0041CC]',
      collapsed ? 'w-16' : 'w-64'
    )} style={{ background: '#0057FF' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[#0041CC]">
        <div className="w-9 h-9 bg-[#F5C400] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <span className="font-black text-[#0057FF] text-base">Z</span>
        </div>
        {!collapsed && (
          <div>
            <p className="font-black text-white text-lg leading-none tracking-tight">ZigPulse</p>
            <p className="text-blue-200 text-xs mt-0.5">ComfortDelGro SG</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 mx-2 my-0.5 px-3 py-3 rounded-xl transition-all duration-200 min-h-[48px]',
                'text-blue-100 hover:bg-[#0041CC] hover:text-white',
                active && 'bg-[#F5C400] text-[#0057FF] font-semibold hover:bg-[#D4A900] hover:text-[#0057FF]'
              )}
              title={collapsed ? label : undefined}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-[#0041CC] text-blue-200 hover:text-white hover:bg-[#0041CC] transition-colors"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </aside>
  )
}
