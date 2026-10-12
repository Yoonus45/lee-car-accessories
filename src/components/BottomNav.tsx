import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { businessInfo } from '../data/mockData'

export default function BottomNav() {
  const location = useLocation()
  const [moreOpen, setMoreOpen] = useState(false)
  const pathname = location.pathname

  // Close "More" drawer when route changes
  useEffect(() => {
    setMoreOpen(false)
  }, [pathname])

  // Prevent background scroll when More sheet is open
  useEffect(() => {
    if (moreOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [moreOpen])

  // Hide on admin dashboard and checkout flow
  if (pathname.startsWith('/admin') || pathname === '/checkout') {
    return null
  }

  // Active determinations
  const isHomeActive = pathname === '/'
  const isShopActive = pathname === '/shop' || pathname.startsWith('/product/')
  const isSeatCoversActive = pathname === '/seat-covers'
  const isGalleryActive = pathname === '/gallery'
  const isMoreRouteActive = ['/about', '/contact', '/booking', '/services', '/reviews', '/cart'].includes(pathname)
  const isMoreActive = moreOpen || isMoreRouteActive

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. FIXED BOTTOM BAR (MOBILE ONLY)
      ───────────────────────────────────────────────────────────── */}
      <nav
        className="mobile-bottom-nav"
        aria-label="Mobile Navigation"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 110,
          background: 'var(--bottom-nav-bg, rgba(7, 10, 14, 0.96))',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid var(--bottom-nav-border, #19222C)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.45)',
          transition: 'background 0.25s ease, border-color 0.25s ease',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            height: 60,
            maxWidth: 540,
            margin: '0 auto',
          }}
        >
          {/* 1. HOME */}
          <Link
            to="/"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              position: 'relative',
              color: isHomeActive ? '#00C8F0' : '#8E9BAE',
              textDecoration: 'none',
              padding: '6px 2px',
              transition: 'color 0.18s ease',
            }}
          >
            {isHomeActive && <span className="bottom-nav-indicator" />}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isHomeActive ? '2.2' : '1.8'} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span style={{ fontSize: 10, fontWeight: isHomeActive ? 700 : 500, letterSpacing: '0.01em', lineHeight: 1 }}>
              Home
            </span>
          </Link>

          {/* 2. SHOP */}
          <Link
            to="/shop"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              position: 'relative',
              color: isShopActive ? '#00C8F0' : '#8E9BAE',
              textDecoration: 'none',
              padding: '6px 2px',
              transition: 'color 0.18s ease',
            }}
          >
            {isShopActive && <span className="bottom-nav-indicator" />}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isShopActive ? '2.2' : '1.8'} strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span style={{ fontSize: 10, fontWeight: isShopActive ? 700 : 500, letterSpacing: '0.01em', lineHeight: 1 }}>
              Shop
            </span>
          </Link>

          {/* 3. SEAT COVERS */}
          <Link
            to="/seat-covers"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              position: 'relative',
              color: isSeatCoversActive ? '#00C8F0' : '#8E9BAE',
              textDecoration: 'none',
              padding: '6px 2px',
              transition: 'color 0.18s ease',
            }}
          >
            {isSeatCoversActive && <span className="bottom-nav-indicator" />}
            {/* Automotive Bucket Seat Icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isSeatCoversActive ? '2.2' : '1.8'} strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 3h10a2 2 0 0 1 2 2v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V5a2 2 0 0 1 2-2z" />
              <path d="M4 17h16a2 2 0 0 1 2 2v2H2v-2a2 2 0 0 1 2-2z" />
              <path d="M9 7v6" />
              <path d="M15 7v6" />
            </svg>
            <span style={{ fontSize: 10, fontWeight: isSeatCoversActive ? 700 : 500, letterSpacing: '0.01em', lineHeight: 1, whiteSpace: 'nowrap' }}>
              Seat Covers
            </span>
          </Link>

          {/* 4. GALLERY */}
          <Link
            to="/gallery"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              position: 'relative',
              color: isGalleryActive ? '#00C8F0' : '#8E9BAE',
              textDecoration: 'none',
              padding: '6px 2px',
              transition: 'color 0.18s ease',
            }}
          >
            {isGalleryActive && <span className="bottom-nav-indicator" />}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isGalleryActive ? '2.2' : '1.8'} strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span style={{ fontSize: 10, fontWeight: isGalleryActive ? 700 : 500, letterSpacing: '0.01em', lineHeight: 1 }}>
              Gallery
            </span>
          </Link>

          {/* 5. MORE */}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            aria-expanded={moreOpen}
            aria-label="More Navigation Options"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              position: 'relative',
              color: isMoreActive ? '#00C8F0' : '#8E9BAE',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 2px',
              transition: 'color 0.18s ease',
            }}
          >
            {isMoreActive && <span className="bottom-nav-indicator" />}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
            <span style={{ fontSize: 10, fontWeight: isMoreActive ? 700 : 500, letterSpacing: '0.01em', lineHeight: 1 }}>
              More
            </span>
          </button>
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          2. MORE DRAWER / SHEET OVERLAY (MOBILE)
      ───────────────────────────────────────────────────────────── */}
      {moreOpen && (
        <div
          onClick={() => setMoreOpen(false)}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.72)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 105,
          }}
        />
      )}

      {/* Slide-Up Bottom Sheet */}
      <div
        className="more-sheet"
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: moreOpen ? 'calc(60px + env(safe-area-inset-bottom, 0px))' : '-100%',
          maxHeight: 'calc(80vh - 60px)',
          background: 'var(--card-bg, #090D12)',
          borderTop: '1px solid var(--card-border, #1E2834)',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          zIndex: 108,
          transition: 'bottom 0.28s cubic-bezier(0.16, 1, 0.3, 1), background 0.25s ease',
          overflowY: 'auto',
          padding: '18px 18px 24px',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.75)',
        }}
      >
        {/* Header Handle */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--divider, #222C38)', marginBottom: 12 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div>
              <div style={{ color: 'var(--cyan, #00C8F0)', fontWeight: 800, fontSize: 11, letterSpacing: '0.12em' }}>EXPLORE & CONNECT</div>
              <div style={{ color: 'var(--text, #FFFFFF)', fontWeight: 800, fontSize: 15, marginTop: 2 }}>{businessInfo.name}</div>
            </div>
            <button
              onClick={() => setMoreOpen(false)}
              aria-label="Close More Menu"
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: 'var(--card-item-bg, #121720)',
                border: '1px solid var(--card-item-border, #1E2834)',
                color: 'var(--text-muted, #8E9BAE)',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Quick Links Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          {[
            { to: '/about', label: 'About Us', icon: '🏢', desc: 'Our ECR store story' },
            { to: '/contact', label: 'Contact Us', icon: '📍', desc: 'Directions & inquiry' },
            { to: '/booking', label: 'Bookings', icon: '📅', desc: 'Reserve fitment slot' },
            { to: '/services', label: 'All Services', icon: '🔧', desc: 'Coupler & audio work' },
            { to: '/reviews', label: 'Reviews', icon: '★', desc: `${businessInfo.reviewCount}+ Google ratings` },
            { to: '/cart', label: 'Cart & Bag', icon: '🛒', desc: 'Review items' },
          ].map(item => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMoreOpen(false)}
              style={{
                background: pathname === item.to ? 'rgba(0, 200, 240, 0.1)' : 'var(--card-item-bg, #0E141C)',
                border: pathname === item.to ? '1px solid rgba(0, 200, 240, 0.4)' : '1px solid var(--card-item-border, #1A232E)',
                borderRadius: 12,
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                textDecoration: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <span style={{ color: pathname === item.to ? 'var(--cyan, #00C8F0)' : 'var(--text, #FFFFFF)', fontWeight: 700, fontSize: 12 }}>
                  {item.label}
                </span>
              </div>
              <span style={{ color: 'var(--text-muted2, #687280)', fontSize: 10, marginTop: 2 }}>{item.desc}</span>
            </Link>
          ))}
        </div>

        {/* Direct WhatsApp / Call Buttons */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <a
            href={businessInfo.whatsappHref}
            target="_blank"
            rel="noreferrer"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              background: '#25D366',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: 12,
              padding: '11px',
              borderRadius: 10,
              textDecoration: 'none',
            }}
          >
            <span>💬</span> WhatsApp
          </a>

          <a
            href={`tel:${businessInfo.phoneHref}`}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              background: '#0E141C',
              border: '1px solid #1E2834',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: 12,
              padding: '11px',
              borderRadius: 10,
              textDecoration: 'none',
            }}
          >
            <span style={{ color: '#00C8F0' }}>☎</span> Direct Call
          </a>
        </div>

        {/* Admin Link at the very bottom */}
        <div style={{ textAlign: 'center', paddingTop: 8, borderTop: '1px solid #141B22' }}>
          <Link
            to="/admin"
            onClick={() => setMoreOpen(false)}
            style={{
              fontSize: 11,
              color: '#556070',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>🔐</span> Admin Login Portal
          </Link>
        </div>
      </div>

      <style>{`
        .bottom-nav-indicator {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 3px;
          border-radius: 0 0 3px 3px;
          background: #00C8F0;
          box-shadow: 0 0 10px rgba(0, 200, 240, 0.7);
        }
        @media (min-width: 769px) {
          .mobile-bottom-nav,
          .more-sheet {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}
