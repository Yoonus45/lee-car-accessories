import { useState } from 'react'
import { Link } from 'react-router-dom'
import { businessInfo } from '../data/mockData'
import { supabase } from '../lib/supabase'

export default function Contact() {
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [msg, setMsg] = useState('')

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !phone) {
      alert('Please fill in your name and phone number')
      return
    }
    setSubmitting(true)
    setSubmitError(null)

    const { error } = await supabase.from('contact_messages').insert({
      customer_name: name.trim(),
      customer_phone: phone.trim(),
      message: msg.trim() || null,
      status: 'unread' as const,
    })

    setSubmitting(false)
    if (error) {
      setSubmitError('Could not send message. Please contact us directly on WhatsApp.')
    } else {
      setSent(true)
    }
  }

  return (
    <div className="container" style={{ paddingTop: 24, width: '100%', overflowX: 'hidden' }}>
      <div className="contact-grid">
        {/* Left: Contact Info & Quick Message */}
        <div style={{ minWidth: 0 }}>
          <div style={{ color: '#11BCE6', fontWeight: 800, fontSize: 11, letterSpacing: '0.16em' }}>
            GET IN TOUCH
          </div>
          <h1 className="sec-title" style={{ fontSize: 'clamp(24px, 4vw, 32px)', marginTop: 6, margin: '6px 0 0' }}>
            CONTACT <span style={{ color: '#11BCE6' }}>LEE CAR ACCESSORIES</span>
          </h1>
          <div style={{ color: '#687078', fontSize: 12, marginTop: 8, lineHeight: 1.6 }}>
            Visit our store at ECR Junction, Ramanathapuram or reach out directly for quotes, inquiries, and appointments.
          </div>

          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'PHONE NUMBER', value: businessInfo.phoneDisplay, icon: '☎', href: `tel:${businessInfo.phoneHref}` },
              { label: 'WHATSAPP DIRECT', value: '+91 99526 37233 (Instant Chat)', icon: '💬', href: businessInfo.whatsappHref },
              { label: 'STORE ADDRESS', value: businessInfo.fullAddress, icon: '📍', href: businessInfo.mapsUrl },
              { label: 'WORKING HOURS', value: businessInfo.hours, icon: '◷', href: undefined },
            ].map(r => (
              <a
                key={r.label}
                href={r.href}
                target={r.href?.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'center',
                  background: 'var(--card-bg, #090D11)',
                  border: '1px solid var(--card-border, #1C232B)',
                  borderRadius: 14,
                  padding: '14px 16px',
                  minWidth: 0,
                  transition: 'border-color .2s ease'
                }}
                className="hover-card"
              >
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: 'var(--card-item-bg, #0D1217)',
                  border: '1px solid var(--card-item-border, #1E2A33)',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#11BCE6',
                  fontSize: 16,
                  flexShrink: 0
                }}>
                  {r.icon}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 10, letterSpacing: '0.1em', fontWeight: 800, color: 'var(--text-muted2, #687078)' }}>
                    {r.label}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text, #FFFFFF)', marginTop: 3, wordBreak: 'break-word', fontWeight: 600 }}>
                    {r.value}
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Google Rating Snippet */}
          <div style={{
            marginTop: 16,
            background: 'var(--card-item-bg, #0D1217)',
            border: '1px solid var(--card-item-border, #1E2A33)',
            borderRadius: 14,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 8
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#D69A13', fontSize: 14 }}>★</span>
              <span style={{ fontWeight: 800, fontSize: 13 }}>{businessInfo.rating.toFixed(1)} / 5</span>
              <span style={{ fontSize: 11, color: '#687078' }}>· ~{businessInfo.reviewCount} Google reviews</span>
            </div>
            <Link
              to="/reviews"
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: '#11BCE6',
                border: '1px solid rgba(17,188,230,0.3)',
                padding: '4px 10px',
                borderRadius: 999
              }}
            >
              READ REVIEWS
            </Link>
          </div>

          {/* Quick Contact Form */}
          <form
            onSubmit={handleSend}
            style={{
              marginTop: 18,
              background: 'var(--card-bg, #090D11)',
              border: '1px solid var(--card-border, #1C232B)',
              borderRadius: 16,
              padding: '18px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 11, letterSpacing: '0.1em', color: '#11BCE6' }}>
              LEAVE A DIRECT MESSAGE
            </div>
            <input
              type="text"
              placeholder="Your Name *"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={{
                background: '#0D1217',
                border: '1px solid #1E2A33',
                borderRadius: 10,
                padding: '12px 14px',
                color: '#FFFFFF',
                outline: 'none',
                minHeight: 44
              }}
            />
            <input
              type="tel"
              placeholder="Phone Number *"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
              style={{
                background: '#0D1217',
                border: '1px solid #1E2A33',
                borderRadius: 10,
                padding: '12px 14px',
                color: '#FFFFFF',
                outline: 'none',
                minHeight: 44
              }}
            />
            <textarea
              placeholder="Your requirement / car model..."
              rows={3}
              value={msg}
              onChange={e => setMsg(e.target.value)}
              style={{
                background: '#0D1217',
                border: '1px solid #1E2A33',
                borderRadius: 10,
                padding: '12px 14px',
                color: '#FFFFFF',
                outline: 'none',
                minHeight: 70,
                resize: 'vertical'
              }}
            />

            {submitError && (
              <div style={{
                background: 'rgba(255,60,60,0.08)', border: '1px solid rgba(255,60,60,0.25)',
                color: '#FF5555', borderRadius: 10, padding: '10px', fontSize: 12
              }}>
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || sent}
              className="btn-cyan"
              style={{ width: '100%', padding: '12px', opacity: submitting ? 0.7 : 1 }}
            >
              {sent ? 'MESSAGE RECEIVED ✓' : submitting ? 'SENDING…' : 'SEND MESSAGE →'}
            </button>
            {sent && (
              <div style={{ fontSize: 11, color: '#11BCE6', textAlign: 'center', fontWeight: 600 }}>
                Thank you! Our shop staff will get back to you at {phone}.
              </div>
            )}
          </form>
        </div>

        {/* Right: Real Google Maps Location */}
        <div style={{ minWidth: 0 }}>
          <div style={{
            background: 'var(--card-bg, #090D11)',
            border: '1px solid var(--card-border, #1C232B)',
            borderRadius: 18,
            overflow: 'hidden',
            height: 380,
            position: 'relative'
          }}>
            <iframe
              title="Lee Car Accessories Ramanathapuram Map"
              src={businessInfo.mapsEmbed}
              style={{ width: '100%', height: '100%', border: 0, filter: 'grayscale(0.15) contrast(1.08)' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div style={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              right: 12,
              display: 'flex',
              justifyContent: 'center',
              pointerEvents: 'none'
            }}>
              <div style={{
                background: 'var(--card-bg, #0D1217)',
                border: '1px solid var(--card-border, #1E2A33)',
                borderRadius: 12,
                padding: '10px 14px',
                display: 'flex',
                gap: 10,
                alignItems: 'center',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                pointerEvents: 'auto',
                maxWidth: '100%'
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: '#11BCE6', display: 'grid', placeItems: 'center',
                  color: '#02141B', fontWeight: 900, fontSize: 13, flexShrink: 0
                }}>📍</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 11, color: 'var(--text, #FFFFFF)' }}>LEE CAR ACCESSORIES</div>
                  <div style={{ fontSize: 10, color: '#687078', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    No. 01, SK Complex, ECR Junction
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <a
              href={businessInfo.whatsappHref}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8,
                background: '#25D366',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: 12,
                letterSpacing: '0.06em',
                padding: '13px',
                borderRadius: 999,
                minHeight: 44,
                boxSizing: 'border-box'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12 2a10 10 0 0 0-8.6 15l-1 3.6 3.7-1A10 10 0 1 0 12 2zm5.2 14.3c-.3.8-1.5 1.5-2.1 1.6-.6.1-1.1.1-1.8-.1-.5-.2-1.1-.5-1.9-1-.7-.5-1.4-1.2-1.9-2-.5-.8-.9-1.7-1-2.6 0-.9.2-1.3.5-1.8l.4-.6c.2-.3.4-.5.6-.5h.6c.2 0 .4 0 .6.5l.8 1.9c.1.3.1.5 0 .7-.1.2-.2.4-.4.6l-.4.4c-.1.1-.2.3-.1.5.1.2.5.8 1 1.4.6.7 1.1 1.1 1.5 1.4.2.1.4.2.5.1l.5-.5c.2-.2.4-.3.6-.4.2 0 .4 0 .7.1l1.9.9c.4.2.5.3.6.5v.6c0 .3-.2.7-.5 1z" />
              </svg>
              CHAT ON WHATSAPP
            </a>

            <a
              href={businessInfo.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-cyan"
              style={{ padding: '12px' }}
            >
              OPEN IN GOOGLE MAPS →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
