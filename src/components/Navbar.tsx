import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { businessInfo } from '../data/mockData'
import { useTheme } from '../context/ThemeContext'
import leeLogo from '../assets/lee-cars-logo.png'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  const { theme, toggleTheme } = useTheme()
  const active = (p: string) => loc.pathname === p

  // Close drawer on navigation
  useEffect(() => {
    setOpen(false)
  }, [loc.pathname])

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (open) {
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
  }, [open])

  const links: [string, string][] = [
    ['/', 'HOME'],
    ['/shop', 'SHOP'],
    ['/seat-covers', 'SEAT COVERS'],
    ['/services', 'SERVICES'],
    ['/gallery', 'GALLERY'],
    ['/reviews', 'REVIEWS'],
    ['/about', 'ABOUT US'],
    ['/contact', 'CONTACT US'],
  ]

  return (
    <>
      <header
        className="site-header"
        style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'var(--header-bg, rgba(7, 10, 14, 0.96))',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--header-border, #161F2A)',
        width: '100%',
        boxSizing: 'border-box',
        transition: 'background 0.25s ease, border-color 0.25s ease',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 60,
          position: 'relative',
        }}
      >
        {/* ─────────────────────────────────────────────────────────────
            MOBILE LEFT: HAMBURGER TOGGLE BUTTON
        ───────────────────────────────────────────────────────────── */}
        <div className="mobile-header-left" style={{ display: 'none' }}>
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close Menu' : 'Open Navigation Menu'}
            aria-expanded={open}
            style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              background: open ? 'rgba(0, 200, 240, 0.15)' : 'var(--button-ghost-bg, rgba(255, 255, 255, 0.04))',
              border: open ? '1px solid var(--cyan, #00C8F0)' : '1px solid var(--button-ghost-border, #1E2834)',
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
              padding: 0,
              transition: 'all 0.2s ease',
            }}
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cyan, #00C8F0)" strokeWidth="2.4" strokeLinecap="round">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text, #FFFFFF)" strokeWidth="2.2" strokeLinecap="round">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            )}
          </button>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            CENTER (MOBILE): PERFECTLY CENTERED LOGO
            Uses absolute positioning so left & right width differences
            never displace the logo.
        ───────────────────────────────────────────────────────────── */}
        <div className="mobile-header-center" style={{ display: 'none' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              textDecoration: 'none',
            }}
          >
            <img
              src={leeLogo}
              alt="Lee Car Accessories Logo"
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid var(--card-item-border, #1E2834)',
                boxShadow: '0 0 10px rgba(0, 200, 240, 0.2)',
                flexShrink: 0,
              }}
            />
            <div style={{ lineHeight: 1.15 }}>
              <div
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontWeight: 900,
                  fontSize: 12.5,
                  letterSpacing: '0.06em',
                  color: 'var(--text, #FFFFFF)',
                  whiteSpace: 'nowrap',
                }}
              >
                LEE <span style={{ color: 'var(--cyan, #00C8F0)' }}>CAR</span>
              </div>
              <div
                style={{
                  fontSize: 7.5,
                  letterSpacing: '0.18em',
                  color: 'var(--text-muted, #8E9BAE)',
                  fontWeight: 700,
                  marginTop: 1,
                  whiteSpace: 'nowrap',
                }}
              >
                ACCESSORIES
              </div>
            </div>
          </Link>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            DESKTOP LEFT: BRAND LOGO
        ───────────────────────────────────────────────────────────── */}
        <div className="desktop-header-logo">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img
              src={leeLogo}
              alt="Lee Car Accessories Logo"
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1px solid var(--card-item-border, #1E2834)',
                flexShrink: 0,
              }}
            />
            <div style={{ lineHeight: 1.1 }}>
              <div
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontWeight: 900,
                  fontSize: 13,
                  letterSpacing: '0.06em',
                  color: 'var(--text, #FFFFFF)',
                }}
              >
                LEE CAR ACCESSORIES
              </div>
              <div
                style={{
                  fontSize: 8.5,
                  letterSpacing: '0.16em',
                  color: 'var(--cyan, #00C8F0)',
                  fontWeight: 700,
                  marginTop: 2,
                }}
              >
                PREMIUM AUTOMOTIVE CUSTOMIZATION
              </div>
            </div>
          </Link>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            DESKTOP CENTER: MAIN NAVIGATION LINKS
        ───────────────────────────────────────────────────────────── */}
        <nav style={{ display: 'flex', gap: 18, alignItems: 'center' }} className="nav-desktop">
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              style={{
                fontSize: 11,
                letterSpacing: '0.12em',
                fontWeight: 700,
                color: active(to) ? 'var(--cyan, #00C8F0)' : 'var(--text-muted, #8E9BAE)',
                borderBottom: active(to) ? '2px solid var(--cyan, #00C8F0)' : '2px solid transparent',
                paddingBottom: 4,
                transition: 'all .2s ease',
                whiteSpace: 'nowrap',
                textDecoration: 'none',
              }}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* ─────────────────────────────────────────────────────────────
            RIGHT: THEME TOGGLE BUTTON + LOGIN BUTTON (MOBILE & DESKTOP)
        ───────────────────────────────────────────────────────────── */}
        <div className="header-right-controls" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {/* WhatsApp shortcut for Desktop */}
          <a
            href={businessInfo.whatsappHref}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat on WhatsApp"
            className="desktop-whatsapp-btn"
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'var(--card-item-bg, #0E141C)',
              border: '1px solid var(--button-ghost-border, #1E2834)',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              textDecoration: 'none',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366">
              <path d="M12 2a10 10 0 0 0-8.6 15l-1 3.6 3.7-1A10 10 0 1 0 12 2zm5.2 14.3c-.3.8-1.5 1.5-2.1 1.6-.6.1-1.1.1-1.8-.1-.5-.2-1.1-.5-1.9-1-.7-.5-1.4-1.2-1.9-2-.5-.8-.9-1.7-1-2.6 0-.9.2-1.3.5-1.8l.4-.6c.2-.3.4-.5.6-.5h.6c.2 0 .4 0 .6.5l.8 1.9c.1.3.1.5 0 .7-.1.2-.2.4-.4.6l-.4.4c-.1.1-.2.3-.1.5.1.2.5.8 1 1.4.6.7 1.1 1.1 1.5 1.4.2.1.4.2.5.1l.5-.5c.2-.2.4-.3.6-.4.2 0 .4 0 .7.1l1.9.9c.4.2.5.3.6.5v.6c0 .3-.2.7-.5 1z" />
            </svg>
          </a>

          {/* Login icon + "Login" text (Desktop only, hidden on mobile) */}
          <Link
            to="/admin"
            aria-label="Login"
            title="Admin Login"
            className="header-login-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--text, #FFFFFF)',
              textDecoration: 'none',
              fontSize: 12,
              fontWeight: 700,
              padding: '7px 11px',
              borderRadius: 8,
              background: 'var(--button-ghost-bg, rgba(255, 255, 255, 0.05))',
              border: '1px solid var(--button-ghost-border, #1E2834)',
              transition: 'all .2s ease',
              lineHeight: 1,
            }}
          >
            {/* Login User Icon */}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--cyan, #00C8F0)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span style={{ fontSize: 12, fontWeight: 700 }}>Login</span>
          </Link>

          {/* Theme Toggle Button: Light / Dark Mode (Top-Right on both Desktop and Mobile) */}
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="theme-toggle-btn"
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'var(--button-ghost-bg, rgba(255, 255, 255, 0.05))',
              border: '1px solid var(--button-ghost-border, #1E2834)',
              color: theme === 'dark' ? '#FFC72C' : '#00A6CE',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.2s ease',
              flexShrink: 0,
            }}
          >
            {theme === 'dark' ? (
              /* ☀️ Sun icon when Dark Mode is active */
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            ) : (
              /* 🌙 Moon icon when Light Mode is active */
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .desktop-header-logo { display: none !important; }
          .desktop-whatsapp-btn { display: none !important; }
          .header-login-btn { display: none !important; }
          .mobile-header-left { display: block !important; }
          .mobile-header-center {
            display: block !important;
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
          }
        }
        @media (min-width: 901px) {
          .mobile-nav-drawer, .mobile-nav-backdrop {
            display: none !important;
          }
        }
        @media (max-width: 360px) {
          .theme-toggle-btn {
            width: 32px !important;
            height: 32px !important;
          }
          .header-login-btn {
            padding: 6px 8px !important;
            font-size: 11px !important;
          }
          .mobile-header-center img {
            width: 32px !important;
            height: 32px !important;
          }
        }
      `}</style>
    </header>

    {/* ─────────────────────────────────────────────────────────────
        MOBILE SLIDE DRAWER BACKDROP (ABOVE HEADER & BOTTOM NAV)
    ───────────────────────────────────────────────────────────── */}
    {open && (
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className="mobile-nav-backdrop"
        style={{
          position: 'fixed',
          inset: 0,
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
      className="mobile-nav-drawer"
      style={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: open ? 0 : '-100%',
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
              <div style={{ fontSize: 9.5, color: 'var(--text-muted, #8E9BAE)', marginTop: 1 }}>ECR Junction Ramanathapuram</div>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
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
            }}
          >
            ✕
          </button>
        </div>

        {/* Links List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {links.map(([to, label]) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              style={{
                fontSize: 12.5,
                letterSpacing: '0.08em',
                fontWeight: 700,
                color: loc.pathname === to ? 'var(--cyan, #00C8F0)' : 'var(--text-muted, #A0AAB6)',
                background: loc.pathname === to ? 'rgba(0, 200, 240, 0.08)' : 'transparent',
                border: loc.pathname === to ? '1px solid rgba(0, 200, 240, 0.25)' : '1px solid transparent',
                padding: '10px 12px',
                borderRadius: 8,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                textDecoration: 'none',
                transition: 'all .15s ease',
              }}
            >
              <span>{label}</span>
              <span style={{ color: loc.pathname === to ? 'var(--cyan, #00C8F0)' : 'var(--text-muted2, #45505C)', fontSize: 13 }}>›</span>
            </Link>
          ))}
          {/* Cart & Appointments in drawer */}
          <Link
            to="/cart"
            onClick={() => setOpen(false)}
            style={{
              fontSize: 12.5,
              letterSpacing: '0.08em',
              fontWeight: 700,
              color: loc.pathname === '/cart' ? 'var(--cyan, #00C8F0)' : 'var(--text-muted, #A0AAB6)',
              background: loc.pathname === '/cart' ? 'rgba(0, 200, 240, 0.08)' : 'transparent',
              border: loc.pathname === '/cart' ? '1px solid rgba(0, 200, 240, 0.25)' : '1px solid transparent',
              padding: '10px 12px',
              borderRadius: 8,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            <span>SHOPPING CART</span>
            <span style={{ color: loc.pathname === '/cart' ? 'var(--cyan, #00C8F0)' : 'var(--text-muted2, #45505C)', fontSize: 13 }}>›</span>
          </Link>
          <Link
            to="/booking"
            onClick={() => setOpen(false)}
            style={{
              fontSize: 12.5,
              letterSpacing: '0.08em',
              fontWeight: 700,
              color: loc.pathname === '/booking' ? 'var(--cyan, #00C8F0)' : 'var(--text-muted, #A0AAB6)',
              background: loc.pathname === '/booking' ? 'rgba(0, 200, 240, 0.08)' : 'transparent',
              border: loc.pathname === '/booking' ? '1px solid rgba(0, 200, 240, 0.25)' : '1px solid transparent',
              padding: '10px 12px',
              borderRadius: 8,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            <span>BOOK APPOINTMENT</span>
            <span style={{ color: loc.pathname === '/booking' ? 'var(--cyan, #00C8F0)' : 'var(--text-muted2, #45505C)', fontSize: 13 }}>›</span>
          </Link>

          {/* Admin Login item inside hamburger drawer */}
          <Link
            to="/admin"
            onClick={() => setOpen(false)}
            style={{
              fontSize: 12.5,
              letterSpacing: '0.08em',
              fontWeight: 700,
              color: loc.pathname === '/admin' ? 'var(--cyan, #00C8F0)' : 'var(--text-muted, #A0AAB6)',
              background: loc.pathname === '/admin' ? 'rgba(0, 200, 240, 0.08)' : 'transparent',
              border: loc.pathname === '/admin' ? '1px solid rgba(0, 200, 240, 0.25)' : '1px solid transparent',
              padding: '10px 12px',
              borderRadius: 8,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              textDecoration: 'none',
              transition: 'all .15s ease',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--cyan, #00C8F0)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              ADMIN LOGIN
            </span>
            <span style={{ color: loc.pathname === '/admin' ? 'var(--cyan, #00C8F0)' : 'var(--text-muted2, #45505C)', fontSize: 13 }}>›</span>
          </Link>
        </div>

        {/* Business Contact & Support */}
        <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid var(--divider, #17202B)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--card-item-bg, #0E141C)', padding: '6px 10px', borderRadius: 8, border: '1px solid var(--card-item-border, #1E2834)' }}>
            <span style={{ color: '#D69A13', fontSize: 12 }}>★</span>
            <span style={{ fontWeight: 800, fontSize: 11, color: 'var(--text, #FFFFFF)' }}>{businessInfo.rating} / 5</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted, #8E9BAE)' }}>· ~{businessInfo.reviewCount} Google reviews</span>
          </div>

          <a
            href={`tel:${businessInfo.phoneHref}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'var(--card-item-bg, #0E141C)',
              border: '1px solid var(--card-item-border, #1E2834)',
              borderRadius: 8,
              padding: '9px 12px',
              color: 'var(--text, #FFFFFF)',
              textDecoration: 'none',
            }}
          >
            <span
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                background: 'var(--cyan, #00C8F0)',
                display: 'grid',
                placeItems: 'center',
                color: '#02141B',
                fontSize: 12,
              }}
            >
              ☎
            </span>
            <div>
              <div style={{ fontSize: 9, letterSpacing: '0.1em', fontWeight: 700, color: 'var(--text-muted, #8E9BAE)' }}>DIRECT CALL</div>
              <div style={{ fontWeight: 800, fontSize: 11.5 }}>{businessInfo.phoneDisplay}</div>
            </div>
          </a>

          <a
            href={businessInfo.whatsappHref}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 8,
              background: '#25D366',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: 12,
              letterSpacing: '0.04em',
              padding: '11px',
              borderRadius: 8,
              textDecoration: 'none',
            }}
          >
            WHATSAPP US
          </a>

          <div style={{ fontSize: 9.5, color: 'var(--text-muted2, #687280)', lineHeight: 1.4, textAlign: 'center', marginTop: 2 }}>
            {businessInfo.fullAddress}
          </div>

          <Link
            to="/admin"
            onClick={() => setOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--text-muted, #8E9BAE)',
              paddingTop: 4,
              textDecoration: 'none',
            }}
          >
            <span>🔐 Admin Login</span>
          </Link>
        </div>
      </div>

    </>
  )
}
