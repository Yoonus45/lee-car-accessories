import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }: { data: { session: unknown } }) => {
      setAuthed(!!(data as { session: unknown }).session)
      setChecking(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event: unknown, session: unknown) => {
      setAuthed(!!session)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  if (checking) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '100vh', background: '#060A0E', color: '#687078' }}>
        Verifying session…
      </div>
    )
  }
  if (!authed) return <Navigate to="/admin" replace />
  return <>{children}</>
}
