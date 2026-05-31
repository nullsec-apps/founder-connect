export const rankFeed = (posts: any[], viewer: any): any[] => {
  if (!viewer) return [...posts].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  const score = (p: any) => {
    let s = 0
    const ageHrs = (Date.now() - new Date(p.created_at).getTime()) / 3600_000
    s += Math.max(0, 48 - ageHrs) * 0.5
    if (p.stage_tag && p.stage_tag === viewer.stage) s += 30
    if (p.sector_tag && p.sector_tag === viewer.sector) s += 25
    s += (Number(p.reaction_count) || 0) * 1.5
    s += (Number(p.reply_count) || 0) * 2
    return s
  }
  return [...posts].sort((a, b) => score(b) - score(a))
}
