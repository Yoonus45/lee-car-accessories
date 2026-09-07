import { useState, useEffect, useMemo } from 'react'
import { businessInfo } from '../data/mockData'
import { supabase } from '../lib/supabase'
import seatLogo from '../assets/primary_seat_logo.png'
import type { DbGalleryItem } from '../types/database'

interface SeatCoverForm {
  full_name: string
  phone: string
  email: string
  car_brand: string
  car_model: string
  car_year: string
  preferred_date: string
  preferred_time: string
  seat_cover_type: string
  material_preference: string
  colour_preference: string
  notes: string
}

const initialForm: SeatCoverForm = {
  full_name: '',
  phone: '',
  email: '',
  car_brand: '',
  car_model: '',
  car_year: '',
  preferred_date: '',
  preferred_time: '',
  seat_cover_type: 'Custom Bucket Fit',
  material_preference: 'Premium Durable Finish',
  colour_preference: 'Classic Black',
  notes: '',
}

const DEFAULT_SEAT_CATEGORIES = [
  'ALL',
  'Custom Fit',
  'Before & After',
  'Luxury Leather',
  'Dual Tone',
  'Classic Luxury',
  'Sport Stitching',
  'Bucket Fit',
] as const

export default function SeatCovers() {
  const [activeCategory, setActiveCategory] = useState<string>('ALL')
  const [galleryItems, setGalleryItems] = useState<DbGalleryItem[]>([])
  const [galleryLoading, setGalleryLoading] = useState(true)
  const [form, setForm] = useState<SeatCoverForm>(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    fetchSeatGallery()
  }, [])

  async function fetchSeatGallery() {
    setGalleryLoading(true)
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('gallery_type', 'seat_cover')
        .eq('published', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) {
        console.warn('[SeatCovers] Gallery fetch notice:', error.message)
      } else if (data) {
        setGalleryItems(data)
      }
    } catch (err) {
      console.warn('[SeatCovers] Could not fetch seat gallery:', err)
    } finally {
      setGalleryLoading(false)
    }
  }

  // Derive categories list dynamically
  const categoriesList = useMemo(() => {
    const set = new Set<string>(['ALL'])
    DEFAULT_SEAT_CATEGORIES.forEach(c => set.add(c))
    galleryItems.forEach(i => {
      if (i.category) set.add(i.category)
    })
    return Array.from(set)
  }, [galleryItems])

  const filteredGallery = useMemo(() => {
    if (activeCategory === 'ALL') return galleryItems
    return galleryItems.filter(
      item => item.category.toLowerCase() === activeCategory.toLowerCase()
    )
  }, [galleryItems, activeCategory])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.full_name.trim() || !form.phone.trim() || !form.car_model.trim()) {
      alert('Please fill in your name, phone number, and car model.')
      return
    }

    setSubmitting(true)
    setSubmitError(null)

    const payload = {
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      car_brand: form.car_brand.trim() || null,
      car_model: form.car_model.trim(),
      car_year: form.car_year.trim() || null,
      preferred_date: form.preferred_date || null,
      preferred_time: form.preferred_time || null,
      seat_cover_type: form.seat_cover_type || null,
      material_preference: form.material_preference || null,
      colour_preference: form.colour_preference || null,
      notes: form.notes.trim() || null,
      status: 'pending' as const,
    }

    const { error } = await supabase
      .from('seat_cover_appointments')
      .insert(payload)

    setSubmitting(false)

    if (error) {
      console.warn('[SeatCovers] Supabase insert note:', error.message)
      // If table is not yet created in user database, show graceful informative error with direct WhatsApp link
      setSubmitError('Could not record appointment online right now. Please tap WhatsApp below to book directly with our team.')
    } else {
      setSubmitted(true)
    }
  }

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION
      ───────────────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        padding: 'clamp(40px, 8vw, 80px) 0',
        background: 'linear-gradient(180deg, #050708 0%, #080C10 50%, #050708 100%)',
        borderBottom: '1px solid #1C232B',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative glow */}
        <div style={{
          position: 'absolute',
          top: -120,
          right: '15%',
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(17,188,230,0.12) 0%, rgba(5,7,8,0) 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'clamp(28px, 5vw, 56px)',
            alignItems: 'center'
          }}>
            {/* Left: Branding & Copy */}
            <div>
              {/* Specialized Seat Cover Logo Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                background: 'rgba(17,188,230,0.08)',
                border: '1px solid rgba(17,188,230,0.25)',
                borderRadius: 999,
                padding: '6px 16px 6px 8px',
                marginBottom: 20
              }}>
                <img
                  src={seatLogo}
                  alt="Premium Seat Cover Service Logo"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    objectFit: 'contain'
                  }}
                />
                <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.14em', color: '#11BCE6' }}>
                  PREMIUM CAR SEAT COVERS
                </span>
              </div>

              <h1 style={{
                fontFamily: 'Orbitron, sans-serif',
                fontWeight: 900,
                fontSize: 'clamp(26px, 5vw, 44px)',
                lineHeight: 1.15,
                color: '#FFFFFF',
                margin: 0
              }}>
                CUSTOM-CRAFTED <br />
                <span style={{ color: '#11BCE6' }}>CAR SEAT COVERS</span>
              </h1>

              <p style={{
                color: '#A0A7AE',
                fontSize: 'clamp(13px, 2vw, 15px)',
                lineHeight: 1.65,
                marginTop: 16,
                maxWidth: 520
              }}>
                Custom-made seat covers designed for comfort, protection, and premium style. Fitted with millimeter precision by the customization specialists at Lee Car Accessories, Ramanathapuram.
              </p>

              {/* Highlights Pill Row */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 22 }}>
                <span style={heroPillStyle}>✓ Custom Fit Options</span>
                <span style={heroPillStyle}>✓ Premium Material Options</span>
                <span style={heroPillStyle}>✓ Professional Installation</span>
              </div>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', gap: 14, marginTop: 28, flexWrap: 'wrap' }}>
                <a href="#appointment-form" className="btn-cyan" style={{ textDecoration: 'none' }}>
                  BOOK AN APPOINTMENT ↓
                </a>
                <a href="#seat-gallery" className="btn-gold" style={{ textDecoration: 'none' }}>
                  VIEW OUR WORK
                </a>
              </div>
            </div>

            {/* Right: Premium Automotive Interior Display */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'relative',
                borderRadius: 22,
                overflow: 'hidden',
                border: '1px solid #1C232B',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                aspectRatio: '4/3'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=900&h=675&fit=crop"
                  alt="Premium Custom Car Seat Cover Interior"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="eager"
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(5,7,8,0) 50%, rgba(5,7,8,0.85) 100%)'
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  right: 16,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.06em' }}>
                    Tailored at ECR Junction, Ramanathapuram
                  </span>
                  <span style={{
                    background: 'rgba(17,188,230,0.2)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid #11BCE6',
                    color: '#11BCE6',
                    fontSize: 10,
                    fontWeight: 900,
                    padding: '4px 10px',
                    borderRadius: 999
                  }}>
                    4.8★ FITMENT
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. WHY CHOOSE OUR SEAT COVERS
      ───────────────────────────────────────────────────────────── */}
      <section className="container" style={{ padding: '60px 0 30px' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ color: '#11BCE6', fontWeight: 800, fontSize: 11, letterSpacing: '0.16em' }}>
            SPECIALIZED CRAFTSMANSHIP
          </div>
          <h2 className="sec-title" style={{ fontSize: 'clamp(24px, 4vw, 32px)', marginTop: 6, margin: '6px 0 0' }}>
            WHY CHOOSE OUR <span style={{ color: '#11BCE6' }}>SEAT COVERS</span>
          </h2>
          <div style={{ color: '#A0A7AE', fontSize: 13, marginTop: 8, maxWidth: 560, marginInline: 'auto' }}>
            Engineered to blend aesthetic luxury with rugged daily durability for your vehicle.
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 18
        }}>
          {[
            {
              icon: '📐',
              title: 'Custom Fit Options',
              desc: 'Patterned specifically for your car make, model, and seat contours to avoid loose wrinkles or shifting.'
            },
            {
              icon: '🧵',
              title: 'Premium Material Options',
              desc: 'Select from carefully curated automotive-grade materials built for wear resistance and easy cleaning.'
            },
            {
              icon: '🔧',
              title: 'Professional Installation',
              desc: 'Expert in-house fitment team ensuring tight alignment, zero bunching, and complete safety clearance.'
            },
            {
              icon: '🛋️',
              title: 'Comfortable Design',
              desc: 'Ergonomically backed cushioning designed to reduce fatigue on long highway drives and hot weather.'
            },
            {
              icon: '🛡️',
              title: 'Long-Lasting Protection',
              desc: 'Protects original OEM fabric seats from UV sun fading, liquid spills, sweat, and everyday dust.'
            },
            {
              icon: '🎨',
              title: 'Multiple Colours & Styles',
              desc: 'Choose from single tones, rich dual tones, contrast piping, and decorative stitching accents.'
            }
          ].map(feature => (
            <div
              key={feature.title}
              style={{
                background: '#090D11',
                border: '1px solid #1C232B',
                borderRadius: 16,
                padding: '24px 20px',
                transition: 'border-color .2s ease, transform .2s ease'
              }}
              className="hover-card"
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'rgba(17,188,230,0.08)',
                border: '1px solid rgba(17,188,230,0.2)',
                display: 'grid',
                placeItems: 'center',
                fontSize: 20,
                marginBottom: 16
              }}>
                {feature.icon}
              </div>
              <div style={{
                fontFamily: 'Orbitron, sans-serif',
                fontWeight: 800,
                fontSize: 14,
                color: '#FFFFFF',
                letterSpacing: '0.02em'
              }}>
                {feature.title}
              </div>
              <div style={{ color: '#A0A7AE', fontSize: 12, lineHeight: 1.6, marginTop: 8 }}>
                {feature.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. OUR WORK GALLERY
      ───────────────────────────────────────────────────────────── */}
      <section id="seat-gallery" className="container" style={{ padding: '50px 0 30px' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ color: '#11BCE6', fontWeight: 800, fontSize: 11, letterSpacing: '0.16em' }}>
            PORTFOLIO SHOWCASE
          </div>
          <h2 className="sec-title" style={{ fontSize: 'clamp(24px, 4vw, 32px)', marginTop: 6, margin: '6px 0 0' }}>
            SEAT COVER <span style={{ color: '#11BCE6' }}>WORK GALLERY</span>
          </h2>
          <div style={{ color: '#687078', fontSize: 12, marginTop: 6 }}>
            Browse popular seat styling and authentic fitment configurations completed at our workshop
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 20 }}>
            {categoriesList.map(cat => {
              const isSelected = activeCategory.toLowerCase() === cat.toLowerCase()
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '7px 16px',
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
        </div>

        {/* Gallery Content */}
        {galleryLoading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 20,
              padding: '20px 0',
            }}
          >
            {[1, 2, 3].map(n => (
              <div
                key={n}
                style={{
                  height: 280,
                  borderRadius: 16,
                  background: '#090D11',
                  border: '1px solid #1C232B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4B5563',
                  fontSize: 12,
                }}
              >
                Loading seat cover portfolio…
              </div>
            ))}
          </div>
        ) : filteredGallery.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              color: '#687078',
              padding: '50px 20px',
              background: '#090D11',
              border: '1px solid #1C232B',
              borderRadius: 16,
              maxWidth: 620,
              marginInline: 'auto',
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>💺</div>
            <div style={{ color: '#FFFFFF', fontWeight: 800, fontSize: 15 }}>
              No seat cover photos in this category
            </div>
            <p style={{ fontSize: 12, color: '#8A929B', marginTop: 6, lineHeight: 1.6 }}>
              Our customization workshop regularly uploads photos of fresh bucket-fit and custom interior installations. Contact our technicians for direct sample photos!
            </p>
            <a
              href="https://wa.me/919952637233?text=Hi%20Lee%20Car%20Accessories%2C%20I%20would%20like%20to%20see%20recent%20seat%20cover%20photos%20for%20my%20car."
              target="_blank"
              rel="noreferrer"
              className="btn-gold"
              style={{ display: 'inline-block', marginTop: 14, textDecoration: 'none', fontSize: 11 }}
            >
              REQUEST SEAT COVER SAMPLES VIA WHATSAPP 💬
            </a>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 20,
            }}
          >
            {filteredGallery.map(item => (
              <div
                key={item.id}
                style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  border: '1px solid #1C232B',
                  background: '#090D11',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                className="hover-card"
              >
                <div style={{ position: 'relative', height: 220, overflow: 'hidden', background: '#050708' }}>
                  <img
                    src={item.image_url}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      right: 12,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      pointerEvents: 'none',
                    }}
                  >
                    <span
                      style={{
                        background: 'rgba(5,7,8,0.85)',
                        backdropFilter: 'blur(6px)',
                        border: '1px solid rgba(17,188,230,0.3)',
                        color: '#11BCE6',
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: '0.08em',
                        padding: '4px 10px',
                        borderRadius: 999,
                      }}
                    >
                      {item.category.toUpperCase()}
                    </span>
                    {item.featured && (
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
                </div>
                <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div
                    style={{
                      fontFamily: 'Orbitron, sans-serif',
                      fontWeight: 800,
                      fontSize: 14,
                      color: '#FFFFFF',
                      marginTop: 2,
                    }}
                  >
                    {item.title}
                  </div>
                  {item.description && (
                    <div style={{ fontSize: 12, color: '#A0A7AE', marginTop: 6, lineHeight: 1.5, flex: 1 }}>
                      {item.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. APPOINTMENT BOOKING FORM
      ───────────────────────────────────────────────────────────── */}
      <section id="appointment-form" className="container" style={{ padding: '60px 0 40px', maxWidth: 840 }}>
        <div style={{
          background: 'linear-gradient(135deg, #090D11 0%, #0A0F14 100%)',
          border: '1px solid #1C232B',
          borderRadius: 22,
          padding: 'clamp(24px, 5vw, 40px)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.5)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(17,188,230,0.08)',
              border: '1px solid rgba(17,188,230,0.2)',
              borderRadius: 999,
              padding: '6px 14px',
              marginBottom: 12
            }}>
              <img
                src={seatLogo}
                alt="Seat Logo"
                style={{ width: 18, height: 18, borderRadius: '50%' }}
              />
              <span style={{ fontSize: 11, fontWeight: 800, color: '#11BCE6', letterSpacing: '0.12em' }}>
                RESERVE YOUR APPOINTMENT
              </span>
            </div>
            <h2 className="sec-title" style={{ fontSize: 'clamp(22px, 4.5vw, 30px)', margin: '4px 0 0' }}>
              SCHEDULE A <span style={{ color: '#11BCE6' }}>SEAT COVER CONSULTATION</span>
            </h2>
            <div style={{ color: '#A0A7AE', fontSize: 12, marginTop: 8, lineHeight: 1.6 }}>
              Share your car details and style preferences. Our team at ECR Junction will prepare personalized options and confirm your priority slot.
            </div>
          </div>

          {submitted ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              background: 'rgba(0,200,100,0.05)',
              borderRadius: 16,
              border: '1px solid rgba(0,200,100,0.25)'
            }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>✓</div>
              <h3 style={{ fontFamily: 'Orbitron', fontWeight: 900, color: '#00C864', margin: 0, fontSize: 18 }}>
                APPOINTMENT REQUEST RECEIVED!
              </h3>
              <p style={{ color: '#A0A7AE', fontSize: 13, marginTop: 10, maxWidth: 500, marginInline: 'auto', lineHeight: 1.6 }}>
                Thank you, <strong style={{ color: '#FFFFFF' }}>{form.full_name}</strong>. We have logged your request for your <strong style={{ color: '#FFFFFF' }}>{form.car_brand} {form.car_model}</strong>. Our specialist will call or WhatsApp you at <strong style={{ color: '#FFFFFF' }}>{form.phone}</strong> to confirm your slot.
              </p>
              <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href={`https://wa.me/919952637233?text=Hi%20Lee%20Car%20Accessories%2C%20I%20just%20submitted%20a%20seat%20cover%20appointment%20request%20for%20my%20${encodeURIComponent(form.car_model)}.%20Customer%20Name%3A%20${encodeURIComponent(form.full_name)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-gold"
                >
                  OPEN ON WHATSAPP 💬
                </a>
                <button
                  onClick={() => { setSubmitted(false); setForm(initialForm) }}
                  style={{
                    background: 'transparent',
                    border: '1px solid #1E2A33',
                    color: '#A0A7AE',
                    borderRadius: 999,
                    padding: '10px 20px',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  BOOK ANOTHER
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Row 1: Name & Phone */}
              <div style={formRowStyle}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>FULL NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mohamed Riyaz"
                    value={form.full_name}
                    onChange={e => setForm({ ...form, full_name: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>PHONE NUMBER *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 99526 37233"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Row 2: Email & Car Brand */}
              <div style={formRowStyle}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>EMAIL ADDRESS (OPTIONAL)</label>
                  <input
                    type="email"
                    placeholder="e.g. customer@example.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>CAR BRAND</label>
                  <input
                    type="text"
                    placeholder="e.g. Hyundai, Mahindra, Suzuki, Toyota"
                    value={form.car_brand}
                    onChange={e => setForm({ ...form, car_brand: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Row 3: Car Model & Year */}
              <div style={formRowStyle}>
                <div style={{ flex: 2 }}>
                  <label style={labelStyle}>CAR MODEL *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Creta SX(O) / Thar / Swift"
                    value={form.car_model}
                    onChange={e => setForm({ ...form, car_model: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>YEAR (OPTIONAL)</label>
                  <input
                    type="text"
                    placeholder="e.g. 2023 / 2024"
                    value={form.car_year}
                    onChange={e => setForm({ ...form, car_year: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Row 4: Preferred Date & Time */}
              <div style={formRowStyle}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>PREFERRED DATE</label>
                  <input
                    type="date"
                    value={form.preferred_date}
                    onChange={e => setForm({ ...form, preferred_date: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>PREFERRED TIME SLOT</label>
                  <select
                    value={form.preferred_time}
                    onChange={e => setForm({ ...form, preferred_time: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="">Select a time slot</option>
                    <option value="Morning (9:30 AM - 12:30 PM)">Morning (9:30 AM - 12:30 PM)</option>
                    <option value="Afternoon (1:00 PM - 4:30 PM)">Afternoon (1:00 PM - 4:30 PM)</option>
                    <option value="Evening (5:00 PM - 8:30 PM)">Evening (5:00 PM - 8:30 PM)</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Styling Preferences */}
              <div style={formRowStyle}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>SEAT COVER STYLE</label>
                  <select
                    value={form.seat_cover_type}
                    onChange={e => setForm({ ...form, seat_cover_type: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="Custom Bucket Fit">Custom Bucket Fit</option>
                    <option value="Snug Standard Fit">Snug Standard Fit</option>
                    <option value="Luxury Cushion Fit">Luxury Cushion Fit</option>
                    <option value="Sport Diamond Stitch">Sport Diamond Stitch</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>MATERIAL PREFERENCE</label>
                  <select
                    value={form.material_preference}
                    onChange={e => setForm({ ...form, material_preference: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="Premium Durable Finish">Premium Durable Finish</option>
                    <option value="Textured Fabric Option">Textured Fabric Option</option>
                    <option value="Dual Finish Combination">Dual Finish Combination</option>
                    <option value="Consult Technician in Store">Consult Technician in Store</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>COLOUR PREFERENCE</label>
                  <select
                    value={form.colour_preference}
                    onChange={e => setForm({ ...form, colour_preference: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="Classic Black">Classic Black</option>
                    <option value="Tan / Beige">Tan / Beige</option>
                    <option value="Coffee Brown">Coffee Brown</option>
                    <option value="Dual Tone Black & Tan">Dual Tone Black & Tan</option>
                    <option value="Dual Tone Black & Red">Dual Tone Black & Red</option>
                  </select>
                </div>
              </div>

              {/* Row 6: Additional Notes */}
              <div>
                <label style={labelStyle}>ADDITIONAL NOTES OR REQUESTS</label>
                <textarea
                  rows={3}
                  placeholder="Tell us if you have front armrest, split folding rear seats, or specific styling requests..."
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              {submitError && (
                <div style={{
                  background: 'rgba(255,85,85,0.08)',
                  border: '1px solid rgba(255,85,85,0.3)',
                  color: '#FF5555',
                  padding: '12px 16px',
                  borderRadius: 10,
                  fontSize: 12,
                  lineHeight: 1.5
                }}>
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-cyan"
                style={{
                  width: '100%',
                  padding: '15px',
                  fontSize: 13,
                  letterSpacing: '0.12em',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.7 : 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                {submitting ? 'RECORDING APPOINTMENT…' : 'CONFIRM SEAT COVER APPOINTMENT →'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. STORE LOCATION & VISIT CONTACT
      ───────────────────────────────────────────────────────────── */}
      <section className="container" style={{ padding: '20px 0 50px' }}>
        <div style={{
          background: '#070B0E',
          border: '1px solid #1C232B',
          borderRadius: 18,
          padding: '28px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20
        }}>
          <div>
            <div style={{ color: '#D69A13', fontWeight: 800, fontSize: 11, letterSpacing: '0.14em' }}>
              VISIT OUR WORKSHOP
            </div>
            <div style={{ fontFamily: 'Orbitron', fontWeight: 800, fontSize: 18, color: '#FFFFFF', marginTop: 4 }}>
              LEE CAR ACCESSORIES · RAMANATHAPURAM
            </div>
            <div style={{ color: '#A0A7AE', fontSize: 12, marginTop: 4 }}>
              {businessInfo.fullAddress} · {businessInfo.hours}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href={`tel:${businessInfo.phoneHref}`} className="btn-cyan">
              CALL {businessInfo.phoneDisplay}
            </a>
            <a href={businessInfo.whatsappHref} target="_blank" rel="noreferrer" className="btn-gold">
              WHATSAPP INQUIRY 💬
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

const heroPillStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid #1E2A33',
  color: '#A0A7AE',
  fontSize: 11,
  fontWeight: 700,
  padding: '6px 14px',
  borderRadius: 999
}

const formRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 14,
  flexWrap: 'wrap'
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 10,
  letterSpacing: '0.1em',
  fontWeight: 800,
  color: '#A0A7AE',
  marginBottom: 6
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#0D1217',
  border: '1px solid #1E2A33',
  borderRadius: 10,
  padding: '12px 14px',
  color: '#FFFFFF',
  outline: 'none',
  fontSize: 13,
  boxSizing: 'border-box'
}
