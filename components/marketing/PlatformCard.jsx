'use client'
import { useState, useRef } from 'react'
import { Copy, Check, RefreshCw } from 'lucide-react'

const PLATFORM_META = {
  instagram: { label: 'Instagram', bg: 'from-purple-950 to-pink-950', border: 'border-purple-800', emoji: '📸', accent: '#E1306C' },
  tiktok:    { label: 'TikTok',    bg: 'from-gray-950 to-teal-950',   border: 'border-teal-800',   emoji: '🎵', accent: '#69C9D0' },
  twitter:   { label: 'X (Twitter)', bg: 'from-gray-950 to-blue-950', border: 'border-blue-800',   emoji: '🐦', accent: '#1DA1F2' },
  facebook:  { label: 'Facebook',  bg: 'from-gray-950 to-blue-950',   border: 'border-blue-900',   emoji: '👥', accent: '#1877F2' },
}

export default function PlatformCard({ platform, event, autoGenerate }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [removedTags, setRemovedTags] = useState(new Set())
  const abortRef = useRef(null)
  const meta = PLATFORM_META[platform]

  const generate = async () => {
    if (abortRef.current) abortRef.current.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl
    setContent('')
    setRemovedTags(new Set())
    setLoading(true)
    try {
      const res = await fetch('/api/marketing/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, platform }),
        signal: ctrl.signal,
      })
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const lines = decoder.decode(value).split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ') && line.trim() !== 'data: [DONE]') {
            try {
              const { text } = JSON.parse(line.slice(6))
              if (text) setContent(prev => prev + text)
            } catch {}
          }
        }
      }
    } catch (e) {
      if (e.name !== 'AbortError') setContent('Error generating content. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const hashtags = [...new Set(content.match(/#\w+/g) ?? [])]
  const visibleTags = hashtags.filter(t => !removedTags.has(t))

  return (
    <div className={`bg-gradient-to-br ${meta.bg} border ${meta.border} rounded-xl overflow-hidden flex flex-col min-h-[340px]`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{meta.emoji}</span>
          <span className="text-white font-bold text-base">{meta.label}</span>
        </div>
        <div className="flex gap-2">
          {content && (
            <button
              onClick={copy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-colors min-h-[40px]"
              aria-label="Copy to clipboard"
            >
              {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
          <button
            onClick={generate}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0057FF] hover:bg-[#0041CC] disabled:opacity-60 text-white text-sm transition-colors min-h-[40px]"
            aria-label={loading ? 'Generating' : content ? 'Regenerate' : 'Generate'}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Generating...' : content ? 'Regenerate' : 'Generate'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5">
        {!content && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <span className="text-3xl mb-2 opacity-40">{meta.emoji}</span>
            <p className="text-white/40 text-sm">Click Generate to create {meta.label} content</p>
            <p className="text-white/25 text-xs mt-1">Powered by Claude AI</p>
          </div>
        )}
        {(content || loading) && (
          <div>
            <div className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
              {content}
              {loading && <span className="inline-block w-0.5 h-4 bg-white/70 ml-0.5 animate-pulse align-middle" />}
            </div>
            {visibleTags.length > 0 && !loading && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2">Hashtags (click to remove)</p>
                <div className="flex flex-wrap gap-2">
                  {visibleTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setRemovedTags(s => new Set([...s, tag]))}
                      className="text-xs px-2.5 py-1 rounded-full bg-white/10 hover:bg-red-900/50 text-white/80 hover:text-red-300 transition-colors"
                    >
                      {tag} ×
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
