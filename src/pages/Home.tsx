import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import { recentWork, businessInfo, reviews } from '../data/mockData'
import { formatINR } from '../lib/currency'

// High-resolution automotive imagery for hero carousel in dark moody environments
const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&h=900&fit=crop',
    alt: 'Premium luxury supercar in dark studio environment',
  },
  {
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&h=900&fit=crop',
    alt: 'High performance sports car with illuminated projector headlights',
  },
  {
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1600&h=900&fit=crop',
    alt: 'Luxury automotive cockpit and custom leather interior',
  },
]

// 4 canonical categories with premium automotive photography
const CANONICAL_CATEGORIES = [
  {
    key: 'lighting',
    name: 'Lighting',
    fallbackImg: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&h=450&fit=crop',
    icon: '💡',
  },
  {
    key: 'audio',
    name: 'Audio',
    fallbackImg: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=450&fit=crop',
    icon: '🎵',
  },
  {
    key: 'interior',
    name: 'Interior',
    fallbackImg: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=600&h=450&fit=crop',
    icon: '🛋️',
  },
  {
    key: 'exterior',
    name: 'Exterior',
    fallbackImg: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=450&fit=crop',
    icon: '🚘',
  },
]

function ReviewCarousel() {
  const scroller = useRef<HTMLDivElement>(null)
  const scroll = (dir: number) => {
    if (!scroller.current) return
    const cardWidth = Math.min(320, window.innerWidth - 64)
    scroller.current.scrollBy({ left: dir * cardWidth, behavior: 'smooth' })
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div
        ref={scroller}
        style={{
          display: 'flex',
          gap: 14,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          paddingBottom: 10,
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          width: '100%',
        }}
      >
        {reviews.map(r => (
          <div
            key={r.id}
            className="review-card hover-card"
            style={{
              width: 'min(320px, calc(100vw - 64px))',
              minWidth: 'min(280px, calc(100vw - 64px))',
              flexShrink: 0,
              scrollSnapAlign: 'start',
              background: 'var(--card-bg, #090D12)',
              border: '1px solid var(--card-border, #1A232E)',
              borderRadius: 16,
              padding: '18px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxSizing: 'border-box',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', minWidth: 0 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: 'var(--card-item-bg, #0E141C)',
                      border: '1px solid var(--card-item-border, #1E2834)',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 900,
                      fontSize: 12,
                      color: '#00C8F0',
                      flexShrink: 0,
                    }}
                  >
                    {r.name.charAt(0)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 12, color: 'var(--text, #FFFFFF)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {r.name}
                    </div>
                    <div style={{ fontSize: 10, color: '#8E9BAE', display: 'flex', gap: 4, alignItems: 'center', marginTop: 2 }}>
                      <span>Google Verified · {r.date}</span>
                    </div>
                  </div>
                </div>
                <span style={{ color: '#D69A13', fontSize: 12, flexShrink: 0 }}>
                  {'★'.repeat(r.rating)}
                </span>
              </div>

              {r.serviceTag && (
                <div style={{ marginTop: 10 }}>
                  <span
                    style={{
                      display: 'inline-block',
                      background: 'rgba(0, 200, 240, 0.08)',
                      border: '1px solid rgba(0, 200, 240, 0.22)',
                      color: '#00C8F0',
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 999,
                    }}
                  >
                    {r.serviceTag}
                  </span>
                </div>
              )}

              <p
                style={{
                  fontSize: 12,
                  lineHeight: 1.6,
                  color: 'var(--text-muted, #A0AAB6)',
                  marginTop: 10,
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                "{r.text}"
              </p>
            </div>

            <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--divider, #151D26)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 10, color: '#00C8F0', fontWeight: 800 }}>VERIFIED CUSTOMER ✓</span>
              <span style={{ fontSize: 10, color: '#687280' }}>ECR Store</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 12 }}>
        <button
          onClick={() => scroll(-1)}
          aria-label="Previous Review"
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'var(--card-item-bg, #0E141C)',
            border: '1px solid var(--card-item-border, #1E2834)',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            color: 'var(--text, #FFFFFF)',
            fontSize: 16,
          }}
        >
          ‹
        </button>
        <button
          onClick={() => scroll(1)}
          aria-label="Next Review"
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'var(--card-item-bg, #0E141C)',
            border: '1px solid var(--card-item-border, #1E2834)',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            color: 'var(--text, #FFFFFF)',
            fontSize: 16,
          }}
        >
          ›
        </button>
      </div>
    </div>
  )
}

export default function Home() {
  const { products, loading: productsLoading } = useProducts()
  const { categories } = useCategories()
  const [heroIndex, setHeroIndex] = useState(0)

  // Working Hero Carousel: Auto advance every 5.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % HERO_SLIDES.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [])

  // Resolve category cards from database or canonical list
  const categoryCards = CANONICAL_CATEGORIES.map(cat => {
    const dbMatch = categories.find(
      c => c.id.toLowerCase() === cat.key.toLowerCase() || c.name.toLowerCase() === cat.name.toLowerCase()
    )
    return {
      key: cat.key,
      name: cat.name,
      img: dbMatch?.img || cat.fallbackImg,
      icon: cat.icon,
    }
  })

  // Featured products from Supabase (up to 4 for clean 2x2 mobile grid matching reference)
  const featuredProducts = products.slice(0, 4)

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      {/* ─────────────────────────────────────────────────────────────
          1. HOME PAGE HERO SECTION
          Exact elements requested:
          - Premium car accessories label in cyan
          - Main heading: "UPGRADE YOUR RIDE"
          - Highlighted cyan heading: "DRIVE IN STYLE"
          - Supporting text: "Quality accessories for better comfort, style and performance."
          - Cyan button: "Explore Products →"
          - High-quality automotive image featuring a premium car in a dark environment
          - Small carousel indicators near the bottom
      ───────────────────────────────────────────────────────────── */}
      <section className="container" style={{ marginTop: 'clamp(12px, 2.5vw, 18px)' }}>
        <div
          className="hero-banner-card"
          style={{
            position: 'relative',
            borderRadius: 18,
            overflow: 'hidden',
            border: 'none',
            background: '#080C10',
            minHeight: 'clamp(360px, 60vw, 480px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.55)',
          }}
        >
          {/* Background Carousel Image with Smooth Transition */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
            }}
          >
            <img
              src={HERO_SLIDES[heroIndex].image}
              alt={HERO_SLIDES[heroIndex].alt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.88,
                transition: 'opacity 0.6s ease-in-out',
              }}
            />
            {/* Dark vignette & gradient overlay for maximum readability */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, rgba(6,9,13,0.3) 0%, rgba(6,9,13,0.7) 45%, rgba(6,9,13,0.96) 95%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(circle at 80% 20%, rgba(0, 200, 240, 0.12) 0%, transparent 60%)',
              }}
            />
          </div>

          {/* Hero Content Overlay */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              padding: 'clamp(20px, 4.5vw, 36px)',
              maxWidth: 580,
            }}
          >
            {/* Premium Car Accessories Label in Cyan */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                marginBottom: 10,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00C8F0' }} />
              <span
                style={{
                  color: '#00C8F0',
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                }}
              >
                PREMIUM CAR ACCESSORIES
              </span>
            </div>

            {/* Main Heading: "UPGRADE YOUR RIDE" */}
            <h1
              style={{
                fontFamily: 'Orbitron, sans-serif',
                fontWeight: 900,
                fontSize: 'clamp(26px, 6.2vw, 44px)',
                lineHeight: 1.05,
                margin: 0,
                color: '#FFFFFF',
                letterSpacing: '-0.01em',
                textTransform: 'uppercase',
              }}
            >
              UPGRADE YOUR RIDE
            </h1>

            {/* Highlighted Cyan Heading: "DRIVE IN STYLE" */}
            <div
              style={{
                fontFamily: 'Orbitron, sans-serif',
                fontWeight: 900,
                fontSize: 'clamp(26px, 6.2vw, 44px)',
                lineHeight: 1.05,
                color: '#00C8F0',
                letterSpacing: '-0.01em',
                textTransform: 'uppercase',
                marginTop: 2,
              }}
            >
              DRIVE IN STYLE
            </div>

            {/* Supporting Text */}
            <p
              style={{
                color: '#A2ACB8',
                fontSize: 'clamp(12px, 3vw, 14px)',
                lineHeight: 1.55,
                marginTop: 10,
                marginBottom: 18,
                maxWidth: 440,
              }}
            >
              Quality accessories for better comfort, style and performance.
            </p>

            {/* Cyan Button: "Explore Products →" */}
            <Link
              to="/shop"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                background: '#00C8F0',
                color: '#04131A',
                fontWeight: 800,
                fontSize: 13,
                letterSpacing: '0.06em',
                padding: '12px 24px',
                borderRadius: 999,
                textDecoration: 'none',
                boxShadow: '0 4px 18px rgba(0, 200, 240, 0.35)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#15D4FA'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#00C8F0'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <span>Explore Products</span>
              <span style={{ fontSize: 16 }}>→</span>
            </Link>
          </div>

          {/* Small Carousel Indicators near the bottom */}
          <div
            style={{
              position: 'relative',
              zIndex: 3,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 8,
              paddingBottom: 14,
            }}
          >
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: heroIndex === i ? 22 : 7,
                  height: 6,
                  borderRadius: 3,
                  background: heroIndex === i ? '#00C8F0' : 'rgba(255, 255, 255, 0.28)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.25s ease',
                  boxShadow: heroIndex === i ? '0 0 8px rgba(0, 200, 240, 0.6)' : 'none',
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. TRUST / BENEFITS SECTION
          Four-item horizontal section matching reference:
          1. Premium Quality (cyan line icon)
          2. Fast Service (cyan line icon)
          3. Expert Installation (cyan line icon)
          4. Customer Satisfaction (cyan line icon)
          Subtle vertical separators, no overflow on narrow screens.
      ───────────────────────────────────────────────────────────── */}
      <section className="container" style={{ marginTop: 'clamp(14px, 2.5vw, 20px)' }}>
        <div
          className="benefits-bar"
          style={{
            background: 'var(--card-bg, #090D12)',
            border: '1px solid var(--card-border, #1A232E)',
            borderRadius: 14,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Benefit 1: Premium Quality */}
          <div
            className="benefit-item"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '12px 6px',
              textAlign: 'center',
              borderRight: '1px solid var(--divider, #161F2A)',
            }}
          >
            {/* Cyan Line Icon: Shield Check */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cyan, #00C8F0)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <span
              style={{
                color: 'var(--text, #FFFFFF)',
                fontWeight: 700,
                fontSize: 'clamp(9.5px, 2.4vw, 11.5px)',
                lineHeight: 1.25,
                letterSpacing: '0.01em',
              }}
            >
              Premium Quality
            </span>
          </div>

          {/* Benefit 2: Fast Service */}
          <div
            className="benefit-item"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '12px 6px',
              textAlign: 'center',
              borderRight: '1px solid var(--divider, #161F2A)',
            }}
          >
            {/* Cyan Line Icon: Lightning Flash */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cyan, #00C8F0)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span
              style={{
                color: 'var(--text, #FFFFFF)',
                fontWeight: 700,
                fontSize: 'clamp(9.5px, 2.4vw, 11.5px)',
                lineHeight: 1.25,
                letterSpacing: '0.01em',
              }}
            >
              Fast Service
            </span>
          </div>

          {/* Benefit 3: Expert Installation */}
          <div
            className="benefit-item"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '12px 6px',
              textAlign: 'center',
              borderRight: '1px solid var(--divider, #161F2A)',
            }}
          >
            {/* Cyan Line Icon: Wrench / Tool */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cyan, #00C8F0)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
            <span
              style={{
                color: 'var(--text, #FFFFFF)',
                fontWeight: 700,
                fontSize: 'clamp(9.5px, 2.4vw, 11.5px)',
                lineHeight: 1.25,
                letterSpacing: '0.01em',
              }}
            >
              Expert Installation
            </span>
          </div>

          {/* Benefit 4: Customer Satisfaction */}
          <div
            className="benefit-item"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '12px 6px',
              textAlign: 'center',
            }}
          >
            {/* Cyan Line Icon: Star in Badge / Circle */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cyan, #00C8F0)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span
              style={{
                color: 'var(--text, #FFFFFF)',
                fontWeight: 700,
                fontSize: 'clamp(9.5px, 2.4vw, 11.5px)',
                lineHeight: 1.25,
                letterSpacing: '0.01em',
              }}
            >
              Customer Satisfaction
            </span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. SHOP BY CATEGORY
          - Header: "Shop by Category" with "View All →" aligned to right
          - 4 Category Cards: Lighting, Audio, Interior, Exterior
          - Automotive image, dark background, subtle border, rounded corners
          - Category name near bottom
          - Clicking navigates to /shop?category={cat} filtering products
          - Horizontally scrollable on mobile without page overflow
      ───────────────────────────────────────────────────────────── */}
      <section className="container" style={{ marginTop: 'clamp(28px, 5vw, 42px)' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 14,
          }}
        >
          <h2
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(17px, 3.8vw, 22px)',
              margin: 0,
              color: 'var(--text, #FFFFFF)',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
            }}
          >
            SHOP BY CATEGORY
          </h2>

          <Link
            to="/shop"
            style={{
              color: '#00C8F0',
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: '0.04em',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>View All</span>
            <span style={{ fontSize: 14 }}>→</span>
          </Link>
        </div>

        {/* Categories Row (Scrollable horizontally on mobile, 4-col grid on larger screens) */}
        <div
          className="categories-scroll-row"
          style={{
            display: 'flex',
            gap: 12,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
            paddingBottom: 4,
          }}
        >
          {categoryCards.map(cat => (
            <Link
              key={cat.key}
              to={`/shop?category=${cat.key}`}
              className="category-card"
              style={{
                minWidth: 'clamp(130px, 34vw, 180px)',
                flex: '1 0 0',
                background: 'var(--card-bg, #090D12)',
                border: '1px solid var(--card-border, #1A232E)',
                borderRadius: 14,
                overflow: 'hidden',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'all 0.22s ease',
              }}
            >
              {/* Category Automotive Image */}
              <div
                style={{
                  width: '100%',
                  aspectRatio: '4 / 3',
                  position: 'relative',
                  overflow: 'hidden',
                  background: '#0D141D',
                }}
              >
                <img
                  src={cat.img}
                  alt={`${cat.name} accessories`}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.35s ease',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(6,9,13,0.1) 0%, rgba(6,9,13,0.85) 100%)',
                  }}
                />
              </div>

              {/* Category Name near bottom */}
              <div
                style={{
                  padding: '10px 12px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 12.5,
                    color: 'var(--text, #FFFFFF)',
                    letterSpacing: '0.03em',
                  }}
                >
                  {cat.name}
                </span>
                <span style={{ color: '#00C8F0', fontSize: 13, fontWeight: 700 }}>›</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. FEATURED PRODUCTS
          - Header: "Featured Products" with "View All →" aligned to right
          - 2 cards per row on mobile when available width allows (fallback for narrow)
          - Product image, name, category, price in Indian Rupees (₹)
          - Cyan arrow / detail indicator
          - Dark background, thin grey border, rounded corners
          - Uses actual products from Supabase
      ───────────────────────────────────────────────────────────── */}
      <section className="container" style={{ marginTop: 'clamp(28px, 5vw, 42px)' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 14,
          }}
        >
          <h2
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(17px, 3.8vw, 22px)',
              margin: 0,
              color: 'var(--text, #FFFFFF)',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
            }}
          >
            FEATURED PRODUCTS
          </h2>

          <Link
            to="/shop"
            style={{
              color: '#00C8F0',
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: '0.04em',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>View All</span>
            <span style={{ fontSize: 14 }}>→</span>
          </Link>
        </div>

        {/* Products Grid: 2 columns on mobile, 4 columns on desktop */}
        <div className="featured-products-grid">
          {productsLoading ? (
            <div style={{ gridColumn: '1 / -1', padding: '30px 0', textAlign: 'center', color: '#8E9BAE' }}>
              Loading products…
            </div>
          ) : (
            featuredProducts.map(p => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="featured-product-card"
                style={{
                  background: 'var(--card-bg, #090D12)',
                  border: '1px solid var(--card-border, #1A232E)',
                  borderRadius: 14,
                  overflow: 'hidden',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: 0,
                  transition: 'all 0.22s ease',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
                }}
              >
                {/* Product Image */}
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '1 / 1',
                    background: '#0E141C',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      maxWidth: 'calc(100% - 12px)',
                      background: 'rgba(7, 10, 14, 0.85)',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid #1E2834',
                      padding: '2px 6px',
                      borderRadius: 999,
                      fontSize: 9,
                      fontWeight: 800,
                      color: '#00C8F0',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {p.category}
                  </div>
                </div>

                {/* Product Details */}
                <div
                  style={{
                    padding: 'clamp(8px, 2.2vw, 12px)',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    minWidth: 0,
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    {/* Category */}
                    <div
                      style={{
                        fontSize: 9,
                        color: 'var(--text-muted, #8E9BAE)',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        marginBottom: 3,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {p.category}
                    </div>

                    {/* Product Name */}
                    <div
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 800,
                        fontSize: 'clamp(11px, 2.6vw, 13px)',
                        color: 'var(--text, #FFFFFF)',
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        wordBreak: 'break-word',
                      }}
                    >
                      {p.title || p.name}
                    </div>
                  </div>

                  {/* Price in Indian Rupees + Cyan Arrow Indicator */}
                  <div
                    style={{
                      marginTop: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 6,
                      paddingTop: 8,
                      borderTop: '1px solid var(--divider, #141C25)',
                      minWidth: 0,
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      {p.contact_for_price || p.price === null ? (
                        <span style={{ color: 'var(--gold, #D69A13)', fontWeight: 800, fontSize: 'clamp(10px, 2.4vw, 11.5px)', whiteSpace: 'nowrap' }}>
                          Contact
                        </span>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, flexWrap: 'wrap', minWidth: 0 }}>
                          <span style={{ color: 'var(--cyan, #00C8F0)', fontWeight: 900, fontSize: 'clamp(12px, 3vw, 14px)', whiteSpace: 'nowrap' }}>
                            {formatINR(p.price)}
                          </span>
                          {p.mrp && (
                            <span style={{ color: 'var(--text-muted2, #687280)', fontSize: 'clamp(8.5px, 2vw, 10px)', textDecoration: 'line-through', whiteSpace: 'nowrap' }}>
                              {formatINR(p.mrp)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Cyan Arrow / Detail Indicator Button */}
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        background: 'rgba(0, 200, 240, 0.12)',
                        border: '1px solid rgba(0, 200, 240, 0.35)',
                        color: '#00C8F0',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 12,
                        fontWeight: 900,
                        flexShrink: 0,
                      }}
                    >
                      →
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. RECENT WORK & PORTFOLIO (PRESERVED)
      ───────────────────────────────────────────────────────────── */}
      <section className="container recent-work-section car-showcase-section" style={{ marginTop: 'clamp(32px, 6vw, 48px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ color: '#00C8F0', fontWeight: 800, fontSize: 11, letterSpacing: '0.14em' }}>OUR WORKMANSHIP</div>
            <div className="sec-title" style={{ fontSize: 'clamp(18px, 4vw, 24px)', marginTop: 4 }}>
              RECENT WORK AT <span style={{ color: '#00C8F0' }}>LEE CAR ACCESSORIES</span>
            </div>
          </div>
          <Link to="/gallery" className="btn-cyan" style={{ padding: '8px 18px', fontSize: 11, minHeight: 38 }}>
            VIEW GALLERY →
          </Link>
        </div>

        <div className="recent-grid-4">
          {recentWork.map((src, i) => (
            <div
              key={i}
              className="recent-work-card"
              style={{
                borderRadius: 14,
                overflow: 'hidden',
                border: '1px solid var(--card-border, #1A232E)',
                aspectRatio: '4/3',
                position: 'relative',
                minWidth: 0,
              }}
            >
              <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`Recent work ${i + 1}`} loading="lazy" />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(0deg, rgba(6,9,13,0.7) 0%, transparent 60%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 8,
                  left: 8,
                  right: 8,
                  fontSize: 'clamp(9px, 2.2vw, 11px)',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                ECR Store Fitment
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. CUSTOMER REVIEWS (PRESERVED)
      ───────────────────────────────────────────────────────────── */}
      <section className="container" style={{ marginTop: 'clamp(32px, 6vw, 48px)' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 16,
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div style={{ color: '#00C8F0', fontWeight: 800, fontSize: 11, letterSpacing: '0.14em' }}>
              CUSTOMER REVIEWS
            </div>
            <div className="sec-title" style={{ fontSize: 'clamp(18px, 4vw, 24px)', marginTop: 4 }}>
              WHAT DRIVERS <span style={{ color: '#00C8F0' }}>SAY ABOUT US</span>
            </div>
          </div>
          <Link to="/reviews" className="btn-gold" style={{ padding: '8px 18px', fontSize: 11, minHeight: 38 }}>
            ALL REVIEWS ({businessInfo.reviewCount}+)
          </Link>
        </div>

        <ReviewCarousel />
      </section>

      {/* Scoped CSS for responsive grids and cards */}
      <style>{`
        .featured-products-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(8px, 2.5vw, 16px);
          align-items: start;
        }
        .recent-grid-4 {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(8px, 2.5vw, 16px);
          align-items: start;
        }
        @media (min-width: 900px) {
          .featured-products-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 18px;
          }
          .recent-grid-4 {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 18px;
          }
          .categories-scroll-row {
            display: grid !important;
            grid-template-columns: repeat(4, 1fr) !important;
            overflow-x: visible !important;
          }
        }
        @media (max-width: 340px) {
          .benefits-bar {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .benefit-item:nth-child(2) {
            border-right: none !important;
          }
          .benefit-item:nth-child(1),
          .benefit-item:nth-child(2) {
            border-bottom: 1px solid #161F2A;
          }
        }
        .featured-product-card:hover {
          border-color: #00C8F0 !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 200, 240, 0.15) !important;
        }
        .category-card:hover {
          border-color: #00C8F0 !important;
          transform: translateY(-2px);
        }
        .featured-product-card:hover img,
        .category-card:hover img {
          transform: scale(1.04);
        }
      `}</style>
    </div>
  )
}
