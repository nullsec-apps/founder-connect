import { useState, useEffect, useCallback } from 'react'
import { supabase, T } from '../lib/supabaseClient'
import { useAuth } from './useAuth'

export function useMessages(conversationId?: string) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!conversationId) { setLoading(false); return }
    const { data } = await supabase.from(T('messages')).select('*').eq('conversation_id', conversationId).order('created_at', { ascending: true })
    setMessages(data || [])
    setLoading(false)
  }, [conversationId])

  useEffect(() => {
    setLoading(true)
    load()
    if (!conversationId) return
    const ch = supabase.channel('msgs_' + conversationId).on('postgres_changes', { event: '*', schema: 'public', table: T('messages'), filter: `conversation_id=eq.${conversationId}` }, (payload: any) => {
      if (payload.eventType === 'INSERT') setMessages(p => p.some(m => m.id === payload.new.id) ? p : [...p, payload.new])
      else load()
    }).subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [conversationId, load])

  const send = useCallback(async (body: string) => {
    if (!user || !conversationId || !body.trim()) return
    const { data } = await supabase.from(T('messages')).insert({ conversation_id: conversationId, sender_id: user.id, body: body.trim() }).select().single()
    if (data) setMessages(p => p.some(m => m.id === data.id) ? p : [...p, data])
    await supabase.from(T('conversations')).update({ last_message_at: new Date().toISOString() }).eq('id', conversationId)
  }, [user, conversationId])

  const markRead = useCallback(async () => {
    if (!user || !conversationId) return
    await supabase.from(T('messages')).update({ read_at: new Date().toISOString() }).eq('conversation_id', conversationId).neq('sender_id', user.id).is('read_at', null)
  }, [user, conversationId])

  return { messages, loading, send, markRead }
}
