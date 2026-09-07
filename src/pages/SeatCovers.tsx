import { useState, useEffect, useMemo } from 'react'
import { businessInfo } from '../data/mockData'
import { supabase } from '../lib/supabase'
import seatLogo from '../assets/primary_seat_logo.png'
import type { DbGalleryItem } from '../types/database'

// ─────────────────────────────────────────────────────────────
// SECTION A: AVAILABLE SEAT COVER DESIGNS (PORTFOLIO SHOWCASE)
// ─────────────────────────────────────────────────────────────
export interface SeatDesign {
  id: string
  name: string
  style: string
  category: string
  desc: string
  highlights: string[]
  material: string
  stitchType: string
  fitmentTime: string
  images: string[]
}

export const SEAT_DESIGNS: SeatDesign[] = [
  {
    id: 'design-nappa-bucket',
    name: 'ROYAL BUCKET FIT NAPPA FINISH',
    style: 'Luxury Bucket Fit',
    category: 'Luxury Leather',
    desc: 'Deep bucket side-bolstering custom-tailored with high-density memory cushioning and breathable micro-perforations. Preserves original factory seats while transforming your cabin into executive luxury.',
    highlights: [
      'Engineered specifically for your car make and seat curves',
      'Dual-needle French cross-stitching for extreme durability',
      'Sweat-resistant perforated centre section for tropical coastal climate',
      'Full armrest, headrest, and rear split-bench coverage'
    ],
    material: 'High-Grade Microfiber & Breathable Nappa PU',
    stitchType: 'Double French Cross-Stitch',
    fitmentTime: '3 – 4 Hours (Prior Booking)',
    images: [
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=900&h=700&fit=crop',
    ]
  },
  {
    id: 'design-dual-tone-honeycomb',
    name: 'DUAL-TONE TAN & BLACK HONEYCOMB',
    style: 'Modern Dual Tone',
    category: 'Dual Tone',
    desc: 'A striking contrast of rich Bavarian Tan leather and deep Obsidian Black flanks, accented with geometric hexagonal quilting on the backrest and base bolsters.',
    highlights: [
      'High-impact contrast piping and precision embossed pattern',
      'High-density memory foam backing for anti-fatigue highway comfort',
      'Heat-resistant and UV-stabilized coating prevents cracking or sun fade',
      'Custom color shade matching available in-store'
    ],
    material: 'Premium Automotive Leatherette with Anti-Scratch Finish',
    stitchType: 'Computerized Diamond & Honeycomb Quilt',
    fitmentTime: '3 – 4 Hours',
    images: [
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=900&h=700&fit=crop',
    ]
  },
  {
    id: 'design-sport-perforated-red',
    name: 'SPORT RACING EDITION (RED ACCENT)',
    style: 'Sport Bolster Fit',
    category: 'Sport Stitching',
    desc: 'Aggressive sports car aesthetic featuring matte carbon-texture leather bolsters, racing red perimeter piping, and high-flow micro-perforated lumbar support.',
    highlights: [
      'Reinforced side lumbar bolsters for firm cornering support',
      'Contrast red perimeter piping and twin-needle accent stitching',
      'Breathable core fabric prevents back sweating on long drives',
      'Water-repellent and spill-proof surface for effortless wiping'
    ],
    material: 'Reinforced Sport Leatherette & Carbon-Weave Texture',
    stitchType: 'Twin Sport Accent Stitching in Flame Red',
    fitmentTime: '3 Hours',
    images: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=900&h=700&fit=crop',
    ]
  },
  {
    id: 'design-monarch-coffee',
    name: 'MONARCH COFFEE BROWN LUXE',
    style: 'Executive Classic',
    category: 'Classic Luxury',
    desc: 'Understated old-money luxury in deep roasted coffee brown. Designed to complement wooden trim dashboards and premium beige car interiors.',
    highlights: [
      'Velvety soft touch with authentic grain texture',
      'Double-stitched ivory welt cords following the natural seat curves',
      'No loose wrinkles, slipping, or bunching over time',
      'Complete airbag-compatible and ISOFIX-friendly seam design'
    ],
    material: 'Ultra-Soft Premium Top-Coat PU Leather',
    stitchType: 'Tailored Ivory Welted Double Stitch',
    fitmentTime: '3 – 4 Hours',
    images: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=900&h=700&fit=crop',
    ]
  },
  {
    id: 'design-stealth-charcoal',
    name: 'STEALTH MATTE CHARCOAL FINISH',
    style: 'Minimalist Factory OEM+',
    category: 'Bucket Fit',
    desc: 'For drivers who want factory-clean perfection. A seamless, non-shiny OEM matte texture that looks and feels like genuine factory-fitted leather.',
    highlights: [
      'Zero glare matte surface that matches modern minimalist cabins',
      'Millimeter-tight fitting with concealed tension cords',
      'Durable against denim dye transfer, pet paws, and children activity',
      'Easy wipe-down with damp microfiber cloth'
    ],
    material: 'Matte Industrial-Grade Automotive Vinyl-Polymer',
    stitchType: 'Concealed Heavy-Duty Overlock Stitch',
    fitmentTime: '2.5 – 3 Hours',
    images: [
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&h=700&fit=crop',
    ]
  },
  {
    id: 'design-oxford-beige',
    name: 'OXFORD BEIGE & CREAM EXECUTIVE',
    style: 'Bright Interior Luxury',
    category: 'Luxury Leather',
    desc: 'Brightens compact vehicle cabins with an airy, spacious luxury feel. Tailored with dual tone ivory borders and micro-stitched centre pleats.',
    highlights: [
      'Visually expands the feeling of space inside smaller vehicles',
      'Anti-dust and stain-resistant polymer top layer',
      'High-resilience foam core retains seat bolster bounce for years',
      'Available with matching leather steering wheel wrap'
    ],
    material: 'Premium High-Density Soft-Touch Leatherette',
    stitchType: 'Vertical Pleated Precision Stitching',
    fitmentTime: '3 – 4 Hours',
    images: [
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=900&h=700&fit=crop',
    ]
  }
]

// ─────────────────────────────────────────────────────────────
// SECTION B: OUR WORK / COMPLETED INSTALLATIONS (FALLBACKS)
// ─────────────────────────────────────────────────────────────
interface WorkItem {
  id: string
  title: string
  carModel: string
  category: string
  description: string
  images: string[]
}

const FALLBACK_WORK_ITEMS: WorkItem[] = [
  {
    id: 'work-1',
    title: 'Swift ZXi Bucket Fit Black Nappa Installation',
    carModel: 'Maruti Suzuki Swift ZXi',
    category: 'Bucket Fit',
    description: 'Custom tailored full-bucket fit seat cover installation with cross-stitched steering wheel and matching gear knob boot.',
    images: [
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&h=700&fit=crop',
    ]
  },
  {
    id: 'work-2',
    title: 'Creta SX(O) Dual-Tone Tan & Charcoal Interior',
    carModel: 'Hyundai Creta SX(O)',
    category: 'Dual Tone',
    description: 'Complete cabin interior upgrade in Bavarian Tan with diamond-quilted backrest and integrated armrest re-trimming.',
    images: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=900&h=700&fit=crop',
    ]
  },
  {
    id: 'work-3',
    title: 'Thar 4x4 Rugged Waterproof Black Leatherette',
    carModel: 'Mahindra Thar LX Hardtop',
    category: 'Sport Stitching',
    description: 'Heavy-duty mud and water-resistant custom seat covers with reinforced bolster padding for off-road expeditions.',
    images: [
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=900&h=700&fit=crop',
    ]
  },
  {
    id: 'work-4',
    title: 'Innova Hycross Executive Captain Seats',
    carModel: 'Toyota Innova Hycross',
    category: 'Classic Luxury',
    description: 'Executive 7-seater full transformation with perforated headrests, folding tray clearance, and rear ottoman cushioning.',
    images: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=900&h=700&fit=crop',
    ]
  },
  {
    id: 'work-5',
    title: 'Scorpio-N Full Cabin Black & Coffee Brown',
    carModel: 'Mahindra Scorpio-N Z8L',
    category: 'Dual Tone',
    description: 'Premium dual-tone stitching matching the factory dash tones with complete 3-row fitment and split-seat function.',
    images: [
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=900&h=700&fit=crop',
    ]
  },
  {
    id: 'work-6',
    title: 'Baleno Alpha Before & After Seat Makeover',
    carModel: 'Maruti Suzuki Baleno Alpha',
    category: 'Before & After',
    description: 'Replaced worn original cloth seats with sleek bucket-fit leather with red sports stitching and memory cushion backing.',
    images: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=900&h=700&fit=crop',
    ]
  }
]

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

export default function SeatCovers() {
  // Modal states
  const [selectedDesign, setSelectedDesign] = useState<SeatDesign | null>(null)
  const [activeDesignImgIdx, setActiveDesignImgIdx] = useState(0)

  const [selectedWork, setSelectedWork] = useState<WorkItem | null>(null)
  const [activeWorkImgIdx, setActiveWorkImgIdx] = useState(0)

  // Our Work filtering
  const [workFilter, setWorkFilter] = useState('ALL')
  const [dbGalleryItems, setDbGalleryItems] = useState<DbGalleryItem[]>([])
  const [galleryLoading, setGalleryLoading] = useState(true)

  // Appointment Form state
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
      } else if (data && data.length > 0) {
        setDbGalleryItems(data)
      }
    } catch (err) {
      console.warn('[SeatCovers] Could not fetch seat gallery:', err)
    } finally {
      setGalleryLoading(false)
    }
  }

  // Combined work items (Supabase gallery items mapped to WorkItem shape + fallbacks)
  const allWorkItems: WorkItem[] = useMemo(() => {
    if (dbGalleryItems.length > 0) {
      const mapped = dbGalleryItems.map(item => ({
        id: item.id,
        title: item.title,
        carModel: item.title,
        category: item.category || 'Bucket Fit',
        description: item.description || 'Custom car seat cover installation at Lee Car Accessories, Ramanathapuram.',
        images: [item.image_url]
      }))
      // Merge unique fallbacks so user always has rich multi-image items
      return [...mapped, ...FALLBACK_WORK_ITEMS.slice(mapped.length)]
    }
    return FALLBACK_WORK_ITEMS
  }, [dbGalleryItems])

  // Work Categories List
  const workCategories = useMemo(() => {
    const set = new Set<string>(['ALL'])
    allWorkItems.forEach(w => {
      if (w.category) set.add(w.category)
    })
    return Array.from(set)
  }, [allWorkItems])

  const filteredWorkItems = useMemo(() => {
    if (workFilter === 'ALL') return allWorkItems
    return allWorkItems.filter(w => w.category.toLowerCase() === workFilter.toLowerCase())
  }, [allWorkItems, workFilter])

  const openDesignModal = (design: SeatDesign) => {
    setSelectedDesign(design)
    setActiveDesignImgIdx(0)
    document.body.style.overflow = 'hidden'
  }

  const closeDesignModal = () => {
    setSelectedDesign(null)
    document.body.style.overflow = ''
  }

  const openWorkModal = (work: WorkItem) => {
    setSelectedWork(work)
    setActiveWorkImgIdx(0)
    document.body.style.overflow = 'hidden'
  }

  const closeWorkModal = () => {
    setSelectedWork(null)
    document.body.style.overflow = ''
  }

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
      console.warn('[SeatCovers] Supabase appointment notice:', error.message)
      setSubmitError('Could not record appointment online right now. Tap WhatsApp below to book directly with our technicians.')
    } else {
      setSubmitted(true)
    }
  }

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION (SPACIOUS & LUXURIOUS)
      ───────────────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        padding: 'clamp(44px, 7vw, 84px) 0',
        background: 'linear-gradient(180deg, #050708 0%, #090E13 50%, #050708 100%)',
        borderBottom: '1px solid #1C232B',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(32px, 5vw, 64px)',
            alignItems: 'center'
          }}>
            {/* Left: Branding & Copy */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: 'rgba(17,188,230,0.08)',
                border: '1px solid rgba(17,188,230,0.25)',
                borderRadius: 999,
                padding: '6px 16px 6px 8px',
                marginBottom: 18
              }}>
                <img
                  src={seatLogo}
                  alt="Seat Cover Service Logo"
                  style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'contain' }}
                />
                <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.14em', color: '#11BCE6' }}>
                  PREMIUM CAR SEAT COVERS
                </span>
              </div>

              <h1 className="sec-title" style={{
                fontSize: 'clamp(28px, 5vw, 48px)',
                lineHeight: 1.1,
                color: '#FFFFFF',
                margin: 0
              }}>
                CUSTOM-CRAFTED <br />
                <span style={{ color: '#11BCE6' }}>CAR SEAT COVERS</span>
              </h1>

              <p style={{
                color: '#A0A7AE',
                fontSize: 'clamp(13px, 2vw, 15px)',
                lineHeight: 1.7,
                marginTop: 16,
                maxWidth: 520
              }}>
                Tailored for comfort, extreme protection, and aesthetic prestige. Every cover is hand-finished and fitted with millimeter precision by the upholstery artisans at Lee Car Accessories, Ramanathapuram.
              </p>

              {/* Highlights Pill Row */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 22 }}>
                <span style={heroPillStyle}>✓ Custom Fit For All Makes</span>
                <span style={heroPillStyle}>✓ Breathable Nappa Leather</span>
                <span style={heroPillStyle}>✓ In-House Master Fitment</span>
              </div>

              {/* Quick CTAs */}
              <div style={{ display: 'flex', gap: 14, marginTop: 28, flexWrap: 'wrap' }}>
                <a href="#seat-designs" className="btn-cyan">
                  EXPLORE DESIGNS ↓
                </a>
                <a href="#our-work" className="btn-gold">
                  VIEW OUR WORK GALLERY
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
                aspectRatio: '4 / 3'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=900&h=675&fit=crop"
                  alt="Custom Bucket Fit Car Seat Cover"
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
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 8
                }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.06em' }}>
                    SK Complex, ECR Junction · Ramanathapuram
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
          SECTION A — SEAT COVER DESIGNS (PORTFOLIO SHOWCASE)
          NO direct order / cart. Clicking opens rich showcase view!
      ───────────────────────────────────────────────────────────── */}
      <section id="seat-designs" className="container" style={{ padding: 'clamp(44px, 7vw, 76px) 0 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(28px, 4vw, 44px)' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(17,188,230,0.08)',
            border: '1px solid rgba(17,188,230,0.2)',
            borderRadius: 999,
            padding: '4px 14px',
            marginBottom: 10
          }}>
            <span style={{ color: '#11BCE6', fontWeight: 800, fontSize: 10, letterSpacing: '0.14em' }}>
              SECTION A · CURATED PATTERNS
            </span>
          </div>
          <h2 className="sec-title" style={{ fontSize: 'clamp(24px, 4.5vw, 36px)', margin: '4px 0 0' }}>
            SEAT COVER <span style={{ color: '#11BCE6' }}>DESIGNS</span>
          </h2>
          <p style={{ color: '#8A929B', fontSize: 13, marginTop: 8, maxWidth: 580, marginInline: 'auto', lineHeight: 1.6 }}>
            Explore our signature seat styling configurations. Tap any design to view multiple angles, material specifications, and request consultation for your vehicle.
          </p>
        </div>

        {/* Designs Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 'clamp(18px, 3vw, 26px)'
        }}>
          {SEAT_DESIGNS.map(design => (
            <div
              key={design.id}
              onClick={() => openDesignModal(design)}
              className="product-card hover-card"
              style={{ cursor: 'pointer' }}
            >
              {/* Card Image Wrap with Multi-image Indicator */}
              <div className="product-card-img-wrap">
                <img src={design.images[0]} alt={design.name} loading="lazy" />
                <div style={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  background: 'rgba(5,7,8,0.85)',
                  backdropFilter: 'blur(6px)',
                  border: '1px solid rgba(17,188,230,0.3)',
                  padding: '3px 9px',
                  borderRadius: 999,
                  fontSize: 10,
                  fontWeight: 800,
                  color: '#11BCE6'
                }}>
                  {design.category}
                </div>

                <div style={{
                  position: 'absolute',
                  bottom: 10,
                  right: 10,
                  background: 'rgba(5,7,8,0.85)',
                  backdropFilter: 'blur(6px)',
                  border: '1px solid #1E2A33',
                  padding: '3px 8px',
                  borderRadius: 8,
                  fontSize: 10,
                  fontWeight: 800,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}>
                  <span>📷</span> {design.images.length} Photos
                </div>
              </div>

              {/* Card Body */}
              <div className="product-card-body">
                <div className="product-card-title">{design.name}</div>
                <div style={{ fontSize: 11, color: '#11BCE6', fontWeight: 700, marginTop: 4 }}>
                  Style: {design.style}
                </div>
                <div className="product-card-desc" style={{ WebkitLineClamp: 3 }}>
                  {design.desc}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: 16 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 11,
                    color: '#8A929B',
                    borderTop: '1px solid #161D24',
                    paddingTop: 10,
                    marginBottom: 12
                  }}>
                    <span>{design.material.split('&')[0]}</span>
                    <span style={{ color: '#D69A13', fontWeight: 700 }}>Custom Made</span>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); openDesignModal(design); }}
                    className="btn-cyan"
                    style={{ width: '100%', padding: '10px 14px', fontSize: 11, minHeight: 38 }}
                  >
                    VIEW DESIGN & SPECIFICATIONS →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION B — OUR WORK (COMPLETED VEHICLE INSTALLATIONS)
          Strictly separated from designs!
      ───────────────────────────────────────────────────────────── */}
      <section id="our-work" style={{
        background: '#070B0E',
        borderTop: '1px solid #161D24',
        borderBottom: '1px solid #161D24',
        padding: 'clamp(50px, 8vw, 84px) 0',
        marginTop: 40
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(24px, 4vw, 36px)' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(214,154,19,0.1)',
              border: '1px solid rgba(214,154,19,0.3)',
              borderRadius: 999,
              padding: '4px 14px',
              marginBottom: 10
            }}>
              <span style={{ color: '#D69A13', fontWeight: 800, fontSize: 10, letterSpacing: '0.14em' }}>
                SECTION B · REAL VEHICLE GALLERY
              </span>
            </div>
            <h2 className="sec-title" style={{ fontSize: 'clamp(24px, 4.5vw, 36px)', margin: '4px 0 0' }}>
              OUR WORK · <span style={{ color: '#11BCE6' }}>COMPLETED INSTALLATIONS</span>
            </h2>
            <p style={{ color: '#8A929B', fontSize: 13, marginTop: 8, maxWidth: 620, marginInline: 'auto', lineHeight: 1.6 }}>
              Browse authentic seat cover fitment transformations completed at our SK Complex, ECR Junction workshop in Ramanathapuram.
            </p>

            {/* Filter Pills for Our Work */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 22 }}>
              {workCategories.map(cat => {
                const isSelected = workFilter.toLowerCase() === cat.toLowerCase()
                return (
                  <button
                    key={cat}
                    onClick={() => setWorkFilter(cat)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 999,
                      fontWeight: 800,
                      fontSize: 11,
                      letterSpacing: '0.06em',
                      cursor: 'pointer',
                      border: `1.5px solid ${isSelected ? '#11BCE6' : '#1C232B'}`,
                      background: isSelected ? '#11BCE6' : '#090D11',
                      color: isSelected ? '#02141B' : '#A0A7AE',
                      transition: 'all .15s ease'
                    }}
                  >
                    {cat.toUpperCase()}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Completed Work Gallery Grid */}
          {galleryLoading && dbGalleryItems.length === 0 ? (
            <div style={{ display: 'grid', placeItems: 'center', minHeight: 240, color: '#687078', fontSize: 13 }}>
              Loading seat cover installation gallery…
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'clamp(16px, 2.5vw, 24px)'
            }}>
              {filteredWorkItems.map(work => (
                <div
                  key={work.id}
                  onClick={() => openWorkModal(work)}
                  className="product-card hover-card"
                  style={{ cursor: 'pointer' }}
                >
                  <div className="product-card-img-wrap" style={{ aspectRatio: '16 / 10' }}>
                    <img src={work.images[0]} alt={work.title} loading="lazy" />
                    <span style={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      background: 'rgba(5,7,8,0.85)',
                      backdropFilter: 'blur(6px)',
                      border: '1px solid rgba(17,188,230,0.3)',
                      padding: '3px 8px',
                      borderRadius: 999,
                      fontSize: 9,
                      fontWeight: 800,
                      color: '#11BCE6'
                    }}>
                      {work.category.toUpperCase()}
                    </span>
                    {work.images.length > 1 && (
                      <span style={{
                        position: 'absolute',
                        bottom: 10,
                        right: 10,
                        background: 'rgba(5,7,8,0.85)',
                        backdropFilter: 'blur(6px)',
                        padding: '2px 7px',
                        borderRadius: 6,
                        fontSize: 9,
                        fontWeight: 800,
                        color: '#FFFFFF'
                      }}>
                        +{work.images.length - 1} photos
                      </span>
                    )}
                  </div>

                  <div className="product-card-body">
                    <div className="product-card-title" style={{ minHeight: 'auto', fontSize: 13 }}>
                      {work.title}
                    </div>
                    <div style={{ fontSize: 11, color: '#D69A13', fontWeight: 700, marginTop: 4 }}>
                      Vehicle: {work.carModel}
                    </div>
                    <div className="product-card-desc" style={{ marginTop: 6, fontSize: 12 }}>
                      {work.description}
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: 14 }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); openWorkModal(work); }}
                        className="btn-dark"
                        style={{ width: '100%', padding: '9px 12px', fontSize: 11, minHeight: 36 }}
                      >
                        VIEW FULL INSTALLATION 🔍
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          WHY CHOOSE OUR SEAT COVERS
      ───────────────────────────────────────────────────────────── */}
      <section className="container" style={{ padding: 'clamp(44px, 7vw, 68px) 0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ color: '#11BCE6', fontWeight: 800, fontSize: 11, letterSpacing: '0.16em' }}>
            PRECISION CRAFTSMANSHIP
          </div>
          <h2 className="sec-title" style={{ fontSize: 'clamp(22px, 4vw, 32px)', marginTop: 6 }}>
            WHY CHOOSE OUR <span style={{ color: '#11BCE6' }}>SEAT COVERS</span>
          </h2>
          <p style={{ color: '#8A929B', fontSize: 13, marginTop: 6, maxWidth: 540, marginInline: 'auto' }}>
            Built for long coastal drives, tropical weather resistance, and showroom-finish aesthetics.
          </p>
        </div>

        <div className="why-grid-4">
          {[
            {
              icon: '📐',
              title: 'Tailor-Made Bucket Fit',
              desc: 'Patterned precisely to your seat contours so there are zero loose wrinkles, shifting, or bunching.'
            },
            {
              icon: '🧵',
              title: 'Automotive Grade Fabrics',
              desc: 'Wear-tested leatherette and microfiber fabrics engineered for high heat, UV resistance, and simple wipe cleaning.'
            },
            {
              icon: '🔧',
              title: 'Zero Wire Cut / Safe Fitment',
              desc: 'Concealed fastener installations that do not tamper with factory wiring, seat adjustment rails, or airbag seams.'
            },
            {
              icon: '🛋️',
              title: 'Anti-Fatigue Cushioning',
              desc: 'High-density memory foam inner layers provide ergonomic lower back and thigh support during long journeys.'
            },
          ].map(feature => (
            <div
              key={feature.title}
              style={{
                background: '#090D11',
                border: '1px solid #1C232B',
                borderRadius: 16,
                padding: '24px 20px',
                display: 'flex',
                flexDirection: 'column'
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
                marginBottom: 14
              }}>
                {feature.icon}
              </div>
              <div style={{
                fontFamily: 'Orbitron, sans-serif',
                fontWeight: 800,
                fontSize: 13,
                color: '#FFFFFF',
                letterSpacing: '0.02em'
              }}>
                {feature.title}
              </div>
              <div style={{ color: '#8A929B', fontSize: 12, lineHeight: 1.6, marginTop: 8 }}>
                {feature.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          APPOINTMENT & CONSULTATION BOOKING FORM
      ───────────────────────────────────────────────────────────── */}
      <section id="appointment-form" className="container" style={{ padding: 'clamp(32px, 6vw, 56px) 0', maxWidth: 860 }}>
        <div style={{
          background: 'linear-gradient(135deg, #090D11 0%, #0A0F14 100%)',
          border: '1px solid #1C232B',
          borderRadius: 22,
          padding: 'clamp(24px, 5vw, 44px)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
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
              <img src={seatLogo} alt="Seat Logo" style={{ width: 18, height: 18, borderRadius: '50%' }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: '#11BCE6', letterSpacing: '0.12em' }}>
                PRIORITY SLOT RESERVATION
              </span>
            </div>
            <h2 className="sec-title" style={{ fontSize: 'clamp(22px, 4.5vw, 30px)', margin: '4px 0 0' }}>
              SCHEDULE A <span style={{ color: '#11BCE6' }}>SEAT COVER CONSULTATION</span>
            </h2>
            <p style={{ color: '#A0A7AE', fontSize: 12, marginTop: 8, lineHeight: 1.6 }}>
              Share your car details and preferred colors. Our team at ECR Junction will inspect your model, prepare custom sample swatches, and lock your priority fitment date.
            </p>
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
                CONSULTATION REQUEST RECEIVED!
              </h3>
              <p style={{ color: '#A0A7AE', fontSize: 13, marginTop: 10, maxWidth: 500, marginInline: 'auto', lineHeight: 1.6 }}>
                Thank you, <strong style={{ color: '#FFFFFF' }}>{form.full_name}</strong>. We have logged your request for your <strong style={{ color: '#FFFFFF' }}>{form.car_brand} {form.car_model}</strong>. Our seat specialist will call or WhatsApp you at <strong style={{ color: '#FFFFFF' }}>{form.phone}</strong> to confirm your slot.
              </p>
              <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href={`https://wa.me/919952637233?text=Hi%20Lee%20Car%20Accessories%2C%20I%20just%20submitted%20a%20seat%20cover%20consultation%20request%20for%20my%20${encodeURIComponent(form.car_model)}.%20Name%3A%20${encodeURIComponent(form.full_name)}`}
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
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Row 1: Name & Phone */}
              <div style={formRowStyle}>
                <div style={{ flex: 1, minWidth: 240 }}>
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
                <div style={{ flex: 1, minWidth: 240 }}>
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

              {/* Row 2: Car Brand & Model */}
              <div style={formRowStyle}>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <label style={labelStyle}>CAR BRAND</label>
                  <input
                    type="text"
                    placeholder="e.g. Hyundai / Mahindra / Maruti Suzuki / Toyota"
                    value={form.car_brand}
                    onChange={e => setForm({ ...form, car_brand: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <label style={labelStyle}>CAR MODEL & VARIANT *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Creta SX(O) / Thar LX / Swift ZXi"
                    value={form.car_model}
                    onChange={e => setForm({ ...form, car_model: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Row 3: Date & Preferred Time */}
              <div style={formRowStyle}>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <label style={labelStyle}>PREFERRED DATE</label>
                  <input
                    type="date"
                    value={form.preferred_date}
                    onChange={e => setForm({ ...form, preferred_date: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 240 }}>
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

              {/* Row 4: Preferences */}
              <div style={formRowStyle}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <label style={labelStyle}>SEAT COVER STYLE</label>
                  <select
                    value={form.seat_cover_type}
                    onChange={e => setForm({ ...form, seat_cover_type: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="Custom Bucket Fit">Custom Bucket Fit</option>
                    <option value="Modern Dual Tone">Modern Dual Tone</option>
                    <option value="Sport Racing Fit">Sport Racing Fit</option>
                    <option value="Executive Classic">Executive Classic</option>
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <label style={labelStyle}>COLOR PREFERENCE</label>
                  <select
                    value={form.colour_preference}
                    onChange={e => setForm({ ...form, colour_preference: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="Classic Black">Classic Black</option>
                    <option value="Dual Tone Black & Tan">Dual Tone Black & Tan</option>
                    <option value="Coffee Brown">Coffee Brown</option>
                    <option value="Black with Red Sport Accent">Black with Red Sport Accent</option>
                    <option value="Oxford Beige / Cream">Oxford Beige / Cream</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Notes */}
              <div>
                <label style={labelStyle}>SPECIAL REQUESTS OR DETAILS (OPTIONAL)</label>
                <textarea
                  rows={3}
                  placeholder="Tell us about rear armrests, child seats, or if you want matching steering wheel wrap..."
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
                  padding: '14px',
                  fontSize: 13,
                  letterSpacing: '0.12em',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.7 : 1
                }}
              >
                {submitting ? 'RECORDING REQUEST…' : 'CONFIRM CONSULTATION REQUEST →'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          STORE LOCATION & VISIT CONTACT
      ───────────────────────────────────────────────────────────── */}
      <section className="container" style={{ padding: '20px 0 clamp(40px, 6vw, 64px)' }}>
        <div style={{
          background: '#070B0E',
          border: '1px solid #1C232B',
          borderRadius: 18,
          padding: 'clamp(20px, 4vw, 32px)',
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
            <div style={{ fontFamily: 'Orbitron', fontWeight: 800, fontSize: 'clamp(16px, 3vw, 20px)', color: '#FFFFFF', marginTop: 4 }}>
              LEE CAR ACCESSORIES · RAMANATHAPURAM
            </div>
            <div style={{ color: '#8A929B', fontSize: 12, marginTop: 4 }}>
              {businessInfo.fullAddress} · Open 9:00 AM – 9:00 PM
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href={`tel:${businessInfo.phoneHref}`} className="btn-cyan">
              CALL {businessInfo.phoneDisplay}
            </a>
            <a href={businessInfo.whatsappHref} target="_blank" rel="noreferrer" className="btn-gold">
              WHATSAPP STORE 💬
            </a>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          DESIGN DETAIL SHOWCASE MODAL (SECTION A)
      ───────────────────────────────────────────────────────────── */}
      {selectedDesign && (
        <div className="modal-overlay" onClick={closeDesignModal}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ padding: 'clamp(20px, 4vw, 32px)' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <span style={{
                  background: 'rgba(17,188,230,0.12)',
                  color: '#11BCE6',
                  fontSize: 10,
                  fontWeight: 900,
                  padding: '4px 10px',
                  borderRadius: 999,
                  letterSpacing: '0.1em'
                }}>
                  {selectedDesign.category.toUpperCase()}
                </span>
                <h3 style={{
                  fontFamily: 'Orbitron',
                  fontWeight: 900,
                  fontSize: 'clamp(18px, 4vw, 24px)',
                  color: '#FFFFFF',
                  margin: '8px 0 2px'
                }}>
                  {selectedDesign.name}
                </h3>
                <div style={{ fontSize: 12, color: '#8A929B' }}>Style: {selectedDesign.style}</div>
              </div>

              <button
                onClick={closeDesignModal}
                aria-label="Close"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: '#0D1217',
                  border: '1px solid #1E2A33',
                  color: '#FFFFFF',
                  fontSize: 18,
                  cursor: 'pointer',
                  display: 'grid',
                  placeItems: 'center'
                }}
              >
                ×
              </button>
            </div>

            {/* Gallery: Large Image + Thumbnails */}
            <div style={{
              borderRadius: 16,
              overflow: 'hidden',
              aspectRatio: '16 / 10',
              maxHeight: 380,
              background: '#000',
              position: 'relative'
            }}>
              <img
                src={selectedDesign.images[activeDesignImgIdx] || selectedDesign.images[0]}
                alt={selectedDesign.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Thumbnails Row */}
            {selectedDesign.images.length > 1 && (
              <div style={{ display: 'flex', gap: 10, marginTop: 12, overflowX: 'auto', paddingBottom: 4 }}>
                {selectedDesign.images.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveDesignImgIdx(idx)}
                    style={{
                      width: 72,
                      height: 54,
                      borderRadius: 8,
                      overflow: 'hidden',
                      padding: 0,
                      border: idx === activeDesignImgIdx ? '2px solid #11BCE6' : '1px solid #1C232B',
                      opacity: idx === activeDesignImgIdx ? 1 : 0.6,
                      cursor: 'pointer',
                      background: '#000',
                      flexShrink: 0
                    }}
                  >
                    <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                  </button>
                ))}
              </div>
            )}

            {/* Design Information & Highlights */}
            <div style={{ marginTop: 20 }}>
              <p style={{ fontSize: 13, color: '#A0A7AE', lineHeight: 1.65 }}>
                {selectedDesign.desc}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 12,
                marginTop: 16,
                background: '#0D1217',
                padding: '14px 16px',
                borderRadius: 12,
                border: '1px solid #1C232B'
              }}>
                <div>
                  <div style={{ fontSize: 10, color: '#687078', fontWeight: 800 }}>MATERIAL SPEC</div>
                  <div style={{ fontSize: 12, color: '#FFFFFF', fontWeight: 700, marginTop: 2 }}>{selectedDesign.material}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#687078', fontWeight: 800 }}>STITCHING TECHNIQUE</div>
                  <div style={{ fontSize: 12, color: '#FFFFFF', fontWeight: 700, marginTop: 2 }}>{selectedDesign.stitchType}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#687078', fontWeight: 800 }}>FITMENT DURATION</div>
                  <div style={{ fontSize: 12, color: '#11BCE6', fontWeight: 700, marginTop: 2 }}>{selectedDesign.fitmentTime}</div>
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.06em', marginBottom: 8 }}>
                  KEY SPECIFICATIONS:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 6 }}>
                  {selectedDesign.highlights.map((h, i) => (
                    <div key={i} style={{ fontSize: 12, color: '#8A929B', display: 'flex', gap: 6 }}>
                      <span style={{ color: '#11BCE6' }}>✓</span> {h}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Action Buttons (NO cart / direct order!) */}
            <div style={{
              marginTop: 24,
              paddingTop: 18,
              borderTop: '1px solid #161D24',
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap'
            }}>
              <a
                href={`tel:${businessInfo.phoneHref}`}
                className="btn-cyan"
                style={{ flex: 1, minWidth: 160, padding: '12px' }}
              >
                📞 CALL OWNER ({businessInfo.phoneDisplay})
              </a>
              <a
                href={`https://wa.me/919952637233?text=Hi%20Lee%20Car%20Accessories%2C%20I%20am%20interested%20in%20the%20${encodeURIComponent(selectedDesign.name)}%20seat%20cover%20design%20for%20my%20car.`}
                target="_blank"
                rel="noreferrer"
                className="btn-gold btn-gold-fill"
                style={{ flex: 1, minWidth: 160, padding: '12px', textAlign: 'center' }}
              >
                💬 WHATSAPP CONSULTATION
              </a>
              <a
                href="#appointment-form"
                onClick={closeDesignModal}
                className="btn-dark"
                style={{ padding: '12px 20px' }}
              >
                BOOK APPOINTMENT ↓
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          WORK SHOWCASE LIGHTBOX MODAL (SECTION B)
      ───────────────────────────────────────────────────────────── */}
      {selectedWork && (
        <div className="modal-overlay" onClick={closeWorkModal}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ padding: 'clamp(20px, 4vw, 32px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <span style={{
                  background: 'rgba(214,154,19,0.12)',
                  color: '#D69A13',
                  fontSize: 10,
                  fontWeight: 900,
                  padding: '4px 10px',
                  borderRadius: 999,
                  letterSpacing: '0.1em'
                }}>
                  {selectedWork.category.toUpperCase()} · COMPLETED WORK
                </span>
                <h3 style={{
                  fontFamily: 'Orbitron',
                  fontWeight: 900,
                  fontSize: 'clamp(18px, 4vw, 22px)',
                  color: '#FFFFFF',
                  margin: '8px 0 2px'
                }}>
                  {selectedWork.title}
                </h3>
                <div style={{ fontSize: 12, color: '#11BCE6', fontWeight: 700 }}>
                  Installed Vehicle: {selectedWork.carModel}
                </div>
              </div>

              <button
                onClick={closeWorkModal}
                aria-label="Close"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: '#0D1217',
                  border: '1px solid #1E2A33',
                  color: '#FFFFFF',
                  fontSize: 18,
                  cursor: 'pointer',
                  display: 'grid',
                  placeItems: 'center'
                }}
              >
                ×
              </button>
            </div>

            {/* Large Image Preview */}
            <div style={{
              borderRadius: 16,
              overflow: 'hidden',
              aspectRatio: '16 / 10',
              maxHeight: 400,
              background: '#000'
            }}>
              <img
                src={selectedWork.images[activeWorkImgIdx] || selectedWork.images[0]}
                alt={selectedWork.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Thumbnails if multi-image */}
            {selectedWork.images.length > 1 && (
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                {selectedWork.images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveWorkImgIdx(i)}
                    style={{
                      width: 72,
                      height: 52,
                      borderRadius: 8,
                      overflow: 'hidden',
                      padding: 0,
                      border: i === activeWorkImgIdx ? '2px solid #11BCE6' : '1px solid #1C232B',
                      opacity: i === activeWorkImgIdx ? 1 : 0.6,
                      cursor: 'pointer',
                      background: '#000'
                    }}
                  >
                    <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                  </button>
                ))}
              </div>
            )}

            <p style={{ fontSize: 13, color: '#A0A7AE', lineHeight: 1.65, marginTop: 16 }}>
              {selectedWork.description}
            </p>

            <div style={{
              marginTop: 20,
              paddingTop: 16,
              borderTop: '1px solid #161D24',
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap'
            }}>
              <a
                href={`https://wa.me/919952637233?text=Hi%20Lee%20Car%20Accessories%2C%20I%20saw%20this%20installation%20in%20your%20Seat%20Cover%20Gallery%3A%20${encodeURIComponent(selectedWork.title)}.%20Can%20you%20do%20this%20for%20my%20car%3F`}
                target="_blank"
                rel="noreferrer"
                className="btn-gold btn-gold-fill"
                style={{ flex: 1, minWidth: 180, padding: '12px', textAlign: 'center' }}
              >
                ASK ABOUT THIS FOR MY CAR 💬
              </a>
              <a
                href={`tel:${businessInfo.phoneHref}`}
                className="btn-cyan"
                style={{ padding: '12px 24px' }}
              >
                CALL STORE
              </a>
            </div>
          </div>
        </div>
      )}
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
