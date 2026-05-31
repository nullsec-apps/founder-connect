import { useState, useEffect, useCallback } from 'react'
import { supabase, T } from '../lib/supabaseClient'
import { useAuth } from './useAuth'

export function useConversations() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user) { setLoading(false); return }
    const { data } = await supabase.from(T('conversations')).select('*').or(`participant_a.eq.${user.id},participant_b.eq.${user.id}`).order('last_message_at', { ascending: false, nullsFirst: false })
    const rows = data || []
    const otherIds = rows.map((r: any) => r.participant_a === user.id ? r.participant_b : r.participant_a)
    let profs: Record<string, any> = {}
    if (otherIds.length) {
      const { data: p } = await supabase.from(T('profiles')).select('*').in('user_id', otherIds)
      ;(p || []).forEach((x: any) => { profs[x.user_id] = x })
    }
    const withMeta = await Promise.all(rows.map(async (r: any) => {
      const otherId = r.participant_a === user.id ? r.participant_b : r.participant_a
      const { data: last } = await supabase.from(T('messages')).select('*').eq('conversation_id', r.id).order('created_at', { ascending: false }).limit(1)
      const { count: unread } = await supabase.from(T('messages')).select('id', { count: 'exact', head: true }).eq('conversation_id', r.id).neq('sender_id', user.id).is('read_at', null)
      return { ...r, other: profs[otherId], lastMessage: last?.[0], unread: unread || 0 }
    }))
    setConversations(withMeta)
    setLoading(false)
  }, [user])

  useEffect(() => {
    load()
    if (!user) return
    const ch = supabase.channel('convos').on('postgres_changes', { event: '*', schema: 'public', table: T('messages') }, () => load()).on('postgres_changes', { event: '*', schema: 'public', table: T('conversations') }, () => load()).subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [user, load])

  const openWith = useCallback(async (otherId: string) => {
    if (!user) return null
    const { data: existing } = await supabase.from(T('conversations')).select('*').or(`and(participant_a.eq.${user.id},participant_b.eq.${otherId}),and(participant_a.eq.${otherId},participant_b.eq.${user.id})`).maybeSingle()
    if (existing) return existing
    const { data } = await supabase.from(T('conversations')).insert({ participant_a: user.id, participant_b: otherId, last_message_at: new Date().toISOString() }).select().single()
    load()
    return data
  }, [user, load])

  const totalUnread = conversations.reduce((s, c) => s + (c.unread || 0), 0)

  return { conversations, loading, openWith, totalUnread, reload: load }
}
