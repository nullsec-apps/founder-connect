import { NavLink, useNavigate } from 'react-router-dom'
import { useProfile } from '../hooks/useProfile'
import { useConversations } from '../hooks/useConversations'
import { useAuth } from '../hooks/useAuth'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Home, Compass, MessageSquare, User, Users, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { to: '/', icon: Home, label: 'Feed', end: true },
  { to: '/discover', icon: Compass, label: 'Discover' },
  { to: '/chat', icon: MessageSquare, label: 'Chat' },
  { to: '/connections', icon: Users, label: 'Connections' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function LeftRail() {
  const { profile } = useProfile()
  const { totalUnread } = useConversations()
  const { signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <>
      <nav className="hidden lg:flex flex-col w-[240px] shrink-0 px-4 py-6 sticky top-0 h-screen border-r hairline">
        <div className="font-display text-xl font-extrabold text-[#0E1114] px-2 mb-8 flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#0A6E55]" /> FounderNet</div>
        <div className="space-y-1 flex-1">
          {items.map(it => (
            <NavLink key={it.to} to={it.to} end={it.end} className={({ isActive }) => cn('flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-medium transition-all duration-200', isActive ? 'bg-[#0E1114] text-white' : 'text-[#6B7280] hover:bg-gray-100 hover:text-[#0E1114]')}>
              <it.icon size={20} strokeWidth={1.8} />
              <span>{it.label}</span>
              {it.to === '/chat' && totalUnread > 0 && <Badge className="ml-auto bg-[#FF5B2E] text-white">{totalUnread}</Badge>}
            </NavLink>
          ))}
        </div>
        {profile && (
          <div className="border-t hairline pt-4 flex items-center gap-3">
            <Avatar className="h-9 w-9"><AvatarImage src={profile.avatar_url} /><AvatarFallback>{profile.full_name?.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
            <div className="min-w-0 flex-1"><div className="text-sm font-medium truncate">{profile.full_name}</div><div className="text-xs text-[#6B7280] truncate">@{profile.handle}</div></div>
            <button onClick={() => { signOut(); navigate('/') }} className="text-[#6B7280] hover:text-[#0E1114] p-1.5 transition-colors duration-200"><LogOut size={18} /></button>
          </div>
        )}
      </nav>
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t hairline flex justify-around px-2 py-1.5">
        {items.map(it => (
          <NavLink key={it.to} to={it.to} end={it.end} className={({ isActive }) => cn('flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg min-w-[56px] relative transition-colors duration-200', isActive ? 'text-[#0A6E55]' : 'text-[#6B7280]')}>
            <it.icon size={22} strokeWidth={1.8} />
            <span className="text-[10px] font-medium">{it.label}</span>
            {it.to === '/chat' && totalUnread > 0 && <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-[#FF5B2E]" />}
          </NavLink>
        ))}
      </nav>
    </>
  )
}
