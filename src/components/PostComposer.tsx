import { useState } from 'react'
import { usePost } from '../hooks/usePost'
import { useProfile } from '../hooks/useProfile'
import { useFileUpload } from '../hooks/useFileUpload'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { STAGES, SECTORS } from '../lib/format'
import { Image, TrendingUp, Send, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PostComposer({ onPosted }: { onPosted?: () => void }) {
  const { create } = usePost()
  const { profile } = useProfile()
  const { upload, uploading } = useFileUpload()
  const [body, setBody] = useState('')
  const [stage, setStage] = useState(profile?.stage || '')
  const [sector, setSector] = useState(profile?.sector || '')
  const [media, setMedia] = useState<string[]>([])
  const [tr, setTr] = useState<any>({ raised: '', mrr: '', shipped: '' })
  const [busy, setBusy] = useState(false)

  const onMedia = async (e: any) => { const f = e.target.files?.[0]; if (!f) return; const url = await upload(f); if (url) setMedia(m => [...m, url]) }

  const submit = async () => {
    if (!body.trim()) return
    setBusy(true)
    try {
      const traction_strip: any = {}
      if (tr.raised) traction_strip.raised = Number(tr.raised)
      if (tr.mrr) traction_strip.mrr = Number(tr.mrr)
      if (tr.shipped) traction_strip.shipped = tr.shipped
      await create({ body: body.trim(), stage_tag: stage || null, sector_tag: sector || null, traction_strip, media })
      setBody(''); setMedia([]); setTr({ raised: '', mrr: '', shipped: '' })
      toast.success('Posted to your network')
      onPosted?.()
    } catch (e: any) { toast.error('Could not post') } finally { setBusy(false) }
  }

  return (
    <Card className="p-4 rounded-2xl border hairline">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10"><AvatarImage src={profile?.avatar_url} /><AvatarFallback>{profile?.full_name?.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
        <div className="flex-1 min-w-0">
          <Textarea value={body} onChange={e => setBody(e.target.value)} placeholder="What did you ship or learn this week?" className="border-none shadow-none px-0 resize-none text-[15px] focus-visible:ring-0 min-h-[60px]" />
          {media.length > 0 && <div className="flex gap-2 flex-wrap mb-2">{media.map((m, i) => <div key={i} className="relative"><img src={m} className="h-20 w-20 object-cover rounded-lg" /><button onClick={() => setMedia(media.filter((_, j) => j !== i))} className="absolute -top-1.5 -right-1.5 bg-black/70 text-white rounded-full p-0.5"><X size={12} /></button></div>)}</div>}
          <div className="flex items-center gap-2 flex-wrap mt-2">
            <Select value={stage} onValueChange={setStage}><SelectTrigger className="h-8 w-auto text-xs gap-1 border-emerald-200"><SelectValue placeholder="Stage" /></SelectTrigger><SelectContent>{STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
            <Select value={sector} onValueChange={setSector}><SelectTrigger className="h-8 w-auto text-xs gap-1"><SelectValue placeholder="Sector" /></SelectTrigger><SelectContent>{SECTORS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
            <label className="cursor-pointer"><Button asChild size="sm" variant="ghost" className="h-8 text-[#6B7280]"><span><Image size={16} /></span></Button><input type="file" accept="image/*" className="hidden" onChange={onMedia} /></label>
            <Popover><PopoverTrigger asChild><Button size="sm" variant="ghost" className="h-8 text-[#0A6E55]"><TrendingUp size={16} /></Button></PopoverTrigger><PopoverContent className="w-64 space-y-3"><div className="text-sm font-medium">Add traction to this post</div><div className="space-y-1"><Label className="text-xs">Raised ($)</Label><Input className="h-9" type="number" value={tr.raised} onChange={e => setTr({ ...tr, raised: e.target.value })} /></div><div className="space-y-1"><Label className="text-xs">MRR ($)</Label><Input className="h-9" type="number" value={tr.mrr} onChange={e => setTr({ ...tr, mrr: e.target.value })} /></div><div className="space-y-1"><Label className="text-xs">Shipped</Label><Input className="h-9" value={tr.shipped} onChange={e => setTr({ ...tr, shipped: e.target.value })} /></div></PopoverContent></Popover>
            <Button className="h-8 ml-auto bg-[#0A6E55] hover:bg-[#085a45] transition-all duration-200" disabled={busy || uploading || !body.trim()} onClick={submit}>{busy ? 'Posting\u2026' : 'Post'} <Send size={14} className="ml-1" /></Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
