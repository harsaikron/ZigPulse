const SG_EVENTS = [
  { name: 'F1 Singapore Grand Prix', venue: 'Marina Bay Street Circuit', zone: 'Marina Bay', date: '2026-09-20', attendance: 260000, category: 'Sports' },
  { name: 'Taylor Swift Eras Tour', venue: 'National Stadium', zone: 'Kallang', date: '2026-07-15', attendance: 55000, category: 'Concert' },
  { name: 'Singapore Food Festival', venue: 'Marina Bay Sands', zone: 'Marina Bay', date: '2026-07-01', attendance: 80000, category: 'Festival' },
  { name: 'National Day Parade', venue: 'The Float @ Marina Bay', zone: 'Marina Bay', date: '2026-08-09', attendance: 28000, category: 'National' },
  { name: 'Singapore Airshow', venue: 'Changi Exhibition Centre', zone: 'Changi Airport', date: '2026-06-10', attendance: 54000, category: 'Exhibition' },
  { name: 'Deepavali Light Up', venue: 'Little India', zone: 'Little India', date: '2026-10-20', attendance: 120000, category: 'Festival' },
  { name: 'ZoukOut', venue: 'Siloso Beach, Sentosa', zone: 'Sentosa', date: '2026-12-05', attendance: 30000, category: 'Music' },
  { name: 'Singapore Marathon', venue: 'Orchard Road', zone: 'Orchard', date: '2026-12-06', attendance: 50000, category: 'Sports' },
  { name: 'Chingay Parade', venue: 'F1 Pit Building', zone: 'Marina Bay', date: '2027-02-14', attendance: 100000, category: 'Cultural' },
  { name: 'IT Show', venue: 'Suntec City', zone: 'CBD', date: '2026-06-25', attendance: 40000, category: 'Exhibition' },
]

export function getUpcomingEvents() {
  const now = new Date()
  return SG_EVENTS
    .filter(e => new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(e => ({
      ...e,
      demandSurge: Math.round(20 + (e.attendance / 10000) * 5),
      recommendedFleet: Math.round(e.attendance / 50),
      daysUntil: Math.ceil((new Date(e.date) - now) / 86400000),
    }))
}
