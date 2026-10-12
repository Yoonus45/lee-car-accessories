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
        fontFamily: 'Inter, system-ui, sans-serif'
      }}
    >
      {/* Top Nav */}
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
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              width: 36,
              height: 36,
              background: 'var(--admin-subcard-bg)',
              border: '1px solid var(--admin-border-subtle)',
              borderRadius: 8,
              color: 'var(--admin-text-sub)',
              cursor: 'pointer',
              fontSize: 18
            }}
            className="admin-hamburger"
            aria-label="Toggle menu"
          >
            ☰
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

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
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
          className={`admin-sidebar${mobileMenuOpen ? ' admin-sidebar-open' : ''}`}
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
        @media (max-width: 700px) {
          .admin-hamburger { display: grid !important; }
          .admin-email-label { display: block !important; }
          .admin-sidebar {
            position: fixed !important;
            top: 60px !important;
            left: -240px !important;
            width: 220px !important;
            height: calc(100vh - 60px) !important;
            z-index: 200 !important;
            transition: left .25s ease !important;
            border-right: 1px solid var(--admin-border) !important;
            box-shadow: 4px 0 24px rgba(0,0,0,0.6) !important;
          }
          .admin-sidebar-open { left: 0 !important; }
        }
        @media (min-width: 701px) {
          .admin-email-label { display: block !important; }
        }
      `}</style>
    </div>
  )
}
