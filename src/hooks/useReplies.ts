import { useState, useEffect, useCallback } from 'react'
import { supabase, T } from '../lib/supabaseClient'
import { useAuth } from './useAuth'

export function useReplies(postId: string) {
  const { user } = useAuth()
  const [replies, setReplies] = useState<any[]>([])

  const load = useCallback(async () => {
    if (!postId || postId.startsWith('seed')) return
    const { data } = await supabase.from(T('replies')).select('*').eq('post_id', postId).order('created_at', { ascending: true })
    const ids = Array.from(new Set((data || []).map((r: any) => r.author_id)))
    let authors: Record<string, any> = {}
    if (ids.length) {
      const { data: profs } = await supabase.from(T('profiles')).select('*').in('user_id', ids)
      ;(profs || []).forEach((p: any) => { authors[p.user_id] = p })
    }
    setReplies((data || []).map((r: any) => ({ ...r, author: authors[r.author_id] })))
  }, [postId])

  useEffect(() => {
    load()
    if (!postId || postId.startsWith('seed')) return
    const ch = supabase.channel('rp_' + postId).on('postgres_changes', { event: 'INSERT', schema: 'public', table: T('replies'), filter: `post_id=eq.${postId}` }, () => load()).subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [postId, load])

  const add = useCallback(async (body: string) => {
    if (!user || !body.trim() || postId.startsWith('seed')) return
    await supabase.from(T('replies')).insert({ post_id: postId, author_id: user.id, body: body.trim() })
    const { count } = await supabase.from(T('replies')).select('id', { count: 'exact', head: true }).eq('post_id', postId)
    await supabase.from(T('posts')).update({ reply_count: count || 0 }).eq('id', postId)
    load()
  }, [user, postId, load])

  return { replies, add }
}
