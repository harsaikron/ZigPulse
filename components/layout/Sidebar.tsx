'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'
import {
  Zap, Sparkles, CalendarDays, CloudSun, Train,
  Megaphone, Paintbrush, Calendar, BarChart3, Settings,
  ChevronLeft, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_GROUPS = [
  {
    label: 'INTELLIGENCE',
    items: [
      { href: '/', label: 'Command Centre', icon: Zap },
      { href: '/opportunity-feed', label: 'Opportunity Feed', icon: Sparkles, badge: true },
      { href: '/events', label: 'Upcoming Events', icon: CalendarDays },
      { href: '/weather-intelligence', label: 'Weather Intel', icon: CloudSun },
      { href: '/transport', label: 'Transport Intel', icon: Train },
    ],
  },
  {
    label: 'STUDIO',
    items: [
      { href: '/campaign-studio', label: 'Campaign Studio', icon: Megaphone },
      { href: '/creative-studio', label: 'Creative Studio', icon: Paintbrush },
      { href: '/calendar', label: 'Opportunity Cal.', icon: Calendar },
    ],
  },
  {
    label: 'INSIGHTS',
    items: [
      { href: '/analytics', label: 'Analytics', icon: BarChart3 },
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'flex flex-col h-screen sticky top-0 z-40 transition-all duration-300',
        'border-r',
        collapsed ? 'w-16' : 'w-[260px]'
      )}
      style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex items-center gap-3 border-b',
          collapsed ? 'px-3 py-4 justify-center' : 'px-4 py-4'
        )}
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="flex-shrink-0">
          <Image
            src="/brand/logo.png"
            alt="Zig icon"
            width={36}
            height={36}
            priority
          />
        </div>
        {!collapsed && (
          <div className="flex items-center gap-1">
            <span className="font-black text-base leading-none" style={{ color: 'var(--color-text-1)' }}>
              ZigPulse
            </span>
            <span
              className="text-[10px] font-bold px-1 py-0.5 rounded ml-1"
              style={{ backgroundColor: 'var(--color-ai-dim)', color: 'var(--color-ai)' }}
            >
              AI
            </span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto px-2 space-y-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p
                className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-1"
                style={{ color: 'var(--color-text-3)' }}
              >
                {group.label}
              </p>
            )}
            {group.items.map(({ href, label, icon: Icon, badge }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  title={collapsed ? label : undefined}
                  className={cn(
                    'flex items-center gap-3 my-0.5 px-3 py-2.5 rounded-xl transition-all duration-200 min-h-[44px] group relative',
                    collapsed && 'justify-center'
                  )}
                  style={
                    active
                      ? { backgroundColor: 'var(--color-primary)', color: '#fff' }
                      : { color: 'var(--color-text-2)' }
                  }
                  onMouseEnter={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-surface-2)'
                  }}
                  onMouseLeave={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = ''
                  }}
                >
                  <Icon
                    size={18}
                    className="flex-shrink-0"
                    style={active ? { color: '#fff' } : { color: 'var(--color-text-3)' }}
                  />
                  {!collapsed && (
                    <span className="text-sm font-medium">{label}</span>
                  )}
                  {active && !collapsed && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#F5C400' }} />
                  )}
                  {badge && !active && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t p-3" style={{ borderColor: 'var(--color-border)' }}>
        {!collapsed && (
          <div
            className="flex items-center gap-2 px-2 py-2 mb-2 rounded-xl"
            style={{ backgroundColor: 'var(--color-surface-2)' }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: '#F5C400' }}
            >
              <span className="text-xs font-black" style={{ color: 'var(--color-primary)' }}>CDG</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--color-text-1)' }}>Marketing Team</p>
              <p className="text-xs truncate" style={{ color: 'var(--color-text-3)' }}>Singapore</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-2 rounded-xl transition-colors min-h-[40px]"
          style={{ color: 'var(--color-text-3)' }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  )
}
