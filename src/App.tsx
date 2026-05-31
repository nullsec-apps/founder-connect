import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthGate from './components/AuthGate'
import AppShell from './components/AppShell'
import FeedColumn from './components/FeedColumn'
import DiscoverGrid from './components/DiscoverGrid'
import ChatLayout from './components/ChatLayout'
import ProfileView from './components/ProfileView'
import ConnectionsPanel from './components/ConnectionsPanel'

export default function App() {
  return (
    <BrowserRouter>
      <AuthGate>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<FeedColumn />} />
            <Route path="/discover" element={<DiscoverGrid />} />
            <Route path="/chat" element={<ChatLayout />} />
            <Route path="/chat/:conversationId" element={<ChatLayout />} />
            <Route path="/connections" element={<ConnectionsPanel />} />
            <Route path="/profile" element={<ProfileView />} />
            <Route path="/u/:handle" element={<ProfileView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthGate>
    </BrowserRouter>
  )
}
