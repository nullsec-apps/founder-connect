import { useState, useEffect, useRef } from 'react'
import { useMessages } from '../hooks/useMessages'
import { useAuth } from '../hooks/useAuth'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { notifyMessage } from '../lib/notify'
import { Send } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function ChatThread({ conversationId, other, online }: { conversationId?: string; other?: any; online?: boolean }) {
  const { user } = useAuth()
  const { messages, send, markRead } = useMessages(conversationId)
  const [body, setBody] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { markRead() }, [conversationId, messages.length, markRead])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages.length])

  const submit = async () => {
    if (!body.trim()) return
    const text = body.trim()
    setBody('')
    await send(text)
    if (!online) notifyMessage({ to: other?.email, fromName: 'A founder', preview: text.slice(0, 80) })
  }

  return (
    <>
      <div className="flex items-center gap-3 p-4 border-b hairline">
        <div className="relative"><Avatar className="h-9 w-9"><AvatarImage src={other?.avatar_url} /><AvatarFallback>{other?.full_name?.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>{online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#0A6E55] border-2 border-white presence-dot" />}</div>
        <div><div className="font-medium text-sm">{other?.full_name}</div><div className="text-xs text-[#6B7280]">{online ? <span className="text-[#0A6E55]">Online now</span> : `@${other?.handle}`}</div></div>
      </div>
      <ScrollArea className="flex-1 p-4"><div className="space-y-2">
        {messages.length === 0 && <div className="text-center text-sm text-[#6B7280] py-8">Say hello \u2014 founders reply faster than VCs.</div>}
        {messages.map(m => { const mine = m.sender_id === user?.id; return (
          <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
            <div className={cn('max-w-[75%] px-3.5 py-2 rounded-2xl text-sm', mine ? 'bg-[#FF5B2E] text-white rounded-br-md' : 'bg-gray-100 text-[#0E1114] rounded-bl-md')}>{m.body}{mine && m.read_at && <span className="block text-[9px] text-white/70 mt-0.5">Read</span>}</div>
          </motion.div>
        )})}
        <div ref={endRef} />
      </div></ScrollArea>
      <div className="p-3 border-t hairline flex gap-2">
        <Input className="h-11" value={body} onChange={e => setBody(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} placeholder="Message\u2026" />
        <Button className="bg-[#FF5B2E] hover:bg-[#e64a1f] h-11 transition-all duration-200" disabled={!body.trim()} onClick={submit}><Send size={16} /></Button>
      </div>
    </>
  )
}
