import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useTheme } from '../../context/ThemeContext'
import ProductsTab from './tabs/ProductsTab'
import OrdersTab from './tabs/OrdersTab'
import BookingsTab from './tabs/BookingsTab'
import MessagesTab from './tabs/MessagesTab'
import CategoriesTab from './tabs/CategoriesTab'
import SeatAppointmentsTab from './tabs/SeatAppointmentsTab'
import GalleryTab from './tabs/GalleryTab'
import leeLogo from '../../assets/lee-cars-logo.png'

type Tab = 'products' | 'categories' | 'gallery' | 'orders' | 'bookings' | 'seat_appointments' | 'messages'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'products', label: 'Products', icon: '📦' },
  { id: 'categories', label: 'Categories', icon: '🏷' },
  { id: 'gallery', label: 'Gallery', icon: '📸' },
  { id: 'orders', label: 'Order Requests', icon: '🛒' },
  { id: 'bookings', label: 'Bookings', icon: '📅' },
  { id: 'seat_appointments', label: 'Seat Covers', icon: '💺' },
  { id: 'messages', label: 'Messages', icon: '💬' },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [tab, setTab] = useState<Tab>('orders')
  const [adminEmail, setAdminEmail] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: { data: { user: { email?: string } | null } }) => {
      setAdminEmail(data.user?.email || '')
    })
  }, [])

  // Prevent background scroll when admin mobile drawer is open (matches homepage Navbar behavior)
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const signOut = async () => {
    await supabase.auth.signOut()
    navigate('/admin', { replace: true })
  }

  return (
    <div
      className="admin-dashboard-container"
      style={{
        minHeight: '100vh',
        background: 'var(--admin-bg)',
        color: 'var(--admin-text-main)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, sans-serif',
        paddingTop: 60,
        boxSizing: 'border-box'
      }}
    >
      {/* Top Nav (Fixed at top of screen across all admin pages) */}
      <header
        className="admin-header"
        style={{
          background: 'var(--admin-card-bg)',
          borderBottom: '1px solid var(--admin-border)',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 60,
          flexShrink: 0,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 100,
          boxSizing: 'border-box'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Mobile hamburger button matching homepage Navbar design & dimensions */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
            style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              background: mobileMenuOpen ? 'rgba(0, 200, 240, 0.15)' : 'var(--button-ghost-bg, rgba(255, 255, 255, 0.04))',
              border: mobileMenuOpen ? '1px solid var(--cyan, #00C8F0)' : '1px solid var(--button-ghost-border, #1E2834)',
              cursor: 'pointer',
              display: 'none',
              placeItems: 'center',
              padding: 0,
              transition: 'all 0.2s ease',
            }}
            className="admin-hamburger"
          >
            {mobileMenuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cyan, #00C8F0)" strokeWidth="2.4" strokeLinecap="round">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--admin-text-main, #FFFFFF)" strokeWidth="2.2" strokeLinecap="round">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            )}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              src={leeLogo}
              alt="Lee Car Accessories"
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: '1px solid var(--admin-border-subtle)',
                objectFit: 'cover'
              }}
            />
            <div>
              <div style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 900, fontSize: 13, color: '#11BCE6', letterSpacing: '0.06em' }}>
                LEE CAR ACCESSORIES
              </div>
              <div style={{ fontSize: 10, color: 'var(--admin-text-muted)', marginTop: 1 }}>Admin Dashboard</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', display: 'none' }} className="admin-email-label">
            {adminEmail}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            style={{
              fontSize: 13,
              color: 'var(--admin-text-main)',
              background: 'var(--admin-subcard-bg)',
              border: '1px solid var(--admin-border-subtle)',
              borderRadius: 8,
              padding: '6px 11px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontWeight: 700,
              transition: 'all .15s ease'
            }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span style={{ fontSize: 14 }}>{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span className="admin-theme-text" style={{ fontSize: 11, fontWeight: 700 }}>
              {theme === 'dark' ? 'Light' : 'Dark'}
            </span>
          </button>

          <a
            href="/"
            style={{
              fontSize: 11,
              color: 'var(--admin-text-sub)',
              background: 'var(--admin-subcard-bg)',
              border: '1px solid var(--admin-border-subtle)',
              borderRadius: 8,
              padding: '6px 12px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            ← Website
          </a>

          <button
            onClick={signOut}
            style={{
              fontSize: 11,
              color: '#FF5555',
              border: '1px solid rgba(255,85,85,0.3)',
              borderRadius: 8,
              padding: '6px 12px',
              background: 'rgba(255,85,85,0.06)',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          MOBILE SLIDE DRAWER BACKDROP (ABOVE HEADER & BOTTOM NAV)
      ───────────────────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
          className="admin-mobile-backdrop mobile-nav-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            height: '100dvh',
            minHeight: '100vh',
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            zIndex: 1200,
          }}
        />
      )}

      {/* ─────────────────────────────────────────────────────────────
          MOBILE SLIDE NAVIGATION DRAWER (FULL VIEWPORT HEIGHT)
      ───────────────────────────────────────────────────────────── */}
      <div
        className="admin-mobile-drawer mobile-nav-drawer"
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: mobileMenuOpen ? 0 : '-100%',
          width: 'min(320px, 86vw)',
          height: '100dvh',
          minHeight: '100vh',
          maxHeight: '100dvh',
          background: 'var(--nav-drawer-bg, #080C11)',
          borderRight: '1px solid var(--header-border, #1A232E)',
          zIndex: 1201,
          display: 'flex',
          flexDirection: 'column',
          padding: 'max(16px, env(safe-area-inset-top, 16px)) 16px max(24px, env(safe-area-inset-bottom, 24px))',
          gap: 8,
          transition: 'left .28s cubic-bezier(0.16, 1, 0.3, 1), background 0.25s ease',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          boxShadow: '10px 0 35px rgba(0, 0, 0, 0.75)',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 12,
            borderBottom: '1px solid var(--divider, #17202B)',
            marginBottom: 6,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              src={leeLogo}
              alt="Lee Car Accessories"
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1px solid var(--card-item-border, #1E2834)',
              }}
            />
            <div>
              <div style={{ fontWeight: 800, fontSize: 12, letterSpacing: '0.08em', color: 'var(--cyan, #00C8F0)' }}>
                LEE CAR ACCESSORIES
              </div>
              <div style={{ fontSize: 9.5, color: 'var(--text-muted, #8E9BAE)', marginTop: 1 }}>Admin Dashboard</div>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close Menu"
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: 'var(--card-item-bg, #0E141C)',
              border: '1px solid var(--button-ghost-border, #1E2834)',
              color: 'var(--text-muted, #8E9BAE)',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              fontSize: 14,
              padding: 0,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Admin Navigation Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id)
                setMobileMenuOpen(false)
              }}
              style={{
                fontSize: 12.5,
                letterSpacing: '0.08em',
                fontWeight: 700,
                color: tab === t.id ? 'var(--cyan, #00C8F0)' : 'var(--text-muted, #A0AAB6)',
                background: tab === t.id ? 'rgba(0, 200, 240, 0.08)' : 'transparent',
                border: tab === t.id ? '1px solid rgba(0, 200, 240, 0.25)' : '1px solid transparent',
                padding: '10px 12px',
                borderRadius: 8,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all .15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 16 }}>{t.icon}</span>
                <span>{t.label}</span>
              </div>
              <span style={{ color: tab === t.id ? 'var(--cyan, #00C8F0)' : 'var(--text-muted2, #45505C)', fontSize: 13 }}>›</span>
            </button>
          ))}
        </div>

        {/* Drawer Footer with Quick Actions & User Info */}
        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--divider, #17202B)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <a
            href="/"
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--text-muted, #A0AAB6)',
              background: 'var(--card-item-bg, #0E141C)',
              border: '1px solid var(--button-ghost-border, #1E2834)',
              borderRadius: 8,
              padding: '9px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              textDecoration: 'none',
            }}
          >
            ← Website
          </a>

          <button
            onClick={() => {
              setMobileMenuOpen(false)
              signOut()
            }}
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#FF5555',
              background: 'rgba(255, 85, 85, 0.08)',
              border: '1px solid rgba(255, 85, 85, 0.3)',
              borderRadius: 8,
              padding: '9px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            Sign Out
          </button>

          <div style={{ fontSize: 10, color: 'var(--text-muted, #8E9BAE)', padding: '4px 6px', lineHeight: 1.5 }}>
            Signed in as<br />
            <span style={{ color: 'var(--text, #FFFFFF)', wordBreak: 'break-all', fontWeight: 600 }}>{adminEmail}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Desktop Sidebar */}
        <aside
          style={{
            width: 220,
            background: 'var(--admin-card-bg)',
            borderRight: '1px solid var(--admin-border)',
            padding: '20px 12px',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            overflowY: 'auto'
          }}
          className="admin-sidebar"
        >
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setMobileMenuOpen(false) }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '11px 14px',
                borderRadius: 10,
                border: 'none',
                background: tab === t.id ? 'rgba(17,188,230,0.12)' : 'transparent',
                color: tab === t.id ? '#11BCE6' : 'var(--admin-text-sub)',
                fontWeight: tab === t.id ? 800 : 600,
                fontSize: 13,
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all .15s ease',
                borderLeft: tab === t.id ? '3px solid #11BCE6' : '3px solid transparent'
              }}
            >
              <span style={{ fontSize: 16 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}

          <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid var(--admin-border)' }}>
            <div style={{ fontSize: 10, color: 'var(--admin-text-muted)', padding: '0 14px', lineHeight: 1.6 }}>
              Signed in as<br />
              <span style={{ color: 'var(--admin-text-sub)', wordBreak: 'break-all' }}>{adminEmail}</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className="admin-main-content"
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '24px 20px'
          }}
        >
          {tab === 'products' && <ProductsTab />}
          {tab === 'categories' && <CategoriesTab />}
          {tab === 'gallery' && <GalleryTab />}
          {tab === 'orders' && <OrdersTab />}
          {tab === 'bookings' && <BookingsTab />}
          {tab === 'seat_appointments' && <SeatAppointmentsTab />}
          {tab === 'messages' && <MessagesTab />}
        </main>
      </div>

      <style>{`
        .admin-header {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          width: 100% !important;
          height: 60px !important;
          z-index: 100 !important;
          box-sizing: border-box !important;
        }
        .admin-dashboard-container {
          padding-top: 60px !important;
          box-sizing: border-box !important;
        }
        .admin-mobile-drawer {
          position: fixed !important;
          top: 0 !important;
          bottom: 0 !important;
          height: 100vh !important;
          height: 100dvh !important;
          min-height: 100vh !important;
          min-height: 100dvh !important;
          max-height: 100vh !important;
          max-height: 100dvh !important;
          z-index: 1201 !important;
          overflow-y: auto !important;
          -webkit-overflow-scrolling: touch !important;
          overscroll-behavior: contain !important;
        }
        .admin-mobile-backdrop {
          position: fixed !important;
          inset: 0 !important;
          top: 0 !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          height: 100vh !important;
          height: 100dvh !important;
          z-index: 1200 !important;
        }
        @media (max-width: 900px) {
          .admin-hamburger { display: grid !important; }
          .admin-sidebar { display: none !important; }
        }
        @media (min-width: 901px) {
          .admin-dashboard-container { height: 100vh !important; }
          .admin-hamburger { display: none !important; }
          .admin-mobile-drawer, .admin-mobile-backdrop { display: none !important; }
          .admin-sidebar { display: flex !important; }
          .admin-email-label { display: block !important; }
        }
      `}</style>
    </div>
  )
}
