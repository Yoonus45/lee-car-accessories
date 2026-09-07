import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { DbProduct } from '../types/database'
import { products as fallbackProducts } from '../data/mockData'

// Convert mockData product shape to DbProduct for fallback
function mockToDb(p: typeof fallbackProducts[0]): DbProduct {
  return {
    id: p.id,
    name: p.name,
    title: p.title,
    price: p.price,
    mrp: p.mrp,
    contact_for_price: !!p.contactForPrice,
    rating: p.rating,
    reviews_count: p.reviews,
    image: p.image,
    images: p.images,
    category: p.category,
    description: p.desc,
    long_desc: p.longDesc,
    in_stock: true,
    display_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

export function useProducts() {
  const [products, setProducts] = useState<DbProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchProducts() {
      setLoading(true)
      setError(null)

      const { data, error: sbError } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .order('display_order', { ascending: true })

      if (cancelled) return

      if (sbError || !data || data.length === 0) {
        if (sbError) console.warn('[useProducts] Supabase error — using local fallback:', sbError.message)
        if (!sbError && (!data || data.length === 0)) console.warn('[useProducts] No products from Supabase — using local fallback')
        setProducts(fallbackProducts.map(mockToDb))
        setError(null)
      } else {
        setProducts((data || []) as DbProduct[])
      }
      setLoading(false)
    }

    fetchProducts()
    return () => { cancelled = true }
  }, [])

  return { products, loading, error }
}
