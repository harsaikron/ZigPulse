'use client'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import OpportunityScore from '@/components/command-centre/OpportunityScore'
import ActiveOpportunities from '@/components/command-centre/ActiveOpportunities'
import HighestImpact from '@/components/command-centre/HighestImpact'
import UpcomingEvents from '@/components/command-centre/UpcomingEvents'
import WeatherStrip from '@/components/command-centre/WeatherStrip'
import TransportAlerts from '@/components/command-centre/TransportAlerts'
import AIRecommendations from '@/components/command-centre/AIRecommendations'
import { useCommandCentre } from '@/lib/hooks/useCommandCentre'
import { AlertTriangle } from 'lucide-react'

function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl animate-pulse ${className}`}
      style={{ backgroundColor: 'var(--color-surface-2)', minHeight: 120 }}
    />
  )
}

export default function CommandCentrePage() {
  const { data, loading, error, isLive } = useCommandCentre()

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Command Centre" isLive={isLive} />

        {error && (
          <div className="mx-6 mt-4 flex items-center gap-3 px-4 py-3 rounded-xl border"
            style={{ backgroundColor: 'rgba(255,82,82,0.08)', borderColor: 'rgba(255,82,82,0.3)', color: '#FF5252' }}>
            <AlertTriangle size={16} />
            <span className="text-sm font-medium">Backend unreachable — start the API on port 4000 to load live data.</span>
          </div>
        )}

        <main className="flex-1 p-6 space-y-6">
          {/* Zone A — Hero Row */}
          <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-6">
            {loading || !data ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              <>
                <OpportunityScore
                  score={data.opportunityScore}
                  lastUpdated={data.lastUpdated}
                />
                <ActiveOpportunities opportunities={data.activeOpportunities} />
              </>
            )}
          </div>

          {/* Zone B — Highest Impact */}
          {loading || !data ? (
            <SkeletonCard className="h-[200px]" />
          ) : data.highestImpact ? (
            <HighestImpact opportunity={data.highestImpact} />
          ) : null}

          {/* Zone C — 3-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading || !data ? (
              <>
                <SkeletonCard className="h-[360px]" />
                <SkeletonCard className="h-[360px]" />
                <SkeletonCard className="h-[360px]" />
              </>
            ) : (
              <>
                <UpcomingEvents events={data.upcomingEvents} />
                {data.weatherSummary && <WeatherStrip weather={data.weatherSummary} />}
                <TransportAlerts alerts={data.transportAlerts} />
              </>
            )}
          </div>

          {/* Zone D — AI Recommendations */}
          <AIRecommendations
            recommendations={data?.aiRecommendations ?? []}
            loading={loading}
          />
        </main>
      </div>
    </div>
  )
}
