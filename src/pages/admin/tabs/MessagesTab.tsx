import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import type { DbContactMessage } from '../../../types/database'

const STATUS_OPTIONS = ['unread', 'read', 'replied'] as const
type MsgStatus = typeof STATUS_OPTIONS[number]

const STATUS_COLORS: Record<MsgStatus, { bg: string; color: string }> = {
  unread: { bg: 'rgba(17,188,230,0.12)', color: '#11BCE6' },
  read: { bg: 'rgba(214,154,19,0.12)', color: '#D69A13' },
  replied: { bg: 'rgba(0,200,100,0.12)', color: '#00C864' },
}

export default function MessagesTab() {
  const [messages, setMessages] = useState<DbContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<MsgStatus | 'all'>('all')

  useEffect(() => { fetchMessages() }, [])

  async function fetchMessages() {
    setLoading(true)
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages(data || [])
    setLoading(false)
  }

  async function updateStatus(id: string, status: MsgStatus) {
    await supabase.from('contact_messages').update({ status }).eq('id', id)
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m))
  }

  const filtered = filterStatus === 'all' ? messages : messages.filter(m => m.status === filterStatus)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 900, fontSize: 18, color: 'var(--admin-text-main)', margin: 0 }}>
            CONTACT MESSAGES
          </h2>
          <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', marginTop: 4 }}>
            {messages.length} total · {messages.filter(m => m.status === 'unread').length} unread
          </div>
        </div>
        <button onClick={fetchMessages} style={refreshBtnStyle}>↻ Refresh</button>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {(['all', ...STATUS_OPTIONS] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            style={{
              padding: '6px 14px', borderRadius: 999,
              border: `1px solid ${filterStatus === s ? '#11BCE6' : 'var(--admin-border-subtle)'}`,
              background: filterStatus === s ? 'rgba(17,188,230,0.12)' : 'transparent',
              color: filterStatus === s ? '#11BCE6' : 'var(--admin-text-sub)',
              fontSize: 11, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize'
            }}
          >{s}</button>
        ))}
      </div>

      {loading ? <LoadingRow /> : filtered.length === 0 ? <EmptyRow text="No messages yet." /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(m => (
            <div key={m.id} style={{ ...cardStyle, borderLeft: m.status === 'unread' ? '3px solid #11BCE6' : '3px solid transparent' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--admin-text-main)' }}>{m.customer_name}</div>
                  <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', marginTop: 2 }}>{formatDate(m.created_at)}</div>
                </div>
                <StatusBadge status={m.status as MsgStatus} />
              </div>

              <div style={{ marginTop: 10 }}>
                <InfoPill label="PHONE" value={m.customer_phone} />
              </div>

              {m.message && (
                <div style={{ marginTop: 10, background: 'var(--admin-subcard-bg)', border: '1px solid var(--admin-border-subtle)', borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ fontSize: 9, letterSpacing: '0.1em', fontWeight: 800, color: 'var(--admin-text-muted)', marginBottom: 4 }}>MESSAGE</div>
                  <div style={{ fontSize: 13, color: 'var(--admin-text-main)', lineHeight: 1.6 }}>{m.message}</div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14, alignItems: 'center' }}>
                <a href={`tel:${m.customer_phone.replace(/\s/g, '')}`} style={callBtnStyle}>☎ Call</a>
                <a
                  href={`https://wa.me/${m.customer_phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(m.customer_name)}%2C%20this%20is%20Lee%20Car%20Accessories.%20Regarding%20your%20enquiry.`}
                  target="_blank"
                  rel="noreferrer"
                  style={waBtnStyle}
                >WhatsApp</a>
                <select
                  value={m.status}
                  onChange={e => updateStatus(m.id, e.target.value as MsgStatus)}
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

function StatusBadge({ status }: { status: MsgStatus }) {
  const c = STATUS_COLORS[status] || { bg: 'rgba(100,100,100,0.1)', color: '#A0A7AE' }
  return (
    <span style={{ background: c.bg, color: c.color, padding: '4px 10px', borderRadius: 999, fontSize: 10, fontWeight: 800, textTransform: 'capitalize' }}>{status}</span>
  )
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: 'var(--admin-subcard-bg)', border: '1px solid var(--admin-border-subtle)', borderRadius: 8, padding: '8px 10px', display: 'inline-block' }}>
      <div style={{ fontSize: 9, letterSpacing: '0.1em', fontWeight: 800, color: 'var(--admin-text-muted)' }}>{label}</div>
      <div style={{ fontSize: 12, color: 'var(--admin-text-main)', marginTop: 3 }}>{value}</div>
    </div>
  )
}

function LoadingRow() {
  return <div style={{ color: 'var(--admin-text-muted)', fontSize: 13, padding: '40px 0', textAlign: 'center' }}>Loading…</div>
}

function EmptyRow({ text }: { text: string }) {
  return (
    <div style={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-border)', borderRadius: 14, padding: '40px 20px', textAlign: 'center', color: 'var(--admin-text-muted)', fontSize: 13 }}>{text}</div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const cardStyle: React.CSSProperties = { background: 'var(--admin-card-bg)', border: '1px solid var(--admin-border)', borderRadius: 14, padding: '16px 18px', boxShadow: 'var(--admin-card-shadow)' }
const callBtnStyle: React.CSSProperties = { background: 'var(--admin-subcard-bg)', border: '1px solid var(--admin-border-subtle)', color: 'var(--admin-text-main)', borderRadius: 8, padding: '7px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }
const waBtnStyle: React.CSSProperties = { background: '#25D366', border: 'none', color: '#FFFFFF', borderRadius: 8, padding: '7px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }
const selectStyle: React.CSSProperties = { background: 'var(--admin-subcard-bg)', border: '1px solid var(--admin-border-subtle)', color: 'var(--admin-text-main)', borderRadius: 8, padding: '7px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer', marginLeft: 'auto' }
const refreshBtnStyle: React.CSSProperties = { background: 'var(--admin-subcard-bg)', border: '1px solid var(--admin-border-subtle)', color: 'var(--admin-text-sub)', borderRadius: 8, padding: '8px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }

