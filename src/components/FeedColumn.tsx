import { useFeed } from '../hooks/useFeed'
import { useProfile } from '../hooks/useProfile'
import { rankFeed } from '../lib/rankFeed'
import PostComposer from './PostComposer'
import PostCard from './PostCard'
import StateBoundary from './StateBoundary'
import EmptyState from './EmptyState'
import { Separator } from '@/components/ui/separator'
import { motion } from 'framer-motion'

export default function FeedColumn() {
  const { posts, loading, error, refresh } = useFeed()
  const { profile } = useProfile()
  const ranked = rankFeed(posts, profile)

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0E1114]">Your feed</h1>
        <p className="text-sm text-[#6B7280]">Ranked for {profile?.stage || 'your stage'} founders \u2014 real numbers, hard pivots, warm intros.</p>
      </motion.div>
      <PostComposer onPosted={refresh} />
      <Separator className="hairline" />
      <StateBoundary loading={loading} error={error} empty={!loading && ranked.length === 0} onRetry={refresh} emptySlot={<EmptyState variant="feed" />}>
        <div className="space-y-4">
          {ranked.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}>
              <PostCard post={p} />
            </motion.div>
          ))}
        </div>
      </StateBoundary>
    </div>
  )
}
