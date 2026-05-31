import { formatDistanceToNow } from 'date-fns'

export const formatRelative = (d: string): string => {
  if (!d) return ''
  try { return formatDistanceToNow(new Date(d), { addSuffix: true }) } catch { return '' }
}

export const formatMoney = (n: number): string => {
  if (n == null || isNaN(n)) return '$0'
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1) + 'M'
  if (n >= 1_000) return '$' + (n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1) + 'K'
  return '$' + n
}

export const normalizeHandle = (h: string): string =>
  (h || '').toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 24)

export const STAGES = ['Idea', 'Pre-seed', 'Seed', 'Series A', 'Series B+']
export const SECTORS = ['AI/ML', 'Fintech', 'SaaS', 'Dev Tools', 'Consumer', 'Health', 'Climate', 'Marketplace', 'Crypto', 'Other']

export const stageLabel = (s?: string): string => s || 'Stealth'

export const stageColor = (s?: string): string => {
  const map: Record<string, string> = {
    'Idea': 'bg-gray-100 text-gray-600',
    'Pre-seed': 'bg-emerald-50 text-emerald-700',
    'Seed': 'bg-emerald-100 text-emerald-800',
    'Series A': 'bg-teal-100 text-teal-800',
    'Series B+': 'bg-teal-200 text-teal-900',
  }
  return map[s || ''] || 'bg-gray-100 text-gray-600'
}
