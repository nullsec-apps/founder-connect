import { usePresence } from '../hooks/usePresence'
import { useProfile } from '../hooks/useProfile'
import { useConversations } from '../hooks/useConversations'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'

export default function PresenceList() {
  const { online } = usePresence()
  const { profile } = useProfile()
  const { openWith } = useConversations()
  const navigate = useNavigate()
  const others = online.filter(o => o.user_id !== profile?.user_id)
  const msg = async (o: any) => { const c = await openWith(o.user_id); if (c) navigate(`/chat/${c.id}`) }
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="p-5 rounded-2xl border hairline">
        <h3 className="font-display font-semibold mb-1 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#0A6E55] presence-dot" /> Online now</h3>
        <p className="text-xs text-[#6B7280] mb-4"><span className="font-medium text-[#0E1114]">{others.length} founder{others.length !== 1 ? 's' : ''}</span> you'd want to meet are online</p>
        <div className="space-y-3">
          {others.length === 0 && <p className="text-sm text-[#6B7280]">No one else online right now.</p>}
          {others.map(o => (
            <div key={o.id} className="flex items-center gap-3">
              <div className="relative"><Avatar className="h-9 w-9 cursor-pointer" onClick={() => navigate(`/u/${o.handle}`)}><AvatarImage src={o.avatar_url} /><AvatarFallback>{o.full_name?.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar><span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#0A6E55] border-2 border-white presence-dot" /></div>
              <div className="min-w-0 flex-1"><div className="text-sm font-medium truncate">{o.full_name}</div><div className="text-xs text-[#6B7280] truncate">{o.company}</div></div>
              <Button size="sm" variant="ghost" className="text-[#FF5B2E] h-8 transition-all duration-200" onClick={() => msg(o)}><MessageSquare size={15} /></Button>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
