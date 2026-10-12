import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function CartToast() {
  const { toast, hideToast } = useCart()

  if (!toast?.visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 999,
        maxWidth: 'calc(100vw - 32px)',
        width: 400,
        background: 'var(--header-bg, rgba(9, 13, 17, 0.96))',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--border-focus, rgba(17, 188, 230, 0.4))',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.2), 0 0 20px var(--cyan-glow, rgba(17, 188, 230, 0.15))',
        borderRadius: 16,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        animation: 'slideUpToast 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: 'rgba(17, 188, 230, 0.12)',
          border: '1px solid rgba(17, 188, 230, 0.3)',
          display: 'grid',
          placeItems: 'center',
          color: '#11BCE6',
          fontSize: 16,
          flexShrink: 0,
        }}
      >
        ✓
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 12, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          Added to Cart!
        </div>
        <div style={{ fontSize: 11, color: '#A0A7AE', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {toast.message}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <Link
          to="/cart"
          onClick={hideToast}
          style={{
            background: '#11BCE6',
            color: '#02141B',
            fontWeight: 800,
            fontSize: 11,
            letterSpacing: '0.04em',
            padding: '7px 14px',
            borderRadius: 999,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          VIEW CART →
        </Link>
        <button
          onClick={hideToast}
          aria-label="Dismiss"
          style={{
            background: 'none',
            border: 'none',
            color: '#687078',
            fontSize: 16,
            cursor: 'pointer',
            padding: 4,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          ✕
        </button>
      </div>

      <style>{`
        @keyframes slideUpToast {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @media (max-width: 480px) {
          div[style*="slideUpToast"] {
            bottom: 16px !important;
            right: 16px !important;
            left: 16px !important;
            width: auto !important;
          }
        }
      `}</style>
    </div>
  )
}
