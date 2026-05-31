import { useParams, useNavigate } from 'react-router-dom'
import { useConversations } from '../hooks/useConversations'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import ChatThread from './ChatThread'
import StateBoundary from './StateBoundary'
import { formatRelative } from '../lib/format'
import { usePresence } from '../hooks/usePresence'
import { MessageSquare, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ChatLayout() {
  const { conversationId } = useParams()
  const navigate = useNavigate()
  const { conversations, loading } = useConversations()
  const { online } = usePresence()
  const active = conversations.find(c => c.id === conversationId)

  return (
    <div className="h-[calc(100vh-7rem)] lg:h-[calc(100vh-3rem)] flex gap-4">
      <div className={cn('w-full lg:w-80 shrink-0', conversationId && 'hidden lg:block')}>
        <h1 className="font-display text-2xl sm:text-3xl font-bold mb-3">Chat</h1>
        <StateBoundary loading={loading} empty={!loading && conversations.length === 0} emptySlot={<Card className="p-6 text-center rounded-2xl border hairline"><MessageSquare size={28} className="mx-auto text-[#6B7280] mb-2" /><p className="text-sm text-[#6B7280]">No conversations yet. Message a founder from Discover or a profile.</p></Card>}>
          <ScrollArea className="h-[calc(100%-3rem)]"><div className="space-y-1 pr-2">
            {conversations.map(c => { const isOnline = online.some(o => o.user_id === c.other?.user_id); return (
              <button key={c.id} onClick={() => navigate(`/chat/${c.id}`)} className={cn('w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200', c.id === conversationId ? 'bg-[#0E1114] text-white' : 'hover:bg-gray-100')}>
                <div className="relative"><Avatar className="h-10 w-10"><AvatarImage src={c.other?.avatar_url} /><AvatarFallback>{c.other?.full_name?.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>{isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#0A6E55] border-2 border-white presence-dot" />}</div>
                <div className="min-w-0 flex-1"><div className="flex justify-between items-center"><span className="font-medium text-sm truncate">{c.other?.full_name}</span>{c.lastMessage && <span className={cn('text-[10px]', c.id === conversationId ? 'text-white/60' : 'text-[#6B7280]')}>{formatRelative(c.lastMessage.created_at)}</span>}</div><div className={cn('text-xs truncate', c.id === conversationId ? 'text-white/70' : 'text-[#6B7280]')}>{c.lastMessage?.body || 'Start the conversation'}</div></div>
                {c.unread > 0 && <Badge className="bg-[#FF5B2E] text-white">{c.unread}</Badge>}
              </button>
            )})}
          </div></ScrollArea>
        </StateBoundary>
      </div>
      <div className={cn('flex-1 min-w-0', !conversationId && 'hidden lg:flex')}>
        {conversationId && active ? (
          <Card className="flex flex-col h-full rounded-2xl border hairline overflow-hidden w-full">
            <button onClick={() => navigate('/chat')} className="lg:hidden flex items-center gap-1 text-sm text-[#6B7280] p-3 border-b hairline"><ArrowLeft size={16} /> Back</button>
            <ChatThread conversationId={conversationId} other={active.other} online={online.some(o => o.user_id === active.other?.user_id)} />
          </Card>
        ) : (
          <div className="hidden lg:flex flex-1 items-center justify-center text-[#6B7280]"><div className="text-center"><MessageSquare size={40} className="mx-auto mb-3 opacity-40" /><p>Select a conversation</p></div></div>
        )}
      </div>
    </div>
  )
}
