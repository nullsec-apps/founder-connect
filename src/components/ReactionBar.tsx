import { useReactions } from '../hooks/useReactions'
import { Button } from '@/components/ui/button'
import { TrendingUp, Lightbulb, MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function ReactionBar({ postId, initialReactions, replyCount, onReplyClick }: { postId: string; initialReactions?: number; replyCount?: number; onReplyClick?: () => void }) {
  const { toggle, mine, countOf } = useReactions(postId)
  const isSeed = postId.startsWith('seed')
  const fireCount = isSeed ? (initialReactions || 0) : countOf('fire')
  const insightCount = isSeed ? 0 : countOf('insight')
  return (
    <div className="flex items-center gap-1 flex-wrap">
      <motion.div whileTap={{ scale: 0.85 }}>
        <Button size="sm" variant="ghost" disabled={isSeed} onClick={() => toggle('fire')} className={cn('h-9 gap-1.5 transition-all duration-200', mine('fire') ? 'text-[#0A6E55] bg-emerald-50' : 'text-[#6B7280] hover:text-[#0A6E55]')}>
          <TrendingUp size={16} strokeWidth={2} /> <span className="text-sm">{fireCount || ''} Strong</span>
        </Button>
      </motion.div>
      <motion.div whileTap={{ scale: 0.85 }}>
        <Button size="sm" variant="ghost" disabled={isSeed} onClick={() => toggle('insight')} className={cn('h-9 gap-1.5 transition-all duration-200', mine('insight') ? 'text-[#0A6E55] bg-emerald-50' : 'text-[#6B7280] hover:text-[#0A6E55]')}>
          <Lightbulb size={16} strokeWidth={2} /> <span className="text-sm">{insightCount || ''} Insight</span>
        </Button>
      </motion.div>
      <Button size="sm" variant="ghost" onClick={onReplyClick} className="h-9 gap-1.5 text-[#FF5B2E] hover:bg-orange-50 ml-auto transition-all duration-200">
        <MessageSquare size={16} strokeWidth={2} /> <span className="text-sm">{isSeed ? (replyCount || 0) : ''} Reply</span>
      </Button>
    </div>
  )
}
