import { useState } from 'react'
import { useReplies } from '../hooks/useReplies'
import { useProfile } from '../hooks/useProfile'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { formatRelative } from '../lib/format'
import { Send } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ReplyThread({ postId }: { postId: string }) {
  const { replies, add } = useReplies(postId)
  const { profile } = useProfile()
  const [body, setBody] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async () => { if (!body.trim()) return; setBusy(true); try { await add(body); setBody('') } finally { setBusy(false) } }
  return (
    <div className="mt-3 pt-3 border-t hairline">
      <div className="space-y-3 mb-3">
        {replies.map(r => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5">
            <Avatar className="h-7 w-7"><AvatarImage src={r.author?.avatar_url} /><AvatarFallback className="text-xs">{(r.author?.full_name || '?').slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
            <div className="flex-1"><div className="text-sm"><span className="font-medium">{r.author?.full_name || 'Founder'}</span> <span className="text-xs text-[#6B7280]">{formatRelative(r.created_at)}</span></div><div className="text-sm text-[#0E1114]">{r.body}</div></div>
          </motion.div>
        ))}
        {replies.length === 0 && <div className="text-sm text-[#6B7280]">Be the first to reply.</div>}
      </div>
      <div className="flex gap-2 items-end">
        <Avatar className="h-7 w-7"><AvatarImage src={profile?.avatar_url} /><AvatarFallback className="text-xs">{profile?.full_name?.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
        <Textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Add your take\u2026" className="min-h-[40px] resize-none text-sm" />
        <Button size="sm" className="bg-[#FF5B2E] hover:bg-[#e64a1f] h-9 transition-all duration-200" disabled={busy || !body.trim()} onClick={submit}><Send size={14} /></Button>
      </div>
    </div>
  )
}
