import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { tractionSegments } from '../lib/traction'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

export default function TractionStrip({ traction }: { traction: any }) {
  const segs = tractionSegments(traction)
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold: 0.3 })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  if (segs.length === 0) return null
  return (
    <TooltipProvider>
      <div ref={ref} className="rounded-xl bg-emerald-50/60 border border-emerald-100 p-3">
        <div className="flex flex-wrap gap-x-5 gap-y-3">
          {segs.map((s, i) => (
            <Tooltip key={s.key}>
              <TooltipTrigger asChild>
                <div className="flex-1 min-w-[90px]">
                  <div className="flex items-center justify-between mb-1"><span className="text-[10px] uppercase tracking-wide text-emerald-700 font-medium">{s.label}</span></div>
                  <div className="text-sm font-display font-semibold text-[#0E1114] mb-1.5">{s.value}</div>
                  <div className="h-1 rounded-full bg-emerald-100 overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: inView ? `${s.fill}%` : 0 }} transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }} className="h-full bg-[#0A6E55] rounded-full" /></div>
                </div>
              </TooltipTrigger>
              <TooltipContent>{s.label}: {s.value}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  )
}
