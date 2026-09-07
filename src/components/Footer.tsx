import { Link } from 'react-router-dom'
import { businessInfo } from '../data/mockData'
import leeLogo from '../assets/lee cars logo.png'

export default function Footer() {
  return (
    <footer style={{
      background: '#070B0E',
      borderTop: '1px solid #1C232B',
      marginTop: 48,
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
    }}>
      <div className="container" style={{
        padding: '36px 0 28px',
        display: 'grid',
        gridTemplateColumns: '1.25fr 0.75fr 1fr',
        gap: 32,
        alignItems: 'start'
      }}>
        {/* Brand, Address & Google Rating */}
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              src={leeLogo}
              alt="Lee Car Accessories Logo"
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1px solid #1E2A33',
                flexShrink: 0
              }}
            />
            <div style={{ lineHeight: 1.2, minWidth: 0 }}>
              <div style={{ fontFamily: 'Orbitron', fontWeight: 800, fontSize: 12, letterSpacing: '0.06em' }}>
                LEE CAR ACCESSORIES
              </div>
              <div style={{ fontSize: 9, color: '#687078', marginTop: 2 }}>
                Customization & Accessories Store · Ramanathapuram
              </div>
            </div>
          </div>

          <div style={{
            marginTop: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            fontSize: 12,
            color: '#A0A7AE',
            lineHeight: 1.6
          }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ color: '#11BCE6', marginTop: 2, flexShrink: 0 }}>📍</span>
              <span>
                {businessInfo.addressLine1}<br />
                {businessInfo.addressLine2}<br />
                {businessInfo.addressLine3}
              </span>
            </div>
            <a href={`tel:${businessInfo.phoneHref}`} style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#A0A7AE' }}>
              <span style={{ color: '#11BCE6', flexShrink: 0 }}>☎</span>
              <span>{businessInfo.phoneDisplay}</span>
            </a>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ color: '#11BCE6', flexShrink: 0 }}>◷</span>
              <span>{businessInfo.hours}</span>
            </div>
            <a
              href={businessInfo.mapsUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                color: '#11BCE6',
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: '0.06em',
                marginTop: 2,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              VIEW ON GOOGLE MAPS →
            </a>
          </div>

          {/* Real Google Rating Badge */}
          <div style={{
            marginTop: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#0A0F14',
            border: '1px solid #1E2A33',
            borderRadius: 12,
            padding: '10px 12px',
            width: 'fit-content',
            maxWidth: '100%',
            flexWrap: 'wrap'
          }}>
            <span style={{ color: '#D69A13', fontSize: 13 }}>★</span>
            <span style={{ fontWeight: 800, fontSize: 13 }}>{businessInfo.rating.toFixed(1)} / 5</span>
            <span style={{ fontSize: 11, color: '#687078' }}>· ~{businessInfo.reviewCount} Google reviews</span>
            <Link
              to="/reviews"
              style={{
                marginLeft: 4,
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '0.06em',
                color: '#11BCE6',
                border: '1px solid rgba(17,188,230,0.3)',
                padding: '4px 8px',
                borderRadius: 999,
                whiteSpace: 'nowrap'
              }}
            >
              READ REVIEWS
            </Link>
          </div>
        </div>

        {/* Explore Links */}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 11, letterSpacing: '0.14em', color: '#11BCE6', marginBottom: 14 }}>
            EXPLORE
          </div>
          <nav className="footer-nav" style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 10,
            fontSize: 11,
            letterSpacing: '0.1em',
            fontWeight: 700,
            color: '#A0A7AE'
          }}>
            <Link to="/">HOME</Link>
            <Link to="/services">SERVICES</Link>
            <Link to="/seat-covers">PREMIUM SEAT COVERS</Link>
            <Link to="/shop">SHOP ACCESSORIES</Link>
            <Link to="/gallery">PROJECT GALLERY</Link>
            <Link to="/reviews">CUSTOMER REVIEWS</Link>
            <Link to="/about">ABOUT US</Link>
            <Link to="/contact">CONTACT US</Link>
            <Link to="/booking">BOOK APPOINTMENT</Link>
          </nav>
        </div>

        {/* Connect & Action Buttons */}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 11, letterSpacing: '0.14em', color: '#11BCE6', marginBottom: 14 }}>
            GET IN TOUCH
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <a
              href={businessInfo.whatsappHref}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#25D366',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M12 2a10 10 0 0 0-8.6 15l-1 3.6 3.7-1A10 10 0 1 0 12 2zm5.2 14.3c-.3.8-1.5 1.5-2.1 1.6-.6.1-1.1.1-1.8-.1-.5-.2-1.1-.5-1.9-1-.7-.5-1.4-1.2-1.9-2-.5-.8-.9-1.7-1-2.6 0-.9.2-1.3.5-1.8l.4-.6c.2-.3.4-.5.6-.5h.6c.2 0 .4 0 .6.5l.8 1.9c.1.3.1.5 0 .7-.1.2-.2.4-.4.6l-.4.4c-.1.1-.2.3-.1.5.1.2.5.8 1 1.4.6.7 1.1 1.1 1.5 1.4.2.1.4.2.5.1l.5-.5c.2-.2.4-.3.6-.4.2 0 .4 0 .7.1l1.9.9c.4.2.5.3.6.5v.6c0 .3-.2.7-.5 1z" />
              </svg>
            </a>
            <a
              href={businessInfo.mapsUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Google Maps Location"
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#0D1217',
                border: '1px solid #1E2A33',
                display: 'grid',
                placeItems: 'center',
                color: '#11BCE6',
                fontSize: 14,
                flexShrink: 0
              }}
            >
              📍
            </a>
            <a
              href={`tel:${businessInfo.phoneHref}`}
              aria-label="Call Phone"
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#0D1217',
                border: '1px solid #1E2A33',
                display: 'grid',
                placeItems: 'center',
                color: '#11BCE6',
                fontSize: 13,
                flexShrink: 0
              }}
            >
              ☎
            </a>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
              style={{
                marginLeft: 'auto',
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#11BCE6',
                border: 'none',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#02141B" strokeWidth="2.4">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </div>

          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <a
              href={`tel:${businessInfo.phoneHref}`}
              className="btn-cyan"
              style={{ width: '100%', padding: '12px' }}
            >
              CALL {businessInfo.phoneDisplay}
            </a>
            <Link
              to="/booking"
              className="btn-gold"
              style={{ width: '100%', padding: '12px' }}
            >
              BOOK APPOINTMENT
            </Link>
          </div>

          <div style={{ fontSize: 11, color: '#687078', marginTop: 14, lineHeight: 1.5 }}>
            Serving Ramanathapuram, Pattinamkathan, Paramakudi, Kilakarai & ECR region.
          </div>
        </div>
      </div>

      {/* Bottom copyright line */}
      <div style={{ borderTop: '1px solid #141B22', padding: '16px 0', background: '#050708' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, fontSize: 11, color: '#687078' }}>
          <div>© {new Date().getFullYear()} Lee Car Accessories. All Rights Reserved.</div>
          <div style={{ display: 'flex', gap: 14 }}>
            <span>No. 01, SK Complex, ECR Junction</span>
            <span>Ramanathapuram 623503</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          footer .container {
            grid-template-columns: 1fr !important;
            gap: 26px !important;
          }
          .footer-nav {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px 16px !important;
          }
        }
      `}</style>
    </footer>
  )
}
