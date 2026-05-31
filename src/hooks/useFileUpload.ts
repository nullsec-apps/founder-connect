import { useState, useCallback } from 'react'
import { projectId } from '../lib/supabaseClient'

export function useFileUpload() {
  const [uploading, setUploading] = useState(false)
  const upload = useCallback(async (f: File): Promise<string> => {
    setUploading(true)
    try {
      const base64: string = await new Promise((res, rej) => {
        const r = new FileReader()
        r.onload = () => res((r.result as string).split(',')[1])
        r.onerror = rej
        r.readAsDataURL(f)
      })
      const resp = await fetch('https://api.nullsec.studio/upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ appId: projectId, filename: f.name, base64Data: base64, contentType: f.type }) })
      const j = await resp.json()
      return j.url || ''
    } finally { setUploading(false) }
  }, [])
  return { upload, uploading }
}
