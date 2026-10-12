import { useParams, Link } from 'react-router-dom'
import { useProduct } from '../hooks/useProduct'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { businessInfo } from '../data/mockData'
import { formatINR } from '../lib/currency'

interface OrderForm {
  customer_name: string
  customer_phone: string
  customer_email: string
  car_model: string
  address: string
  notes: string
}

const emptyForm: OrderForm = {
  customer_name: '',
  customer_phone: '',
  customer_email: '',
  car_model: '',
  address: '',
  notes: '',
}

export default function ProductDetail() {
  const { id } = useParams()
  const { product, loading } = useProduct(id)
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)

  // Order modal state
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<OrderForm>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: 60, textAlign: 'center', color: '#687078' }}>
        Loading product…
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container" style={{ paddingTop: 60, textAlign: 'center', color: '#687078' }}>
        Product not found. <Link to="/shop" style={{ color: '#11BCE6' }}>Back to Shop</Link>
      </div>
    )
  }

  const imgs = product.images?.length ? product.images : [product.image]
  const isContactForPrice = product.contact_for_price

  async function submitOrder(e: React.FormEvent) {
    e.preventDefault()
    if (!form.customer_name || !form.customer_phone) {
      setSubmitError('Please fill in your name and phone number.')
      return
    }
    setSubmitting(true)
    setSubmitError(null)

    const { error } = await supabase.from('order_requests').insert({
      customer_name: form.customer_name.trim(),
      customer_phone: form.customer_phone.trim(),
      customer_email: form.customer_email.trim() || null,
      car_model: form.car_model.trim() || null,
      product_id: product!.id,
      product_name: product!.name,
      quantity: qty,
      address: form.address.trim() || null,
      notes: form.notes.trim() || null,
      status: 'new' as const,
    })

    setSubmitting(false)
    if (error) {
      setSubmitError('Could not place order. Please try WhatsApp or call us directly.')
    } else {
      setSubmitted(true)
    }
  }

  function closeModal() {
    setShowModal(false)
    setSubmitted(false)
    setSubmitError(null)
    setForm(emptyForm)
  }

  return (
    <>
      <div className="container" style={{ paddingTop: 20, width: '100%', overflowX: 'hidden' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: 11, color: '#687078', display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: '#A0A7AE' }}>HOME</Link>
          <span>/</span>
          <Link to="/shop" style={{ color: '#A0A7AE' }}>SHOP</Link>
          <span>/</span>
          <span style={{ color: '#11BCE6', fontWeight: 700 }}>{product.title}</span>
        </div>

        <div className="pd-grid" style={{ marginTop: 18 }}>
          {/* Left: Product Images Gallery */}
          <div style={{ minWidth: 0 }}>
            <div style={{
              background: '#090D11',
              border: '1px solid #1C232B',
              borderRadius: 16,
              overflow: 'hidden',
              aspectRatio: '1',
              display: 'grid',
              placeItems: 'center',
              padding: 12,
              position: 'relative'
            }}>
              <img
                src={imgs[activeImg] || product.image}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }}
                alt={product.name}
              />
              <span style={{
                position: 'absolute',
                top: 16,
                left: 16,
                background: 'rgba(5,7,8,0.85)',
                border: '1px solid #1E2A33',
                padding: '4px 10px',
                borderRadius: 999,
                fontSize: 10,
                fontWeight: 800,
                color: '#11BCE6'
              }}>
                {product.category}
              </span>
            </div>

            {/* Thumbnails */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 12 }}>
              {imgs.slice(0, 4).map((src: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  aria-label={`View Image ${i + 1}`}
                  style={{
                    aspectRatio: '1',
                    borderRadius: 10,
                    overflow: 'hidden',
                    border: i === activeImg ? '2px solid #11BCE6' : '1px solid #1C232B',
                    opacity: i === activeImg ? 1 : 0.65,
                    padding: 0,
                    cursor: 'pointer',
                    background: '#090D11',
                    transition: 'all .2s ease'
                  }}
                >
                  <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Details */}
          <div style={{ minWidth: 0 }}>
            <h1 style={{
              fontFamily: 'Orbitron',
              fontWeight: 900,
              fontSize: 'clamp(20px, 4vw, 26px)',
              lineHeight: 1.15,
              margin: 0,
              color: '#FFFFFF'
            }}>
              {product.name}
            </h1>

            <div style={{ fontSize: 11, letterSpacing: '0.08em', fontWeight: 700, color: '#687078', marginTop: 6 }}>
              {product.category} · Available at {businessInfo.name}, Ramanathapuram
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10, flexWrap: 'wrap' }}>
              <div style={{ color: '#D69A13', fontSize: 14, letterSpacing: '0.04em' }}>★★★★★</div>
              <span style={{ fontSize: 12, color: '#FFFFFF', fontWeight: 800 }}>{product.rating}</span>
              <span style={{ fontSize: 11, color: '#687078' }}>({product.reviews_count} customer reviews)</span>
            </div>

            {/* Pricing */}
            <div style={{ marginTop: 16, background: 'var(--card-bg, #090D11)', border: '1px solid var(--card-border, #1C232B)', borderRadius: 12, padding: '14px 18px' }}>
              {isContactForPrice ? (
                <div>
                  <span style={{ color: '#D69A13', fontWeight: 900, fontSize: 22 }}>Contact for Price</span>
                  <div style={{ fontSize: 11, color: '#A0A7AE', marginTop: 4 }}>
                    Pricing depends on vehicle model, seat row count, and material choice.
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ color: '#00C8F0', fontWeight: 900, fontSize: 26 }}>{formatINR(product.price)}</span>
                    {product.mrp && (
                      <span style={{ color: '#687078', fontWeight: 600, fontSize: 14, textDecoration: 'line-through' }}>
                        MRP {formatINR(product.mrp)}
                      </span>
                    )}
                    <span style={{ background: 'rgba(17,188,230,0.1)', color: '#11BCE6', fontWeight: 800, fontSize: 10, padding: '3px 8px', borderRadius: 999 }}>
                      STORE FITMENT INCLUDED
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: '#687078', marginTop: 4 }}>
                    Inclusive of all taxes. 100% genuine guaranteed.
                  </div>
                </div>
              )}
            </div>

            {/* Key Bullet Features */}
            <ul style={{ marginTop: 16, paddingLeft: 18, color: '#A0A7AE', fontSize: 12, lineHeight: 1.8 }}>
              <li>Precision installation by certified technicians at our ECR store</li>
              <li>Coupler-to-coupler connection with zero factory wire splicing</li>
              <li>Store warranty with replacement guarantee</li>
              <li>Same-day fitment available on prior booking</li>
            </ul>

            {/* Quantity Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 18, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, letterSpacing: '0.1em', fontWeight: 700, color: '#A0A7AE' }}>
                QUANTITY
              </span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: '#090D11',
                border: '1px solid #1C232B',
                borderRadius: 999,
                padding: '4px 8px'
              }}>
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  aria-label="Decrease Quantity"
                  style={{
                    width: 34, height: 34, borderRadius: '50%',
                    border: '1px solid #1E2A33', background: '#0D1217',
                    color: '#FFFFFF', fontSize: 16, cursor: 'pointer',
                    display: 'grid', placeItems: 'center'
                  }}
                >−</button>
                <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 800, fontSize: 15, color: '#FFFFFF' }}>
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  aria-label="Increase Quantity"
                  style={{
                    width: 34, height: 34, borderRadius: '50%',
                    border: '1px solid #1E2A33', background: '#0D1217',
                    color: '#FFFFFF', fontSize: 16, cursor: 'pointer',
                    display: 'grid', placeItems: 'center'
                  }}
                >+</button>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="pd-buttons-grid">
              <button
                onClick={() => setShowModal(true)}
                className="btn-cyan"
                style={{ width: '100%', padding: '14px' }}
              >
                PLACE ORDER REQUEST
              </button>
              <a
                href={`${businessInfo.whatsappHref}?text=Hi,%20I%20am%20interested%20in%20${encodeURIComponent(product.name)}`}
                target="_blank"
                rel="noreferrer"
                className="btn-gold btn-gold-fill"
                style={{ width: '100%', padding: '14px', textAlign: 'center' }}
              >
                ENQUIRE ON WHATSAPP
              </a>
            </div>

            {/* Secondary Quick Contact Buttons */}
            <div className="pd-buttons-grid" style={{ marginTop: 10 }}>
              <a
                href={`tel:${businessInfo.phoneHref}`}
                className="btn-dark"
                style={{ width: '100%', padding: '12px' }}
              >
                ☎ CALL {businessInfo.phoneDisplay}
              </a>
              <Link
                to="/booking"
                className="btn-dark"
                style={{ width: '100%', padding: '12px', borderColor: '#11BCE6', color: '#11BCE6' }}
              >
                BOOK FITMENT APPOINTMENT
              </Link>
            </div>
          </div>
        </div>

        {/* Description & Warranty Specifications */}
        <div style={{
          marginTop: 32,
          background: 'var(--card-bg, #090D11)',
          border: '1px solid var(--card-border, #1C232B)',
          borderRadius: 16,
          padding: '24px 22px'
        }}>
          <div style={{ fontWeight: 800, fontSize: 12, letterSpacing: '0.1em', paddingBottom: 12, borderBottom: '1px solid var(--divider, #1C232B)', color: 'var(--cyan, #00C8F0)' }}>
            TECHNICAL SPECIFICATIONS & FITMENT DETAILS
          </div>
          <p style={{ color: '#A0A7AE', fontSize: 13, lineHeight: 1.75, marginTop: 14 }}>
            {product.long_desc}
          </p>

          <div className="subfeature-grid-4" style={{ marginTop: 22 }}>
            {[
              { t: 'PREMIUM BRANDED', d: 'Zero counterfeit guarantee', i: '◆' },
              { t: 'STORE INSTALLATION', d: 'At ECR SK Complex shop', i: '⚙' },
              { t: 'STORE WARRANTY', d: 'Assured service support', i: '🛡' },
              { t: 'INSTANT SUPPORT', d: businessInfo.phoneDisplay, i: '☎' },
            ].map(f => (
              <div key={f.t} style={{
                background: 'var(--card-item-bg, #0D1217)',
                border: '1px solid var(--card-item-border, #1C232B)',
                borderRadius: 12,
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{ color: '#11BCE6', fontSize: 18, marginBottom: 8 }}>{f.i}</div>
                <div style={{ fontWeight: 800, fontSize: 11 }}>{f.t}</div>
                <div style={{ fontSize: 11, color: '#687078', marginTop: 4 }}>{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== ORDER REQUEST MODAL ===== */}
      {showModal && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px', overflowY: 'auto'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--card-bg, #090D11)',
              border: '1px solid var(--card-border, #1C232B)',
              borderRadius: 18,
              width: '100%',
              maxWidth: 520,
              padding: '24px 22px',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            {/* Close */}
            <button
              onClick={closeModal}
              style={{
                position: 'absolute', top: 14, right: 14,
                width: 32, height: 32, borderRadius: '50%',
                border: '1px solid #1E2A33', background: '#0D1217',
                color: '#A0A7AE', fontSize: 16, cursor: 'pointer',
                display: 'grid', placeItems: 'center'
              }}
              aria-label="Close order modal"
            >×</button>

            {submitted ? (
              /* Success state */
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                <div style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: 18, color: '#11BCE6' }}>
                  ORDER REQUEST RECEIVED!
                </div>
                <div style={{ color: '#A0A7AE', fontSize: 12, marginTop: 10, lineHeight: 1.65 }}>
                  Thank you, <strong style={{ color: '#FFFFFF' }}>{form.customer_name}</strong>!<br />
                  Our team at Lee Car Accessories will contact you at<br />
                  <strong style={{ color: '#11BCE6' }}>{form.customer_phone}</strong> shortly to confirm your order.
                </div>
                <div style={{ marginTop: 18, display: 'flex', gap: 10, flexDirection: 'column' }}>
                  <a
                    href={`${businessInfo.whatsappHref}?text=Hi!%20I%20just%20placed%20an%20order%20request%20for%20${encodeURIComponent(product.name)}.%20Please%20confirm.`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8,
                      background: '#25D366', color: '#FFF', fontWeight: 800,
                      fontSize: 11, padding: '12px', borderRadius: 999
                    }}
                  >
                    ALSO SEND ON WHATSAPP
                  </a>
                  <button onClick={closeModal} className="btn-dark" style={{ width: '100%', padding: '12px' }}>
                    CLOSE
                  </button>
                </div>
              </div>
            ) : (
              /* Form state */
              <>
                <div style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: 16, color: '#FFFFFF', paddingRight: 40 }}>
                  PLACE ORDER REQUEST
                </div>
                <div style={{ fontSize: 11, color: '#687078', marginTop: 4 }}>
                  Product: <span style={{ color: '#11BCE6', fontWeight: 700 }}>{product.name}</span>
                  {' · '}Qty: {qty}
                </div>

                <form onSubmit={submitOrder} style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { key: 'customer_name', label: 'FULL NAME', ph: 'Your full name', type: 'text', req: true },
                    { key: 'customer_phone', label: 'PHONE NUMBER', ph: '+91 99526 00000', type: 'tel', req: true },
                    { key: 'customer_email', label: 'EMAIL (OPTIONAL)', ph: 'your@email.com', type: 'email', req: false },
                    { key: 'car_model', label: 'CAR MAKE & MODEL', ph: 'e.g. Hyundai Creta 2023', type: 'text', req: false },
                    { key: 'address', label: 'DELIVERY / PICKUP ADDRESS', ph: 'Your address or "Store Pickup"', type: 'text', req: false },
                  ].map(f => (
                    <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <label style={{ fontSize: 10, letterSpacing: '0.1em', fontWeight: 800, color: '#A0A7AE' }}>
                        {f.label} {f.req && <span style={{ color: '#11BCE6' }}>*</span>}
                      </label>
                      <input
                        type={f.type}
                        placeholder={f.ph}
                        required={f.req}
                        value={(form as unknown as Record<string, string>)[f.key]}
                        onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                        style={{
                          background: '#0D1217', border: '1px solid #1E2A33',
                          borderRadius: 10, padding: '11px 13px',
                          color: '#FFFFFF', outline: 'none',
                          width: '100%', minHeight: 44, boxSizing: 'border-box', fontSize: 13
                        }}
                      />
                    </div>
                  ))}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <label style={{ fontSize: 10, letterSpacing: '0.1em', fontWeight: 800, color: '#A0A7AE' }}>
                      ADDITIONAL NOTES
                    </label>
                    <textarea
                      placeholder="Color preference, car trim level, specific requirements…"
                      rows={3}
                      value={form.notes}
                      onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                      style={{
                        background: '#0D1217', border: '1px solid #1E2A33',
                        borderRadius: 10, padding: '11px 13px',
                        color: '#FFFFFF', outline: 'none',
                        width: '100%', minHeight: 70, boxSizing: 'border-box',
                        resize: 'vertical', fontSize: 13
                      }}
                    />
                  </div>

                  {submitError && (
                    <div style={{
                      background: 'rgba(255,60,60,0.08)', border: '1px solid rgba(255,60,60,0.25)',
                      color: '#FF5555', borderRadius: 10, padding: '10px 13px', fontSize: 12
                    }}>
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-cyan"
                    style={{ width: '100%', padding: '14px', opacity: submitting ? 0.7 : 1 }}
                  >
                    {submitting ? 'SUBMITTING…' : 'CONFIRM ORDER REQUEST →'}
                  </button>

                  <div style={{ textAlign: 'center', fontSize: 11, color: '#687078' }}>
                    Our team will contact you at your phone number to confirm and arrange fitment.
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
