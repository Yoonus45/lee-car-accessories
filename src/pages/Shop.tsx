import { Link, useSearchParams } from 'react-router-dom'
import { useMemo } from 'react'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import { businessInfo } from '../data/mockData'
import { formatINR } from '../lib/currency'
import type { DbProduct } from '../types/database'

// Standard automotive categories with emoji icons
const CATEGORY_META: Record<string, { label: string; icon: string }> = {
  ALL: { label: 'All Products', icon: '🚗' },
  LIGHTING: { label: 'Lighting', icon: '💡' },
  AUDIO: { label: 'Audio & Stereo', icon: '🎵' },
  INTERIOR: { label: 'Interior', icon: '🛋️' },
  EXTERIOR: { label: 'Exterior', icon: '🚘' },
  ACCESSORIES: { label: 'Accessories', icon: '✦' },
}

export default function Shop() {
  const { products, loading } = useProducts()
  const { categories } = useCategories()
  const [searchParams, setSearchParams] = useSearchParams()

  const rawParam = (searchParams.get('category') || 'ALL').trim().toUpperCase()

  // Match canonical category keys
  const activeCategory = useMemo(() => {
    if (!rawParam || rawParam === 'ALL') return 'ALL'
    for (const key of Object.keys(CATEGORY_META)) {
      if (rawParam === key || rawParam.includes(key) || key.includes(rawParam)) {
        return key
      }
    }
    return rawParam
  }, [rawParam])

  // Derive categories dynamically from Supabase + mock fallback
  const allCategoryKeys = useMemo(() => {
    const set = new Set<string>(['ALL', 'LIGHTING', 'AUDIO', 'INTERIOR', 'EXTERIOR', 'ACCESSORIES'])
    categories.forEach(c => {
      if (c.id) set.add(c.id.toUpperCase())
    })
    products.forEach(p => {
      if (p.category) set.add(p.category.toUpperCase())
    })
    return Array.from(set)
  }, [categories, products])

  const handleSelectCategory = (catKey: string) => {
    if (catKey === 'ALL') {
      searchParams.delete('category')
      setSearchParams(searchParams)
    } else {
      setSearchParams({ category: catKey.toLowerCase() })
    }
  }

  // Filter products strictly based on category
  const filtered = useMemo(() => {
    if (activeCategory === 'ALL') return products
    return products.filter(p => {
      const pCat = (p.category || '').trim().toUpperCase()
      return pCat === activeCategory || pCat.includes(activeCategory) || activeCategory.includes(pCat)
    })
  }, [products, activeCategory])

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      {/* ─────────────────────────────────────────────────────────────
          CATEGORY FILTER BAR (CLEAR, CLEAN, EXPLICIT)
      ───────────────────────────────────────────────────────────── */}
      <section className="container" style={{ marginTop: 'clamp(16px, 3vw, 24px)' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ color: '#11BCE6', fontWeight: 800, fontSize: 11, letterSpacing: '0.16em' }}>
            SELECT CATEGORY
          </div>
          <h1 className="sec-title" style={{ fontSize: 'clamp(20px, 4vw, 26px)', marginTop: 4 }}>
            SHOP BY <span style={{ color: '#11BCE6' }}>CATEGORY</span>
          </h1>
          <p style={{ color: '#8A929B', fontSize: 13, marginTop: 6 }}>
            Click a category below to filter products instantly
          </p>
        </div>

        {/* Clean Category Pills */}
        <div style={{
          display: 'flex',
          gap: 10,
          justifyContent: 'center',
          flexWrap: 'wrap',
          padding: '4px'
        }}>
          {allCategoryKeys.map(catKey => {
            const isSelected = activeCategory === catKey
            const meta = CATEGORY_META[catKey] || { label: catKey, icon: '⬢' }
            const count = catKey === 'ALL'
              ? products.length
              : products.filter(p => {
                  const pCat = (p.category || '').trim().toUpperCase()
                  return pCat === catKey || pCat.includes(catKey) || catKey.includes(pCat)
                }).length

            return (
              <button
                key={catKey}
                onClick={() => handleSelectCategory(catKey)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 18px',
                  borderRadius: 999,
                  fontWeight: 800,
                  fontSize: 12,
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  border: `1.5px solid ${isSelected ? 'var(--cyan, #00C8F0)' : 'var(--border2, #1C232B)'}`,
                  background: isSelected ? 'var(--cyan, #00C8F0)' : 'var(--card-bg, #090D11)',
                  color: isSelected ? '#02141B' : 'var(--text, #A0A7AE)',
                  transition: 'all .18s ease',
                  boxShadow: isSelected ? '0 0 16px rgba(0,200,240,0.35)' : 'none'
                }}
              >
                <span>{meta.icon}</span>
                <span>{meta.label.toUpperCase()}</span>
                <span style={{
                  fontSize: 10,
                  opacity: isSelected ? 0.95 : 0.8,
                  background: isSelected ? 'rgba(2,20,27,0.18)' : 'var(--card-item-bg, #0D1217)',
                  color: isSelected ? '#02141B' : 'var(--text-muted, #8E9BAE)',
                  padding: '2px 6px',
                  borderRadius: 999,
                  fontWeight: 900
                }}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          PRODUCT CATALOG GRID
      ───────────────────────────────────────────────────────────── */}
      <section className="container" style={{ marginTop: 'clamp(28px, 4vw, 40px)' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
          borderBottom: '1px solid var(--divider, #161D24)',
          paddingBottom: 14,
          flexWrap: 'wrap',
          gap: 10
        }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted, #A0A7AE)' }}>
            Showing <strong style={{ color: 'var(--text, #FFFFFF)' }}>{filtered.length}</strong> product{filtered.length !== 1 ? 's' : ''} in <span style={{ color: '#11BCE6', fontWeight: 800 }}>{activeCategory === 'ALL' ? 'All Categories' : activeCategory}</span>
          </div>

          {activeCategory !== 'ALL' && (
            <button
              onClick={() => handleSelectCategory('ALL')}
              style={{
                background: 'transparent',
                border: '1px solid var(--border2, #1E2A33)',
                color: '#11BCE6',
                borderRadius: 999,
                padding: '6px 14px',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              CLEAR FILTER ×
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'grid', placeItems: 'center', minHeight: 280, color: 'var(--text-muted2, #687078)', fontSize: 13 }}>
            Loading products…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'var(--card-bg, #090D11)',
            border: '1px solid var(--card-border, #1C232B)',
            borderRadius: 18,
            maxWidth: 600,
            marginInline: 'auto'
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ color: 'var(--text, #FFFFFF)', fontWeight: 800, fontSize: 16 }}>
              No products found in {activeCategory}
            </div>
            <p style={{ color: 'var(--text-muted, #8A929B)', fontSize: 13, marginTop: 8, lineHeight: 1.6 }}>
              We have fresh shipments arriving weekly at our Ramanathapuram showroom. Contact our store directly to check inventory for your car model.
            </p>
            <div style={{ marginTop: 20, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleSelectCategory('ALL')}
                className="btn-cyan"
              >
                VIEW ALL PRODUCTS
              </button>
              <a
                href={`${businessInfo.whatsappHref}?text=Hi%20Lee%20Car%20Accessories%2C%20do%20you%20have%20accessories%20for%20${encodeURIComponent(activeCategory)}%3F`}
                target="_blank"
                rel="noreferrer"
                className="btn-gold"
              >
                WHATSAPP STORE 💬
              </a>
            </div>
          </div>
        ) : (
          <div className="product-grid-4">
            {filtered.map(p => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SPECIAL CONSULTATION BANNER
      ───────────────────────────────────────────────────────────── */}
      <section className="container" style={{ marginTop: 'clamp(40px, 6vw, 60px)' }}>
        <div className="banner-grid">
          <div style={{ padding: 'clamp(28px, 4vw, 40px)' }}>
            <div style={{ color: '#D69A13', fontWeight: 800, fontSize: 11, letterSpacing: '0.14em' }}>
              NEED HELP CHOOSING?
            </div>
            <div className="sec-title" style={{ fontSize: 'clamp(20px, 4vw, 26px)', marginTop: 6 }}>
              <span style={{ color: 'var(--text, #FFFFFF)' }}>FREE EXPERT</span> <span style={{ color: '#11BCE6' }}>FITMENT CONSULTATION</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted, #A0A7AE)', marginTop: 10, lineHeight: 1.65, maxWidth: 480 }}>
              Not sure which LED socket fits your headlights or which Android frame matches your dashboard? Send us a photo of your vehicle on WhatsApp for instant guidance.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 22, flexWrap: 'wrap' }}>
              <a
                href={businessInfo.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="btn-cyan"
                style={{ background: '#25D366', borderColor: '#25D366', color: '#FFFFFF' }}
              >
                WHATSAPP US 💬
              </a>
              <a href={`tel:${businessInfo.phoneHref}`} className="btn-gold">
                CALL {businessInfo.phoneDisplay}
              </a>
            </div>
          </div>

          <div style={{ height: '100%', minHeight: 200, overflow: 'hidden' }}>
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
      <section className="container" style={{ marginTop: 24 }}>
        <div className="feature-row-4" style={{ background: 'var(--card-bg, #090D11)', border: '1px solid var(--card-border, #1C232B)', borderRadius: 16, overflow: 'hidden' }}>
          {[
            { t: 'STORE PICKUP & FITMENT', d: 'ECR Junction, Ramanathapuram', i: '📍' },
            { t: 'DIRECT PHONE SUPPORT', d: businessInfo.phoneDisplay, i: '☎' },
            { t: 'ZERO FACTORY WIRE CUTS', d: '100% Coupler to coupler', i: '⬢' },
            { t: 'GENUINE WARRANTY', d: 'Replacement guarantee', i: '🛡' },
          ].map((f, idx) => (
            <div key={f.t} style={{
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              padding: '18px 20px',
              borderRight: idx < 3 ? '1px solid var(--divider, #1E2834)' : 'none'
            }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'var(--card-item-bg, #0D1217)',
                border: '1px solid var(--card-item-border, #1E2834)',
                display: 'grid',
                placeItems: 'center',
                color: '#11BCE6',
                fontSize: 15,
                flexShrink: 0
              }}>{f.i}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 11, letterSpacing: '0.04em', color: 'var(--text, #FFFFFF)' }}>{f.t}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted2, #687078)', marginTop: 2 }}>{f.d}</div>
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
    <div className="product-card" style={{ minWidth: 0 }}>
      <Link to={`/product/${p.id}`} className="product-card-img-wrap" style={{ display: 'block' }}>
        <img src={p.image} alt={p.name} loading="lazy" />
        <span style={{
          position: 'absolute',
          top: 8,
          right: 8,
          maxWidth: 'calc(100% - 16px)',
          background: 'rgba(5,7,8,0.85)',
          backdropFilter: 'blur(6px)',
          border: '1px solid rgba(17,188,230,0.3)',
          padding: '3px 8px',
          borderRadius: 999,
          fontSize: 9,
          fontWeight: 800,
          color: '#11BCE6',
          letterSpacing: '0.06em',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {p.category}
        </span>
      </Link>

      <div className="product-card-body" style={{ minWidth: 0 }}>
        <Link to={`/product/${p.id}`}>
          <div className="product-card-title">{p.title || p.name}</div>
        </Link>
        <div style={{ fontSize: 9.5, letterSpacing: '0.06em', fontWeight: 700, color: 'var(--text-muted2, #687078)', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {p.category} · Store Fitment
        </div>
        <div className="product-card-desc">{p.description}</div>

        <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--divider, #161D24)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
            <div style={{ minWidth: 0 }}>
              {p.contact_for_price ? (
                <span style={{ color: '#D69A13', fontWeight: 800, fontSize: 'clamp(10px, 2.4vw, 12px)' }}>Contact for Price</span>
              ) : (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, flexWrap: 'wrap' }}>
                  <span style={{ color: '#00C8F0', fontWeight: 900, fontSize: 'clamp(12px, 3vw, 15px)', whiteSpace: 'nowrap' }}>{formatINR(p.price)}</span>
                  {p.mrp && <span style={{ color: '#687078', fontSize: 'clamp(8.5px, 2vw, 10px)', textDecoration: 'line-through', whiteSpace: 'nowrap' }}>{formatINR(p.mrp)}</span>}
                </div>
              )}
            </div>
            <span style={{ color: '#D69A13', fontSize: 'clamp(9.5px, 2.2vw, 11px)', fontWeight: 800, whiteSpace: 'nowrap' }}>★ {p.rating}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 6 }}>
            <Link
              to={`/product/${p.id}`}
              className="btn-cyan"
              style={{
                width: '100%',
                padding: '8px 4px',
                fontSize: 'clamp(9px, 2.2vw, 11px)',
                minHeight: 34,
                boxSizing: 'border-box',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                justifyContent: 'center',
              }}
            >
              VIEW DETAILS
            </Link>
            <a
              href={`${businessInfo.whatsappHref}?text=Hi%20Lee%20Car%20Accessories%2C%20I%20am%20interested%20in%20${encodeURIComponent(p.title || p.name)}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Inquire on WhatsApp"
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'var(--card-item-bg, #0D1217)',
                border: '1px solid var(--card-item-border, #1E2834)',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
                color: '#25D366',
                fontSize: 14,
                flexShrink: 0,
              }}
            >
              💬
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
