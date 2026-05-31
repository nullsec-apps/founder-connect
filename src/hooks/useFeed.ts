import { useState, useEffect, useCallback } from 'react'
import { supabase, T } from '../lib/supabaseClient'

export function useFeed() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  const refresh = useCallback(async () => {
    try {
      setError(null)
      const { data: rows, error: e } = await supabase.from(T('posts')).select('*').order('created_at', { ascending: false }).limit(80)
      if (e) throw e
      const ids = Array.from(new Set((rows || []).map((r: any) => r.author_id)))
      let authors: Record<string, any> = {}
      if (ids.length) {
        const { data: profs } = await supabase.from(T('profiles')).select('*').in('user_id', ids)
        ;(profs || []).forEach((p: any) => { authors[p.user_id] = p })
      }
      setPosts((rows || []).map((r: any) => ({ ...r, author: authors[r.author_id] })))
    } catch (err) { setError(err) } finally { setLoading(false) }
  }, [])

  useEffect(() => {
    refresh()
    const ch = supabase.channel('feed_posts').on('postgres_changes', { event: '*', schema: 'public', table: T('posts') }, () => refresh()).subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [refresh])

  return { posts, loading, error, refresh }
}
