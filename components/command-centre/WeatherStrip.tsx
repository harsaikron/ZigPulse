'use client'
import { Sun, Cloud, CloudRain, Droplets } from 'lucide-react'
import type { WeatherSummary } from '@/lib/types'

const conditionIcon = (condition: string) => {
  if (condition.includes('Rain') || condition === 'Thunderstorm') return CloudRain
  if (condition.includes('Cloud')) return Cloud
  return Sun
}

interface Props {
  weather: WeatherSummary
}

export default function WeatherStrip({ weather }: Props) {
  return (
    <div
      className="rounded-2xl p-5 h-full"
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      <h2 className="text-base font-bold mb-4" style={{ color: 'var(--color-text-1)' }}>
        Weather Intel
      </h2>
      <div className="space-y-2">
        {weather.forecast.map((day, i) => {
          const Icon = conditionIcon(day.condition)
          const isToday = i === 0
          const highRain = day.rainProb >= 70
          const dateLabel = isToday
            ? 'Today'
            : new Date(day.date).toLocaleDateString('en-SG', { weekday: 'short' })

          return (
            <div
              key={day.id}
              className="flex items-center gap-3 px-3 py-2 rounded-xl"
              style={{
                backgroundColor: isToday ? 'var(--color-primary-dim)' : 'var(--color-surface-2)',
                border: highRain && !isToday ? '1px solid #FFB30040' : '1px solid transparent',
              }}
            >
              <span
                className="text-xs font-semibold w-12 flex-shrink-0"
                style={{ color: isToday ? 'var(--color-primary)' : 'var(--color-text-3)' }}
              >
                {dateLabel}
              </span>
              <Icon
                size={16}
                style={{ color: day.rainProb >= 60 ? '#60A5FA' : '#F5C400' }}
                className="flex-shrink-0"
              />
              <span className="text-sm font-semibold w-8" style={{ color: 'var(--color-text-1)' }}>
                {day.high}°
              </span>
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-border)' }}>
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${day.rainProb}%`,
                      backgroundColor: day.rainProb >= 70 ? '#FFB300' : 'var(--color-primary)',
                    }}
                  />
                </div>
                <span
                  className="text-xs font-semibold w-8 text-right flex items-center gap-0.5"
                  style={{ color: day.rainProb >= 70 ? '#FFB300' : 'var(--color-text-3)' }}
                >
                  <Droplets size={10} />{day.rainProb}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
