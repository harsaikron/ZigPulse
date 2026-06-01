'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    if (window.location.pathname === '/login') {
      setAuthed(true)
      setChecked(true)
      return
    }
    const ok = localStorage.getItem('zp_auth') === 'true'
    if (!ok) {
      router.replace('/login')
    } else {
      setAuthed(true)
    }
    setChecked(true)
  }, [router])

  if (!checked) return null
  if (!authed) return null
  return <>{children}</>
}
