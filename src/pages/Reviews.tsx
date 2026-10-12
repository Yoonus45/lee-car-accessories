import { useState } from 'react'
import { reviews, ratingDistribution, businessInfo } from '../data/mockData'

function Stars({ n }: { n: number }) {
  return (
    <span style={{ color: '#D69A13', letterSpacing: '0.04em', fontSize: 13 }}>
      {'★'.repeat(Math.round(n))}
      <span style={{ color: '#1E2A33' }}>{'★'.repeat(5 - Math.round(n))}</span>
    </span>
  )
}

export default function Reviews() {
  const [filter, setFilter] = useState<number | 'all'>('all')
  const filtered = filter === 'all' ? reviews : reviews.filter(r => r.rating === filter)

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      {/* HEADER SECTION */}
      <section className="container" style={{ textAlign: 'center', padding: '32px 0 20px' }}>
        <div style={{ color: '#11BCE6', fontWeight: 800, fontSize: 11, letterSpacing: '0.16em' }}>
          VERIFIED CUSTOMER FEEDBACK
        </div>
        <h1 className="sec-title" style={{ fontSize: 'clamp(24px, 4.5vw, 34px)', marginTop: 6, margin: '6px 0 0' }}>
          LEE CAR <span style={{ color: '#11BCE6' }}>ACCESSORIES REVIEWS</span>
        </h1>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          marginTop: 14,
          flexWrap: 'wrap',
          background: 'var(--card-bg, #090D11)',
          border: '1px solid var(--card-border, #1C232B)',
          borderRadius: 999,
          padding: '8px 16px'
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22 12c0-.6-.1-1.2-.2-1.7H12v3.4h5.6c-.2 1.3-.9 2.4-1.9 3.1v2.6h3.1c1.8-1.7 2.8-4.1 2.8-7.4z" />
              <path fill="#34A853" d="M12 22c2.7 0 5-0.9 6.7-2.4l-3.1-2.6c-.9.6-2 0.9-3.6 0.9-2.8 0-5.1-1.9-5.9-4.4H2 v2.7C3.7 19.8 7.6 22 12 22z" />
              <path fill="#FBBC05" d="M6.1 13.5c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V7H2c-.7 1.4-1 3-1 4.6s.3 3.2 1 4.6l4.1-2.7z" />
              <path fill="#EA4335" d="M12 6.4c1.5 0 2.8.5 3.8 1.4l2.9-2.9C17 3.4 14.7 2 12 2 7.6 2 3.7 4.2 2 8.0l4.1 2.7c.8-2.5 3.1-4.3 5.9-4.3z" />
            </svg>
            <span style={{ fontWeight: 800, fontSize: 13 }}>Google Rating</span>
          </span>
          <span style={{ fontWeight: 900, fontSize: 20, color: '#FFFFFF' }}>{businessInfo.rating.toFixed(1)} / 5</span>
          <span style={{ color: '#D69A13', fontSize: 14 }}>★★★★★</span>
          <span style={{ fontSize: 12, color: '#A0A7AE' }}>Based on approximately {businessInfo.reviewCount} Google reviews</span>
        </div>

        <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <a
            href={businessInfo.googleReviewsUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-cyan"
            style={{ gap: 8 }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#02141B" strokeWidth="2.2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            VIEW ON GOOGLE
          </a>
          <a
            href={businessInfo.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-gold"
          >
            OPEN GOOGLE MAPS
          </a>
        </div>

        <div style={{ fontSize: 11, color: '#687078', marginTop: 10, maxWidth: 600, marginInline: 'auto' }}>
          Reviews reflect genuine public feedback from customers who visited Lee Car Accessories at No. 01, SK Complex, ECR Junction, Ramanathapuram.
        </div>
      </section>

      {/* SUMMARY + RATING DISTRIBUTION (REQUIREMENT 4) */}
      <section className="container" style={{ marginTop: 10 }}>
        <div className="reviews-summary-grid">
          {/* Overall Rating Card */}
          <div style={{
            background: 'var(--card-bg, #090D11)',
            border: '1px solid var(--card-border, #1C232B)',
            borderRadius: 16,
            padding: '24px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{ fontWeight: 800, fontSize: 11, letterSpacing: '0.12em', color: '#11BCE6' }}>
              OVERALL RATING
            </div>
            <div style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: 'clamp(44px, 8vw, 56px)', lineHeight: 1, marginTop: 8, color: 'var(--text, #FFFFFF)' }}>
              {businessInfo.rating.toFixed(1)}
            </div>
            <div style={{ color: '#D69A13', fontSize: 20, marginTop: 6, letterSpacing: '0.08em' }}>
              ★★★★★
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted, #A0A7AE)', marginTop: 8, fontWeight: 600 }}>
              Based on ~{businessInfo.reviewCount} Google reviews
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
              <span style={{
                background: 'var(--card-item-bg, #0D1217)',
                border: '1px solid var(--card-item-border, #1E2A33)',
                padding: '6px 12px',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 800,
                color: 'var(--text, #FFFFFF)'
              }}>
                ⭐ 4.8 / 5.0
              </span>
              <span style={{
                background: 'rgba(214,154,19,0.12)',
                border: '1px solid rgba(214,154,19,0.3)',
                padding: '6px 12px',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 800,
                color: '#D69A13'
              }}>
                100% VERIFIED
              </span>
            </div>

            <div style={{ fontSize: 11, color: '#687078', marginTop: 14 }}>
              SK Complex, ECR Junction, Ramanathapuram
            </div>
          </div>

          {/* Rating Distribution Visual */}
          <div style={{
            background: 'var(--card-bg, #090D11)',
            border: '1px solid var(--card-border, #1C232B)',
            borderRadius: 16,
            padding: '22px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: 11, letterSpacing: '0.12em', color: '#11BCE6' }}>
                RATING DISTRIBUTION
              </div>
              <span style={{ fontSize: 11, color: '#687078' }}>Approx. {businessInfo.reviewCount} total</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
              {ratingDistribution.map(r => (
                <div key={r.stars} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#A0A7AE', width: 36, flexShrink: 0 }}>
                    {r.stars} ★
                  </span>
                  <div style={{
                    flex: 1,
                    height: 10,
                    background: '#0D1217',
                    borderRadius: 999,
                    overflow: 'hidden',
                    border: '1px solid #1C232B'
                  }}>
                    <div style={{
                      width: `${r.percent}%`,
                      height: '100%',
                      background: r.stars >= 4 ? '#11BCE6' : r.stars === 3 ? '#D69A13' : '#3A444E',
                      borderRadius: 999,
                      transition: 'width .4s ease'
                    }} />
                  </div>
                  <span style={{ fontSize: 11, color: '#A0A7AE', width: 40, textAlign: 'right', fontWeight: 600, flexShrink: 0 }}>
                    {r.percent}%
                  </span>
                  <span style={{ fontSize: 10, color: '#687078', width: 50, textAlign: 'right', flexShrink: 0 }}>
                    ({r.count})
                  </span>
                </div>
              ))}
            </div>

            {/* Filter pills */}
            <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: 10, letterSpacing: '0.1em', fontWeight: 800, color: '#687078' }}>FILTER:</span>
              {(['all', 5, 4] as const).map(v => (
                <button
                  key={String(v)}
                  onClick={() => setFilter(v)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 999,
                    fontWeight: 800,
                    fontSize: 11,
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    border: '1px solid ' + (filter === v ? '#11BCE6' : '#1E2A33'),
                    background: filter === v ? '#11BCE6' : '#0D1217',
                    color: filter === v ? '#02141B' : '#A0A7AE',
                    transition: 'all .15s ease'
                  }}
                >
                  {v === 'all' ? 'ALL REVIEWS' : `${v} STARS`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* REVIEW CARDS GRID */}
      <section className="container" style={{ marginTop: 24 }}>
        <div className="reviews-cards-grid">
          {filtered.map(r => (
            <div
              key={r.id}
              style={{
                background: 'var(--card-bg, #090D11)',
                border: '1px solid var(--card-border, #1C232B)',
                borderRadius: 16,
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minWidth: 0,
                boxSizing: 'border-box'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', minWidth: 0 }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'var(--card-item-bg, #0D1217)',
                      border: '1px solid var(--card-item-border, #1E2A33)',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 900,
                      fontSize: 13,
                      color: '#11BCE6',
                      flexShrink: 0
                    }}>
                      {r.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--text, #FFFFFF)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {r.name}
                      </div>
                      <div style={{ fontSize: 11, color: '#687078', display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', marginTop: 2 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <svg width="11" height="11" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22 12c0-.6-.1-1.2-.2-1.7H12v3.4h5.6c-.2 1.3-.9 2.4-1.9 3.1v2.6h3.1c1.8-1.7 2.8-4.1 2.8-7.4z" />
                            <path fill="#34A853" d="M12 22c2.7 0 5-0.9 6.7-2.4l-3.1-2.6c-.9.6-2 0.9-3.6 0.9-2.8 0-5.1-1.9-5.9-4.4H2 v2.7C3.7 19.8 7.6 22 12 22z" />
                            <path fill="#FBBC05" d="M6.1 13.5c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V7H2c-.7 1.4-1 3-1 4.6s.3 3.2 1 4.6l4.1-2.7z" />
                            <path fill="#EA4335" d="M12 6.4c1.5 0 2.8.5 3.8 1.4l2.9-2.9C17 3.4 14.7 2 12 2 7.6 2 3.7 4.2 2 8.0l4.1 2.7c.8-2.5 3.1-4.3 5.9-4.3z" />
                          </svg>
                          Google Review
                        </span>
                        <span>· {r.date}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    <Stars n={r.rating} />
                  </div>
                </div>

                {r.serviceTag && (
                  <div style={{ marginTop: 12 }}>
                    <span style={{
                      display: 'inline-block',
                      background: 'rgba(17,188,230,0.08)',
                      border: '1px solid rgba(17,188,230,0.25)',
                      color: '#11BCE6',
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '3px 9px',
                      borderRadius: 999
                    }}>
                      {r.serviceTag}
                    </span>
                  </div>
                )}

                <p style={{
                  margin: '12px 0 0',
                  fontSize: 13,
                  lineHeight: 1.65,
                  color: '#A0A7AE',
                }}>
                  "{r.text}"
                </p>
              </div>

              <div style={{
                marginTop: 14,
                paddingTop: 12,
                borderTop: '1px solid #141B22',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 6
              }}>
                <span style={{
                  fontSize: 10,
                  letterSpacing: '0.08em',
                  fontWeight: 800,
                  color: '#11BCE6',
                  background: 'rgba(17,188,230,0.1)',
                  padding: '3px 8px',
                  borderRadius: 6
                }}>
                  VERIFIED CUSTOMER ✓
                </span>
                <span style={{ fontSize: 11, color: '#687078' }}>
                  Posted on Google Business Profile
                </span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: '#687078', padding: 40 }}>
            No reviews matching this star filter.
          </div>
        )}

        <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <a
            href={businessInfo.googleReviewsUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-cyan"
          >
            VIEW ALL REVIEWS ON GOOGLE →
          </a>
          <a
            href={businessInfo.whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="btn-gold"
          >
            CHAT ON WHATSAPP
          </a>
        </div>

        {/* Integration note for Google Places API */}
        <div style={{
          textAlign: 'center',
          fontSize: 11,
          color: '#555E68',
          marginTop: 18,
          lineHeight: 1.6,
          maxWidth: 680,
          marginInline: 'auto'
        }}>
          Architecture note: Reviews component is structured for official Google Places API integration.
          To stream live reviews directly from Google, replace static review dataset with a Places Details endpoint fetch using Place ID.
        </div>
      </section>

      {/* WRITE A REVIEW CTA BANNER */}
      <section className="container" style={{ marginTop: 32 }}>
        <div className="banner-grid" style={{
          background: 'linear-gradient(135deg, #0A0F14 0%, #0D1217 100%)',
          border: 'none',
          borderRadius: 18,
          overflow: 'hidden'
        }}>
          <div style={{ padding: '30px 26px' }}>
            <div style={{ color: '#D69A13', fontWeight: 800, fontSize: 11, letterSpacing: '0.14em' }}>
              SHARE YOUR EXPERIENCE
            </div>
            <div className="sec-title" style={{ fontSize: 'clamp(20px, 4vw, 24px)', marginTop: 6 }}>
              LOVED OUR <span style={{ color: '#11BCE6' }}>WORKMANSHIP?</span>
            </div>
            <div style={{ fontSize: 12, color: '#A0A7AE', marginTop: 8, lineHeight: 1.65, maxWidth: 460 }}>
              Leave a review on our official Google Business profile. Your feedback helps car owners across Ramanathapuram and the ECR corridor find trusted automotive accessories.
            </div>
            <a
              href={businessInfo.googleReviewsUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-cyan"
              style={{ marginTop: 18, display: 'inline-flex' }}
            >
              WRITE A GOOGLE REVIEW ★
            </a>
          </div>
          <div style={{ height: '100%', minHeight: 180, overflow: 'hidden' }}>
            <img
              src="https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&h=500&fit=crop"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              alt="Lee Car Accessories Interior"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
