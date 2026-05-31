import { useState, useEffect, useCallback } from 'react'
import { supabase, T } from '../lib/supabaseClient'
import { useAuth } from './useAuth'

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user) { setProfile(null); setLoading(false); return }
    setLoading(true)
    const { data } = await supabase.from(T('profiles')).select('*').eq('user_id', user.id).maybeSingle()
    setProfile(data || null)
    setLoading(false)
  }, [user])

  useEffect(() => { load() }, [load])

  const save = useCallback(async (d: any) => {
    if (!user) throw new Error('not authed')
    if (profile) {
      const { data, error } = await supabase.from(T('profiles')).update(d).eq('id', profile.id).select().single()
      if (error) throw error
      setProfile(data)
      return data
    } else {
      const { data, error } = await supabase.from(T('profiles')).insert({ ...d, user_id: user.id, email: user.email, is_online: true, last_seen_at: new Date().toISOString() }).select().single()
      if (error) throw error
      setProfile(data)
      return data
    }
  }, [user, profile])

  const list = useCallback(async (f?: { stage?: string; sector?: string; search?: string }) => {
    let q = supabase.from(T('profiles')).select('*').order('created_at', { ascending: false })
    if (f?.stage && f.stage !== 'all') q = q.eq('stage', f.stage)
    if (f?.sector && f.sector !== 'all') q = q.eq('sector', f.sector)
    const { data } = await q
    let rows = data || []
    if (f?.search) {
      const s = f.search.toLowerCase()
      rows = rows.filter((r: any) => (r.full_name || '').toLowerCase().includes(s) || (r.company || '').toLowerCase().includes(s) || (r.handle || '').toLowerCase().includes(s))
    }
    return rows
  }, [])

  const getByUser = useCallback(async (id: string) => {
    const { data } = await supabase.from(T('profiles')).select('*').eq('user_id', id).maybeSingle()
    return data
  }, [])

  const getByHandle = useCallback(async (h: string) => {
    const { data } = await supabase.from(T('profiles')).select('*').eq('handle', h).maybeSingle()
    return data
  }, [])

  return { profile, loading, save, list, getByUser, getByHandle, reload: load }
}
