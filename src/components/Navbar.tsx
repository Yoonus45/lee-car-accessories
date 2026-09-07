import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { businessInfo } from '../data/mockData'
import leeLogo from '../assets/lee cars logo.png'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  const nav = useNavigate()
  const [cartCount] = useState(2)
  const active = (p: string) => loc.pathname === p

  useEffect(() => {
    setOpen(false)
  }, [loc.pathname])

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const links: [string, string][] = [
    ['/', 'HOME'],
    ['/services', 'SERVICES'],
    ['/seat-covers', 'SEAT COVERS'],
    ['/shop', 'SHOP'],
    ['/gallery', 'GALLERY'],
    ['/reviews', 'REVIEWS'],
    ['/about', 'ABOUT US'],
    ['/contact', 'CONTACT US'],
  ]

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(5,7,8,0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid #1C232B',
      width: '100%',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
        gap: 8,
      }}>
        {/* Left: Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flexShrink: 1 }}>
          <img
            src={leeLogo}
            alt="Lee Car Accessories Logo"
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1px solid #1E2A33',
              flexShrink: 0
            }}
          />
          <div style={{ lineHeight: 1.1, minWidth: 0, overflow: 'hidden' }}>
            <div style={{
              fontFamily: 'Orbitron',
              fontWeight: 800,
              fontSize: 'clamp(10px, 3vw, 11px)',
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              LEE CAR ACCESSORIES
            </div>
            <div className="logo-tagline" style={{
              fontSize: 8,
              letterSpacing: '0.16em',
              color: '#687078',
              fontWeight: 600,
              marginTop: 2
            }}>
              PREMIUM CUSTOMIZATION
            </div>
          </div>
        </Link>

        {/* Center: Desktop Navigation */}
        <nav style={{ display: 'flex', gap: 18, alignItems: 'center' }} className="nav-desktop">
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              style={{
                fontSize: 11,
                letterSpacing: '0.12em',
                fontWeight: 700,
                color: active(to) ? '#11BCE6' : '#A0A7AE',
                borderBottom: active(to) ? '2px solid #11BCE6' : '2px solid transparent',
                paddingBottom: 4,
                transition: 'all .2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right: Quick actions & Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {/* Cart button */}
          <button
            onClick={() => nav('/shop')}
            aria-label="View Shop Cart"
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: '#0D1217',
              border: '1px solid #1E2A33',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A0A7AE" strokeWidth="1.7">
              <path d="M6 6h15l-1.5 9h-13z" />
              <path d="M6 6L5 2H2" />
              <circle cx="9" cy="20" r="1.8" />
              <circle cx="18" cy="20" r="1.8" />
            </svg>
            <span style={{
              position: 'absolute',
              top: -3,
              right: -3,
              background: '#11BCE6',
              color: '#02141B',
              fontSize: 9,
              fontWeight: 900,
              width: 17,
              height: 17,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center'
            }}>
              {cartCount}
            </span>
          </button>

          {/* WhatsApp Direct Chat */}
          <a
            href={businessInfo.whatsappHref}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat on WhatsApp"
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: '#0D1217',
              border: '1px solid #1E2A33',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366">
              <path d="M12 2a10 10 0 0 0-8.6 15l-1 3.6 3.7-1A10 10 0 1 0 12 2zm5.2 14.3c-.3.8-1.5 1.5-2.1 1.6-.6.1-1.1.1-1.8-.1-.5-.2-1.1-.5-1.9-1-.7-.5-1.4-1.2-1.9-2-.5-.8-.9-1.7-1-2.6 0-.9.2-1.3.5-1.8l.4-.6c.2-.3.4-.5.6-.5h.6c.2 0 .4 0 .6.5l.8 1.9c.1.3.1.5 0 .7-.1.2-.2.4-.4.6l-.4.4c-.1.1-.2.3-.1.5.1.2.5.8 1 1.4.6.7 1.1 1.1 1.5 1.4.2.1.4.2.5.1l.5-.5c.2-.2.4-.3.6-.4.2 0 .4 0 .7.1l1.9.9c.4.2.5.3.6.5v.6c0 .3-.2.7-.5 1z" />
            </svg>
          </a>

          {/* Contact / Profile Icon (Desktop only to prevent clutter on small mobile) */}
          <Link
            to="/contact"
            aria-label="Contact Us"
            className="nav-profile-btn"
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: '#11BCE6',
              border: '1px solid #11BCE6',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#02141B" strokeWidth="2">
              <circle cx="12" cy="8" r="3.5" />
              <path d="M5 19a7 7 0 0 1 14 0" />
            </svg>
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setOpen(!open)}
            className="hamburger-btn"
            aria-label={open ? 'Close Menu' : 'Open Navigation Menu'}
            aria-expanded={open}
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: open ? '#11BCE6' : '#0D1217',
              border: open ? '1px solid #11BCE6' : '1px solid #1E2A33',
              cursor: 'pointer',
              display: 'none',
              placeItems: 'center',
              transition: 'all .2s ease',
              padding: 0
            }}
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#02141B" strokeWidth="2.4" strokeLinecap="round">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A0A7AE" strokeWidth="2.2" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Backdrop overlay for mobile menu */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            top: 64,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 90,
          }}
        />
      )}

      {/* Mobile Slide Drawer Menu */}
      <div
        style={{
          position: 'fixed',
          top: 64,
          right: open ? 0 : '-100%',
          width: 'min(320px, 86vw)',
          height: 'calc(100dvh - 64px)',
          background: '#080C10',
          borderLeft: '1px solid #1C232B',
          zIndex: 95,
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 18px 28px',
          gap: 10,
          transition: 'right .3s cubic-bezier(0.16, 1, 0.3, 1)',
          overflowY: 'auto',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.6)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, paddingBottom: 10, borderBottom: '1px solid #1C232B' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 11, letterSpacing: '0.14em', color: '#11BCE6' }}>NAVIGATION</div>
            <div style={{ fontSize: 10, color: '#687078', marginTop: 2 }}>{businessInfo.name}</div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close Menu"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: '#0D1217',
              border: '1px solid #1E2A33',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A0A7AE" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Links list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {links.map(([to, label]) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              style={{
                fontSize: 13,
                letterSpacing: '0.1em',
                fontWeight: 700,
                color: loc.pathname === to ? '#11BCE6' : '#A0A7AE',
                background: loc.pathname === to ? 'rgba(17,188,230,0.1)' : 'transparent',
                border: loc.pathname === to ? '1px solid rgba(17,188,230,0.3)' : '1px solid transparent',
                padding: '12px 14px',
                borderRadius: 10,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all .15s ease'
              }}
            >
              <span>{label}</span>
              <span style={{ color: loc.pathname === to ? '#11BCE6' : '#3A444E', fontSize: 14 }}>›</span>
            </Link>
          ))}
        </div>

        {/* Real Business Quick Actions in Drawer */}
        <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid #1C232B', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0D1217', padding: '6px 10px', borderRadius: 8, border: '1px solid #1E2A33' }}>
            <span style={{ color: '#D69A13', fontSize: 12 }}>★</span>
            <span style={{ fontWeight: 800, fontSize: 11 }}>{businessInfo.rating} / 5</span>
            <span style={{ fontSize: 10, color: '#687078' }}>· ~{businessInfo.reviewCount} Google reviews</span>
          </div>

          <a
            href={`tel:${businessInfo.phoneHref}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: '#0D1217',
              border: '1px solid #1E2A33',
              borderRadius: 10,
              padding: '11px 12px',
              color: '#FFFFFF'
            }}
          >
            <span style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: '#11BCE6',
              display: 'grid',
              placeItems: 'center',
              color: '#02141B',
              fontSize: 12
            }}>☎</span>
            <div>
              <div style={{ fontSize: 9, letterSpacing: '0.1em', fontWeight: 700, color: '#687078' }}>DIRECT CALL</div>
              <div style={{ fontWeight: 800, fontSize: 12 }}>{businessInfo.phoneDisplay}</div>
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
              letterSpacing: '0.06em',
              padding: '12px',
              borderRadius: 999
            }}
          >
            WHATSAPP US
          </a>

          <Link
            to="/booking"
            onClick={() => setOpen(false)}
            style={{
              display: 'flex',
              justifyContent: 'center',
              background: '#11BCE6',
              color: '#02141B',
              fontWeight: 800,
              fontSize: 11,
              letterSpacing: '0.08em',
              padding: '12px',
              borderRadius: 999,
              border: '1px solid #11BCE6',
              textAlign: 'center'
            }}
          >
            BOOK APPOINTMENT →
          </Link>

          <div style={{ fontSize: 10, color: '#687078', lineHeight: 1.5, textAlign: 'center', marginTop: 4 }}>
            {businessInfo.fullAddress}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1080px) {
          .nav-desktop { display: none !important; }
          .hamburger-btn { display: grid !important; }
        }
        @media (max-width: 480px) {
          .nav-profile-btn { display: none !important; }
        }
        @media (max-width: 360px) {
          .logo-tagline { display: none !important; }
        }
      `}</style>
    </header>
  )
}
