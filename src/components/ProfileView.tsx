import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProfile } from '../hooks/useProfile'
import { useConnections } from '../hooks/useConnections'
import { useConversations } from '../hooks/useConversations'
import { supabase, T } from '../lib/supabaseClient'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import TractionStrip from './TractionStrip'
import PostCard from './PostCard'
import StateBoundary from './StateBoundary'
import { stageColor } from '../lib/format'
import { Globe, UserPlus, MessageSquare, Check, LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { motion } from 'framer-motion'

export default function ProfileView() {
  const { handle } = useParams()
  const navigate = useNavigate()
  const { profile: me, getByHandle } = useProfile()
  const { request, statusWith } = useConnections()
  const { openWith } = useConversations()
  const { signOut } = useAuth()
  const [target, setTarget] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      let p = me
      if (handle) p = await getByHandle(handle)
      setTarget(p)
      if (p) {
        const { data } = await supabase.from(T('posts')).select('*').eq('author_id', p.user_id).order('created_at', { ascending: false })
        setPosts((data || []).map((x: any) => ({ ...x, author: p })))
      }
      setLoading(false)
    }
    load()
  }, [handle, me, getByHandle])

  if (loading) return <StateBoundary loading />
  if (!target) return <div className="text-center py-12 text-[#6B7280]">Founder not found.</div>
  const isMe = me?.user_id === target.user_id
  const st = !isMe && target.user_id ? statusWith(target.user_id) : null
  const msg = async () => { const c = await openWith(target.user_id); if (c) navigate(`/chat/${c.id}`) }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-5">
      <Card className="p-5 sm:p-6 rounded-2xl border hairline">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4"><Avatar className="h-16 w-16"><AvatarImage src={target.avatar_url} /><AvatarFallback>{target.full_name?.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar><div><h1 className="font-display text-xl sm:text-2xl font-bold">{target.full_name}</h1><div className="text-sm text-[#6B7280]">@{target.handle} \u00b7 {target.role}{target.company ? `, ${target.company}` : ''}</div><div className="flex gap-2 mt-1">{target.stage && <Badge className={`text-[10px] ${stageColor(target.stage)}`}>{target.stage}</Badge>}{target.sector && <Badge variant="outline" className="text-[10px]">{target.sector}</Badge>}</div></div></div>
          {isMe ? <Button variant="outline" className="transition-all duration-200" onClick={() => { signOut(); navigate('/') }}><LogOut size={15} className="mr-1.5" /> Sign out</Button> : (
            <div className="flex gap-2"><Button variant="outline" className="text-[#FF5B2E] border-[#FF5B2E]/30 hover:bg-orange-50 transition-all duration-200" disabled={!!st} onClick={() => request(target.user_id, { to: target.email, fromName: me?.full_name })}>{st ? (st.status === 'accepted' ? <><Check size={15} className="mr-1" /> Connected</> : 'Pending') : <><UserPlus size={15} className="mr-1" /> Connect</>}</Button><Button className="bg-[#FF5B2E] hover:bg-[#e64a1f] transition-all duration-200" onClick={msg}><MessageSquare size={15} className="mr-1" /> Message</Button></div>
          )}
        </div>
        {target.currently_figuring_out && <p className="mt-4 text-[15px] text-[#0E1114]"><span className="text-xs uppercase tracking-wide text-[#6B7280] block mb-1">Currently figuring out</span>\u201c{target.currently_figuring_out}\u201d</p>}
        <div className="mt-4"><TractionStrip traction={target.traction} /></div>
        {target.website_url && <a href={target.website_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm text-[#0A6E55] hover:underline"><Globe size={14} /> {target.website_url.replace(/^https?:\/\//, '')}</a>}
      </Card>
      <Tabs defaultValue="posts">
        <TabsList><TabsTrigger value="posts">Posts ({posts.length})</TabsTrigger></TabsList>
        <TabsContent value="posts" className="space-y-4 mt-4">{posts.length === 0 ? <div className="text-center py-10 text-[#6B7280]">No posts yet.</div> : posts.map(p => <PostCard key={p.id} post={p} />)}</TabsContent>
      </Tabs>
    </motion.div>
  )
}
