import { useState, useEffect, useCallback } from 'react'
import { supabase, T } from '../lib/supabaseClient'
import { useAuth } from './useAuth'

export function useReactions(postId: string) {
  const { user } = useAuth()
  const [reactions, setReactions] = useState<any[]>([])

  const load = useCallback(async () => {
    if (!postId || postId.startsWith('seed')) return
    const { data } = await supabase.from(T('reactions')).select('*').eq('post_id', postId)
    setReactions(data || [])
  }, [postId])

  useEffect(() => {
    load()
    if (!postId || postId.startsWith('seed')) return
    const ch = supabase.channel('rx_' + postId).on('postgres_changes', { event: '*', schema: 'public', table: T('reactions'), filter: `post_id=eq.${postId}` }, () => load()).subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [postId, load])

  const toggle = useCallback(async (kind: string) => {
    if (!user || !postId || postId.startsWith('seed')) return
    const existing = reactions.find(r => r.user_id === user.id && r.kind === kind)
    if (existing) {
      setReactions(p => p.filter(r => r.id !== existing.id))
      await supabase.from(T('reactions')).delete().eq('id', existing.id)
    } else {
      const optimistic = { id: 'tmp-' + Date.now(), post_id: postId, user_id: user.id, kind }
      setReactions(p => [...p, optimistic])
      await supabase.from(T('reactions')).insert({ post_id: postId, user_id: user.id, kind })
    }
    const { count } = await supabase.from(T('reactions')).select('id', { count: 'exact', head: true }).eq('post_id', postId)
    await supabase.from(T('posts')).update({ reaction_count: count || 0 }).eq('id', postId)
  }, [user, postId, reactions])

  const mine = (kind: string) => !!user && reactions.some(r => r.user_id === user.id && r.kind === kind)
  const countOf = (kind: string) => reactions.filter(r => r.kind === kind).length

  return { reactions, toggle, mine, countOf }
}
