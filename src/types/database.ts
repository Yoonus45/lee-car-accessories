// ============================================================
// Database TypeScript types — matches Supabase schema exactly
// ============================================================

export interface DbCategory {
  id: string           // Slug primary key: 'LIGHTING', 'INTERIOR', etc.
  name: string         // Display name
  img: string          // Image URL (from Supabase Storage or external URL)
  display_order: number
  created_at: string
}

export interface DbProduct {
  id: string           // Slug primary key: e.g. 'led-headlight'
  name: string
  title: string
  price: number | null
  mrp: number | null
  contact_for_price: boolean
  rating: number
  reviews_count: number
  image: string        // Main image URL
  images: string[]     // All image URLs (postgres text[])
  category: string     // FK → categories.id
  description: string
  long_desc: string
  in_stock: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface DbOrderRequest {
  id: string
  created_at: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  car_model: string | null
  product_id: string
  product_name: string
  quantity: number
  address: string | null
  notes: string | null
  status: 'new' | 'contacted' | 'confirmed' | 'ready' | 'completed' | 'cancelled'
}

export interface DbBooking {
  id: string
  created_at: string
  customer_name: string
  customer_phone: string
  car_model: string | null
  service_required: string | null
  preferred_date: string | null
  preferred_time: string | null
  notes: string | null
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}

export interface DbContactMessage {
  id: string
  created_at: string
  customer_name: string
  customer_phone: string
  message: string | null
  status: 'unread' | 'read' | 'replied'
}

export interface DbSeatCoverAppointment {
  id: string
  created_at: string
  full_name: string
  phone: string
  email: string | null
  car_brand: string | null
  car_model: string
  car_year: string | null
  preferred_date: string | null
  preferred_time: string | null
  seat_cover_type: string | null
  material_preference: string | null
  colour_preference: string | null
  notes: string | null
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}

export type GalleryType = 'general' | 'seat_cover'

export interface DbGalleryItem {
  id: string
  created_at: string
  title: string
  description: string | null
  category: string
  image_url: string
  storage_path: string | null
  gallery_type: GalleryType
  featured: boolean
  published: boolean
  sort_order: number
}

