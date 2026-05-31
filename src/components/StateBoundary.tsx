import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { WifiOff, AlertCircle } from 'lucide-react'

interface Props { loading?: boolean; error?: any; empty?: boolean; children?: any; emptySlot?: any; onRetry?: () => void }

export default function StateBoundary({ loading, error, empty, children, emptySlot, onRetry }: Props) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return (
      <div className="p-1"><Alert><WifiOff className="h-4 w-4" /><AlertTitle>You're offline</AlertTitle><AlertDescription>Reconnect to see the latest from your network.</AlertDescription></Alert></div>
    )
  }
  if (loading) {
    return (
      <div className="space-y-4 p-1">
        {[0, 1, 2].map(i => (
          <div key={i} className="rounded-2xl border hairline bg-white p-5 space-y-3">
            <div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full" /><div className="space-y-2"><Skeleton className="h-3 w-32" /><Skeleton className="h-2 w-20" /></div></div>
            <Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-4/5" />
          </div>
        ))}
      </div>
    )
  }
  if (error) {
    return (
      <div className="p-1"><Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Something broke</AlertTitle><AlertDescription className="flex items-center gap-3 flex-wrap">We couldn't load this right now.{onRetry && <Button size="sm" variant="outline" onClick={onRetry}>Retry</Button>}</AlertDescription></Alert></div>
    )
  }
  if (empty) return emptySlot || null
  return children
}
