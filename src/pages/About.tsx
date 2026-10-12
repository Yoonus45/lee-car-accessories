import { Link } from 'react-router-dom'
import { businessInfo } from '../data/mockData'

export default function About() {
  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      {/* HERO / INTRO */}
      <section className="container about-hero" style={{ paddingTop: 24 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ color: '#11BCE6', fontWeight: 800, fontSize: 11, letterSpacing: '0.16em' }}>
            ABOUT US
          </div>
          <h1 className="sec-title" style={{ fontSize: 'clamp(26px, 4.5vw, 36px)', lineHeight: 1.05, marginTop: 6, margin: '6px 0 0' }}>
            LEE CAR <span style={{ color: '#11BCE6' }}>ACCESSORIES</span>
          </h1>

          <p style={{ color: '#A0A7AE', fontSize: 13, lineHeight: 1.75, marginTop: 14 }}>
            Lee Car Accessories is Ramanathapuram's premier destination for complete automotive styling and luxury upgrades. Established at No. 01, SK Complex, ECR Junction, Pattinamkathan, we bring over a decade of hands-on technical craftsmanship to every vehicle that enters our bay.
          </p>

          <p style={{ color: '#A0A7AE', fontSize: 13, lineHeight: 1.75, marginTop: 10 }}>
            Whether you are outfitting a brand-new car straight from the showroom or upgrading your existing ride, our certified technicians execute every installation with strict coupler-to-coupler standards — zero wire cutting, ensuring your manufacturer electrical warranty remains 100% intact.
          </p>

          {/* Business location box */}
          <div style={{
            marginTop: 18,
            background: 'var(--card-bg, #090D11)',
            border: '1px solid var(--card-border, #1C232B)',
            borderRadius: 14,
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6
          }}>
            <div style={{ fontWeight: 800, fontSize: 11, letterSpacing: '0.08em', color: '#11BCE6' }}>
              STORE LOCATION
            </div>
            <div style={{ fontSize: 12, color: 'var(--text, #FFFFFF)', lineHeight: 1.6 }}>
              {businessInfo.fullAddress}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
              <a href={businessInfo.mapsUrl} target="_blank" rel="noreferrer" style={{ fontSize: 11, fontWeight: 800, color: '#11BCE6' }}>
                VIEW ON MAPS →
              </a>
              <a href={`tel:${businessInfo.phoneHref}`} style={{ fontSize: 11, fontWeight: 800, color: '#D69A13' }}>
                ☎ {businessInfo.phoneDisplay}
              </a>
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: 12,
            marginTop: 18
          }}>
            {[
              { n: '10+', l: 'YEARS EXPERIENCE' },
              { n: '500+', l: 'HAPPY CAR OWNERS' },
              { n: '4.8 ★', l: `~${businessInfo.reviewCount} GOOGLE REVIEWS` },
            ].map(s => (
              <div key={s.l} style={{
                background: 'var(--card-bg, #090D11)',
                border: '1px solid var(--card-border, #1C232B)',
                borderRadius: 12,
                padding: '14px',
                textAlign: 'center',
                minWidth: 0
              }}>
                <div style={{ color: '#11BCE6', fontWeight: 900, fontSize: 20 }}>{s.n}</div>
                <div style={{ fontSize: 9, letterSpacing: '0.06em', fontWeight: 800, color: '#A0A7AE', marginTop: 4, lineHeight: 1.3 }}>
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          borderRadius: 18,
          overflow: 'hidden',
          border: '1px solid #1C232B',
          height: '100%',
          minHeight: 280,
          maxHeight: 460,
          minWidth: 0
        }}>
          <img
            src="https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&h=800&fit=crop"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            alt="Lee Car Accessories Interior Craftsmanship"
            loading="lazy"
          />
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="container" style={{ marginTop: 40 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#11BCE6', fontWeight: 800, fontSize: 11, letterSpacing: '0.16em' }}>
            WHY CHOOSE US
          </div>
          <div className="sec-title" style={{ fontSize: 'clamp(20px, 4vw, 26px)', marginTop: 4 }}>
            THE LEE CAR <span style={{ color: '#11BCE6' }}>ADVANTAGE</span>
          </div>
        </div>

        <div className="why-grid-4" style={{ marginTop: 22 }}>
          {[
            {
              t: 'EXPERIENCED CREW',
              d: 'Over 10 years customizing all car brands: Maruti, Hyundai, Tata, Mahindra, Toyota, and Honda.',
              i: '◆'
            },
            {
              t: 'NO WIRE TAMPERING',
              d: '100% plug & play couplers. No cutting original car wires; keeps your car factory warranty safe.',
              i: '✦'
            },
            {
              t: 'TRANSPARENT PRICING',
              d: 'Affordable, honest rates with reliable warranty on all parts. Call ' + businessInfo.phoneDisplay,
              i: '₹'
            },
            {
              t: '4.8 GOOGLE RATING',
              d: 'Over 70 genuine Google reviews from satisfied customers across Ramanathapuram district.',
              i: '♥'
            },
          ].map(c => (
            <div key={c.t} style={{
              background: 'var(--card-bg, #090D11)',
              border: '1px solid var(--card-border, #1C232B)',
              borderRadius: 14,
              padding: '22px 18px',
              textAlign: 'center',
              minWidth: 0
            }} className="hover-card">
              <div style={{
                width: 44,
                height: 44,
                margin: '0 auto 12px',
                borderRadius: 10,
                background: '#0D1217',
                border: '1px solid #1E2A33',
                display: 'grid',
                placeItems: 'center',
                color: '#11BCE6',
                fontSize: 18
              }}>{c.i}</div>
              <div style={{ fontWeight: 800, fontSize: 12, letterSpacing: '0.06em' }}>{c.t}</div>
              <div style={{ fontSize: 11, color: '#687078', marginTop: 6, lineHeight: 1.55 }}>{c.d}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
          <Link to="/contact" className="btn-cyan">
            VISIT OUR STORE →
          </Link>
          <Link to="/reviews" className="btn-gold">
            READ CUSTOMER REVIEWS ★ 4.8
          </Link>
        </div>
      </section>
    </div>
  )
}
