import { useState, useEffect, useCallback } from 'react'
import { useProfile } from '../hooks/useProfile'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import FounderCard from './FounderCard'
import StateBoundary from './StateBoundary'
import { STAGES, SECTORS } from '../lib/format'
import { Search } from 'lucide-react'
import { seedFounders } from '../lib/seedData'
import { motion } from 'framer-motion'

export default function DiscoverGrid() {
  const { profile, list } = useProfile()
  const [search, setSearch] = useState('')
  const [stage, setStage] = useState('all')
  const [sector, setSector] = useState('all')
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const run = useCallback(async () => {
    setLoading(true)
    const r = await list({ stage, sector, search })
    setRows(r.filter((x: any) => x.user_id !== profile?.user_id))
    setLoading(false)
  }, [list, stage, sector, search, profile])

  useEffect(() => { const t = setTimeout(run, 250); return () => clearTimeout(t) }, [run])

  const matched = rows.length > 0 ? rows : (stage === 'all' && sector === 'all' && !search ? seedFounders : [])

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0E1114]">Discover founders</h1>
        <p className="text-sm text-[#6B7280]">Find peers, co-founders, and operators who get your stage.</p>
      </motion.div>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" /><Input className="h-11 pl-9" placeholder="Search by name, company, handle" value={search} onChange={e => setSearch(e.target.value)} /></div>
        <Select value={stage} onValueChange={setStage}><SelectTrigger className="h-11 sm:w-36"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All stages</SelectItem>{STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
        <Select value={sector} onValueChange={setSector}><SelectTrigger className="h-11 sm:w-36"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All sectors</SelectItem>{SECTORS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
      </div>
      {profile && rows.length > 0 && (
        <div><div className="text-sm font-medium text-[#0A6E55] mb-2">Founders at your stage \u2014 connect with 5</div></div>
      )}
      <StateBoundary loading={loading} empty={!loading && matched.length === 0} emptySlot={<div className="text-center py-12 text-[#6B7280]">No founders match yet. Adjust your filters.</div>}>
        <div className="grid sm:grid-cols-2 gap-4">{matched.map((f, i) => (
          <motion.div key={f.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}>
            <FounderCard founder={f} />
          </motion.div>
        ))}</div>
      </StateBoundary>
    </div>
  )
}
