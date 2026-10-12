import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useTheme } from '../../context/ThemeContext'
import leeLogo from '../../assets/lee-cars-logo.png'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // If already logged in, redirect to dashboard
  useEffect(() => {
    supabase.auth.getSession().then(({ data }: { data: { session: unknown } }) => {
      if (data.session) navigate('/admin/dashboard', { replace: true })
    })
  }, [navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (authError) {
      setError('Invalid email or password. Please try again.')
    } else {
      navigate('/admin/dashboard', { replace: true })
    }
  }

  return (
    <div
      className="admin-login-page"
      style={{
        minHeight: '100vh',
        background: 'var(--admin-bg)',
        color: 'var(--admin-text-main)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        position: 'relative'
      }}
    >
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Top bar with Theme Toggle */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <button
            onClick={toggleTheme}
            type="button"
            style={{
              background: 'var(--admin-subcard-bg)',
              border: '1px solid var(--admin-border-subtle)',
              color: 'var(--admin-text-main)',
              borderRadius: 8,
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s ease'
            }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        </div>

        {/* Logo / Brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img
            src={leeLogo}
            alt="Lee Car Accessories"
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              margin: '0 auto 16px',
              border: '2px solid rgba(17,188,230,0.3)',
              boxShadow: '0 0 20px rgba(17,188,230,0.15)',
              objectFit: 'cover'
            }}
          />
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(17,188,230,0.08)',
            border: '1px solid rgba(17,188,230,0.2)',
            borderRadius: 999,
            padding: '8px 18px',
            marginBottom: 16
          }}>
            <span style={{ color: '#11BCE6', fontSize: 12, fontWeight: 800, letterSpacing: '0.12em' }}>🔐 ADMIN PORTAL</span>
          </div>
          <h1 style={{
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 900,
            fontSize: 22,
            color: 'var(--admin-text-main)',
            margin: 0,
            lineHeight: 1.2
          }}>
            LEE CAR<br />
            <span style={{ color: '#11BCE6' }}>ACCESSORIES</span>
          </h1>
          <div style={{ color: 'var(--admin-text-muted)', fontSize: 11, marginTop: 6 }}>
            Business Management Dashboard
          </div>
        </div>

        {/* Login Card */}
        <div style={{
          background: 'var(--admin-card-bg)',
          border: '1px solid var(--admin-border)',
          borderRadius: 18,
          padding: '28px 24px',
          boxShadow: 'var(--admin-card-shadow)'
        }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.1em', fontWeight: 800, color: 'var(--admin-text-sub)', marginBottom: 6 }}>
                ADMIN EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="leecaraccessories.rpt@gmail.com"
                style={{
                  width: '100%',
                  background: 'var(--admin-input-bg)',
                  border: '1px solid var(--admin-input-border)',
                  borderRadius: 10,
                  padding: '13px 14px',
                  color: 'var(--admin-input-text)',
                  outline: 'none',
                  fontSize: 13,
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.1em', fontWeight: 800, color: 'var(--admin-text-sub)', marginBottom: 6 }}>
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                style={{
                  width: '100%',
                  background: 'var(--admin-input-bg)',
                  border: '1px solid var(--admin-input-border)',
                  borderRadius: 10,
                  padding: '13px 14px',
                  color: 'var(--admin-input-text)',
                  outline: 'none',
                  fontSize: 13,
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {error && (
              <div style={{
                background: 'rgba(255,60,60,0.08)',
                border: '1px solid rgba(255,60,60,0.25)',
                color: '#FF5555',
                borderRadius: 10,
                padding: '11px 14px',
                fontSize: 12
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? '#0B7A8F' : '#11BCE6',
                color: '#02141B',
                fontWeight: 900,
                fontSize: 12,
                letterSpacing: '0.1em',
                padding: '14px',
                borderRadius: 999,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                width: '100%',
                transition: 'background .2s ease'
              }}
            >
              {loading ? 'SIGNING IN…' : 'SIGN IN →'}
            </button>
          </form>

          <div style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: '1px solid var(--admin-border)',
            fontSize: 11,
            color: 'var(--admin-text-muted)',
            textAlign: 'center',
            lineHeight: 1.6
          }}>
            This portal is for authorized staff only.<br />
            Forgot password? Reset via Supabase dashboard.
          </div>
        </div>

        {/* Back to website */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <a href="/" style={{ fontSize: 11, color: 'var(--admin-text-muted)', textDecoration: 'none' }}>
            ← Back to Lee Car Accessories website
          </a>
        </div>
      </div>
    </div>
  )
}

