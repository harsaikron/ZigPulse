'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === 'admin' && password === 'zigpulse2024') {
      localStorage.setItem('zp_auth', 'true')
      router.push('/')
    } else {
      setError('Invalid username or password.')
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      {/* Logo */}
      <div className="flex flex-col items-center gap-3 mb-8">
        <Image src="/brand/logo.png" alt="ZigPulse" width={48} height={48} priority />
        <div className="flex items-center gap-2">
          <span className="font-black text-xl" style={{ color: 'var(--color-text-1)' }}>ZigPulse</span>
          <span
            className="text-xs font-bold px-1.5 py-0.5 rounded"
            style={{ backgroundColor: 'var(--color-ai-dim)', color: 'var(--color-ai)' }}
          >
            AI
          </span>
        </div>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-[400px] rounded-2xl p-8"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        <h1 className="text-xl font-bold mb-6" style={{ color: 'var(--color-text-1)' }}>
          Welcome back
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--color-text-2)' }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError('') }}
              placeholder="admin"
              className="w-full px-4 py-2.5 rounded-xl text-sm"
              style={{
                backgroundColor: 'var(--color-surface-2)',
                color: 'var(--color-text-1)',
                border: '1px solid var(--color-border)',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--color-text-2)' }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl text-sm pr-10"
                style={{
                  backgroundColor: 'var(--color-surface-2)',
                  color: 'var(--color-text-1)',
                  border: '1px solid var(--color-border)',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--color-text-3)' }}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm" style={{ color: 'var(--color-danger)' }}>{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl text-sm font-semibold mt-2 transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
