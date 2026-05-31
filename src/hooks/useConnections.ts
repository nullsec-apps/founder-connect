import { useState, useEffect, useCallback } from 'react'
import { supabase, T } from '../lib/supabaseClient'
import { useAuth } from './useAuth'
import { notifyConnection } from '../lib/notify'
import toast from 'react-hot-toast'

export function useConnections() {
  const { user } = useAuth()
  const [connections, setConnections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user) { setLoading(false); return }
    const { data } = await supabase.from(T('connections')).select('*').or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
    const rows = data || []
    const ids = Array.from(new Set(rows.flatMap((r: any) => [r.requester_id, r.addressee_id])))
    let profs: Record<string, any> = {}
    if (ids.length) {
      const { data: p } = await supabase.from(T('profiles')).select('*').in('user_id', ids)
      ;(p || []).forEach((x: any) => { profs[x.user_id] = x })
    }
    setConnections(rows.map((r: any) => ({ ...r, requester: profs[r.requester_id], addressee: profs[r.addressee_id] })))
    setLoading(false)
  }, [user])

  useEffect(() => {
    load()
    if (!user) return
    const ch = supabase.channel('conns').on('postgres_changes', { event: '*', schema: 'public', table: T('connections') }, () => load()).subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [user, load])

  const request = useCallback(async (addresseeId: string, opts?: { to?: string; fromName?: string }) => {
    if (!user) return
    await supabase.from(T('connections')).insert({ requester_id: user.id, addressee_id: addresseeId, status: 'pending' })
    if (opts?.to) notifyConnection({ to: opts.to, fromName: opts.fromName || 'A founder' })
    toast.success('Connection request sent')
    load()
  }, [user, load])

  const respond = useCallback(async (id: string, status: string) => {
    await supabase.from(T('connections')).update({ status }).eq('id', id)
    toast.success(status === 'accepted' ? 'Connected' : 'Declined')
    load()
  }, [load])

  const statusWith = (otherId: string) => {
    const c = connections.find(c => (c.requester_id === otherId || c.addressee_id === otherId))
    if (!c) return null
    return { ...c, outgoing: c.requester_id === user?.id }
  }

  return { connections, loading, request, respond, statusWith }
}
