const ZONES = [
  'CBD', 'Orchard', 'Marina Bay', 'Changi Airport', 'Jurong East',
  'Woodlands', 'Tampines', 'Bugis', 'Sentosa', 'Novena',
  'Toa Payoh', 'Bishan', 'Little India', 'Chinatown', 'Dhoby Ghaut'
]

export function generateDemandData() {
  const hour = new Date().getHours()
  const peakMultiplier = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 20) ? 1.5 : 1.0
  return {
    totalActive: Math.round(8000 + Math.random() * 4000),
    totalDemand: Math.round(12000 * peakMultiplier + Math.random() * 2000),
    utilizationRate: Math.round(60 + Math.random() * 25),
    zones: ZONES.map(name => ({
      name,
      demand: Math.round(200 + Math.random() * 800 * peakMultiplier),
      supply: Math.round(150 + Math.random() * 600),
      score: Math.round(40 + Math.random() * 60),
    })).sort((a, b) => b.demand - a.demand),
    timestamp: new Date().toISOString(),
  }
}

export function generateForecast(days = 60) {
  const base = []
  const now = new Date()
  for (let i = 0; i < days; i++) {
    const d = new Date(now)
    d.setDate(d.getDate() + i)
    const isWeekend = d.getDay() === 0 || d.getDay() === 6
    const hasEvent = Math.random() < 0.15
    base.push({
      date: d.toISOString().slice(0, 10),
      demand: Math.round(45000 + (isWeekend ? 15000 : 0) + (hasEvent ? 20000 : 0) + Math.random() * 5000),
      supply: Math.round(38000 + Math.random() * 4000),
      eventDay: hasEvent,
      weekend: isWeekend,
    })
  }
  return base
}
