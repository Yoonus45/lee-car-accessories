import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import type { DbSeatCoverAppointment } from '../../../types/database'

const STATUS_OPTIONS = ['pending', 'confirmed', 'completed', 'cancelled'] as const
type AppointmentStatus = typeof STATUS_OPTIONS[number]

const STATUS_COLORS: Record<AppointmentStatus, { bg: string; color: string }> = {
  pending: { bg: 'rgba(17,188,230,0.12)', color: '#11BCE6' },
  confirmed: { bg: 'rgba(214,154,19,0.12)', color: '#D69A13' },
  completed: { bg: 'rgba(0,200,100,0.12)', color: '#00C864' },
  cancelled: { bg: 'rgba(255,85,85,0.12)', color: '#FF5555' },
}

export default function SeatAppointmentsTab() {
  const [appointments, setAppointments] = useState<DbSeatCoverAppointment[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<AppointmentStatus | 'all'>('all')

  useEffect(() => {
    fetchAppointments()
  }, [])

  async function fetchAppointments() {
    setLoading(true)
    const { data, error } = await supabase
      .from('seat_cover_appointments')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.warn('[SeatAppointmentsTab] Error fetching appointments:', error.message)
    }
    setAppointments(data || [])
    setLoading(false)
  }

  async function updateStatus(id: string, status: AppointmentStatus) {
    const { error } = await supabase
      .from('seat_cover_appointments')
      .update({ status })
      .eq('id', id)

    if (!error) {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a))
    }
  }

  const filtered = filterStatus === 'all'
    ? appointments
    : appointments.filter(a => a.status === filterStatus)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 900, fontSize: 18, color: 'var(--admin-text-main)', margin: 0 }}>
            SEAT COVER APPOINTMENTS
          </h2>
          <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', marginTop: 4 }}>
            {appointments.length} total · {appointments.filter(a => a.status === 'pending').length} pending review
          </div>
        </div>
        <button onClick={fetchAppointments} style={refreshBtnStyle}>↻ Refresh</button>
      </div>

      {/* Status filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {(['all', ...STATUS_OPTIONS] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            style={{
              padding: '6px 14px',
              borderRadius: 999,
              border: `1px solid ${filterStatus === s ? '#11BCE6' : 'var(--admin-border-subtle)'}`,
              background: filterStatus === s ? 'rgba(17,188,230,0.12)' : 'transparent',
              color: filterStatus === s ? '#11BCE6' : 'var(--admin-text-sub)',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingRow />
      ) : filtered.length === 0 ? (
        <EmptyRow text="No seat cover appointments found." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(a => (
            <div key={a.id} style={cardStyle}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--admin-text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{a.full_name}</span>
                    <span style={{ fontSize: 11, color: '#11BCE6', fontWeight: 700 }}>
                      [{a.car_brand ? `${a.car_brand} ` : ''}{a.car_model}{a.car_year ? ` (${a.car_year})` : ''}]
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', marginTop: 2 }}>{formatDate(a.created_at)}</div>
                </div>
                <StatusBadge status={a.status as AppointmentStatus} />
              </div>

              {/* Appointment details pills */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginTop: 14 }}>
                <InfoPill label="PHONE" value={a.phone} />
                {a.email && <InfoPill label="EMAIL" value={a.email} />}
                {a.preferred_date && <InfoPill label="APPOINTMENT DATE" value={a.preferred_date} />}
                {a.preferred_time && <InfoPill label="PREFERRED TIME" value={a.preferred_time} />}
                {a.seat_cover_type && <InfoPill label="STYLE / FIT" value={a.seat_cover_type} />}
                {a.material_preference && <InfoPill label="MATERIAL OPTION" value={a.material_preference} />}
                {a.colour_preference && <InfoPill label="COLOUR CHOICE" value={a.colour_preference} />}
              </div>

              {a.notes && (
                <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--admin-subcard-bg)', borderRadius: 8, border: '1px solid var(--admin-border-subtle)' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--admin-text-muted)', letterSpacing: '0.08em' }}>CUSTOMER NOTES:</div>
                  <div style={{ fontSize: 12, color: 'var(--admin-text-main)', marginTop: 4, lineHeight: 1.5 }}>{a.notes}</div>
                </div>
              )}

              {/* Action bar */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14, alignItems: 'center' }}>
                <a href={`tel:${a.phone.replace(/\s/g, '')}`} style={callBtnStyle}>☎ Call</a>
                <a
                  href={`https://wa.me/${a.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(a.full_name)}%2C%20this%20is%20Lee%20Car%20Accessories.%20Regarding%20your%20custom%20seat%20cover%20appointment%20request%20for%20your%20${encodeURIComponent(a.car_model)}.`}
                  target="_blank"
                  rel="noreferrer"
                  style={waBtnStyle}
                >
                  WhatsApp
                </a>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: '#687078', fontWeight: 600 }}>Status:</span>
                  <select
                    value={a.status}
                    onChange={e => updateStatus(a.id, e.target.value as AppointmentStatus)}
                    style={selectStyle}
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const meta = STATUS_COLORS[status] || STATUS_COLORS.pending
  return (
    <span style={{
      background: meta.bg,
      color: meta.color,
      fontSize: 10,
      fontWeight: 800,
      letterSpacing: '0.08em',
      padding: '4px 10px',
      borderRadius: 999,
      textTransform: 'uppercase'
    }}>
      {status}
    </span>
  )
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: 'var(--admin-subcard-bg)', borderRadius: 8, padding: '8px 12px', border: '1px solid var(--admin-border-subtle)' }}>
      <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--admin-text-muted)', letterSpacing: '0.08em' }}>{label}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--admin-text-main)', marginTop: 2, wordBreak: 'break-word' }}>{value}</div>
    </div>
  )
}

function LoadingRow() {
  return <div style={{ color: 'var(--admin-text-muted)', fontSize: 12, padding: '30px 0', textAlign: 'center' }}>Loading seat cover appointments…</div>
}

function EmptyRow({ text }: { text: string }) {
  return <div style={{ color: 'var(--admin-text-muted)', background: 'var(--admin-card-bg)', border: '1px solid var(--admin-border)', borderRadius: 14, padding: '30px 0', textAlign: 'center', fontSize: 12 }}>{text}</div>
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return iso
  }
}

const cardStyle: React.CSSProperties = {
  background: 'var(--admin-card-bg)',
  border: '1px solid var(--admin-border)',
  borderRadius: 14,
  padding: '16px 18px',
  boxShadow: 'var(--admin-card-shadow)'
}

const refreshBtnStyle: React.CSSProperties = {
  fontSize: 11,
  color: 'var(--admin-text-sub)',
  border: '1px solid var(--admin-border-subtle)',
  borderRadius: 8,
  padding: '6px 14px',
  background: 'var(--admin-subcard-bg)',
  cursor: 'pointer',
  fontWeight: 700
}

const callBtnStyle: React.CSSProperties = {
  fontSize: 11,
  color: '#11BCE6',
  border: '1px solid rgba(17,188,230,0.3)',
  borderRadius: 8,
  padding: '5px 12px',
  background: 'rgba(17,188,230,0.06)',
  textDecoration: 'none',
  fontWeight: 700,
}

const waBtnStyle: React.CSSProperties = {
  fontSize: 11,
  color: '#25D366',
  border: '1px solid rgba(37,211,102,0.3)',
  borderRadius: 8,
  padding: '5px 12px',
  background: 'rgba(37,211,102,0.06)',
  textDecoration: 'none',
  fontWeight: 700,
}

const selectStyle: React.CSSProperties = {
  background: 'var(--admin-subcard-bg)',
  border: '1px solid var(--admin-border-subtle)',
  color: 'var(--admin-text-main)',
  borderRadius: 8,
  padding: '5px 10px',
  fontSize: 12,
  cursor: 'pointer',
  outline: 'none'
}

