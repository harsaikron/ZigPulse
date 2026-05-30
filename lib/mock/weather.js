export function getWeatherData() {
  const forecast = []
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    const rainProb = Math.round(20 + Math.random() * 60)
    forecast.push({
      date: d.toISOString().slice(0, 10),
      condition: rainProb > 70 ? 'Heavy Rain' : rainProb > 50 ? 'Light Rain' : rainProb > 30 ? 'Cloudy' : 'Sunny',
      high: Math.round(28 + Math.random() * 6),
      low: Math.round(24 + Math.random() * 3),
      rainProb,
      humidity: Math.round(70 + Math.random() * 20),
      demandUplift: rainProb > 50 ? Math.round(10 + (rainProb - 50) * 0.5) : 0,
    })
  }
  const elNinoConfidence = 72
  const elNinoProjection = Array.from({ length: 60 }, (_, i) => ({
    day: i + 1,
    rainProb: Math.round(45 + Math.sin(i / 10) * 20 + Math.random() * 10),
    demandUplift: Math.round(8 + Math.sin(i / 10) * 8 + Math.random() * 5),
    elNinoIntensity: Math.min(100, Math.round(60 + i * 0.3 + Math.random() * 10)),
  }))
  return { forecast, elNinoConfidence, elNinoProjection, current: forecast[0] }
}
