import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabase'
import { businessInfo } from '../data/mockData'
import { formatINR } from '../lib/currency'

interface CheckoutFormData {
  fullName: string
  phone: string
  email: string
  address: string
  city: string
  carModel: string
  notes: string
}

const initialFormData: CheckoutFormData = {
  fullName: '',
  phone: '',
  email: '',
  address: '',
  city: 'Ramanathapuram',
  carModel: '',
  notes: '',
}

export default function Checkout() {
  const { cart, totalItems, subtotal, clearCart, hasContactForPrice } = useCart()
  const navigate = useNavigate()

  const [form, setForm] = useState<CheckoutFormData>(initialFormData)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // If cart is empty, redirect to /cart
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart', { replace: true })
    }
  }, [cart, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.fullName.trim() || !form.phone.trim() || !form.address.trim()) {
      setErrorMsg('Please fill in your Full Name, Phone Number, and Delivery/Fitting Address.')
      return
    }

    setSubmitting(true)
    setErrorMsg(null)

    // Format products summary
    const productsSummary = cart
      .map(item => `${item.title || item.name} (x${item.quantity})`)
      .join(', ')

    // Format itemized breakdown for notes
    const itemizedDetails = cart
      .map(item => `• ${item.title || item.name} — Qty: ${item.quantity} — ${item.price ? formatINR(item.price * item.quantity) : 'Contact for Price'}`)
      .join('\n')

    const formattedNotes = [
      `[CART CHECKOUT ORDER — Total: ${formatINR(subtotal)}]`,
      `City: ${form.city.trim() || 'Ramanathapuram'}`,
      itemizedDetails,
      form.notes.trim() ? `Customer Instructions: ${form.notes.trim()}` : null,
    ]
      .filter(Boolean)
      .join('\n')

    const itemsSnapshot = cart.map(item => ({
      product_id: item.id,
      product_name: item.title || item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }))

    // First attempt: with full extended columns (total_amount, city, items)
    const primaryPayload = {
      customer_name: form.fullName.trim(),
      customer_phone: form.phone.trim(),
      customer_email: form.email.trim() || null,
      car_model: form.carModel.trim() || null,
      product_id: cart[0]?.id || 'cart-order',
      product_name: productsSummary.slice(0, 250),
      quantity: totalItems,
      address: `${form.address.trim()}, ${form.city.trim()}`,
      city: form.city.trim() || null,
      notes: formattedNotes,
      total_amount: subtotal,
      items: itemsSnapshot,
      status: 'new' as const,
    }

    let orderId = ''
    let insertSuccess = false

    try {
      const { data, error } = await supabase
        .from('order_requests')
        .insert(primaryPayload)
        .select('id')

      if (!error) {
        orderId = data?.[0]?.id || ''
        insertSuccess = true
      } else {
        console.warn('[Checkout] Extended insert attempt notice:', error.message)

        // Fallback attempt: with standard core columns if total_amount/items columns are not yet in DB
        const fallbackPayload = {
          customer_name: form.fullName.trim(),
          customer_phone: form.phone.trim(),
          customer_email: form.email.trim() || null,
          car_model: form.carModel.trim() || null,
          product_id: cart[0]?.id || 'cart-order',
          product_name: productsSummary.slice(0, 250),
          quantity: totalItems,
          address: `${form.address.trim()}, ${form.city.trim()}`,
          notes: formattedNotes,
          status: 'new' as const,
        }

        const { data: fbData, error: fbError } = await supabase
          .from('order_requests')
          .insert(fallbackPayload)
          .select('id')

        if (fbError) {
          throw fbError
        }
        orderId = fbData?.[0]?.id || ''
        insertSuccess = true
      }
    } catch (err: unknown) {
      console.error('[Checkout] Order placement error:', err)
      setSubmitting(false)
      const message = err instanceof Error ? err.message : 'Unknown network issue'
      setErrorMsg(`Could not record order: ${message}. You can place this order directly via WhatsApp below.`)
      return
    }

    if (insertSuccess) {
      // Clear cart
      const completedOrder = {
        orderId: orderId || `ORD-${Date.now().toString().slice(-6)}`,
        customerName: form.fullName.trim(),
        customerPhone: form.phone.trim(),
        customerEmail: form.email.trim(),
        address: `${form.address.trim()}, ${form.city.trim()}`,
        carModel: form.carModel.trim(),
        items: [...cart],
        subtotal,
        totalItems,
        createdAt: new Date().toISOString(),
      }

      // Save to sessionStorage for order success page
      try {
        sessionStorage.setItem('lee_last_order', JSON.stringify(completedOrder))
      } catch {
        // ignore
      }

      clearCart()
      setSubmitting(false)

      navigate('/order-success', {
        state: { order: completedOrder },
        replace: true,
      })
    }
  }

  return (
    <div className="container" style={{ padding: 'clamp(24px, 4vw, 44px) 0 clamp(40px, 6vw, 64px)' }}>
      {/* Header Breadcrumbs */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: '#687078', display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8 }}>
          <Link to="/" style={{ color: '#A0A7AE' }}>HOME</Link>
          <span>/</span>
          <Link to="/cart" style={{ color: '#A0A7AE' }}>CART</Link>
          <span>/</span>
          <span style={{ color: '#11BCE6', fontWeight: 700 }}>CHECKOUT</span>
        </div>

        <div style={{ color: '#11BCE6', fontWeight: 800, fontSize: 11, letterSpacing: '0.14em' }}>
          CONFIRM YOUR REQUEST
        </div>
        <h1 className="sec-title" style={{ fontSize: 'clamp(24px, 4.5vw, 34px)', margin: '4px 0 0' }}>
          CHECKOUT & <span style={{ color: '#11BCE6' }}>ORDER REQUEST</span>
        </h1>
        <p style={{ color: '#8A929B', fontSize: 13, marginTop: 6 }}>
          No advance online payment required. Our team will verify your vehicle specifications, confirm stock, and schedule your fitment or delivery.
        </p>
      </div>

      {/* Main Two-Column Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.35fr) minmax(320px, 0.9fr)',
          gap: 'clamp(20px, 3.5vw, 36px)',
          alignItems: 'start',
        }}
        className="checkout-grid-wrap"
      >
        {/* Left Column: Customer Details Form */}
        <div
          style={{
            background: 'var(--card-bg, #090D11)',
            border: '1px solid var(--card-border, #1C232B)',
            borderRadius: 20,
            padding: 'clamp(20px, 4vw, 36px)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid var(--divider, #161D24)' }}>
            <span style={{ fontSize: 20 }}>👤</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text, #FFFFFF)' }}>CUSTOMER INFORMATION</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted2, #687078)' }}>Where should we contact and deliver/fit your order?</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Full Name & Phone Number */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <label style={labelStyle}>FULL NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mohamed Riyaz"
                  value={form.fullName}
                  onChange={e => setForm({ ...form, fullName: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div style={{ flex: 1, minWidth: 220 }}>
                <label style={labelStyle}>PHONE NUMBER *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 99526 37233"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Email & Car Model */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <label style={labelStyle}>EMAIL ADDRESS (OPTIONAL)</label>
                <input
                  type="email"
                  placeholder="e.g. customer@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div style={{ flex: 1, minWidth: 220 }}>
                <label style={labelStyle}>YOUR CAR MAKE & MODEL</label>
                <input
                  type="text"
                  placeholder="e.g. Swift ZXi / Creta SX / Thar"
                  value={form.carModel}
                  onChange={e => setForm({ ...form, carModel: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Delivery / Fitting Address */}
            <div>
              <label style={labelStyle}>DELIVERY / STORE FITTING ADDRESS *</label>
              <textarea
                rows={2}
                required
                placeholder="Door No, Street Name, Landmark (or specify: 'In-Store Fitment at ECR Junction')"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            {/* City */}
            <div>
              <label style={labelStyle}>CITY / DISTRICT *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramanathapuram, Pattinamkathan, Paramakudi, Kilakarai"
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                style={inputStyle}
              />
            </div>

            {/* Notes */}
            <div>
              <label style={labelStyle}>SPECIAL INSTRUCTIONS / PREFERENCES (OPTIONAL)</label>
              <textarea
                rows={2}
                placeholder="e.g. Need headlight fitment this Saturday morning; please call before packing"
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            {errorMsg && (
              <div
                style={{
                  padding: '12px 16px',
                  background: 'rgba(255,85,85,0.1)',
                  border: '1px solid rgba(255,85,85,0.3)',
                  borderRadius: 10,
                  color: '#FF7070',
                  fontSize: 12,
                  lineHeight: 1.5,
                }}
              >
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-cyan"
              style={{
                width: '100%',
                padding: '15px',
                fontSize: 13,
                letterSpacing: '0.1em',
                fontWeight: 900,
                marginTop: 8,
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? 'RECORDING ORDER REQUEST…' : 'CONFIRM & PLACE ORDER REQUEST →'}
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary (Sticky on Desktop) */}
        <div
          style={{
            background: 'var(--card-bg, #090D11)',
            border: '1px solid var(--card-border, #1C232B)',
            borderRadius: 20,
            padding: 'clamp(20px, 3vw, 28px)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.15)',
            position: 'sticky',
            top: 84,
          }}
        >
          <div style={{ color: '#11BCE6', fontWeight: 800, fontSize: 11, letterSpacing: '0.14em' }}>
            ORDER CONTENTS
          </div>
          <h2
            style={{
              fontFamily: 'Orbitron',
              fontWeight: 900,
              fontSize: 18,
              color: 'var(--text, #FFFFFF)',
              margin: '6px 0 16px',
            }}
          >
            ORDER SUMMARY ({totalItems} ITEMS)
          </h2>

          {/* Items Mini List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 280, overflowY: 'auto', paddingRight: 4, marginBottom: 16 }}>
            {cart.map(item => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'var(--card-item-bg, #0D1217)',
                  border: '1px solid var(--card-item-border, #1E2A33)',
                  borderRadius: 12,
                  padding: '8px 10px',
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 12, color: 'var(--text, #FFFFFF)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted2, #687078)', marginTop: 2 }}>
                    Qty: {item.quantity}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {item.contact_for_price || item.price === null ? (
                    <span style={{ color: '#D69A13', fontSize: 11, fontWeight: 800 }}>Quote</span>
                  ) : (
                    <span style={{ color: '#00C8F0', fontWeight: 800, fontSize: 12 }}>
                      {formatINR((item.price || 0) * item.quantity)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div style={{ borderTop: '1px solid var(--divider, #161D24)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-muted, #A0A7AE)' }}>
              <span>Subtotal:</span>
              <strong style={{ color: 'var(--text, #FFFFFF)' }}>{formatINR(subtotal)}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-muted, #A0A7AE)' }}>
              <span>In-Store Fitment:</span>
              <span style={{ color: '#00C864', fontWeight: 800 }}>FREE AT ECR STORE</span>
            </div>

            {hasContactForPrice && (
              <div style={{ fontSize: 11, color: '#D69A13', lineHeight: 1.4 }}>
                ⓘ Items with custom sizing or specifications will be quoted upon call confirmation.
              </div>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                borderTop: '1px solid var(--divider, #1C232B)',
                paddingTop: 12,
                marginTop: 4,
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--text, #FFFFFF)' }}>Estimated Total:</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted2, #687078)' }}>Pay upon fitting or delivery</div>
              </div>
              <div style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: 22, color: '#00C8F0' }}>
                {formatINR(subtotal)}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11, color: '#687078', borderTop: '1px solid #161D24', paddingTop: 14 }}>
            <div>🔒 Safe & Direct Order Booking</div>
            <div>📍 Store Pickup: {businessInfo.fullAddress}</div>
            <div>📞 Questions? Call {businessInfo.phoneDisplay}</div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .checkout-grid-wrap {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 10,
  letterSpacing: '0.1em',
  fontWeight: 800,
  color: 'var(--text-muted, #A0A7AE)',
  marginBottom: 6,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--card-item-bg, #0D1217)',
  border: '1px solid var(--border, #1E2A33)',
  borderRadius: 10,
  padding: '12px 14px',
  color: 'var(--text, #FFFFFF)',
  outline: 'none',
  fontSize: 13,
  boxSizing: 'border-box',
}
