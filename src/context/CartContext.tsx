import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  title: string
  price: number | null
  mrp: number | null
  contact_for_price: boolean
  image: string
  category: string
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: {
    id: string
    name: string
    title?: string
    price?: number | null
    mrp?: number | null
    contact_for_price?: boolean
    image: string
    category?: string
  }, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
  hasContactForPrice: boolean
  toast: { message: string; visible: boolean; item?: CartItem } | null
  hideToast: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const STORAGE_KEY = 'lee_car_accessories_cart_v1'

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [toast, setToast] = useState<{ message: string; visible: boolean; item?: CartItem } | null>(null)

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    } catch (err) {
      console.warn('Failed to save cart to localStorage:', err)
    }
  }, [cart])

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast?.visible) return
    const timer = setTimeout(() => {
      setToast(prev => prev ? { ...prev, visible: false } : null)
    }, 3500)
    return () => clearTimeout(timer)
  }, [toast])

  const addToCart = (product: {
    id: string
    name: string
    title?: string
    price?: number | null
    mrp?: number | null
    contact_for_price?: boolean
    image: string
    category?: string
  }, quantity = 1) => {
    const qty = Math.max(1, quantity)
    let addedItem: CartItem | undefined

    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.id === product.id)
      if (existingIdx > -1) {
        const updated = [...prev]
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + qty
        }
        addedItem = updated[existingIdx]
        return updated
      } else {
        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          title: product.title || product.name,
          price: product.price ?? null,
          mrp: product.mrp ?? null,
          contact_for_price: !!product.contact_for_price || product.price === null,
          image: product.image,
          category: product.category || 'ACCESSORIES',
          quantity: qty,
        }
        addedItem = newItem
        return [...prev, newItem]
      }
    })

    // Show toast notification
    setToast({
      message: `Added ${qty > 1 ? `${qty}x ` : ''}"${product.title || product.name}" to cart!`,
      visible: true,
      item: addedItem
    })
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)
  const hasContactForPrice = cart.some(item => item.contact_for_price || item.price === null)

  const hideToast = () => setToast(null)

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        hasContactForPrice,
        toast,
        hideToast,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
