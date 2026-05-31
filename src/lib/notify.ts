import { projectId } from './supabaseClient'

const EMAIL = 'https://api.nullsec.studio/email'

export const notifyConnection = async (a: { to?: string; fromName: string }) => {
  if (!a.to) return
  try {
    await fetch(EMAIL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: a.to, subject: `${a.fromName} wants to connect on FounderNet`, html: `<p><strong>${a.fromName}</strong> sent you a connection request on FounderNet.</p><p>Open the app to respond.</p>`, appId: projectId }) })
  } catch {}
}

export const notifyMessage = async (a: { to?: string; fromName: string; preview: string }) => {
  if (!a.to) return
  try {
    await fetch(EMAIL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: a.to, subject: `New message from ${a.fromName}`, html: `<p><strong>${a.fromName}</strong>: ${a.preview}</p>`, appId: projectId }) })
  } catch {}
}
