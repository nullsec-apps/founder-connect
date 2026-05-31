import { useCallback } from 'react'
import { supabase, T } from '../lib/supabaseClient'
import { useAuth } from './useAuth'

export function usePost() {
  const { user } = useAuth()
  const create = useCallback(async (d: any) => {
    if (!user) throw new Error('not authed')
    const { data, error } = await supabase.from(T('posts')).insert({ ...d, author_id: user.id, reaction_count: 0, reply_count: 0 }).select().single()
    if (error) throw error
    return data
  }, [user])
  const remove = useCallback(async (id: string) => {
    await supabase.from(T('posts')).delete().eq('id', id)
  }, [])
  return { create, remove }
}
