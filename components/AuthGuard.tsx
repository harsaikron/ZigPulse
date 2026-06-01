'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    // Login page needs no auth check
    if (pathname === '/login') {
      setAuthed(true)
      return
    }
    const ok = localStorage.getItem('zp_auth') === 'true'
    if (!ok) {
      router.replace('/login')
    } else {
      setAuthed(true)
    }
  }, [pathname, router])

  // Show login page immediately without waiting for effect
  if (pathname === '/login') return <>{children}</>

  if (!authed) return null
  return <>{children}</>
}
