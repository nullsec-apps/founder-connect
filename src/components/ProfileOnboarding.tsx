import { useState } from 'react'
import { useProfile } from '../hooks/useProfile'
import { useFileUpload } from '../hooks/useFileUpload'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { STAGES, SECTORS, normalizeHandle } from '../lib/format'
import { Upload, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function ProfileOnboarding() {
  const { save } = useProfile()
  const { upload, uploading } = useFileUpload()
  const [f, setF] = useState<any>({ full_name: '', handle: '', company: '', role: '', stage: '', sector: '', currently_figuring_out: '', avatar_url: '', website_url: '', raised: '', mrr: '', hiring: '', shipped: '' })
  const [busy, setBusy] = useState(false)
  const set = (k: string, v: any) => setF((p: any) => ({ ...p, [k]: v }))

  const filled = [f.full_name, f.handle, f.company, f.stage, f.sector, f.currently_figuring_out].filter(Boolean).length
  const pct = Math.round((filled / 6) * 100)

  const onAvatar = async (e: any) => {
    const file = e.target.files?.[0]; if (!file) return
    const url = await upload(file); set('avatar_url', url)
  }

  const submit = async () => {
    setBusy(true)
    try {
      const traction: any = {}
      if (f.raised) traction.raised = Number(f.raised)
      if (f.mrr) traction.mrr = Number(f.mrr)
      if (f.hiring) traction.hiring = Number(f.hiring)
      if (f.shipped) traction.shipped = f.shipped
      await save({ full_name: f.full_name, handle: normalizeHandle(f.handle), company: f.company, role: f.role, stage: f.stage, sector: f.sector, currently_figuring_out: f.currently_figuring_out, avatar_url: f.avatar_url, website_url: f.website_url, traction })
      toast.success('Profile created \u2014 welcome to FounderNet')
    } catch (e: any) { toast.error(e.message || 'Failed to create profile') } finally { setBusy(false) }
  }

  return (
    <div className="min-h-screen bg-[#FBFBF9] py-8 sm:py-10 px-4 overflow-x-hidden">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-xl mx-auto">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0E1114]">Claim your founder profile</h1>
        <p className="text-[#6B7280] mt-1">Lead with momentum, not vanity. This is what other founders see first.</p>
        <Progress value={pct} className="mt-4 h-1.5" />
        <Card className="mt-6 p-5 sm:p-6 rounded-2xl border hairline space-y-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16"><AvatarImage src={f.avatar_url} /><AvatarFallback>{(f.full_name || '?').slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
            <label className="cursor-pointer"><div className="inline-flex items-center gap-2 text-sm border hairline rounded-lg px-3 py-2.5 hover:bg-gray-50 transition-all duration-200"><Upload size={15} />{uploading ? 'Uploading\u2026' : 'Upload avatar'}</div><input type="file" accept="image/*" className="hidden" onChange={onAvatar} /></label>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Full name *</Label><Input className="h-12" value={f.full_name} onChange={e => set('full_name', e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Handle *</Label><Input className="h-12" value={f.handle} onChange={e => set('handle', normalizeHandle(e.target.value))} placeholder="sarahbuilds" /></div>
            <div className="space-y-1.5"><Label>Company</Label><Input className="h-12" value={f.company} onChange={e => set('company', e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Role</Label><Input className="h-12" value={f.role} onChange={e => set('role', e.target.value)} placeholder="CEO" /></div>
            <div className="space-y-1.5"><Label>Stage *</Label><Select value={f.stage} onValueChange={v => set('stage', v)}><SelectTrigger className="h-12"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-1.5"><Label>Sector *</Label><Select value={f.sector} onValueChange={v => set('sector', v)}><SelectTrigger className="h-12"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{SECTORS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
          </div>
          <div className="space-y-1.5"><Label>Currently figuring out *</Label><Textarea value={f.currently_figuring_out} onChange={e => set('currently_figuring_out', e.target.value)} placeholder="The hard problem you're chewing on right now" /></div>
          <div className="space-y-1.5"><Label>Website</Label><Input className="h-12" value={f.website_url} onChange={e => set('website_url', e.target.value)} placeholder="https://" /></div>
          <div className="pt-2 border-t hairline">
            <div className="text-sm font-medium text-[#0A6E55] mb-3">Traction (optional, shown as your strip)</div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Raised ($)</Label><Input className="h-12" type="number" value={f.raised} onChange={e => set('raised', e.target.value)} /></div>
              <div className="space-y-1.5"><Label>MRR ($)</Label><Input className="h-12" type="number" value={f.mrr} onChange={e => set('mrr', e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Open roles</Label><Input className="h-12" type="number" value={f.hiring} onChange={e => set('hiring', e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Just shipped</Label><Input className="h-12" value={f.shipped} onChange={e => set('shipped', e.target.value)} placeholder="v2 launch" /></div>
            </div>
          </div>
          <Button className="w-full h-12 bg-[#0A6E55] hover:bg-[#085a45] transition-all duration-200" disabled={busy || !f.full_name || !f.handle || !f.stage || !f.sector || !f.currently_figuring_out} onClick={submit}>{busy ? 'Creating\u2026' : 'Enter FounderNet'} <ArrowRight size={16} className="ml-1" /></Button>
        </Card>
      </motion.div>
    </div>
  )
}
