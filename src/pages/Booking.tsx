import { useState } from 'react'
import { businessInfo } from '../data/mockData'
import { supabase } from '../lib/supabase'

export default function Booking() {
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    model: '',
    service: '',
    date: '',
    time: '',
    notes: ''
  })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone) {
      alert('Please fill in required name and phone number')
      return
    }
    setSubmitting(true)
    setSubmitError(null)

    const { error } = await supabase.from('bookings').insert({
      customer_name: form.name.trim(),
      customer_phone: form.phone.trim(),
      car_model: form.model.trim() || null,
      service_required: form.service.trim() || null,
      preferred_date: form.date || null,
      preferred_time: form.time || null,
      notes: form.notes.trim() || null,
      status: 'pending' as const,
    })

    setSubmitting(false)
    if (error) {
      setSubmitError('Could not submit booking. Please contact us directly on WhatsApp or call.')
    } else {
      setDone(true)
    }
  }

  return (
    <div className="container" style={{ paddingTop: 24, maxWidth: 740, width: '100%', overflowX: 'hidden' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#11BCE6', fontWeight: 800, fontSize: 11, letterSpacing: '0.16em' }}>
          PROFESSIONAL FITMENT
        </div>
        <h1 className="sec-title" style={{ fontSize: 'clamp(22px, 4.5vw, 30px)', marginTop: 6, margin: '6px 0 0' }}>
          SCHEDULE AN <span style={{ color: '#11BCE6' }}>APPOINTMENT</span>
        </h1>
        <div style={{ color: '#A0A7AE', fontSize: 12, marginTop: 8, lineHeight: 1.65 }}>
          Book a priority slot at our store: {businessInfo.fullAddress}<br />
          Or reach us directly on WhatsApp / Call: <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{businessInfo.phoneDisplay}</span>
        </div>
      </div>

      <form
        onSubmit={submit}
        className="booking-form"
        style={{
          marginTop: 24,
          background: '#090D11',
          border: '1px solid #1C232B',
          borderRadius: 18,
          padding: '26px 22px',
          display: 'grid',
          gap: 16
        }}
      >
        {[
          { k: 'name', label: 'FULL NAME', ph: 'Enter your name', type: 'text', req: true },
          { k: 'phone', label: 'PHONE NUMBER', ph: 'e.g. 99526 37233', type: 'tel', req: true },
          { k: 'model', label: 'CAR MAKE & MODEL', ph: 'e.g. Swift 2023 / Creta / Thar', type: 'text', req: false },
          { k: 'service', label: 'SERVICE REQUIRED', ph: 'e.g. Leather Seats / LED Lights', type: 'text', req: false },
          { k: 'date', label: 'PREFERRED DATE', ph: '', type: 'date', req: false },
          { k: 'time', label: 'PREFERRED TIME', ph: '', type: 'time', req: false },
        ].map(f => (
          <div key={f.k} style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
            <label style={{ fontSize: 10, letterSpacing: '0.1em', fontWeight: 800, color: '#A0A7AE' }}>
              {f.label} {f.req && <span style={{ color: '#11BCE6' }}>*</span>}
            </label>
            <input
              value={(form as Record<string,string>)[f.k]}
              onChange={e => setForm({ ...form, [f.k]: e.target.value })}
              type={f.type}
              placeholder={f.ph}
              required={f.req}
              style={{
                background: '#0D1217',
                border: '1px solid #1E2A33',
                borderRadius: 10,
                padding: '12px 14px',
                color: '#FFFFFF',
                outline: 'none',
                width: '100%',
                minHeight: 46,
                boxSizing: 'border-box'
              }}
            />
          </div>
        ))}

        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 10, letterSpacing: '0.1em', fontWeight: 800, color: '#A0A7AE' }}>
            CUSTOM REQUIREMENTS / NOTES
          </label>
          <textarea
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            rows={3}
            placeholder="Specify any details like color preference, car trim, or specific audio model..."
            style={{
              background: '#0D1217',
              border: '1px solid #1E2A33',
              borderRadius: 10,
              padding: '12px 14px',
              color: '#FFFFFF',
              outline: 'none',
              resize: 'vertical',
              width: '100%',
              minHeight: 80,
              boxSizing: 'border-box'
            }}
          />
        </div>

        {submitError && (
          <div style={{
            gridColumn: '1 / -1',
            background: 'rgba(255,60,60,0.08)',
            border: '1px solid rgba(255,60,60,0.25)',
            color: '#FF5555',
            borderRadius: 10,
            padding: '12px',
            fontSize: 12
          }}>
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || done}
          className="btn-cyan"
          style={{ gridColumn: '1 / -1', width: '100%', padding: '14px', opacity: submitting ? 0.7 : 1 }}
        >
          {done ? 'APPOINTMENT REQUESTED ✓' : submitting ? 'SUBMITTING…' : 'CONFIRM APPOINTMENT REQUEST →'}
        </button>

        {done && (
          <div style={{
            gridColumn: '1 / -1',
            background: 'rgba(17,188,230,0.1)',
            border: '1px solid rgba(17,188,230,0.3)',
            color: '#11BCE6',
            borderRadius: 10,
            padding: '12px',
            textAlign: 'center',
            fontSize: 12,
            fontWeight: 700
          }}>
            Thank you! We will call you shortly at {form.phone} to confirm your appointment at Lee Car Accessories.
          </div>
        )}

        <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#687078', fontSize: 11, marginTop: 4 }}>
          Or connect instantly with our shop
        </div>

        <div style={{
          gridColumn: '1 / -1',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12
        }}>
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
              fontSize: 11,
              letterSpacing: '0.06em',
              padding: '13px',
              borderRadius: 999,
              minHeight: 44,
              boxSizing: 'border-box'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 2a10 10 0 0 0-8.6 15l-1 3.6 3.7-1A10 10 0 1 0 12 2zm5.2 14.3c-.3.8-1.5 1.5-2.1 1.6-.6.1-1.1.1-1.8-.1-.5-.2-1.1-.5-1.9-1-.7-.5-1.4-1.2-1.9-2-.5-.8-.9-1.7-1-2.6 0-.9.2-1.3.5-1.8l.4-.6c.2-.3.4-.5.6-.5h.6c.2 0 .4 0 .6.5l.8 1.9c.1.3.1.5 0 .7-.1.2-.2.4-.4.6l-.4.4c-.1.1-.2.3-.1.5.1.2.5.8 1 1.4.6.7 1.1 1.1 1.5 1.4.2.1.4.2.5.1l.5-.5c.2-.2.4-.3.6-.4.2 0 .4 0 .7.1l1.9.9c.4.2.5.3.6.5v.6c0 .3-.2.7-.5 1z" />
            </svg>
            WHATSAPP US
          </a>

          <a
            href={`tel:${businessInfo.phoneHref}`}
            className="btn-cyan"
            style={{ padding: '13px', fontSize: 11 }}
          >
            CALL {businessInfo.phoneDisplay}
          </a>
        </div>
      </form>
    </div>
  )
}
