'use client'
import { useState, useEffect, useCallback } from 'react'
import { api } from '../api'
import type { CommandCentreSummary } from '../types'

const POLL_INTERVAL = 60_000 // 60 seconds

export function useCommandCentre() {
  const [data, setData] = useState<CommandCentreSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLive, setIsLive] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const summary = await api.getCommandCentreSummary()
      setData(summary)
      setIsLive(true)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
      setIsLive(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchData])

  return { data, loading, error, isLive, refetch: fetchData }
}
