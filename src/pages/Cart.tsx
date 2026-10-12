import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { businessInfo } from '../data/mockData'
import { formatINR } from '../lib/currency'

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart, totalItems, subtotal, hasContactForPrice } = useCart()
  const navigate = useNavigate()

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: 'clamp(40px, 8vw, 80px) 0', textAlign: 'center' }}>
        <div
          style={{
            maxWidth: 520,
            marginInline: 'auto',
            background: 'var(--card-bg, #090D11)',
            border: '1px solid var(--card-border, #1C232B)',
            borderRadius: 22,
            padding: 'clamp(32px, 6vw, 48px) 24px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.2)',
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'rgba(17,188,230,0.08)',
              border: '1px solid rgba(17,188,230,0.25)',
              display: 'grid',
              placeItems: 'center',
              fontSize: 32,
              margin: '0 auto 18px',
              color: '#11BCE6',
            }}
          >
            🛒
          </div>

          <div style={{ color: '#11BCE6', fontWeight: 800, fontSize: 11, letterSpacing: '0.14em' }}>
            SHOPPING CART
          </div>
          <h1 className="sec-title" style={{ fontSize: 'clamp(22px, 4vw, 28px)', margin: '6px 0 10px' }}>
            YOUR CART IS <span style={{ color: '#11BCE6' }}>EMPTY</span>
          </h1>

          <p style={{ color: '#8A929B', fontSize: 13, lineHeight: 1.65, maxWidth: 420, marginInline: 'auto' }}>
            Looks like you haven't added any accessories yet. Explore our genuine parts, LED headlights, and Android infotainment units.
          </p>

          <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/shop" className="btn-cyan">
              EXPLORE SHOP CATALOGUE →
            </Link>
            <Link to="/seat-covers" className="btn-gold">
              VIEW SEAT COVERS
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: 'clamp(24px, 4vw, 44px) 0 clamp(40px, 6vw, 64px)' }}>
      {/* Header Breadcrumb & Title */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: '#687078', display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8 }}>
          <Link to="/" style={{ color: '#A0A7AE' }}>HOME</Link>
          <span>/</span>
          <Link to="/shop" style={{ color: '#A0A7AE' }}>SHOP</Link>
          <span>/</span>
          <span style={{ color: '#11BCE6', fontWeight: 700 }}>CART</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ color: '#11BCE6', fontWeight: 800, fontSize: 11, letterSpacing: '0.14em' }}>
              YOUR SELECTIONS
            </div>
            <h1 className="sec-title" style={{ fontSize: 'clamp(24px, 4.5vw, 34px)', margin: '4px 0 0' }}>
              SHOPPING <span style={{ color: '#11BCE6' }}>CART</span>
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, color: '#8A929B' }}>
              <strong style={{ color: '#FFFFFF' }}>{totalItems}</strong> item{totalItems !== 1 ? 's' : ''}
            </span>
            <button
              onClick={clearCart}
              style={{
                background: 'transparent',
                border: '1px solid #1E2A33',
                color: '#FF7070',
                borderRadius: 999,
                padding: '6px 14px',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>

      {/* Cart Layout: Two Columns on Desktop */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 0.9fr)',
          gap: 'clamp(20px, 3.5vw, 36px)',
          alignItems: 'start',
        }}
        className="cart-grid-wrap"
      >
        {/* Left Column: List of Cart Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {cart.map(item => (
            <div
              key={item.id}
              style={{
                background: 'var(--card-bg, #090D11)',
                border: '1px solid var(--card-border, #1C232B)',
                borderRadius: 16,
                padding: 'clamp(14px, 2.5vw, 20px)',
                display: 'grid',
                gridTemplateColumns: 'clamp(70px, 15vw, 100px) minmax(0, 1fr)',
                gap: 'clamp(12px, 2vw, 18px)',
                alignItems: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              }}
            >
              {/* Product Image */}
              <Link to={`/product/${item.id}`} style={{ display: 'block', aspectRatio: '1', borderRadius: 12, overflow: 'hidden', background: 'var(--card-item-bg, #0D1217)', border: '1px solid var(--card-item-border, #1E2A33)' }}>
                <img
                  src={item.image}
                  alt={item.title || item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Link>

              {/* Product Info & Controls */}
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ minWidth: 0 }}>
                    <span
                      style={{
                        background: 'rgba(17,188,230,0.08)',
                        color: '#11BCE6',
                        fontSize: 9,
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: 999,
                        letterSpacing: '0.06em',
                        border: '1px solid rgba(17,188,230,0.2)',
                      }}
                    >
                      {item.category}
                    </span>
                    <Link to={`/product/${item.id}`}>
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: 'clamp(13px, 2vw, 15px)',
                          color: 'var(--text, #FFFFFF)',
                          marginTop: 4,
                          lineHeight: 1.3,
                        }}
                      >
                        {item.title || item.name}
                      </div>
                    </Link>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.title} from cart`}
                    style={{
                      background: 'none',
                      border: '1px solid #1E2A33',
                      color: '#687078',
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      cursor: 'pointer',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 13,
                      flexShrink: 0,
                      transition: 'all 0.15s ease',
                    }}
                    title="Remove item"
                  >
                    ✕
                  </button>
                </div>

                {/* Price & Quantity Row */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 12,
                    marginTop: 14,
                    paddingTop: 10,
                    borderTop: '1px solid #141B22',
                  }}
                >
                  {/* Unit & Item Total Price */}
                  <div>
                    {item.contact_for_price || item.price === null ? (
                      <span style={{ color: '#D69A13', fontWeight: 800, fontSize: 13 }}>
                        Contact for Price
                      </span>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                        <span style={{ color: '#00C8F0', fontWeight: 900, fontSize: 'clamp(14px, 2vw, 16px)' }}>
                          {formatINR((item.price || 0) * item.quantity)}
                        </span>
                        {item.quantity > 1 && (
                          <span style={{ fontSize: 11, color: '#687078' }}>
                            ({formatINR(item.price)} each)
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Quantity Stepper */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      background: 'var(--card-item-bg, #0D1217)',
                      border: '1px solid var(--card-item-border, #1E2A33)',
                      borderRadius: 999,
                      padding: '3px 6px',
                    }}
                  >
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        border: '1px solid var(--card-item-border, #1E2A33)',
                        background: 'var(--card-item-bg, #090D11)',
                        color: 'var(--text, #FFFFFF)',
                        fontSize: 14,
                        cursor: 'pointer',
                        display: 'grid',
                        placeItems: 'center',
                        fontWeight: 700,
                      }}
                    >
                      −
                    </button>
                    <span style={{ minWidth: 20, textAlign: 'center', fontWeight: 800, fontSize: 13, color: 'var(--text, #FFFFFF)' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        border: '1px solid var(--card-item-border, #1E2A33)',
                        background: 'var(--card-item-bg, #090D11)',
                        color: 'var(--text, #FFFFFF)',
                        fontSize: 14,
                        cursor: 'pointer',
                        display: 'grid',
                        placeItems: 'center',
                        fontWeight: 700,
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Continue Shopping button */}
          <div style={{ marginTop: 8 }}>
            <Link
              to="/shop"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                color: '#11BCE6',
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: '0.04em',
              }}
            >
              ← CONTINUE BROWSING ACCESSORIES
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout Action (Sticky on Desktop) */}
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
            CHECKOUT BREAKDOWN
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
            ORDER SUMMARY
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderBottom: '1px solid var(--divider, #161D24)', paddingBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-muted, #A0A7AE)' }}>
              <span>Total Selected Items:</span>
              <strong style={{ color: 'var(--text, #FFFFFF)' }}>{totalItems}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-muted, #A0A7AE)' }}>
              <span>Subtotal:</span>
              <span style={{ color: 'var(--text, #FFFFFF)', fontWeight: 800 }}>
                {formatINR(subtotal)}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#A0A7AE' }}>
              <span>Store Fitment / Inspection:</span>
              <span style={{ color: '#00C864', fontWeight: 800 }}>FREE AT STORE</span>
            </div>

            {hasContactForPrice && (
              <div
                style={{
                  background: 'rgba(214,154,19,0.08)',
                  border: '1px solid rgba(214,154,19,0.25)',
                  borderRadius: 8,
                  padding: '8px 10px',
                  fontSize: 11,
                  color: '#D69A13',
                  lineHeight: 1.4,
                }}
              >
                ⓘ Some items require final quote based on car model & specification.
              </div>
            )}
          </div>

          {/* Grand Total */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              padding: '16px 0',
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text, #FFFFFF)' }}>Estimated Total:</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted2, #687078)' }}>Inclusive of all taxes</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: 24, color: '#00C8F0' }}>
                {formatINR(subtotal)}
              </div>
            </div>
          </div>

          {/* Primary Proceed to Checkout Button */}
          <button
            onClick={() => navigate('/checkout')}
            className="btn-cyan"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: 13,
              letterSpacing: '0.1em',
              fontWeight: 900,
            }}
          >
            PROCEED TO CHECKOUT →
          </button>

          {/* WhatsApp Direct Option */}
          <a
            href={`${businessInfo.whatsappHref}?text=Hi%20Lee%20Car%20Accessories%2C%20I%20have%20${totalItems}%20items%20in%20my%20cart%20(Total%3A%20₹${subtotal}).%20Can%20I%20confirm%20stock%20and%20fitment%3F`}
            target="_blank"
            rel="noreferrer"
            className="btn-gold"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: 12,
              marginTop: 10,
              textAlign: 'center',
            }}
          >
            ORDER VIA WHATSAPP 💬
          </a>

          {/* Trust Guarantees */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #161D24', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11, color: '#687078' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#11BCE6' }}>✓</span>
              <span>100% Genuine Branded Automotive Accessories</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#11BCE6' }}>✓</span>
              <span>Professional in-store fitment at ECR Junction</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#11BCE6' }}>✓</span>
              <span>No online payment required now — pay after confirmation</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .cart-grid-wrap {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
