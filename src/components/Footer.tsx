import { Link } from 'react-router-dom'
import { businessInfo } from '../data/mockData'
import leeLogo from '../assets/lee cars logo.png'

export default function Footer() {
  return (
    <footer style={{
      background: '#060A0D',
      borderTop: '1px solid #161D24',
      marginTop: 'clamp(40px, 6vw, 64px)',
      position: 'relative',
      width: '100%',
    }}>
      <div className="container" style={{ padding: '30px 0 20px' }}>
        {/* Main Footer Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 'clamp(20px, 4vw, 36px)',
          alignItems: 'start',
          paddingBottom: 24,
          borderBottom: '1px solid #141B22'
        }}>
          {/* Brand & Address Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img
                src={leeLogo}
                alt="Lee Car Accessories Logo"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid #1E2A33',
                  flexShrink: 0
                }}
              />
              <div style={{ lineHeight: 1.15 }}>
                <div style={{ fontFamily: 'Orbitron', fontWeight: 800, fontSize: 13, letterSpacing: '0.06em', color: '#FFFFFF' }}>
                  LEE CAR ACCESSORIES
                </div>
                <div style={{ fontSize: 9, color: '#11BCE6', fontWeight: 700, letterSpacing: '0.12em', marginTop: 2 }}>
                  PREMIUM CUSTOMIZATION
                </div>
              </div>
            </div>

            <p style={{
              fontSize: 12,
              color: '#8A929B',
              lineHeight: 1.6,
              marginTop: 12,
              maxWidth: 340
            }}>
              Specialized car accessories, bucket-fit seat covers, and premium electronics at ECR Junction, Ramanathapuram.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#A0A7AE', marginTop: 10 }}>
              <span style={{ color: '#D69A13' }}>★</span>
              <strong style={{ color: '#FFFFFF' }}>{businessInfo.rating} / 5</strong>
              <span style={{ color: '#687078' }}>· ~{businessInfo.reviewCount} Google reviews</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <div style={{ fontWeight: 800, fontSize: 11, letterSpacing: '0.12em', color: '#11BCE6', marginBottom: 12 }}>
              QUICK NAVIGATION
            </div>
            <nav style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px 16px',
              fontSize: 11,
              letterSpacing: '0.06em',
              fontWeight: 700,
              color: '#8A929B'
            }}>
              <Link to="/" style={{ transition: 'color .15s' }}>HOME</Link>
              <Link to="/services" style={{ transition: 'color .15s' }}>SERVICES</Link>
              <Link to="/seat-covers" style={{ transition: 'color .15s', color: '#11BCE6' }}>SEAT COVERS</Link>
              <Link to="/shop" style={{ transition: 'color .15s' }}>SHOP</Link>
              <Link to="/gallery" style={{ transition: 'color .15s' }}>GALLERY</Link>
              <Link to="/booking" style={{ transition: 'color .15s' }}>BOOKING</Link>
              <Link to="/reviews" style={{ transition: 'color .15s' }}>REVIEWS</Link>
              <Link to="/contact" style={{ transition: 'color .15s' }}>CONTACT US</Link>
            </nav>
          </div>

          {/* Direct Contact & Store Info */}
          <div>
            <div style={{ fontWeight: 800, fontSize: 11, letterSpacing: '0.12em', color: '#11BCE6', marginBottom: 12 }}>
              CONNECT & VISIT
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, color: '#A0A7AE' }}>
              <a
                href={`tel:${businessInfo.phoneHref}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#FFFFFF', fontWeight: 600 }}
              >
                <span style={{ color: '#11BCE6' }}>☎</span> {businessInfo.phoneDisplay}
              </a>
              <a
                href={businessInfo.whatsappHref}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#25D366', fontWeight: 700 }}
              >
                <span>💬</span> WhatsApp Store Support
              </a>
              <a
                href={businessInfo.mapsUrl}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#A0A7AE', lineHeight: 1.4 }}
              >
                <span style={{ color: '#11BCE6' }}>📍</span> No. 01, SK Complex, ECR Junction, Ramanathapuram
              </a>
              <div style={{ fontSize: 11, color: '#687078', marginTop: 2 }}>
                Open Mon - Sun: 9:00 AM – 9:00 PM
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Compact Copyright Line */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
          paddingTop: 16,
          fontSize: 11,
          color: '#687078'
        }}>
          <div>© {new Date().getFullYear()} Lee Car Accessories. All Rights Reserved.</div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/seat-covers" style={{ color: '#A0A7AE' }}>Seat Covers</Link>
            <span>·</span>
            <Link to="/contact" style={{ color: '#A0A7AE' }}>Contact</Link>
            <span>·</span>
            <Link to="/admin" style={{ color: '#687078' }}>Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
