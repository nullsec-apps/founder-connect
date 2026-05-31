import { useState, useEffect } from 'react'
import { supabase, T } from '../lib/supabaseClient'
import { useAuth } from './useAuth'

export function usePresence() {
  const { user } = useAuth()
  const [online, setOnline] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    const fetchOnline = async () => {
      const cutoff = new Date(Date.now() - 1000 * 60 * 5).toISOString()
      const { data } = await supabase.from(T('profiles')).select('*').gte('last_seen_at', cutoff).order('last_seen_at', { ascending: false })
      if (mounted) setOnline(data || [])
    }
    fetchOnline()
    const heartbeat = async () => {
      if (user) await supabase.from(T('profiles')).update({ is_online: true, last_seen_at: new Date().toISOString() }).eq('user_id', user.id)
    }
    heartbeat()
    const hbInt = setInterval(heartbeat, 30000)
    const fInt = setInterval(fetchOnline, 30000)
    const ch = supabase.channel('presence_profiles').on('postgres_changes', { event: 'UPDATE', schema: 'public', table: T('profiles') }, () => fetchOnline()).subscribe()
    return () => { mounted = false; clearInterval(hbInt); clearInterval(fInt); supabase.removeChannel(ch) }
  }, [user])

  return { online }
}
