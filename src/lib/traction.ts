import { formatMoney } from './format'

export interface Traction {
  raised?: number
  mrr?: number
  mrrDelta?: number
  hiring?: number
  shipped?: string
}

export interface TractionSegment {
  key: string
  label: string
  value: string
  fill: number
  tone: 'green' | 'neutral'
}

export const tractionSegments = (t: Traction | null | undefined): TractionSegment[] => {
  if (!t) return []
  const segs: TractionSegment[] = []
  if (t.raised != null && t.raised > 0) {
    segs.push({ key: 'raised', label: 'Raised', value: formatMoney(t.raised), fill: Math.min(100, (t.raised / 5_000_000) * 100), tone: 'green' })
  }
  if (t.mrr != null && t.mrr > 0) {
    const d = t.mrrDelta ? (t.mrrDelta > 0 ? ` +${t.mrrDelta}%` : ` ${t.mrrDelta}%`) : ''
    segs.push({ key: 'mrr', label: 'MRR', value: formatMoney(t.mrr) + d, fill: Math.min(100, (t.mrr / 100_000) * 100), tone: 'green' })
  }
  if (t.hiring != null && t.hiring > 0) {
    segs.push({ key: 'hiring', label: 'Hiring', value: `${t.hiring} role${t.hiring > 1 ? 's' : ''}`, fill: Math.min(100, t.hiring * 20), tone: 'green' })
  }
  if (t.shipped) {
    segs.push({ key: 'shipped', label: 'Shipped', value: t.shipped, fill: 100, tone: 'green' })
  }
  return segs
}

export const hasTraction = (t: Traction | null | undefined): boolean => tractionSegments(t).length > 0
