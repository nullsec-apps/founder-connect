import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import TractionStrip from './TractionStrip'
import { useConnections } from '../hooks/useConnections'
import { useConversations } from '../hooks/useConversations'
import { usePresence } from '../hooks/usePresence'
import { useProfile } from '../hooks/useProfile'
import { stageColor } from '../lib/format'
import { UserPlus, MessageSquare, Check } from 'lucide-react'

export default function FounderCard({ founder }: { founder: any }) {
  const navigate = useNavigate()
  const { request, statusWith } = useConnections()
  const { openWith } = useConversations()
  const { online } = usePresence()
  const { profile } = useProfile()
  const isOnline = online.some(o => o.user_id === founder.user_id) || founder.is_online
  const st = founder.user_id ? statusWith(founder.user_id) : null
  const msg = async () => { if (!founder.user_id) return; const c = await openWith(founder.user_id); if (c) navigate(`/chat/${c.id}`) }
  return (
    <Card className="p-5 rounded-2xl border hairline lift h-full flex flex-col">
      <div className="flex items-start gap-3">
        <div className="relative"><Avatar className="h-12 w-12 cursor-pointer" onClick={() => founder.handle && navigate(`/u/${founder.handle}`)}><AvatarImage src={founder.avatar_url} /><AvatarFallback>{founder.full_name?.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>{isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#0A6E55] border-2 border-white presence-dot" />}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap"><span className="font-medium cursor-pointer hover:underline" onClick={() => founder.handle && navigate(`/u/${founder.handle}`)}>{founder.full_name}</span>{founder.stage && <Badge className={`text-[10px] px-1.5 ${stageColor(founder.stage)}`}>{founder.stage}</Badge>}</div>
          <div className="text-xs text-[#6B7280]">{founder.role ? founder.role + ', ' : ''}{founder.company} \u00b7 {founder.sector}</div>
        </div>
      </div>
      {founder.currently_figuring_out && <p className="mt-3 text-sm text-[#0E1114] italic">\u201c{founder.currently_figuring_out}\u201d</p>}
      <div className="mt-3 flex-1"><TractionStrip traction={founder.traction} /></div>
      <div className="mt-4 flex gap-2">
        <Button size="sm" variant="outline" className="flex-1 text-[#FF5B2E] border-[#FF5B2E]/30 hover:bg-orange-50 transition-all duration-200" disabled={!founder.user_id || !!st} onClick={() => founder.user_id && request(founder.user_id, { to: founder.email, fromName: profile?.full_name })}>{st ? (st.status === 'accepted' ? <><Check size={14} className="mr-1" /> Connected</> : 'Pending') : <><UserPlus size={14} className="mr-1" /> Connect</>}</Button>
        <Button size="sm" variant="ghost" className="text-[#FF5B2E] transition-all duration-200" disabled={!founder.user_id} onClick={msg}><MessageSquare size={16} /></Button>
      </div>
    </Card>
  )
}
