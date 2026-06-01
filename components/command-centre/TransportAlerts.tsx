'use client'
import { useRouter } from 'next/navigation'
import { Train, AlertTriangle, Wand2 } from 'lucide-react'
import type { TransportAlert, Severity } from '@/lib/types'

const severityColor: Record<Severity, string> = {
  CRITICAL: '#FF5252',
  HIGH: '#FFB300',
  MEDIUM: '#0367FC',
  LOW: '#00C853',
}

interface Props {
  alerts: TransportAlert[]
}

export default function TransportAlerts({ alerts }: Props) {
  const router = useRouter()
  return (
    <div
      className="rounded-2xl p-5 h-full"
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      <h2 className="text-base font-bold mb-4" style={{ color: 'var(--color-text-1)' }}>
        Transport Alerts
      </h2>
      <div className="space-y-3">
        {alerts.map((alert) => {
          const color = severityColor[alert.severity]
          return (
            <div
              key={alert.id}
              className="p-3 rounded-xl"
              style={{
                backgroundColor: 'var(--color-surface-2)',
                borderLeft: `3px solid ${color}`,
              }}
            >
              <div className="flex items-start gap-2 mb-1">
                <AlertTriangle size={14} style={{ color }} className="flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="text-xs font-bold px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: `${color}20`, color }}
                    >
                      {alert.severity}
                    </span>
                    {alert.affectedLine && (
                      <span className="text-xs font-medium flex items-center gap-1" style={{ color: 'var(--color-text-2)' }}>
                        <Train size={10} /> {alert.affectedLine}
                      </span>
                    )}
                  </div>
                  <p className="text-xs" style={{ color: 'var(--color-text-2)' }}>
                    {alert.description}
                  </p>
                  {alert.demandUplift > 0 && (
                    <p className="text-xs font-semibold mt-1" style={{ color: '#00C853' }}>
                      +{alert.demandUplift}% taxi demand opportunity
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => router.push('/campaign-studio')}
                className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg mt-2"
                style={{ backgroundColor: 'var(--color-primary-dim)', color: 'var(--color-primary)' }}
              >
                <Wand2 size={10} /> Generate Campaign
              </button>
            </div>
          )
        })}
        {alerts.length === 0 && (
          <p className="text-sm text-center py-4" style={{ color: 'var(--color-text-3)' }}>
            No active transport alerts
          </p>
        )}
      </div>
    </div>
  )
}
