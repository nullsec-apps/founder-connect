import { useConnections } from '../hooks/useConnections'
import { useAuth } from '../hooks/useAuth'
import { useConversations } from '../hooks/useConversations'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Check, X, MessageSquare, Users } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ConnectionsPanel() {
  const { user } = useAuth()
  const { connections, respond } = useConnections()
  const { openWith } = useConversations()
  const navigate = useNavigate()
  const incoming = connections.filter(c => c.addressee_id === user?.id && c.status === 'pending')
  const outgoing = connections.filter(c => c.requester_id === user?.id && c.status === 'pending')
  const accepted = connections.filter(c => c.status === 'accepted')
  const other = (c: any) => c.requester_id === user?.id ? c.addressee : c.requester
  const Row = ({ c, actions }: any) => { const p = other(c); return (
    <div className="flex items-center gap-3 py-3"><Avatar className="h-10 w-10 cursor-pointer" onClick={() => p?.handle && navigate(`/u/${p.handle}`)}><AvatarImage src={p?.avatar_url} /><AvatarFallback>{p?.full_name?.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar><div className="min-w-0 flex-1"><div className="font-medium text-sm">{p?.full_name}</div><div className="text-xs text-[#6B7280]">{p?.company} \u00b7 {p?.stage}</div></div>{actions}</div>
  )}
  const msg = async (c: any) => { const p = other(c); const conv = await openWith(p.user_id); if (conv) navigate(`/chat/${conv.id}`) }
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-5">
      <div><h1 className="font-display text-2xl sm:text-3xl font-bold flex items-center gap-2"><Users size={24} /> Connections</h1><p className="text-sm text-[#6B7280]">Founders you've linked with and pending requests.</p></div>
      <Tabs defaultValue="accepted">
        <TabsList className="flex-wrap h-auto"><TabsTrigger value="accepted">Connected ({accepted.length})</TabsTrigger><TabsTrigger value="incoming">Requests ({incoming.length})</TabsTrigger><TabsTrigger value="outgoing">Sent ({outgoing.length})</TabsTrigger></TabsList>
        <TabsContent value="accepted" className="mt-4"><Card className="px-5 divide-y hairline rounded-2xl">{accepted.length === 0 ? <div className="py-8 text-center text-[#6B7280] text-sm">No connections yet. Find founders in Discover.</div> : accepted.map(c => <Row key={c.id} c={c} actions={<Button size="sm" variant="outline" className="text-[#FF5B2E] border-[#FF5B2E]/30 transition-all duration-200" onClick={() => msg(c)}><MessageSquare size={14} /></Button>} />)}</Card></TabsContent>
        <TabsContent value="incoming" className="mt-4"><Card className="px-5 divide-y hairline rounded-2xl">{incoming.length === 0 ? <div className="py-8 text-center text-[#6B7280] text-sm">No pending requests.</div> : incoming.map(c => <Row key={c.id} c={c} actions={<div className="flex gap-2"><Button size="sm" className="bg-[#0A6E55] hover:bg-[#085a45] h-8 transition-all duration-200" onClick={() => respond(c.id, 'accepted')}><Check size={14} /></Button><Button size="sm" variant="outline" className="h-8 transition-all duration-200" onClick={() => respond(c.id, 'declined')}><X size={14} /></Button></div>} />)}</Card></TabsContent>
        <TabsContent value="outgoing" className="mt-4"><Card className="px-5 divide-y hairline rounded-2xl">{outgoing.length === 0 ? <div className="py-8 text-center text-[#6B7280] text-sm">No sent requests.</div> : outgoing.map(c => <Row key={c.id} c={c} actions={<Badge variant="outline">Pending</Badge>} />)}</Card></TabsContent>
      </Tabs>
    </motion.div>
  )
}
