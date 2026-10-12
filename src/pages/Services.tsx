import { Link } from 'react-router-dom'
import { services, businessInfo } from '../data/mockData'

export default function Services() {
  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      {/* HEADER */}
      <section className="container" style={{ textAlign: 'center', padding: '32px 0 20px' }}>
        <div style={{ color: '#11BCE6', fontWeight: 800, fontSize: 11, letterSpacing: '0.16em' }}>
          EXPERT FITMENT SERVICES
        </div>
        <h1 className="sec-title" style={{ fontSize: 'clamp(24px, 4.5vw, 32px)', marginTop: 6, margin: '6px 0 0' }}>
          AUTOMOTIVE UPGRADE <span style={{ color: '#11BCE6' }}>SERVICES</span>
        </h1>
        <div style={{ color: '#A0A7AE', fontSize: 13, marginTop: 8, lineHeight: 1.65, maxWidth: 640, marginInline: 'auto' }}>
          Comprehensive car customization at No. 01, SK Complex, ECR Junction, Ramanathapuram. Coupler-to-coupler installation with manufacturer warranty protection.
        </div>
      </section>

      {/* SERVICE CARDS */}
      <section className="container service-grid-2">
        {services.map(s => (
          <div
            key={s.slug}
            style={{
              borderRadius: 18,
              overflow: 'hidden',
              border: '1px solid var(--card-border, #1C232B)',
              background: 'var(--card-bg, #090D11)',
              position: 'relative',
              minHeight: 280,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              boxSizing: 'border-box'
            }}
            className="hover-card"
          >
            <img
              src={s.img}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                inset: 0,
                transition: 'transform .4s ease'
              }}
              alt={s.title}
              loading="lazy"
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(0deg, rgba(5,7,8,0.95) 0%, rgba(5,7,8,0.7) 45%, rgba(5,7,8,0.2) 100%)'
            }} />

            <div style={{ position: 'relative', padding: '24px 22px', zIndex: 1 }}>
              <div style={{
                fontFamily: 'Orbitron',
                fontWeight: 900,
                fontSize: 'clamp(14px, 2.5vw, 16px)',
                letterSpacing: '0.02em',
                color: '#FFFFFF'
              }}>
                {s.title}
              </div>
              <div style={{ fontSize: 12, color: '#A0A7AE', marginTop: 8, lineHeight: 1.6, maxWidth: 440 }}>
                {s.desc}
              </div>
              <div style={{ marginTop: 16, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <Link
                  to={s.slug === 'interior' ? '/seat-covers' : `/shop?category=${s.slug}`}
                  style={{
                    color: '#11BCE6',
                    fontWeight: 800,
                    fontSize: 11,
                    letterSpacing: '0.08em',
                    display: 'inline-flex',
                    gap: 6,
                    alignItems: 'center'
                  }}
                >
                  {s.slug === 'interior' ? 'VIEW SEAT COVERS →' : 'EXPLORE ACCESSORIES →'}
                </Link>
                <Link
                  to="/booking"
                  style={{
                    color: '#D69A13',
                    fontWeight: 800,
                    fontSize: 11,
                    letterSpacing: '0.08em',
                    display: 'inline-flex',
                    gap: 6,
                    alignItems: 'center'
                  }}
                >
                  BOOK APPOINTMENT
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* CUSTOM REQUIREMENT BANNER */}
      <section className="container" style={{ marginTop: 32 }}>
        <div className="banner-grid" style={{
          background: 'linear-gradient(135deg, #0A0F14 0%, #0D1217 100%)',
          border: 'none',
          borderRadius: 18,
          overflow: 'hidden'
        }}>
          <div style={{ padding: '32px 26px' }}>
            <div style={{ color: '#D69A13', fontWeight: 800, fontSize: 11, letterSpacing: '0.14em' }}>
              BESPOKE AUTOMOTIVE BUILDS
            </div>
            <div className="sec-title" style={{ fontSize: 'clamp(20px, 4vw, 24px)', marginTop: 6 }}>
              HAVE A CUSTOM <span style={{ color: '#11BCE6' }}>REQUIREMENT?</span>
            </div>
            <div style={{ fontSize: 12, color: '#A0A7AE', marginTop: 8, lineHeight: 1.65, maxWidth: 480 }}>
              Need a full interior aesthetic overhaul, dual-subwoofer audio setup, or high-output headlight tuning? Speak directly with our master technicians at No. 01, SK Complex, ECR Junction, Ramanathapuram.
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn-cyan">CONTACT US →</Link>
              <a href={businessInfo.whatsappHref} target="_blank" rel="noreferrer" className="btn-gold">
                WHATSAPP {businessInfo.phoneDisplay}
              </a>
            </div>
          </div>
          <div style={{ height: '100%', minHeight: 180, overflow: 'hidden' }}>
            <img
              src="https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&h=500&fit=crop"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              alt="Lee Car Accessories Custom Fitment"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
