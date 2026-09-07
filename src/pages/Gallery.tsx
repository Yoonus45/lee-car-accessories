import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import type { DbGalleryItem } from '../types/database'

const DEFAULT_CATEGORIES = [
  'ALL',
  'Car Accessories',
  'Lighting',
  'Interior',
  'Exterior',
  'Audio',
  'Installation',
  'Custom Work',
] as const

export default function Gallery() {
  const [items, setItems] = useState<DbGalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('ALL')
  const [visibleCount, setVisibleCount] = useState(9)
  const [selectedPhoto, setSelectedPhoto] = useState<DbGalleryItem | null>(null)

  useEffect(() => {
    fetchGallery()
  }, [])

  async function fetchGallery() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('gallery_type', 'general')
        .eq('published', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) {
        console.warn('[Gallery] Supabase query notice:', error.message)
      } else if (data) {
        setItems(data)
      }
    } catch (err) {
      console.warn('[Gallery] Fetch failed:', err)
    } finally {
      setLoading(false)
    }
  }

  // Derive categories list dynamically from items + default list
  const categoryFilters = useMemo(() => {
    const set = new Set<string>(['ALL'])
    // Add default popular categories first
    DEFAULT_CATEGORIES.forEach(c => set.add(c))
    // Add any unique custom categories from published database items
    items.forEach(i => {
      if (i.category) set.add(i.category)
    })
    return Array.from(set)
  }, [items])

  // Filtered by category
  const filtered = useMemo(() => {
    if (activeCategory === 'ALL') return items
    return items.filter(
      item => item.category.toLowerCase() === activeCategory.toLowerCase()
    )
  }, [items, activeCategory])

  const show = filtered.slice(0, visibleCount)

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      {/* Hero / Header */}
      <section className="container" style={{ textAlign: 'center', padding: '36px 0 20px' }}>
        <div style={{ color: '#11BCE6', fontWeight: 800, fontSize: 11, letterSpacing: '0.16em' }}>
          WORK PORTFOLIO
        </div>
        <h1 className="sec-title" style={{ fontSize: 'clamp(24px, 4.5vw, 34px)', marginTop: 6, margin: '6px 0 0' }}>
          OUR INSTALLATION <span style={{ color: '#11BCE6' }}>GALLERY</span>
        </h1>
        <div style={{ color: '#A0A7AE', fontSize: 13, marginTop: 8, maxWidth: 560, marginInline: 'auto' }}>
          Explore authentic customer installations, custom modifications, and premium accessories fitted at Lee Car Accessories, Ramanathapuram.
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 22 }}>
          {categoryFilters.map(cat => {
            const isSelected = activeCategory.toLowerCase() === cat.toLowerCase()
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat)
                  setVisibleCount(9)
                }}
                style={{
                  padding: '8px 18px',
                  borderRadius: 999,
                  fontWeight: 800,
                  fontSize: 11,
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  border: '1px solid ' + (isSelected ? '#11BCE6' : '#1E2A33'),
                  background: isSelected ? '#11BCE6' : '#0D1217',
                  color: isSelected ? '#02141B' : '#A0A7AE',
                  transition: 'all .15s ease',
                }}
              >
                {cat.toUpperCase()}
              </button>
            )
          })}
        </div>
      </section>

      {/* GALLERY GRID */}
      <section className="container" style={{ paddingBottom: 50 }}>
        {loading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 16,
              padding: '20px 0',
            }}
          >
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div
                key={n}
                style={{
                  height: 230,
                  borderRadius: 14,
                  background: '#090D11',
                  border: '1px solid #1C232B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4B5563',
                  fontSize: 12,
                }}
              >
                Loading portfolio…
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              color: '#687078',
              padding: '60px 20px',
              background: '#090D11',
              border: '1px solid #1C232B',
              borderRadius: 16,
              maxWidth: 600,
              marginInline: 'auto',
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>📷</div>
            <div style={{ color: '#FFFFFF', fontWeight: 800, fontSize: 15 }}>
              No photos found in this category
            </div>
            <p style={{ fontSize: 12, color: '#8A929B', marginTop: 6, lineHeight: 1.5 }}>
              We regularly update our completed work. Check back soon or message our team to see recent project photos and custom fittings!
            </p>
            <a
              href="https://wa.me/919952637233?text=Hi%20Lee%20Car%20Accessories%2C%20I%20would%20like%20to%20see%20recent%20work%20photos%20for%20my%20car."
              target="_blank"
              rel="noreferrer"
              className="btn-gold"
              style={{ display: 'inline-block', marginTop: 14, textDecoration: 'none', fontSize: 11 }}
            >
              CHAT ON WHATSAPP FOR PHOTOS 💬
            </a>
          </div>
        ) : (
          <div className="gallery-grid-3">
            {show.map(g => (
              <div
                key={g.id}
                onClick={() => setSelectedPhoto(g)}
                style={{
                  borderRadius: 14,
                  overflow: 'hidden',
                  border: '1px solid #1C232B',
                  position: 'relative',
                  background: '#090D11',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                }}
                className="hover-card"
              >
                <img
                  src={g.image_url}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  alt={g.title}
                  loading="lazy"
                />

                {/* Top overlay badges */}
                <div
                  style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    right: 10,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <span
                    style={{
                      background: 'rgba(5,7,8,0.82)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(17,188,230,0.3)',
                      padding: '4px 10px',
                      borderRadius: 999,
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      color: '#11BCE6',
                    }}
                  >
                    {g.category}
                  </span>

                  {g.featured && (
                    <span
                      style={{
                        background: 'rgba(214,154,19,0.9)',
                        color: '#FFFFFF',
                        fontSize: 9,
                        fontWeight: 900,
                        padding: '3px 8px',
                        borderRadius: 999,
                        letterSpacing: '0.06em',
                      }}
                    >
                      ⭐ FEATURED
                    </span>
                  )}
                </div>

                {/* Bottom title banner */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '24px 12px 10px',
                    background: 'linear-gradient(180deg, rgba(5,7,8,0) 0%, rgba(5,7,8,0.92) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: '#FFFFFF',
                      fontFamily: 'Orbitron, sans-serif',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {g.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {visibleCount < filtered.length && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
            <button onClick={() => setVisibleCount(v => v + 6)} className="btn-gold">
              LOAD MORE WORK ({filtered.length - visibleCount} REMAINING)
            </button>
          </div>
        )}
      </section>

      {/* LIGHTBOX MODAL ON CLICK */}
      {selectedPhoto && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.88)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            style={{
              maxWidth: 800,
              width: '100%',
              background: '#090D11',
              border: '1px solid #1C232B',
              borderRadius: 18,
              overflow: 'hidden',
              boxShadow: '0 24px 60px rgba(0,0,0,0.8)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ position: 'relative', maxHeight: '65vh', background: '#050708' }}>
              <img
                src={selectedPhoto.image_url}
                alt={selectedPhoto.title}
                style={{ width: '100%', maxHeight: '65vh', objectFit: 'contain', display: 'block' }}
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  background: 'rgba(5,7,8,0.7)',
                  border: '1px solid #1E2A33',
                  color: '#FFFFFF',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: '18px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span
                  style={{
                    color: '#11BCE6',
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    background: 'rgba(17,188,230,0.1)',
                    border: '1px solid rgba(17,188,230,0.25)',
                    padding: '2px 8px',
                    borderRadius: 6,
                  }}
                >
                  {selectedPhoto.category.toUpperCase()}
                </span>
                {selectedPhoto.featured && (
                  <span style={{ color: '#D69A13', fontSize: 10, fontWeight: 800 }}>
                    ⭐ FEATURED INSTALLATION
                  </span>
                )}
              </div>
              <h3
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontWeight: 900,
                  fontSize: 16,
                  color: '#FFFFFF',
                  margin: '8px 0 4px',
                }}
              >
                {selectedPhoto.title}
              </h3>
              {selectedPhoto.description && (
                <p style={{ color: '#A0A7AE', fontSize: 12, margin: '6px 0 0', lineHeight: 1.6 }}>
                  {selectedPhoto.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
