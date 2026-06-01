'use client'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Bell, Sun, Moon, Monitor, Command } from 'lucide-react'

interface TopBarProps {
  title: string
  isLive?: boolean
}

export default function TopBar({ title, isLive = false }: TopBarProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  const ThemeIcon = !mounted
    ? Monitor
    : theme === 'light'
    ? Sun
    : theme === 'dark'
    ? Moon
    : Monitor

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-4 px-6 h-[60px] border-b"
      style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
    >
      {/* Wordmark */}
      <div className="flex-shrink-0">
        <Image
          src="/brand/time_to_zig.png"
          alt="ZigPulse"
          width={120}
          height={28}
          priority
          className="object-contain"
        />
      </div>

      {/* Page title */}
      <h1 className="text-base font-semibold" style={{ color: 'var(--color-text-1)' }}>
        {title}
      </h1>

      <div className="flex-1" />

      {/* LIVE indicator */}
      {isLive && (
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-xs font-semibold text-green-500">LIVE</span>
        </div>
      )}

      {/* ⌘K — Command Palette trigger (empty modal Phase 1) */}
      <button
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors border"
        style={{ color: 'var(--color-text-3)', borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-2)' }}
        onClick={() => {/* Phase 2 */}}
        aria-label="Open command palette"
      >
        <Command size={13} />
        <span>K</span>
      </button>

      {/* Notifications */}
      <button
        className="relative p-2 rounded-lg transition-colors"
        style={{ color: 'var(--color-text-2)' }}
        aria-label="Notifications"
      >
        <Bell size={18} />
        <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[9px] text-white font-bold">
          3
        </span>
      </button>

      {/* Theme Toggle */}
      <button
        onClick={cycleTheme}
        className="p-2 rounded-lg transition-colors"
        style={{ color: 'var(--color-text-2)' }}
        aria-label="Toggle theme"
      >
        <ThemeIcon size={18} />
      </button>

      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
        style={{ backgroundColor: '#F5C400', color: 'var(--color-primary)' }}
      >
        CDG
      </div>
    </header>
  )
}
