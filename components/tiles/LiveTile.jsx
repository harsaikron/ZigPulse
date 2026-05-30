'use client'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import StatusDot from './StatusDot'

export default function LiveTile({
  front,
  back,
  wide = false,
  className,
  status = 'live',
  badge,
  flipInterval = 10000,
}) {
  const [flipped, setFlipped] = useState(false)
  const [glowing, setGlowing] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setFlipped(f => !f), flipInterval + Math.random() * 3000)
    return () => clearInterval(id)
  }, [flipInterval])

  useEffect(() => {
    setGlowing(true)
    const t = setTimeout(() => setGlowing(false), 1500)
    return () => clearTimeout(t)
  }, [status])

  return (
    <div
      className={cn(
        'relative rounded-xl overflow-hidden transition-shadow duration-500 h-full',
        glowing && 'shadow-[0_0_20px_4px_rgba(0,87,255,0.18)]',
        className
      )}
      style={{ perspective: '1000px' }}
    >
      {badge > 0 && (
        <div className="absolute top-2 right-2 z-20 min-w-[22px] h-[22px] bg-[#F5C400] text-[#0057FF] text-xs font-black rounded-full flex items-center justify-center px-1">
          {badge}
        </div>
      )}

      <div className="absolute top-3 left-3 z-20">
        <StatusDot status={status} />
      </div>

      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformStyle: 'preserve-3d', width: '100%', height: '100%', minHeight: 180 }}
        className="relative"
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-xl bg-white border border-slate-200 p-4 pt-8 flex flex-col shadow-sm"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {front}
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-xl border border-[#0041CC] p-4 pt-8 flex flex-col"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: '#0057FF' }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  )
}
