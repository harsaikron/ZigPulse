export default function StatusDot({ status }) {
  const colorMap = {
    live: 'bg-green-400',
    connecting: 'bg-yellow-400',
    stale: 'bg-yellow-500',
    error: 'bg-red-500',
  }
  const labelMap = { live: 'LIVE', connecting: 'CONNECTING', stale: 'STALE', error: 'ERROR' }
  const textMap = {
    live: 'text-green-600',
    connecting: 'text-yellow-600',
    stale: 'text-yellow-600',
    error: 'text-red-500',
  }
  return (
    <div className="flex items-center gap-1.5" aria-label={`Data status: ${labelMap[status] || status}`}>
      <span className={`w-2 h-2 rounded-full ${colorMap[status] || 'bg-gray-400'} ${status === 'live' ? 'live-pulse' : ''}`} />
      <span className={`text-xs font-semibold ${textMap[status] || 'text-gray-400'}`}>
        {labelMap[status] || status}
      </span>
    </div>
  )
}
