import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import { businessInfo } from '../data/mockData'
import type { DbProduct } from '../types/database'

export default function Shop() {
  const { products, loading } = useProducts()
  const { categories } = useCategories()
  const [activeCategory, setActiveCategory] = useState<string>('ALL')

  const filtered = activeCategory === 'ALL'
    ? products
    : products.filter(p => p.category === activeCategory)

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      {/* HERO BANNER */}
      <section className="container" style={{ marginTop: 16 }}>
        <div className="hero-grid-shop" style={{
          background: 'linear-gradient(135deg, #0A0F14 0%, #0D1217 100%)',
          border: '1px solid #1C232B',
          borderRadius: 18,
          overflow: 'hidden'
        }}>
          <div style={{ padding: '34px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(17,188,230,0.08)',
              border: '1px solid rgba(17,188,230,0.22)',
              borderRadius: 999,
              padding: '5px 12px',
              width: 'fit-content',
              marginBottom: 12
            }}>
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', color: '#11BCE6' }}>
                GENUINE AUTOMOTIVE ACCESSORIES
              </span>
            </div>
            <div className="sec-title" style={{ fontSize: 'clamp(24px, 4.5vw, 38px)', lineHeight: 1.05 }}>
              SHOP BY <span style={{ color: '#11BCE6' }}>CATEGORY</span>
            </div>
            <div style={{ color: '#A0A7AE', fontSize: 12, marginTop: 10, lineHeight: 1.65, maxWidth: 440 }}>
              Curated premium accessories fitted with millimeter precision. Visit our Ramanathapuram store at No. 01, SK Complex, ECR Junction.
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ background: '#11BCE6', color: '#02141B', fontWeight: 800, fontSize: 10, padding: '6px 12px', borderRadius: 999 }}>
                COUPLER-TO-COUPLER FITMENT
              </span>
              <span style={{ border: '1px solid #1E2A33', color: '#A0A7AE', fontWeight: 700, fontSize: 10, padding: '6px 12px', borderRadius: 999 }}>
                WARRANTY ASSURED
              </span>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
            padding: 14,
            minWidth: 0,
            alignItems: 'center'
          }}>
            <img
              src="https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=500&h=500&fit=crop"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12, minHeight: 160 }}
              alt="Custom Leather Seat Cover"
              loading="lazy"
            />
            <div style={{ display: 'grid', gap: 10 }}>
              <img
                src="https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=200&fit=crop"
                style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 12 }}
                alt="Android Infotainment Stereo"
                loading="lazy"
              />
              <img
                src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400&h=200&fit=crop"
                style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 12 }}
                alt="LED Headlights"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES STRIP */}
      <section className="container" style={{ marginTop: 24 }}>
        <div className="category-grid-5">
          {/* ALL filter */}
          <div
            onClick={() => setActiveCategory('ALL')}
            style={{
              background: activeCategory === 'ALL' ? '#11BCE6' : '#090D11',
              border: `1px solid ${activeCategory === 'ALL' ? '#11BCE6' : '#1C232B'}`,
              borderRadius: 14,
              overflow: 'hidden',
              textAlign: 'center',
              paddingBottom: 12,
              cursor: 'pointer'
            }}
            className="hover-card"
          >
            <div style={{ aspectRatio: '1', overflow: 'hidden', background: '#0D1217', display: 'grid', placeItems: 'center' }}>
              <span style={{ fontSize: 28 }}>🚗</span>
            </div>
            <div style={{ fontWeight: 800, fontSize: 11, letterSpacing: '0.08em', marginTop: 10, color: activeCategory === 'ALL' ? '#02141B' : '#FFFFFF' }}>
              ALL
            </div>
          </div>
          {categories.map(c => (
            <div
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              style={{
                background: activeCategory === c.id ? 'rgba(17,188,230,0.12)' : '#090D11',
                border: `1px solid ${activeCategory === c.id ? '#11BCE6' : '#1C232B'}`,
                borderRadius: 14,
                overflow: 'hidden',
                textAlign: 'center',
                paddingBottom: 12,
                cursor: 'pointer'
              }}
              className="hover-card"
            >
              <div style={{ aspectRatio: '1', overflow: 'hidden' }}>
                <img src={c.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={c.name} loading="lazy" />
              </div>
              <div style={{ fontWeight: 800, fontSize: 11, letterSpacing: '0.08em', marginTop: 10, color: activeCategory === c.id ? '#11BCE6' : '#FFFFFF' }}>
                {c.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCT CATALOG GRID */}
      <section className="container" style={{ marginTop: 36 }}>
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ color: '#11BCE6', fontWeight: 800, fontSize: 11, letterSpacing: '0.16em' }}>
            FULL CATALOGUE
          </div>
          <div className="sec-title" style={{ fontSize: 'clamp(20px, 4vw, 26px)', marginTop: 4 }}>
            AUTOMOTIVE ACCESSORIES & <span style={{ color: '#11BCE6' }}>PARTS</span>
          </div>
          <div style={{ color: '#687078', fontSize: 12, marginTop: 6 }}>
            {loading ? 'Loading products...' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} available`}
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'grid', placeItems: 'center', minHeight: 200 }}>
            <div style={{ color: '#687078', fontSize: 13 }}>Loading products…</div>
          </div>
        ) : (
          <div className="product-grid-4">
            {filtered.map(p => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </section>

      {/* SPECIAL OFFER / CONSULTATION BANNER */}
      <section className="container" style={{ marginTop: 36 }}>
        <div className="banner-grid" style={{
          background: 'linear-gradient(135deg, #0A0F14 0%, #0D1217 100%)',
          border: '1px solid #1C232B',
          borderRadius: 18,
          overflow: 'hidden'
        }}>
          <div style={{ padding: '30px 26px' }}>
            <div style={{ color: '#D69A13', fontWeight: 800, fontSize: 11, letterSpacing: '0.14em' }}>
              NEED HELP CHOOSING?
            </div>
            <div className="sec-title" style={{ fontSize: 'clamp(20px, 4vw, 24px)', marginTop: 6 }}>
              FREE EXPERT <span style={{ color: '#11BCE6' }}>CONSULTATION</span>
            </div>
            <div style={{ fontSize: 12, color: '#A0A7AE', marginTop: 8, lineHeight: 1.65, maxWidth: 460 }}>
              Not sure which LED bulbs fit your headlamp reflector, or need custom shade matching for seat covers? Our technicians are ready to advise you.
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
              <a
                href={businessInfo.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="btn-cyan"
                style={{ background: '#25D366', borderColor: '#25D366', color: '#FFFFFF' }}
              >
                WHATSAPP US →
              </a>
              <a href={`tel:${businessInfo.phoneHref}`} className="btn-gold">
                CALL {businessInfo.phoneDisplay}
              </a>
            </div>
          </div>

          <div style={{ height: '100%', minHeight: 180, overflow: 'hidden' }}>
            <img
              src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=500&fit=crop"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              alt="Lee Car Accessories Showroom"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* TRUST FEATURES BAR */}
      <section className="container" style={{ marginTop: 20 }}>
        <div className="feature-row-4" style={{ background: '#090D11', border: '1px solid #1C232B', borderRadius: 14, overflow: 'hidden' }}>
          {[
            { t: 'STORE PICKUP & FITMENT', d: 'ECR Junction, Ramanathapuram', i: '📍' },
            { t: 'DIRECT SUPPORT', d: businessInfo.phoneDisplay, i: '☎' },
            { t: 'NO WIRE CUTS', d: '100% Coupler to coupler', i: '⬢' },
            { t: 'GENUINE WARRANTY', d: 'Replacement guarantee', i: '🛡' },
          ].map((f, idx) => (
            <div key={f.t} style={{
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              padding: '16px 18px',
              borderRight: idx < 3 ? '1px solid #1C232B' : 'none'
            }}>
              <div style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: '#0D1217',
                border: '1px solid #1E2A33',
                display: 'grid',
                placeItems: 'center',
                color: '#11BCE6',
                fontSize: 14,
                flexShrink: 0
              }}>{f.i}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 11, letterSpacing: '0.04em' }}>{f.t}</div>
                <div style={{ fontSize: 11, color: '#687078', marginTop: 2 }}>{f.d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function ProductCard({ p }: { p: DbProduct }) {
  return (
    <div className="product-card">
      <Link to={`/product/${p.id}`} className="product-card-img-wrap" style={{ display: 'block' }}>
        <img src={p.image} alt={p.name} loading="lazy" />
        <span style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: 'rgba(5,7,8,0.85)',
          border: '1px solid #1E2A33',
          padding: '3px 8px',
          borderRadius: 999,
          fontSize: 10,
          fontWeight: 800,
          color: '#11BCE6'
        }}>
          {p.category}
        </span>
      </Link>

      <div className="product-card-body">
        <div className="product-card-title">{p.title}</div>
        <div style={{ fontSize: 10, letterSpacing: '0.08em', fontWeight: 700, color: '#687078', marginTop: 3 }}>
          {p.category} · Store Fitment
        </div>
        <div className="product-card-desc">{p.description}</div>

        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div>
            {p.contact_for_price ? (
              <span style={{ color: '#D69A13', fontWeight: 800, fontSize: 13 }}>Contact for Price</span>
            ) : (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ color: '#11BCE6', fontWeight: 900, fontSize: 15 }}>₹{p.price!.toLocaleString('en-IN')}</span>
                {p.mrp && <span style={{ color: '#687078', fontSize: 11, textDecoration: 'line-through' }}>₹{p.mrp.toLocaleString('en-IN')}</span>}
              </div>
            )}
          </div>
          <span style={{ color: '#D69A13', fontSize: 11, fontWeight: 700 }}>★ {p.rating}</span>
        </div>

        <Link
          to={`/product/${p.id}`}
          className="btn-cyan"
          style={{
            marginTop: 14,
            width: '100%',
            padding: '10px 14px',
            fontSize: 11,
            minHeight: 40
          }}
        >
          VIEW DETAILS
        </Link>
      </div>
    </div>
  )
}
