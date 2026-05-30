const MRT_LINES = ['North-South Line', 'East-West Line', 'Circle Line', 'Downtown Line', 'Thomson-East Coast Line']
const DISRUPTION_TYPES = ['Delay', 'Service Disruption', 'Maintenance', 'Track Fault']

export function getLTAAlerts() {
  const count = Math.random() < 0.3 ? Math.ceil(Math.random() * 3) : 0
  const alerts = []
  for (let i = 0; i < count; i++) {
    const line = MRT_LINES[Math.floor(Math.random() * MRT_LINES.length)]
    alerts.push({
      id: `lta-${Date.now()}-${i}`,
      line,
      type: DISRUPTION_TYPES[Math.floor(Math.random() * DISRUPTION_TYPES.length)],
      affectedZones: ['CBD', 'Orchard', 'Bugis'].slice(0, Math.ceil(Math.random() * 3)),
      demandUplift: Math.round(15 + Math.random() * 25),
      startTime: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      severity: Math.random() < 0.3 ? 'high' : 'medium',
    })
  }
  return { alerts, count, timestamp: new Date().toISOString() }
}
