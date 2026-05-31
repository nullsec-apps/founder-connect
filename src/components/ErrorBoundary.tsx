import { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: any) { super(props); this.state = { hasError: false } }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(e: any) { console.error('App error:', e) }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FBFBF9] px-4">
          <div className="text-center max-w-sm">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4"><AlertTriangle className="text-[#FF5B2E]" size={24} /></div>
            <h1 className="font-display text-xl font-bold text-[#0E1114]">Something broke</h1>
            <p className="text-sm text-[#6B7280] mt-1 mb-4">A glitch on our end. Reloading usually fixes it.</p>
            <Button className="bg-[#0A6E55] hover:bg-[#085a45]" onClick={() => window.location.reload()}>Reload FounderNet</Button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
