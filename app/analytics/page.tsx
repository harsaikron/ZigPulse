import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import { BarChart3 } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar title="Analytics" />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 p-12 text-center">
          <BarChart3 size={64} style={{ color: 'var(--color-text-3)' }} />
          <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-1)' }}>Analytics</h2>
          <p className="text-base" style={{ color: 'var(--color-text-3)' }}>Coming in Phase 2</p>
          <button disabled className="px-6 py-2 rounded-xl text-sm font-semibold opacity-40 cursor-not-allowed"
            style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
            View Reports
          </button>
        </main>
      </div>
    </div>
  )
}
