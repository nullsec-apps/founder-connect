import { createClient } from '@supabase/supabase-js'

export const projectId = (typeof window !== 'undefined' && (window as any).__NULLSEC__?.projectId) || 'demo'
const url = (typeof window !== 'undefined' && (window as any).__NULLSEC__?.supabaseUrl) || (import.meta as any).env?.VITE_SUPABASE_URL
const anon = (typeof window !== 'undefined' && (window as any).__NULLSEC__?.supabaseAnonKey) || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(url, anon)
export const T = (name: string) => `app_${projectId}_${name}`
