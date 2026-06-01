'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'
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
  { href: '/weather', label: 'Weather', icon: CloudSun },
  { href: '/profit', label: 'Profit Estimator', icon: DollarSign },
  { href: '/marketing', label: 'Marketing Studio', icon: Megaphone },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={cn(
      'flex flex-col h-screen sticky top-0 transition-all duration-300 z-40',
      'bg-white border-r border-gray-100 shadow-sm',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 border-b border-gray-100',
        collapsed ? 'px-3 py-4 justify-center' : 'px-4 py-4'
      )}>
        {/* Zig logo */}
        <div className="flex-shrink-0">
          <Image
            src="/zig-logo-icon.svg"
            alt="Zig logo"
            width={36}
            height={36}
            priority
          />
        </div>
        {!collapsed && (
          <div>
            <p className="font-black text-gray-900 text-base leading-none tracking-tight">ZigPulse</p>
            <p className="text-gray-400 text-xs mt-0.5 font-medium">ComfortDelGro SG</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto px-2">
        {!collapsed && (
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest px-3 mb-2 mt-1">Navigation</p>
        )}
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                'flex items-center gap-3 my-0.5 px-3 py-2.5 rounded-xl transition-all duration-200 min-h-[48px] group',
                active
                  ? 'bg-[#0057FF] text-white shadow-md shadow-blue-200'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900',
                collapsed && 'justify-center'
              )}
            >
              <Icon
                size={20}
                className={cn(
                  'flex-shrink-0 transition-colors',
                  active ? 'text-white' : 'text-gray-400 group-hover:text-[#0057FF]'
                )}
              />
              {!collapsed && (
                <span className={cn('text-sm font-medium', active ? 'text-white' : 'text-gray-700')}>
                  {label}
                </span>
              )}
              {active && !collapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#F5C400]" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-100 p-3">
        {!collapsed && (
          <div className="flex items-center gap-2 px-2 py-2 mb-2 rounded-xl bg-gray-50">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#F5C400' }}>
              <span className="text-xs font-black text-[#0057FF]">CDG</span>
            </div>
            <div className="min-w-0">
              <p className="text-gray-800 text-xs font-semibold truncate">Operations Team</p>
              <p className="text-gray-400 text-xs truncate">Singapore</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'flex items-center justify-center w-full py-2 rounded-xl text-gray-400 hover:text-[#0057FF] hover:bg-blue-50 transition-colors min-h-[40px]',
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  )
}
