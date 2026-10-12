import { useEffect, useState, useMemo } from 'react'
import { supabase } from '../../../lib/supabase'
import type { DbOrderRequest } from '../../../types/database'

export const STATUS_OPTIONS = [
  'new',
  'contacted',
  'confirmed',
  'ready',
  'completed',
  'cancelled',
] as const

export type OrderStatus = typeof STATUS_OPTIONS[number]

export const STATUS_META: Record<
  OrderStatus,
  {
    label: string
    shortLabel: string
    icon: string
    dropdownLabel: string
    bg: string
    color: string
    border: string
  }
> = {
  new: {
    label: 'New',
    shortLabel: 'New',
    icon: '🆕',
    dropdownLabel: '🆕 New',
    bg: 'rgba(17,188,230,0.12)',
    color: '#11BCE6',
    border: 'rgba(17,188,230,0.3)',
  },
  contacted: {
    label: 'Contacted',
    shortLabel: 'Contacted',
    icon: '📞',
    dropdownLabel: '📞 Contacted',
    bg: 'rgba(214,154,19,0.12)',
    color: '#D69A13',
    border: 'rgba(214,154,19,0.3)',
  },
  confirmed: {
    label: 'Confirmed',
    shortLabel: 'Confirmed',
    icon: '✅',
    dropdownLabel: '✅ Confirmed',
    bg: 'rgba(14,165,233,0.14)',
    color: '#38BDF8',
    border: 'rgba(56,189,248,0.35)',
  },
  ready: {
    label: 'Ready for Fitment / Shipping',
    shortLabel: 'Ready',
    icon: '🚗',
    dropdownLabel: '🚗 Ready for Fitment / Shipping',
    bg: 'rgba(168,85,247,0.12)',
    color: '#C084FC',
    border: 'rgba(192,132,252,0.35)',
  },
  completed: {
    label: 'Completed',
    shortLabel: 'Completed',
    icon: '🎉',
    dropdownLabel: '🎉 Completed',
    bg: 'rgba(0,200,100,0.12)',
    color: '#00C864',
    border: 'rgba(0,200,100,0.3)',
  },
  cancelled: {
    label: 'Cancelled',
    shortLabel: 'Cancelled',
    icon: '❌',
    dropdownLabel: '❌ Cancelled',
    bg: 'rgba(255,85,85,0.12)',
    color: '#FF5555',
    border: 'rgba(255,85,85,0.3)',
  },
}

// Active progression steps for non-cancelled orders
const WORKFLOW_STEPS: OrderStatus[] = ['new', 'contacted', 'confirmed', 'ready', 'completed']

export default function OrdersTab() {
  const [orders, setOrders] = useState<DbOrderRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  // Auto-dismiss toast
  useEffect(() => {
    if (!successToast) return
    const timer = setTimeout(() => setSuccessToast(null), 3000)
    return () => clearTimeout(timer)
  }, [successToast])

  async function fetchOrders() {
    setLoading(true)
    setActionError(null)
    const { data, error } = await supabase
      .from('order_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.warn('[OrdersTab] Fetch error:', error.message)
      setActionError(`Could not load orders: ${error.message}`)
    }
    setOrders(data || [])
    setLoading(false)
  }

  async function updateStatus(id: string, newStatus: OrderStatus) {
    setUpdatingId(id)
    setActionError(null)

    const { error } = await supabase
      .from('order_requests')
      .update({ status: newStatus })
      .eq('id', id)

    setUpdatingId(null)

    if (error) {
      console.error('[OrdersTab] Update error:', error)
      setActionError(`Failed to update order status: ${error.message || 'Unknown database error'}`)
    } else {
      // Immediately reflect update in local state for zero-latency dashboard refresh
      setOrders(prev => prev.map(o => (o.id === id ? { ...o, status: newStatus } : o)))
      setSuccessToast(`Order status updated to ${STATUS_META[newStatus].label}`)
    }
  }

  // Live Metrics Calculations across all 7 cards
  const metrics = useMemo(() => {
    return {
      total: orders.length,
      new: orders.filter(o => o.status === 'new').length,
      contacted: orders.filter(o => o.status === 'contacted').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      ready: orders.filter(o => o.status === 'ready').length,
      completed: orders.filter(o => o.status === 'completed').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    }
  }, [orders])

  // Filter & Search Logic
  const filtered = useMemo(() => {
    return orders.filter(o => {
      const matchesStatus = filterStatus === 'all' || o.status === filterStatus
      const q = searchQuery.toLowerCase().trim()
      if (!q) return matchesStatus

      const matchesSearch =
        (o.customer_name && o.customer_name.toLowerCase().includes(q)) ||
        (o.customer_phone && o.customer_phone.toLowerCase().includes(q)) ||
        (o.customer_email && o.customer_email.toLowerCase().includes(q)) ||
        (o.car_model && o.car_model.toLowerCase().includes(q)) ||
        (o.product_name && o.product_name.toLowerCase().includes(q)) ||
        (o.address && o.address.toLowerCase().includes(q)) ||
        (o.notes && o.notes.toLowerCase().includes(q))

      return matchesStatus && matchesSearch
    })
  }, [orders, filterStatus, searchQuery])

  // CSV Export
  function exportToCSV() {
    if (filtered.length === 0) {
      alert('No orders to export.')
      return
    }

    const headers = [
      'Order ID',
      'Date',
      'Customer Name',
      'Phone Number',
      'Email',
      'Car Model',
      'Product Name',
      'Quantity',
      'Address',
      'Notes',
      'Status',
      'Status Label',
    ]

    const rows = filtered.map(o => {
      const statusMeta = STATUS_META[o.status as OrderStatus] || STATUS_META.new
      return [
        `"${o.id}"`,
        `"${new Date(o.created_at).toLocaleString('en-IN')}"`,
        `"${(o.customer_name || '').replace(/"/g, '""')}"`,
        `"${(o.customer_phone || '').replace(/"/g, '""')}"`,
        `"${(o.customer_email || '').replace(/"/g, '""')}"`,
        `"${(o.car_model || '').replace(/"/g, '""')}"`,
        `"${(o.product_name || '').replace(/"/g, '""')}"`,
        o.quantity || 1,
        `"${(o.address || '').replace(/"/g, '""')}"`,
        `"${(o.notes || '').replace(/"/g, '""')}"`,
        `"${o.status}"`,
        `"${statusMeta.label}"`,
      ]
    })

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const dateStr = new Date().toISOString().split('T')[0]
    link.setAttribute('href', url)
    link.setAttribute('download', `lee-car-accessories-orders-${dateStr}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER & ACTION BAR
      ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2
              style={{
                fontFamily: 'Orbitron, sans-serif',
                fontWeight: 900,
                fontSize: 18,
                color: 'var(--admin-text-main)',
                margin: 0,
              }}
            >
              ORDER MANAGEMENT
            </h2>
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: '#11BCE6',
                background: 'rgba(17,188,230,0.1)',
                border: '1px solid rgba(17,188,230,0.3)',
                padding: '2px 8px',
                borderRadius: 6,
                letterSpacing: '0.08em',
              }}
            >
              MANUAL WORKFLOW
            </span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', marginTop: 4 }}>
            Direct customer product inquiries & fitment orders: New → Contacted → Confirmed → Ready → Completed
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={exportToCSV}
            style={{
              fontSize: 11,
              color: '#11BCE6',
              border: '1px solid rgba(17,188,230,0.3)',
              borderRadius: 8,
              padding: '7px 14px',
              background: 'rgba(17,188,230,0.08)',
              cursor: 'pointer',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            📥 Export CSV ({filtered.length})
          </button>
          <button onClick={fetchOrders} style={refreshBtnStyle} title="Reload orders from database">
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Action error banner */}
      {actionError && (
        <div
          style={{
            marginBottom: 16,
            padding: '12px 16px',
            background: 'rgba(255,85,85,0.1)',
            border: '1px solid rgba(255,85,85,0.3)',
            borderRadius: 10,
            color: '#FF7070',
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>⚠️ {actionError}</span>
          <button
            onClick={() => setActionError(null)}
            style={{ background: 'none', border: 'none', color: '#FF7070', cursor: 'pointer', fontSize: 14 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Success toast */}
      {successToast && (
        <div
          style={{
            marginBottom: 16,
            padding: '10px 16px',
            background: 'rgba(0,200,100,0.1)',
            border: '1px solid rgba(0,200,100,0.3)',
            borderRadius: 10,
            color: '#00C864',
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          ✓ {successToast}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. DASHBOARD METRICS SUMMARY CARDS (7 CARDS)
      ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 12,
          marginBottom: 20,
        }}
      >
        {[
          {
            key: 'all',
            label: 'TOTAL ORDERS',
            icon: '📦',
            count: metrics.total,
            color: 'var(--admin-text-main)',
            bg: 'var(--admin-subcard-bg)',
            border: 'var(--admin-border-subtle)',
          },
          {
            key: 'new',
            label: 'NEW',
            icon: '🆕',
            count: metrics.new,
            color: '#11BCE6',
            bg: 'rgba(17,188,230,0.08)',
            border: 'rgba(17,188,230,0.25)',
          },
          {
            key: 'contacted',
            label: 'CONTACTED',
            icon: '📞',
            count: metrics.contacted,
            color: '#D69A13',
            bg: 'rgba(214,154,19,0.08)',
            border: 'rgba(214,154,19,0.25)',
          },
          {
            key: 'confirmed',
            label: 'CONFIRMED',
            icon: '✅',
            count: metrics.confirmed,
            color: '#38BDF8',
            bg: 'rgba(14,165,233,0.08)',
            border: 'rgba(56,189,248,0.25)',
          },
          {
            key: 'ready',
            label: 'READY FOR FITMENT',
            icon: '🚗',
            count: metrics.ready,
            color: '#C084FC',
            bg: 'rgba(168,85,247,0.08)',
            border: 'rgba(192,132,252,0.25)',
          },
          {
            key: 'completed',
            label: 'COMPLETED',
            icon: '🎉',
            count: metrics.completed,
            color: '#00C864',
            bg: 'rgba(0,200,100,0.08)',
            border: 'rgba(0,200,100,0.25)',
          },
          {
            key: 'cancelled',
            label: 'CANCELLED',
            icon: '❌',
            count: metrics.cancelled,
            color: '#FF5555',
            bg: 'rgba(255,85,85,0.08)',
            border: 'rgba(255,85,85,0.25)',
          },
        ].map(m => {
          const isActive = filterStatus === m.key
          return (
            <div
              key={m.label}
              onClick={() => setFilterStatus(m.key as OrderStatus | 'all')}
              style={{
                background: 'var(--admin-card-bg)',
                border: `1px solid ${isActive ? m.color : m.border}`,
                borderRadius: 12,
                padding: '14px 16px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? `0 0 14px ${m.bg}` : 'var(--admin-card-shadow)',
              }}
              title={`Click to filter by ${m.label}`}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    color: 'var(--admin-text-sub)',
                    letterSpacing: '0.08em',
                  }}
                >
                  {m.label}
                </span>
                <span style={{ fontSize: 13 }}>{m.icon}</span>
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: m.color,
                  marginTop: 6,
                  fontFamily: 'Orbitron, sans-serif',
                }}
              >
                {m.count}
              </div>
            </div>
          )
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. SEARCH & STATUS FILTER BAR
      ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          background: 'var(--admin-card-bg)',
          border: '1px solid var(--admin-border)',
          borderRadius: 14,
          padding: '14px 16px',
          marginBottom: 16,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--admin-card-shadow)',
        }}
      >
        {/* Search input */}
        <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 200 }}>
          <input
            type="text"
            placeholder="Search customer, phone, car, product, address, notes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--admin-input-bg)',
              border: '1px solid var(--admin-input-border)',
              borderRadius: 8,
              padding: '8px 12px 8px 32px',
              fontSize: 12,
              color: 'var(--admin-input-text)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <span
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--admin-text-muted)',
              fontSize: 13,
            }}
          >
            🔍
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--admin-text-muted)',
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Status filter pills: ALL | NEW | CONTACTED | CONFIRMED | READY | COMPLETED | CANCELLED */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(
            [
              { id: 'all', label: 'ALL', count: metrics.total },
              { id: 'new', label: 'NEW', count: metrics.new },
              { id: 'contacted', label: 'CONTACTED', count: metrics.contacted },
              { id: 'confirmed', label: 'CONFIRMED', count: metrics.confirmed },
              { id: 'ready', label: 'READY', count: metrics.ready },
              { id: 'completed', label: 'COMPLETED', count: metrics.completed },
              { id: 'cancelled', label: 'CANCELLED', count: metrics.cancelled },
            ] as const
          ).map(filterItem => {
            const isSelected = filterStatus === filterItem.id
            const statusColor =
              filterItem.id === 'all'
                ? '#11BCE6'
                : STATUS_META[filterItem.id as OrderStatus].color

            return (
              <button
                key={filterItem.id}
                onClick={() => setFilterStatus(filterItem.id as OrderStatus | 'all')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 999,
                  border: `1px solid ${isSelected ? statusColor : 'var(--admin-border-subtle)'}`,
                  background: isSelected ? 'rgba(17,188,230,0.12)' : 'transparent',
                  color: isSelected ? statusColor : 'var(--admin-text-sub)',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{filterItem.label}</span>
                <span
                  style={{
                    fontSize: 9,
                    background: isSelected ? statusColor : 'var(--admin-subcard-bg)',
                    border: `1px solid ${isSelected ? 'transparent' : 'var(--admin-border-subtle)'}`,
                    color: isSelected ? '#02141B' : 'var(--admin-text-muted)',
                    padding: '1px 6px',
                    borderRadius: 999,
                    fontWeight: 800,
                  }}
                >
                  {filterItem.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. ORDERS LIST / CARDS
      ───────────────────────────────────────────────────────────── */}
      {loading ? (
        <LoadingRow />
      ) : filtered.length === 0 ? (
        <EmptyRow
          text={
            searchQuery
              ? `No orders matching "${searchQuery}".`
              : `No order requests found under "${filterStatus.toUpperCase()}".`
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map(o => {
            const currentStatus = (o.status as OrderStatus) || 'new'
            const isUpdating = updatingId === o.id

            return (
              <div key={o.id} style={cardStyle}>
                {/* Card top row */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 10,
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: 15,
                        color: 'var(--admin-text-main, #FFFFFF)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <span>{o.customer_name}</span>
                      {o.car_model && (
                        <span
                          style={{
                            fontSize: 11,
                            color: '#11BCE6',
                            fontWeight: 700,
                            background: 'rgba(17,188,230,0.08)',
                            padding: '2px 8px',
                            borderRadius: 6,
                            border: '1px solid rgba(17,188,230,0.2)',
                          }}
                        >
                          🚗 {o.car_model}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: '#687078', marginTop: 3 }}>
                      Ordered: {formatDate(o.created_at)} • Order Ref:{' '}
                      <span style={{ fontFamily: 'monospace', color: '#8A929B' }}>
                        {o.id.slice(0, 8)}
                      </span>
                    </div>
                  </div>

                  <StatusBadge status={currentStatus} />
                </div>

                {/* Product banner */}
                <div
                  style={{
                    marginTop: 12,
                    padding: '10px 14px',
                    background: 'var(--admin-subcard-bg)',
                    borderRadius: 10,
                    border: '1px solid var(--admin-border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 8,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 18 }}>📦</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--admin-text-main)' }}>
                        {o.product_name}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--admin-text-muted)' }}>
                        Product Slug: {o.product_id}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      background: 'rgba(17,188,230,0.1)',
                      color: '#11BCE6',
                      border: '1px solid rgba(17,188,230,0.25)',
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                    }}
                  >
                    QTY: {o.quantity || 1}
                  </div>
                </div>

                {/* Status Timeline */}
                <OrderTimeline status={currentStatus} />

                {/* Info pills */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: 10,
                    marginTop: 12,
                  }}
                >
                  <InfoPill label="CUSTOMER PHONE" value={o.customer_phone} />
                  {o.customer_email && <InfoPill label="CUSTOMER EMAIL" value={o.customer_email} />}
                  {o.address && <InfoPill label="FITTING / DELIVERY ADDRESS" value={o.address} />}
                </div>

                {/* Customer Notes */}
                {o.notes && (
                  <div
                    style={{
                      marginTop: 10,
                      padding: '8px 12px',
                      background: 'var(--admin-subcard-bg)',
                      borderRadius: 8,
                      border: '1px solid var(--admin-border-subtle)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 9,
                        fontWeight: 800,
                        color: 'var(--admin-text-muted)',
                        letterSpacing: '0.08em',
                      }}
                    >
                      CUSTOMER INSTRUCTIONS / NOTES:
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--admin-text-sub)', marginTop: 3, lineHeight: 1.5 }}>
                      {o.notes}
                    </div>
                  </div>
                )}

                {/* Quick action footer */}
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    flexWrap: 'wrap',
                    marginTop: 14,
                    alignItems: 'center',
                    borderTop: '1px solid #141D25',
                    paddingTop: 12,
                  }}
                >
                  <a
                    href={`tel:${o.customer_phone.replace(/\s/g, '')}`}
                    style={callBtnStyle}
                    title="Call customer directly"
                  >
                    📞 Call Customer
                  </a>
                  <a
                    href={`https://wa.me/${o.customer_phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(
                      o.customer_name
                    )}%2C%20this%20is%20Lee%20Car%20Accessories.%20Regarding%20your%20order%20request%20for%20${encodeURIComponent(
                      o.product_name
                    )}%20(Qty%3A%20${o.quantity || 1}).`}
                    target="_blank"
                    rel="noreferrer"
                    style={waBtnStyle}
                    title="Send WhatsApp message"
                  >
                    💬 WhatsApp
                  </a>

                  {/* Improved Status selector with live loading */}
                  <div
                    style={{
                      marginLeft: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 11, color: '#8A929B', fontWeight: 700 }}>Status:</span>
                    {isUpdating && (
                      <span
                        style={{
                          fontSize: 10,
                          color: '#11BCE6',
                          fontWeight: 800,
                          animation: 'pulse 1s infinite',
                        }}
                      >
                        Saving…
                      </span>
                    )}
                    <select
                      value={currentStatus}
                      disabled={isUpdating}
                      onChange={e => updateStatus(o.id, e.target.value as OrderStatus)}
                      style={{
                        ...selectStyle,
                        opacity: isUpdating ? 0.6 : 1,
                        cursor: isUpdating ? 'wait' : 'pointer',
                        borderColor: STATUS_META[currentStatus].border,
                        color: STATUS_META[currentStatus].color,
                      }}
                      title="Update order status workflow"
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>
                          {STATUS_META[s].dropdownLabel}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
    STATUS TIMELINE COMPONENT
───────────────────────────────────────────────────────────── */
function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === 'cancelled') {
    return (
      <div
        style={{
          marginTop: 12,
          padding: '10px 14px',
          background: 'rgba(255, 85, 85, 0.08)',
          border: '1px solid rgba(255, 85, 85, 0.25)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span style={{ fontSize: 16 }}>❌</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span
            style={{
              color: '#FF5555',
              fontWeight: 900,
              fontSize: 11,
              letterSpacing: '0.08em',
              fontFamily: 'Orbitron, sans-serif',
            }}
          >
            ORDER CANCELLED
          </span>
          <span style={{ color: 'var(--admin-text-sub)', fontSize: 11 }}>
            — This order inquiry is closed and will not proceed.
          </span>
        </div>
      </div>
    )
  }

  const activeIndex = WORKFLOW_STEPS.indexOf(status)

  return (
    <div
      style={{
        marginTop: 12,
        padding: '12px 14px',
        background: 'var(--admin-subcard-bg)',
        border: '1px solid var(--admin-border-subtle)',
        borderRadius: 10,
      }}
    >
      <div
        style={{
          fontSize: 9,
          fontWeight: 800,
          color: 'var(--admin-text-muted)',
          letterSpacing: '0.08em',
          marginBottom: 10,
        }}
      >
        ORDER PROGRESS TIMELINE:
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          gap: 2,
        }}
      >
        {WORKFLOW_STEPS.map((stepKey, idx) => {
          const isCompleted = idx < activeIndex
          const isCurrent = idx === activeIndex
          const stepMeta = STATUS_META[stepKey]

          const circleBg = isCurrent
            ? stepMeta.color
            : isCompleted
            ? '#00C864'
            : 'var(--admin-subcard-bg)'

          const circleTextColor = isCurrent
            ? '#02141B'
            : isCompleted
            ? '#FFFFFF'
            : 'var(--admin-text-muted)'

          const labelColor = isCurrent
            ? stepMeta.color
            : isCompleted
            ? 'var(--admin-text-sub)'
            : 'var(--admin-text-muted)'

          return (
            <div
              key={stepKey}
              style={{
                display: 'flex',
                alignItems: 'center',
                flex: idx === WORKFLOW_STEPS.length - 1 ? '0 1 auto' : 1,
                minWidth: 0,
              }}
            >
              {/* Step circle + label container */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  flexShrink: 0,
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: circleBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    fontWeight: 900,
                    color: circleTextColor,
                    boxShadow: isCurrent ? `0 0 12px ${stepMeta.bg}` : 'none',
                    border: isCurrent
                      ? `2px solid var(--admin-text-main)`
                      : isCompleted
                      ? '2px solid #00C864'
                      : '1px solid var(--admin-border-subtle)',
                    transition: 'all 0.2s ease',
                  }}
                  title={stepMeta.label}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: isCurrent ? 800 : isCompleted ? 700 : 500,
                    color: labelColor,
                    marginTop: 6,
                    whiteSpace: 'nowrap',
                    maxWidth: 76,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={stepMeta.label}
                >
                  {stepMeta.shortLabel}
                </div>
              </div>

              {/* Connecting line between stages */}
              {idx < WORKFLOW_STEPS.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    margin: '0 4px',
                    marginBottom: 20, // aligns vertically with circle centers
                    background: isCompleted
                      ? 'linear-gradient(90deg, #00C864, #11BCE6)'
                      : isCurrent
                      ? 'linear-gradient(90deg, #11BCE6, var(--admin-border-subtle))'
                      : 'var(--admin-border)',
                    borderRadius: 1,
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
    STATUS BADGE COMPONENT
───────────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status] || STATUS_META.new
  return (
    <span
      style={{
        background: meta.bg,
        color: meta.color,
        border: `1px solid ${meta.border}`,
        padding: '5px 12px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 800,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        letterSpacing: '0.04em',
      }}
    >
      <span>{meta.icon}</span>
      <span>{meta.label.toUpperCase()}</span>
    </span>
  )
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: 'var(--admin-subcard-bg)',
        border: '1px solid var(--admin-border-subtle)',
        borderRadius: 8,
        padding: '8px 10px',
      }}
    >
      <div
        style={{
          fontSize: 9,
          letterSpacing: '0.1em',
          fontWeight: 800,
          color: 'var(--admin-text-muted)',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 12,
          color: 'var(--admin-text-main)',
          marginTop: 3,
          wordBreak: 'break-word',
          fontWeight: 600,
        }}
      >
        {value}
      </div>
    </div>
  )
}

function LoadingRow() {
  return (
    <div
      style={{
        color: 'var(--admin-text-muted)',
        fontSize: 13,
        padding: '40px 0',
        textAlign: 'center',
      }}
    >
      Loading orders…
    </div>
  )
}

function EmptyRow({ text }: { text: string }) {
  return (
    <div
      style={{
        background: 'var(--admin-card-bg)',
        border: '1px solid var(--admin-border)',
        borderRadius: 14,
        padding: '40px 20px',
        textAlign: 'center',
        color: 'var(--admin-text-muted)',
        fontSize: 13,
      }}
    >
      {text}
    </div>
  )
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

const cardStyle: React.CSSProperties = {
  background: 'var(--admin-card-bg)',
  border: '1px solid var(--admin-border)',
  borderRadius: 14,
  padding: '16px 18px',
  boxShadow: 'var(--admin-card-shadow)',
}

const callBtnStyle: React.CSSProperties = {
  background: 'var(--admin-subcard-bg)',
  border: '1px solid var(--admin-border-subtle)',
  color: 'var(--admin-text-main)',
  borderRadius: 8,
  padding: '7px 14px',
  fontSize: 11,
  fontWeight: 700,
  cursor: 'pointer',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
}

const waBtnStyle: React.CSSProperties = {
  background: '#25D366',
  border: 'none',
  color: '#FFFFFF',
  borderRadius: 8,
  padding: '7px 14px',
  fontSize: 11,
  fontWeight: 700,
  cursor: 'pointer',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
}

const selectStyle: React.CSSProperties = {
  background: 'var(--admin-subcard-bg)',
  border: '1px solid var(--admin-border-subtle)',
  color: 'var(--admin-text-main)',
  borderRadius: 8,
  padding: '7px 12px',
  fontSize: 11,
  fontWeight: 700,
  cursor: 'pointer',
  outline: 'none',
}

const refreshBtnStyle: React.CSSProperties = {
  background: 'var(--admin-subcard-bg)',
  border: '1px solid var(--admin-border-subtle)',
  color: 'var(--admin-text-sub)',
  borderRadius: 8,
  padding: '7px 14px',
  fontSize: 11,
  fontWeight: 700,
  cursor: 'pointer',
}

