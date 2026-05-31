import { Outlet } from 'react-router-dom'
import LeftRail from './LeftRail'
import ContextPane from './ContextPane'

export default function AppShell() {
  return (
    <div className="min-h-screen bg-[#FBFBF9] overflow-x-hidden">
      <div className="max-w-7xl mx-auto flex">
        <LeftRail />
        <main className="flex-1 min-w-0 px-4 sm:px-6 py-6 pb-24 lg:pb-6 w-full max-w-[640px] mx-auto lg:mx-0">
          <Outlet />
        </main>
        <aside className="hidden xl:block w-[320px] shrink-0 px-4 py-6">
          <div className="sticky top-6"><ContextPane /></div>
        </aside>
      </div>
    </div>
  )
}
