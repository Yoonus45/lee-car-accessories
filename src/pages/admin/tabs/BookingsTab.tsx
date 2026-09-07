import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import type { DbBooking } from '../../../types/database'

const STATUS_OPTIONS = ['pending', 'confirmed', 'completed', 'cancelled'] as const
type BookingStatus = typeof STATUS_OPTIONS[number]

const STATUS_COLORS: Record<BookingStatus, { bg: string; color: string }> = {
  pending: { bg: 'rgba(17,188,230,0.12)', color: '#11BCE6' },
  confirmed: { bg: 'rgba(214,154,19,0.12)', color: '#D69A13' },
  completed: { bg: 'rgba(0,200,100,0.12)', color: '#00C864' },
  cancelled: { bg: 'rgba(255,85,85,0.12)', color: '#FF5555' },
}

export default function BookingsTab() {
  const [bookings, setBookings] = useState<DbBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<BookingStatus | 'all'>('all')

  useEffect(() => { fetchBookings() }, [])

  async function fetchBookings() {
    setLoading(true)
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
    setBookings(data || [])
    setLoading(false)
  }

  async function updateStatus(id: string, status: BookingStatus) {
    await supabase.from('bookings').update({ status }).eq('id', id)
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
  }

  const filtered = filterStatus === 'all' ? bookings : bookings.filter(b => b.status === filterStatus)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 900, fontSize: 18, color: '#FFFFFF', margin: 0 }}>
            BOOKINGS
          </h2>
          <div style={{ fontSize: 11, color: '#687078', marginTop: 4 }}>
            {bookings.length} total · {bookings.filter(b => b.status === 'pending').length} pending
          </div>
        </div>
        <button onClick={fetchBookings} style={refreshBtnStyle}>↻ Refresh</button>
      </div>

      {/* Status filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {(['all', ...STATUS_OPTIONS] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            style={{
              padding: '6px 14px', borderRadius: 999,
              border: `1px solid ${filterStatus === s ? '#11BCE6' : '#1E2A33'}`,
              background: filterStatus === s ? 'rgba(17,188,230,0.12)' : 'transparent',
              color: filterStatus === s ? '#11BCE6' : '#A0A7AE',
              fontSize: 11, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize'
            }}
          >{s}</button>
        ))}
      </div>

      {loading ? <LoadingRow /> : filtered.length === 0 ? <EmptyRow text="No bookings yet." /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(b => (
            <div key={b.id} style={cardStyle}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: '#FFFFFF' }}>{b.customer_name}</div>
                  <div style={{ fontSize: 11, color: '#687078', marginTop: 2 }}>{formatDate(b.created_at)}</div>
                </div>
                <StatusBadge status={b.status as BookingStatus} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginTop: 12 }}>
                <InfoPill label="PHONE" value={b.customer_phone} />
                {b.car_model && <InfoPill label="CAR MODEL" value={b.car_model} />}
                {b.service_required && <InfoPill label="SERVICE" value={b.service_required} />}
                {b.preferred_date && <InfoPill label="PREF. DATE" value={b.preferred_date} />}
                {b.preferred_time && <InfoPill label="PREF. TIME" value={b.preferred_time} />}
                {b.notes && <InfoPill label="NOTES" value={b.notes} />}
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14, alignItems: 'center' }}>
                <a href={`tel:${b.customer_phone.replace(/\s/g, '')}`} style={callBtnStyle}>☎ Call</a>
                <a
                  href={`https://wa.me/${b.customer_phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(b.customer_name)}%2C%20this%20is%20Lee%20Car%20Accessories.%20Regarding%20your%20appointment%20booking${b.service_required ? '%20for%20' + encodeURIComponent(b.service_required) : ''}.`}
                  target="_blank"
                  rel="noreferrer"
                  style={waBtnStyle}
                >WhatsApp</a>
                <select
                  value={b.status}
                  onChange={e => updateStatus(b.id, e.target.value as BookingStatus)}
                  style={selectStyle}
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const c = STATUS_COLORS[status] || { bg: 'rgba(100,100,100,0.1)', color: '#A0A7AE' }
  return (
    <span style={{ background: c.bg, color: c.color, padding: '4px 10px', borderRadius: 999, fontSize: 10, fontWeight: 800, textTransform: 'capitalize' }}>{status}</span>
  )
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: '#0D1217', border: '1px solid #1E2A33', borderRadius: 8, padding: '8px 10px' }}>
      <div style={{ fontSize: 9, letterSpacing: '0.1em', fontWeight: 800, color: '#687078' }}>{label}</div>
      <div style={{ fontSize: 12, color: '#FFFFFF', marginTop: 3, wordBreak: 'break-word' }}>{value}</div>
    </div>
  )
}

function LoadingRow() {
  return <div style={{ color: '#687078', fontSize: 13, padding: '40px 0', textAlign: 'center' }}>Loading…</div>
}

function EmptyRow({ text }: { text: string }) {
  return (
    <div style={{ background: '#090D11', border: '1px solid #1C232B', borderRadius: 14, padding: '40px 20px', textAlign: 'center', color: '#687078', fontSize: 13 }}>{text}</div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const cardStyle: React.CSSProperties = { background: '#090D11', border: '1px solid #1C232B', borderRadius: 14, padding: '16px 18px' }
const callBtnStyle: React.CSSProperties = { background: '#0D1217', border: '1px solid #1E2A33', color: '#FFFFFF', borderRadius: 8, padding: '7px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }
const waBtnStyle: React.CSSProperties = { background: '#25D366', border: 'none', color: '#FFFFFF', borderRadius: 8, padding: '7px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }
const selectStyle: React.CSSProperties = { background: '#0D1217', border: '1px solid #1E2A33', color: '#FFFFFF', borderRadius: 8, padding: '7px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer', marginLeft: 'auto' }
const refreshBtnStyle: React.CSSProperties = { background: '#0D1217', border: '1px solid #1E2A33', color: '#A0A7AE', borderRadius: 8, padding: '8px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }
