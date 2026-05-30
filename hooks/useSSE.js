'use client'
import { useEffect, useState, useRef } from 'react'

export function useSSE(url, initialData = null) {
  const [data, setData] = useState(initialData)
  const [status, setStatus] = useState('connecting')
  const lastUpdateRef = useRef(Date.now())
  const esRef = useRef(null)

  useEffect(() => {
    const connect = () => {
      const es = new EventSource(url)
      esRef.current = es

      es.onopen = () => setStatus('live')

      es.onmessage = (e) => {
        try {
          setData(JSON.parse(e.data))
          setStatus('live')
          lastUpdateRef.current = Date.now()
        } catch {}
      }

      es.onerror = () => {
        setStatus('error')
        es.close()
        setTimeout(connect, 5000)
      }
    }
    connect()

    const staleness = setInterval(() => {
      if (Date.now() - lastUpdateRef.current > 120000) setStatus('stale')
    }, 10000)

    return () => {
      esRef.current?.close()
      clearInterval(staleness)
    }
  }, [url])

  return { data, status }
}
