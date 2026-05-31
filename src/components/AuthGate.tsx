import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useProfile } from '../hooks/useProfile'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import ProfileOnboarding from './ProfileOnboarding'
import TractionStrip from './TractionStrip'
import { Sparkles, ArrowRight, MessageSquare, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AuthGate({ children }: { children: any }) {
  const { user, loading, signInPassword, signUp } = useAuth()
  const { profile, loading: pLoading } = useProfile()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [mode, setMode] = useState('signin')

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FBFBF9]"><div className="flex items-center gap-2 text-[#6B7280]"><span className="w-2.5 h-2.5 rounded-full bg-[#0A6E55] presence-dot" /> Loading\u2026</div></div>

  if (!user) {
    const submit = async () => {
      setErr(''); setBusy(true)
      try {
        if (mode === 'signin') await signInPassword(email, password)
        else await signUp(email, password)
      } catch (e: any) { setErr(e.message || 'Failed') } finally { setBusy(false) }
    }
    return (
      <div className="min-h-screen w-full bg-[#FBFBF9] overflow-x-hidden">
        <header className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 flex items-center justify-between">
          <div className="font-display text-lg font-extrabold text-[#0E1114] flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#0A6E55]" /> FounderNet</div>
          <span className="text-xs text-[#6B7280] hidden sm:block">Private network for operators</span>
        </header>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-16 grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 text-xs font-medium text-[#0A6E55] bg-emerald-50 px-3 py-1 rounded-full mb-6"><Sparkles size={14} strokeWidth={2} /> Private network for operators</div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.02] text-[#0E1114]">Founders talk to founders here.</h1>
            <p className="mt-5 text-base sm:text-lg text-[#6B7280] max-w-md leading-relaxed">A private feed of operators sharing real numbers, hard pivots, and warm intros \u2014 not recruiter spam or hustle theater.</p>
            <div className="mt-8">
              <Card className="p-6 rounded-2xl border-none shadow-sm w-full max-w-sm">
                <Tabs value={mode} onValueChange={setMode}>
                  <TabsList className="grid grid-cols-2 w-full mb-4"><TabsTrigger value="signin">Sign in</TabsTrigger><TabsTrigger value="signup">Sign up</TabsTrigger></TabsList>
                  <TabsContent value={mode} className="space-y-3 mt-0">
                    <div className="space-y-1.5"><Label>Email</Label><Input className="h-12 text-base" type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} placeholder="you@startup.com" /></div>
                    <div className="space-y-1.5"><Label>Password</Label><Input className="h-12 text-base" type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" /></div>
                    {err && <p className="text-sm text-red-600">{err}</p>}
                    <Button className="w-full h-12 bg-[#0A6E55] hover:bg-[#085a45] text-base transition-all duration-200" disabled={busy || !email || !password} onClick={submit}>{busy ? 'Working\u2026' : 'Claim your founder profile'} <ArrowRight size={16} className="ml-1" /></Button>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.12 }} className="relative">
            <Card className="p-6 rounded-2xl border hairline bg-white shadow-lg">
              <div className="flex items-center gap-3">
                <img src="https://i.pravatar.cc/80?img=47" className="w-11 h-11 rounded-full object-cover" />
                <div><div className="font-medium text-[#0E1114] flex items-center gap-2">Sarah Chen <Badge className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5">Seed</Badge></div><div className="text-xs text-[#6B7280]">CEO, Ledgerline \u00b7 Fintech</div></div>
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-[#0E1114]">Closed our seed \u2014 here's the deck math that worked. We anchored on net revenue retention crossing 120%. Investors stopped asking about TAM.</p>
              <div className="mt-4"><TractionStrip traction={{ raised: 1400000, mrr: 22000, mrrDelta: 31 }} /></div>
              <div className="mt-4 flex items-center gap-4 text-sm text-[#6B7280]"><span className="flex items-center gap-1.5 text-[#0A6E55]"><TrendingUp size={15} /> 24</span><span className="flex items-center gap-1.5 text-[#FF5B2E]"><MessageSquare size={15} /> 6 replies</span></div>
            </Card>
            <div className="mt-4 flex items-center gap-3 pl-2">
              <div className="flex -space-x-2">{[12, 32, 68, 45, 47].map(i => <img key={i} src={`https://i.pravatar.cc/40?img=${i}`} className="w-8 h-8 rounded-full border-2 border-white object-cover" />)}</div>
              <span className="text-sm text-[#6B7280]"><span className="font-medium text-[#0E1114]">8 founders</span> you'd want to meet are online now</span>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (pLoading) return <div className="min-h-screen flex items-center justify-center bg-[#FBFBF9] text-[#6B7280]">Loading your profile\u2026</div>
  if (!profile) return <ProfileOnboarding />
  return children
}
