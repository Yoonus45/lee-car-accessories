import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { DbProduct } from '../types/database'
import { products as fallbackProducts } from '../data/mockData'

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

export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<DbProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    let cancelled = false

    async function fetchProduct() {
      setLoading(true)
      setError(null)

      const { data, error: sbError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id as string)
        .single()

      if (cancelled) return

      if (sbError || !data) {
        // Fallback to mockData
        const fallback = fallbackProducts.find(p => p.id === id)
        if (fallback) {
          setProduct(mockToDb(fallback))
        } else {
          setError('Product not found')
        }
      } else {
        setProduct(data)
      }
      setLoading(false)
    }

    fetchProduct()
    return () => { cancelled = true }
  }, [id])

  return { product, loading, error }
}
