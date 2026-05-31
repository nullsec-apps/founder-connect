import { useLocation } from 'react-router-dom'
import PresenceList from './PresenceList'
import { useConnections } from '../hooks/useConnections'
import { useProfile } from '../hooks/useProfile'
import { useFeed } from '../hooks/useFeed'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserPlus, TrendingUp } from 'lucide-react'
import { seedFounders } from '../lib/seedData'
import { motion } from 'framer-motion'

export default function ContextPane() {
  const loc = useLocation()
  const { profile, list } = useProfile()
  const { request, statusWith } = useConnections()
  const { posts } = useFeed()
  const navigate = useNavigate()
  const [suggest, setSuggest] = useState<any[]>([])

  useEffect(() => {
    if (!profile) return
    list({ stage: profile.stage }).then(rows => {
      const filtered = rows.filter((r: any) => r.user_id !== profile.user_id).slice(0, 5)
      setSuggest(filtered.length ? filtered : seedFounders.slice(0, 4))
    })
  }, [profile, list])

  if (loc.pathname.startsWith('/chat')) return <PresenceList />

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-5">
      <Card className="p-5 rounded-2xl border hairline">
        <div className="flex items-center justify-between mb-3"><h3 className="font-display font-semibold text-[#0E1114]">Who to know</h3><span className="text-xs text-[#6B7280]">{profile?.stage || 'your stage'}</span></div>
        <div className="space-y-3">
          {suggest.map(p => {
            const st = p.user_id ? statusWith(p.user_id) : null
            return (
              <div key={p.id} className="flex items-center gap-3">
                <Avatar className="h-9 w-9 cursor-pointer" onClick={() => p.handle && navigate(`/u/${p.handle}`)}><AvatarImage src={p.avatar_url} /><AvatarFallback>{p.full_name?.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1"><div className="text-sm font-medium truncate">{p.full_name}</div><div className="text-xs text-[#6B7280] truncate">{p.company} \u00b7 {p.sector}</div></div>
                <Button size="sm" variant="outline" className="text-[#FF5B2E] border-[#FF5B2E]/30 hover:bg-orange-50 h-8 transition-all duration-200" disabled={!p.user_id || !!st} onClick={() => p.user_id && request(p.user_id, { to: p.email, fromName: profile?.full_name })}>{st ? (st.status === 'accepted' ? 'Connected' : 'Pending') : <UserPlus size={14} />}</Button>
              </div>
            )
          })}
        </div>
      </Card>
      <Card className="p-5 rounded-2xl border hairline">
        <div className="flex items-center gap-2 mb-3"><TrendingUp size={16} className="text-[#0A6E55]" /><h3 className="font-display font-semibold text-[#0E1114]">Momentum today</h3></div>
        <div className="grid grid-cols-2 gap-3">
          <div><div className="text-2xl font-display font-bold text-[#0E1114]">{posts.length}</div><div className="text-xs text-[#6B7280]">posts in feed</div></div>
          <div><div className="text-2xl font-display font-bold text-[#0E1114]">{posts.reduce((s, p) => s + (Number(p.reaction_count) || 0), 0)}</div><div className="text-xs text-[#6B7280]">reactions</div></div>
        </div>
      </Card>
    </motion.div>
  )
}
