import { Link } from 'react-router-dom'
import { products, recentWork, businessInfo, reviews } from '../data/mockData'
import { useRef } from 'react'

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
            style={{
              width: 'min(320px, calc(100vw - 64px))',
              minWidth: 'min(280px, calc(100vw - 64px))',
              flexShrink: 0,
              scrollSnapAlign: 'start',
              background: '#090D11',
              border: '1px solid #1C232B',
              borderRadius: 16,
              padding: '18px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxSizing: 'border-box'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', minWidth: 0 }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: '#0D1217',
                    border: '1px solid #1E2A33',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 900,
                    fontSize: 12,
                    color: '#11BCE6',
                    flexShrink: 0
                  }}>
                    {r.name.charAt(0)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {r.name}
                    </div>
                    <div style={{ fontSize: 10, color: '#687078', display: 'flex', gap: 4, alignItems: 'center', marginTop: 2 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22 12c0-.6-.1-1.2-.2-1.7H12v3.4h5.6c-.2 1.3-.9 2.4-1.9 3.1v2.6h3.1c1.8-1.7 2.8-4.1 2.8-7.4z" />
                        <path fill="#34A853" d="M12 22c2.7 0 5-0.9 6.7-2.4l-3.1-2.6c-.9.6-2 0.9-3.6 0.9-2.8 0-5.1-1.9-5.9-4.4H2 v2.7C3.7 19.8 7.6 22 12 22z" />
                        <path fill="#FBBC05" d="M6.1 13.5c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V7H2c-.7 1.4-1 3-1 4.6s.3 3.2 1 4.6l4.1-2.7z" />
                        <path fill="#EA4335" d="M12 6.4c1.5 0 2.8.5 3.8 1.4l2.9-2.9C17 3.4 14.7 2 12 2 7.6 2 3.7 4.2 2 8.0l4.1 2.7c.8-2.5 3.1-4.3 5.9-4.3z" />
                      </svg>
                      <span>Google · {r.date}</span>
                    </div>
                  </div>
                </div>
                <span style={{ color: '#D69A13', fontSize: 12, letterSpacing: '0.04em', flexShrink: 0 }}>
                  {'★'.repeat(r.rating)}
                </span>
              </div>

              {r.serviceTag && (
                <div style={{ marginTop: 10 }}>
                  <span style={{
                    display: 'inline-block',
                    background: 'rgba(17,188,230,0.08)',
                    border: '1px solid rgba(17,188,230,0.22)',
                    color: '#11BCE6',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 999
                  }}>
                    {r.serviceTag}
                  </span>
                </div>
              )}

              <p style={{
                fontSize: 12,
                lineHeight: 1.6,
                color: '#A0A7AE',
                marginTop: 10,
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                "{r.text}"
              </p>
            </div>

            <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #141B22', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 10, color: '#11BCE6', fontWeight: 800 }}>VERIFIED CUSTOMER ✓</span>
              <span style={{ fontSize: 10, color: '#687078' }}>ECR Junction Store</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 12 }}>
        <button
          onClick={() => scroll(-1)}
          aria-label="Previous Review"
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: '#0D1217',
            border: '1px solid #1E2A33',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            color: '#FFFFFF',
            fontSize: 16
          }}
        >
          ‹
        </button>
        <button
          onClick={() => scroll(1)}
          aria-label="Next Review"
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: '#0D1217',
            border: '1px solid #1E2A33',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            color: '#FFFFFF',
            fontSize: 16
          }}
        >
          ›
        </button>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      {/* HERO SECTION */}
      <section className="container" style={{ marginTop: 16 }}>
        <div className="hero-grid" style={{
          background: 'linear-gradient(135deg, #0A0F14 0%, #0D1217 100%)',
          border: '1px solid #1C232B',
          borderRadius: 18,
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div className="hero-content">
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(17,188,230,0.08)',
              border: '1px solid rgba(17,188,230,0.22)',
              borderRadius: 999,
              padding: '6px 12px',
              width: 'fit-content',
              marginBottom: 14
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#11BCE6' }}></span>
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', color: '#11BCE6' }}>
                RAMANATHAPURAM'S #1 CUSTOM STORE
              </span>
            </div>

            <h1 className="sec-title hero-title" style={{ fontSize: 'clamp(28px, 5.2vw, 54px)', margin: 0, lineHeight: 1.02 }}>
              <span style={{ display: 'block', color: '#FFFFFF' }}>UPGRADE</span>
              <span style={{ display: 'block', color: '#11BCE6' }}>YOUR DRIVE</span>
            </h1>

            <p style={{ color: '#A0A7AE', fontSize: 13, marginTop: 14, maxWidth: 420, lineHeight: 1.65 }}>
              Expert car accessories & luxury customization at ECR Junction. From leather seat covers to high-power LED headlights and touchscreen Android stereos.
            </p>

            <div className="hero-buttons">
              <Link to="/services" className="btn-cyan">EXPLORE SERVICES →</Link>
              <Link to="/shop" className="btn-gold">SHOP ACCESSORIES</Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 22, flexWrap: 'wrap' }}>
              <span style={{ color: '#D69A13', fontSize: 13 }}>★★★★★</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#FFFFFF' }}>{businessInfo.rating} / 5.0</span>
              <span style={{ fontSize: 11, color: '#687078' }}>· Based on ~{businessInfo.reviewCount} Google reviews</span>
            </div>
          </div>

          <div className="hero-img" style={{ position: 'relative', overflow: 'hidden', minHeight: 280 }}>
            <img
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&h=800&fit=crop"
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.92 }}
              alt="Lee Car Accessories Custom Luxury Car"
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, #0A0F14 0%, transparent 40%, transparent 100%), linear-gradient(0deg, rgba(5,7,8,0.4), transparent 50%)'
            }} />
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="container" style={{ marginTop: 20 }}>
        <div className="stats-row-4" style={{ background: '#090D11', border: '1px solid #1C232B', borderRadius: 14, overflow: 'hidden' }}>
          {[
            { icon: '★', label: '4.8 / 5 GOOGLE RATING', sub: `~${businessInfo.reviewCount} Verified Reviews` },
            { icon: '◈', label: '10+ YEARS EXPERIENCE', sub: 'Ramanathapuram Specialists' },
            { icon: '♥', label: '500+ HAPPY CAR OWNERS', sub: 'Swift, Creta, Thar, Scorpio' },
            { icon: '⬢', label: '100% COUPLER FITTING', sub: 'No Wire Cutting Guarantee' },
          ].map((s, i) => (
            <div key={s.label} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '18px 20px',
              borderRight: i < 3 ? '1px solid #1C232B' : 'none'
            }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: '#0D1217',
                border: '1px solid #1E2A33',
                display: 'grid',
                placeItems: 'center',
                color: '#11BCE6',
                fontSize: 14,
                flexShrink: 0
              }}>{s.icon}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 11, letterSpacing: '0.06em' }}>{s.label}</div>
                <div style={{ fontSize: 11, color: '#687078', marginTop: 2 }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="container" style={{ marginTop: 44 }}>
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ color: '#11BCE6', fontWeight: 800, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            FIND YOUR PERFECT UPGRADE
          </div>
          <div className="sec-title" style={{ fontSize: 'clamp(20px, 4vw, 26px)', marginTop: 4 }}>
            WHAT ARE YOU <span style={{ color: '#11BCE6' }}>LOOKING FOR?</span>
          </div>
          <div style={{ color: '#687078', fontSize: 12, marginTop: 6 }}>
            Top automotive categories tailored for your vehicle
          </div>
        </div>

        <div className="category-grid-5">
          {[
            { title: 'LIGHTING', sub: 'LED & Bi-Projector', icon: '☀' },
            { title: 'INTERIOR', sub: 'Seat Covers & 7D Mats', icon: '◈' },
            { title: 'AUDIO & CARPLAY', sub: 'Android Stereo & Sub', icon: '♫' },
            { title: 'EXTERIOR', sub: 'Roof Rails & Spoilers', icon: '⬢' },
            { title: 'SAFETY TECH', sub: '4K Dashcam & Sensors', icon: '✦' },
          ].map(c => (
            <Link
              key={c.title}
              to="/shop"
              style={{
                background: '#090D11',
                border: '1px solid #1C232B',
                borderRadius: 14,
                padding: '22px 16px',
                textAlign: 'center',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
              className="hover-card"
            >
              <div style={{
                width: 44,
                height: 44,
                margin: '0 auto 12px',
                borderRadius: 12,
                background: '#0D1217',
                border: '1px solid #1E2A33',
                display: 'grid',
                placeItems: 'center',
                color: '#11BCE6',
                fontSize: 18
              }}>
                {c.icon}
              </div>
              <div style={{ fontWeight: 800, fontSize: 12, letterSpacing: '0.06em' }}>{c.title}</div>
              <div style={{ fontSize: 11, color: '#687078', marginTop: 4 }}>{c.sub}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* RECENT WORK GALLERY PREVIEW */}
      <section className="container" style={{ marginTop: 44 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 18, gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ color: '#11BCE6', fontWeight: 800, fontSize: 11, letterSpacing: '0.16em' }}>OUR PORTFOLIO</div>
            <div className="sec-title" style={{ fontSize: 'clamp(20px, 4vw, 24px)', marginTop: 4 }}>
              RECENT WORK AT <span style={{ color: '#11BCE6' }}>LEE CAR ACCESSORIES</span>
            </div>
          </div>
          <Link to="/gallery" className="btn-gold" style={{ padding: '10px 20px', fontSize: 11 }}>
            VIEW FULL GALLERY →
          </Link>
        </div>

        <div className="recent-grid-4">
          {recentWork.map((src, i) => (
            <div key={i} style={{
              borderRadius: 14,
              overflow: 'hidden',
              border: '1px solid #1C232B',
              aspectRatio: '4/3',
              position: 'relative'
            }}>
              <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`Recent work ${i + 1}`} loading="lazy" />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(0deg, rgba(5,7,8,0.7) 0%, transparent 60%)'
              }} />
              <div style={{ position: 'absolute', bottom: 10, left: 12, fontSize: 11, fontWeight: 700, color: '#FFFFFF' }}>
                SK Complex ECR Fitment
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* POPULAR REALISTIC PRODUCTS */}
      <section className="container" style={{ marginTop: 46 }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ color: '#11BCE6', fontWeight: 800, fontSize: 11, letterSpacing: '0.16em' }}>TOP PICKS</div>
          <div className="sec-title" style={{ fontSize: 'clamp(20px, 4vw, 26px)', marginTop: 4 }}>
            POPULAR <span style={{ color: '#11BCE6' }}>PRODUCTS</span>
          </div>
          <div style={{ color: '#687078', fontSize: 12, marginTop: 6 }}>
            Genuine automotive components installed at our Ramanathapuram shop
          </div>
        </div>

        <div className="product-grid-4">
          {products.slice(0, 4).map(p => (
            <div key={p.id} className="product-card">
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
                <div className="product-card-desc">{p.desc}</div>

                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <div>
                    {p.contactForPrice ? (
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
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
          <Link to="/shop" className="btn-gold" style={{ padding: '12px 28px' }}>
            VIEW ALL PRODUCTS & ACCESSORIES →
          </Link>
        </div>
      </section>

      {/* CUSTOMER REVIEWS SECTION (REQUIREMENT 5) */}
      <section className="container" style={{ marginTop: 48 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: 16,
          gap: 12,
          flexWrap: 'wrap'
        }}>
          <div>
            <div style={{ color: '#11BCE6', fontWeight: 800, fontSize: 11, letterSpacing: '0.16em' }}>
              CUSTOMER REVIEWS
            </div>
            <div className="sec-title" style={{ fontSize: 'clamp(20px, 4vw, 26px)', marginTop: 4 }}>
              WHAT OUR <span style={{ color: '#11BCE6' }}>CUSTOMERS SAY</span>
            </div>
          </div>
          <Link to="/reviews" className="btn-gold" style={{ padding: '10px 20px', fontSize: 11 }}>
            VIEW ALL REVIEWS ({businessInfo.reviewCount}+)
          </Link>
        </div>

        {/* Real Google Rating Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 18,
          flexWrap: 'wrap',
          background: '#090D11',
          border: '1px solid #1C232B',
          borderRadius: 12,
          padding: '10px 16px',
          width: 'fit-content',
          maxWidth: '100%'
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#0D1217',
            border: '1px solid #1E2A33',
            padding: '4px 10px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 800
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22 12c0-.6-.1-1.2-.2-1.7H12v3.4h5.6c-.2 1.3-.9 2.4-1.9 3.1v2.6h3.1c1.8-1.7 2.8-4.1 2.8-7.4z" />
              <path fill="#34A853" d="M12 22c2.7 0 5-0.9 6.7-2.4l-3.1-2.6c-.9.6-2 0.9-3.6 0.9-2.8 0-5.1-1.9-5.9-4.4H2 v2.7C3.7 19.8 7.6 22 12 22z" />
              <path fill="#FBBC05" d="M6.1 13.5c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V7H2c-.7 1.4-1 3-1 4.6s.3 3.2 1 4.6l4.1-2.7z" />
              <path fill="#EA4335" d="M12 6.4c1.5 0 2.8.5 3.8 1.4l2.9-2.9C17 3.4 14.7 2 12 2 7.6 2 3.7 4.2 2 8.0l4.1 2.7c.8-2.5 3.1-4.3 5.9-4.3z" />
            </svg>
            Google
          </span>
          <span style={{ fontWeight: 900, fontSize: 16, color: '#FFFFFF' }}>{businessInfo.rating.toFixed(1)} / 5</span>
          <span style={{ color: '#D69A13', fontSize: 14 }}>★★★★★</span>
          <span style={{ fontSize: 11, color: '#A0A7AE' }}>
            Based on ~{businessInfo.reviewCount} verified reviews for Lee Car Accessories, Ramanathapuram
          </span>
        </div>

        {/* Carousel */}
        <ReviewCarousel />

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18, gap: 12, flexWrap: 'wrap' }}>
          <a
            href={businessInfo.googleReviewsUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-cyan"
            style={{ padding: '12px 24px' }}
          >
            VIEW ON GOOGLE →
          </a>
          <Link
            to="/reviews"
            className="btn-gold"
            style={{ padding: '12px 24px' }}
          >
            READ ALL {businessInfo.reviewCount} REVIEWS
          </Link>
        </div>
      </section>

      {/* BOOK AN INSTALLATION CTA BANNER */}
      <section className="container" style={{ marginTop: 36 }}>
        <div className="banner-grid" style={{
          background: 'linear-gradient(135deg, #0A0F14 0%, #0D1217 100%)',
          border: '1px solid #1C232B',
          borderRadius: 18,
          overflow: 'hidden'
        }}>
          <div style={{ padding: '32px 28px' }}>
            <div style={{ color: '#D69A13', fontWeight: 800, fontSize: 11, letterSpacing: '0.14em' }}>
              PROFESSIONAL FITMENT GUARANTEE
            </div>
            <div className="sec-title" style={{ fontSize: 'clamp(20px, 4vw, 24px)', marginTop: 6 }}>
              BOOK YOUR <span style={{ color: '#11BCE6' }}>INSTALLATION</span>
            </div>
            <div style={{ fontSize: 12, color: '#A0A7AE', marginTop: 8, lineHeight: 1.65, maxWidth: 440 }}>
              Visit our store at No. 01, SK Complex, ECR Junction, Ramanathapuram. Coupler-to-coupler installation without tampering factory wiring or car warranty.
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
              <Link to="/booking" className="btn-cyan">BOOK APPOINTMENT →</Link>
              <a href={businessInfo.whatsappHref} target="_blank" rel="noreferrer" className="btn-gold">WHATSAPP US</a>
            </div>
          </div>
          <div style={{ height: '100%', minHeight: 180, overflow: 'hidden' }}>
            <img
              src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=500&fit=crop"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              alt="Installation at Lee Car Accessories"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* FEATURE BAR */}
      <section className="container" style={{ marginTop: 20 }}>
        <div className="feature-row-4" style={{ background: '#090D11', border: '1px solid #1C232B', borderRadius: 14, overflow: 'hidden' }}>
          {[
            { t: 'GENUINE PRODUCTS', d: 'Guaranteed authentic parts', i: '◆' },
            { t: 'EXPERT FITMENT', d: 'Certified skilled mechanics', i: '⚙' },
            { t: 'COUPLER TO COUPLER', d: 'Zero factory wire cut', i: '✦' },
            { t: 'STORE WARRANTY', d: 'Assured service support', i: '🛡' },
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
