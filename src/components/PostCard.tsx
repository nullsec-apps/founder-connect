import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import TractionStrip from './TractionStrip'
import ReactionBar from './ReactionBar'
import ReplyThread from './ReplyThread'
import { hasTraction } from '../lib/traction'
import { formatRelative, stageColor } from '../lib/format'
import { AnimatePresence, motion } from 'framer-motion'

export default function PostCard({ post }: { post: any }) {
  const [showReplies, setShowReplies] = useState(false)
  const navigate = useNavigate()
  const a = post.author || {}
  return (
    <Card className="p-5 rounded-2xl border hairline lift">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 cursor-pointer" onClick={() => a.handle && navigate(`/u/${a.handle}`)}><AvatarImage src={a.avatar_url} /><AvatarFallback>{(a.full_name || '?').slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-[#0E1114] cursor-pointer hover:underline" onClick={() => a.handle && navigate(`/u/${a.handle}`)}>{a.full_name || 'Founder'}</span>
            {post.stage_tag && <Badge className={`text-[10px] px-1.5 ${stageColor(post.stage_tag)}`}>{post.stage_tag}</Badge>}
            {post.sector_tag && <Badge variant="outline" className="text-[10px] px-1.5">{post.sector_tag}</Badge>}
            <span className="text-xs text-[#6B7280]">\u00b7 {formatRelative(post.created_at)}</span>
          </div>
          {a.company && <div className="text-xs text-[#6B7280]">{a.role ? a.role + ', ' : ''}{a.company}</div>}
        </div>
      </div>
      <p className="mt-3 text-[15px] leading-relaxed text-[#0E1114] whitespace-pre-wrap">{post.body}</p>
      {post.media?.length > 0 && <div className="mt-3 grid grid-cols-2 gap-2">{post.media.map((m: string, i: number) => <img key={i} src={m} className="rounded-xl object-cover w-full max-h-72" />)}</div>}
      {hasTraction(post.traction_strip) && <div className="mt-4"><TractionStrip traction={post.traction_strip} /></div>}
      <div className="mt-4"><ReactionBar postId={post.id} initialReactions={post.isSeed ? Number(post.reaction_count) : undefined} replyCount={post.isSeed ? Number(post.reply_count) : undefined} onReplyClick={() => setShowReplies(s => !s)} /></div>
      <AnimatePresence>
        {showReplies && !post.isSeed && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <ReplyThread postId={post.id} />
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
