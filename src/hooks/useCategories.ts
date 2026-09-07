import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { DbCategory } from '../types/database'

// Fallback categories while Supabase isn't configured
const fallbackCategories: DbCategory[] = [
  { id: 'LIGHTING',    name: 'LIGHTING',    img: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400&h=400&fit=crop', display_order: 1, created_at: '' },
  { id: 'INTERIOR',    name: 'INTERIOR',    img: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=400&h=400&fit=crop',   display_order: 2, created_at: '' },
  { id: 'EXTERIOR',    name: 'EXTERIOR',    img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=400&fit=crop', display_order: 3, created_at: '' },
  { id: 'AUDIO',       name: 'AUDIO',       img: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=400&fit=crop', display_order: 4, created_at: '' },
  { id: 'ACCESSORIES', name: 'ACCESSORIES', img: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=400&h=400&fit=crop', display_order: 5, created_at: '' },
]

export function useCategories() {
  const [categories, setCategories] = useState<DbCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchCategories() {
      setLoading(true)
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true })

      if (cancelled) return

      if (error || !data || data.length === 0) {
        setCategories(fallbackCategories)
      } else {
        setCategories(data as DbCategory[])
      }
      setLoading(false)
    }

    fetchCategories()
    return () => { cancelled = true }
  }, [])

  return { categories, loading }
}
