import PostCard from './PostCard'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { seedPosts } from '../lib/seedData'
import { Compass, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function EmptyState({ variant = 'feed' }: { variant?: 'feed' | 'chat' }) {
  const navigate = useNavigate()
  if (variant === 'chat') return (
    <Card className="p-6 text-center rounded-2xl border hairline"><p className="text-sm text-[#6B7280]">Start a conversation from Discover.</p></Card>
  )
  return (
    <div className="space-y-4">
      <Card className="p-5 rounded-2xl border-dashed border-2 hairline bg-emerald-50/40">
        <div className="flex items-center gap-2 text-[#0A6E55] mb-2"><Sparkles size={16} /><span className="text-sm font-medium">Your feed is warming up</span></div>
        <p className="text-sm text-[#6B7280] mb-3">Here's high-signal starter content from founders at your stage. Post your first update or connect to make it yours.</p>
        <Button variant="outline" className="text-[#FF5B2E] border-[#FF5B2E]/30 hover:bg-orange-50 transition-all duration-200" onClick={() => navigate('/discover')}><Compass size={15} className="mr-1.5" /> Connect with 5 founders at your stage</Button>
      </Card>
      {seedPosts.map((p, i) => (
        <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.08 }}>
          <PostCard post={p} />
        </motion.div>
      ))}
    </div>
  )
}
