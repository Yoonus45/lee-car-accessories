import { useState, useEffect, useRef, useMemo } from 'react'
import { supabase } from '../../../lib/supabase'
import type { DbGalleryItem, GalleryType } from '../../../types/database'

const STORAGE_BUCKET = 'gallery-images'
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

export const GENERAL_CATEGORIES = [
  'Car Accessories',
  'Lighting',
  'Interior',
  'Exterior',
  'Audio',
  'Installation',
  'Custom Work',
  'Other',
] as const

export const SEAT_COVER_CATEGORIES = [
  'Custom Fit',
  'Before & After',
  'Luxury Leather',
  'Dual Tone',
  'Classic Luxury',
  'Sport Stitching',
  'Bucket Fit',
  'Other',
] as const

interface GalleryFormData {
  title: string
  category: string
  description: string
  gallery_type: GalleryType
  featured: boolean
  published: boolean
  sort_order: number
  image_url: string
  storage_path: string | null
}

const emptyForm: GalleryFormData = {
  title: '',
  category: '',
  description: '',
  gallery_type: 'general',
  featured: false,
  published: true,
  sort_order: 0,
  image_url: '',
  storage_path: null,
}

export default function GalleryTab() {
  const [activeType, setActiveType] = useState<GalleryType>('general')
  const [items, setItems] = useState<DbGalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterState, setFilterState] = useState<'all' | 'published' | 'hidden' | 'featured'>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Modal states
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<DbGalleryItem | null>(null)
  const [form, setForm] = useState<GalleryFormData>(emptyForm)
  const [customCategory, setCustomCategory] = useState('')

  // Upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Delete confirmation modal state
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<DbGalleryItem | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchGalleryItems()
  }, [])

  // Auto-clear toast
  useEffect(() => {
    if (!toastMessage) return
    const timer = setTimeout(() => setToastMessage(null), 3000)
    return () => clearTimeout(timer)
  }, [toastMessage])

  async function fetchGalleryItems() {
    setLoading(true)
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.warn('[GalleryTab] Fetch error:', error.message)
    }
    setItems(data || [])
    setLoading(false)
  }

  // Active items filtered by gallery type (General vs Seat Cover)
  const typeItems = useMemo(() => {
    return items.filter(item => item.gallery_type === activeType)
  }, [items, activeType])

  // Live Metrics for active tab
  const metrics = useMemo(() => {
    return {
      total: typeItems.length,
      published: typeItems.filter(i => i.published).length,
      hidden: typeItems.filter(i => !i.published).length,
      featured: typeItems.filter(i => i.featured).length,
    }
  }, [typeItems])

  // Filtered items based on search and filters
  const displayedItems = useMemo(() => {
    return typeItems.filter(item => {
      // Filter state
      if (filterState === 'published' && !item.published) return false
      if (filterState === 'hidden' && item.published) return false
      if (filterState === 'featured' && !item.featured) return false

      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false

      // Search query
      const q = searchQuery.toLowerCase().trim()
      if (!q) return true
      return (
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
      )
    })
  }, [typeItems, filterState, selectedCategory, searchQuery])

  // Open Add modal
  function openAddModal() {
    setEditingItem(null)
    const defaultCat = activeType === 'general' ? GENERAL_CATEGORIES[0] : SEAT_COVER_CATEGORIES[0]
    setForm({
      ...emptyForm,
      gallery_type: activeType,
      category: defaultCat,
    })
    setCustomCategory('')
    setSelectedFile(null)
    setPreviewUrl(null)
    setFormError(null)
    setModalOpen(true)
  }

  // Open Edit modal
  function openEditModal(item: DbGalleryItem) {
    setEditingItem(item)
    const knownCats = activeType === 'general' ? (GENERAL_CATEGORIES as readonly string[]) : (SEAT_COVER_CATEGORIES as readonly string[])
    const isCustom = !knownCats.includes(item.category)

    setForm({
      title: item.title,
      category: isCustom ? 'Other' : item.category,
      description: item.description || '',
      gallery_type: item.gallery_type,
      featured: item.featured,
      published: item.published,
      sort_order: item.sort_order,
      image_url: item.image_url,
      storage_path: item.storage_path,
    })
    setCustomCategory(isCustom ? item.category : '')
    setSelectedFile(null)
    setPreviewUrl(item.image_url)
    setFormError(null)
    setModalOpen(true)
  }

  // Handle image file selection with validation
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setFormError(null)

    // Allowed extensions / mime types
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    if (!validTypes.includes(file.type.toLowerCase())) {
      setFormError('Invalid file type. Please upload a JPG, PNG, or WEBP image.')
      return
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFormError(`Image exceeds the 5 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB).`)
      return
    }

    setSelectedFile(file)
    const localUrl = URL.createObjectURL(file)
    setPreviewUrl(localUrl)
  }

  // Quick toggle: Published <-> Hidden
  async function togglePublished(item: DbGalleryItem) {
    const newStatus = !item.published
    // Optimistic update
    setItems(prev => prev.map(i => (i.id === item.id ? { ...i, published: newStatus } : i)))

    const { error } = await supabase
      .from('gallery_items')
      .update({ published: newStatus })
      .eq('id', item.id)

    if (error) {
      // Revert on error
      setItems(prev => prev.map(i => (i.id === item.id ? { ...i, published: item.published } : i)))
      setToastMessage(`Error: ${error.message}`)
    } else {
      setToastMessage(newStatus ? 'Photo published to website' : 'Photo hidden from website')
    }
  }

  // Quick toggle: Featured <-> Unfeatured
  async function toggleFeatured(item: DbGalleryItem) {
    const newStatus = !item.featured
    // Optimistic update
    setItems(prev => prev.map(i => (i.id === item.id ? { ...i, featured: newStatus } : i)))

    const { error } = await supabase
      .from('gallery_items')
      .update({ featured: newStatus })
      .eq('id', item.id)

    if (error) {
      setItems(prev => prev.map(i => (i.id === item.id ? { ...i, featured: item.featured } : i)))
      setToastMessage(`Error: ${error.message}`)
    } else {
      setToastMessage(newStatus ? 'Marked as Featured' : 'Unmarked from Featured')
    }
  }

  // Save (Create or Update)
  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)

    if (!form.title.trim()) {
      setFormError('Please enter a title for this gallery item.')
      return
    }

    const finalCategory =
      form.category === 'Other' && customCategory.trim()
        ? customCategory.trim()
        : form.category || 'Car Accessories'

    if (!editingItem && !selectedFile && !form.image_url.trim()) {
      setFormError('Please choose an image to upload or provide an image URL.')
      return
    }

    setSaving(true)

    let finalImageUrl = form.image_url
    let finalStoragePath = form.storage_path

    // Upload file if new file was selected
    if (selectedFile) {
      setUploading(true)
      const ext = selectedFile.name.split('.').pop()?.toLowerCase() || 'jpg'
      const folder = form.gallery_type === 'seat_cover' ? 'seat-covers' : 'general'
      const uniqueName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(uniqueName, selectedFile, {
          contentType: selectedFile.type,
          upsert: true,
        })

      setUploading(false)

      if (uploadError) {
        setSaving(false)
        setFormError(`Storage upload failed: ${uploadError.message}. Make sure the '${STORAGE_BUCKET}' bucket exists in Supabase.`)
        return
      }

      // If replacing an existing image that was stored in Supabase Storage, remove old file
      if (editingItem && editingItem.storage_path && editingItem.storage_path !== uploadData.path) {
        await supabase.storage.from(STORAGE_BUCKET).remove([editingItem.storage_path])
      }

      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(uploadData.path)

      finalImageUrl = urlData.publicUrl
      finalStoragePath = uploadData.path
    }

    if (!finalImageUrl) {
      setSaving(false)
      setFormError('Image URL is missing. Please select an image.')
      return
    }

    if (editingItem) {
      // Update
      const { data, error } = await supabase
        .from('gallery_items')
        .update({
          title: form.title.trim(),
          category: finalCategory,
          description: form.description.trim() || null,
          gallery_type: form.gallery_type,
          featured: form.featured,
          published: form.published,
          sort_order: Number(form.sort_order) || 0,
          image_url: finalImageUrl,
          storage_path: finalStoragePath,
        })
        .eq('id', editingItem.id)
        .select()
        .single()

      setSaving(false)

      if (error) {
        setFormError(`Update failed: ${error.message}`)
        return
      }

      setItems(prev => prev.map(i => (i.id === editingItem.id ? data : i)))
      setToastMessage('Gallery item updated successfully')
      setModalOpen(false)
    } else {
      // Create
      const { data, error } = await supabase
        .from('gallery_items')
        .insert({
          title: form.title.trim(),
          category: finalCategory,
          description: form.description.trim() || null,
          gallery_type: form.gallery_type,
          featured: form.featured,
          published: form.published,
          sort_order: Number(form.sort_order) || 0,
          image_url: finalImageUrl,
          storage_path: finalStoragePath,
        })
        .select()
        .single()

      setSaving(false)

      if (error) {
        setFormError(`Insert failed: ${error.message}`)
        return
      }

      setItems(prev => [data, ...prev])
      setToastMessage('Gallery item added successfully')
      setModalOpen(false)
    }
  }

  // Delete handler with storage cleanup
  async function handleDelete(item: DbGalleryItem) {
    setDeleting(true)

    // 1. Delete database record
    const { error: dbError } = await supabase
      .from('gallery_items')
      .delete()
      .eq('id', item.id)

    if (dbError) {
      setDeleting(false)
      setToastMessage(`Failed to delete record: ${dbError.message}`)
      setDeleteConfirmItem(null)
      return
    }

    // 2. Delete associated file from Supabase Storage
    let pathToRemove = item.storage_path
    if (!pathToRemove && item.image_url) {
      const match = item.image_url.match(new RegExp(`/${STORAGE_BUCKET}/(.+)$`))
      if (match) pathToRemove = match[1]
    }

    if (pathToRemove) {
      try {
        await supabase.storage.from(STORAGE_BUCKET).remove([pathToRemove])
      } catch (err) {
        console.warn('[GalleryTab] Could not remove image from storage:', err)
      }
    }

    setDeleting(false)
    setItems(prev => prev.filter(i => i.id !== item.id))
    setToastMessage('Gallery item and image deleted permanently')
    setDeleteConfirmItem(null)
  }

  const categoryOptions = activeType === 'general' ? GENERAL_CATEGORIES : SEAT_COVER_CATEGORIES

  return (
    <div>
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER & TOP CONTROLS
      ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 14,
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
              GALLERY MANAGEMENT
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
              SHOWCASE & PORTFOLIO
            </span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', marginTop: 4 }}>
            Manage client showcase photos and completed work for General Website & Seat Covers
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={openAddModal}
            style={{
              fontSize: 12,
              color: '#02141B',
              border: 'none',
              borderRadius: 8,
              padding: '9px 16px',
              background: '#11BCE6',
              cursor: 'pointer',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 0 14px rgba(17,188,230,0.3)',
            }}
          >
            + Upload New Work
          </button>
          <button onClick={fetchGalleryItems} style={refreshBtnStyle} title="Reload gallery items">
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Toast Banner */}
      {toastMessage && (
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
          ✓ {toastMessage}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. GALLERY TYPE SWITCHER (GENERAL vs SEAT COVERS)
      ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          marginBottom: 20,
          background: 'var(--admin-card-bg)',
          padding: '6px',
          borderRadius: 12,
          border: '1px solid var(--admin-border)',
          width: 'fit-content',
          boxShadow: 'var(--admin-card-shadow)',
        }}
      >
        <button
          onClick={() => {
            setActiveType('general')
            setSelectedCategory('all')
          }}
          style={{
            padding: '8px 18px',
            borderRadius: 8,
            border: 'none',
            background: activeType === 'general' ? '#11BCE6' : 'transparent',
            color: activeType === 'general' ? '#02141B' : 'var(--admin-text-sub)',
            fontWeight: 800,
            fontSize: 12,
            letterSpacing: '0.04em',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.15s ease',
          }}
        >
          <span>🌐</span>
          <span>General Gallery</span>
          <span
            style={{
              fontSize: 10,
              background: activeType === 'general' ? 'rgba(2,20,27,0.25)' : 'var(--admin-subcard-bg)',
              color: activeType === 'general' ? '#02141B' : 'var(--admin-text-muted)',
              padding: '1px 6px',
              borderRadius: 999,
            }}
          >
            {items.filter(i => i.gallery_type === 'general').length}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveType('seat_cover')
            setSelectedCategory('all')
          }}
          style={{
            padding: '8px 18px',
            borderRadius: 8,
            border: 'none',
            background: activeType === 'seat_cover' ? '#11BCE6' : 'transparent',
            color: activeType === 'seat_cover' ? '#02141B' : 'var(--admin-text-sub)',
            fontWeight: 800,
            fontSize: 12,
            letterSpacing: '0.04em',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.15s ease',
          }}
        >
          <span>💺</span>
          <span>Seat Covers — Our Work</span>
          <span
            style={{
              fontSize: 10,
              background: activeType === 'seat_cover' ? 'rgba(2,20,27,0.25)' : 'var(--admin-subcard-bg)',
              color: activeType === 'seat_cover' ? '#02141B' : 'var(--admin-text-muted)',
              padding: '1px 6px',
              borderRadius: 999,
            }}
          >
            {items.filter(i => i.gallery_type === 'seat_cover').length}
          </span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. METRICS SUMMARY FOR ACTIVE GALLERY
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
            label: 'TOTAL PHOTOS',
            icon: '📸',
            count: metrics.total,
            color: 'var(--admin-text-main)',
            bg: 'var(--admin-subcard-bg)',
            border: 'var(--admin-border-subtle)',
          },
          {
            key: 'published',
            label: 'LIVE ON WEBSITE',
            icon: '👁️',
            count: metrics.published,
            color: '#00C864',
            bg: 'rgba(0,200,100,0.08)',
            border: 'rgba(0,200,100,0.25)',
          },
          {
            key: 'hidden',
            label: 'HIDDEN / DRAFT',
            icon: '🔒',
            count: metrics.hidden,
            color: 'var(--admin-text-sub)',
            bg: 'rgba(160,167,174,0.08)',
            border: 'rgba(160,167,174,0.2)',
          },
          {
            key: 'featured',
            label: 'FEATURED SPOTLIGHT',
            icon: '⭐',
            count: metrics.featured,
            color: '#D69A13',
            bg: 'rgba(214,154,19,0.08)',
            border: 'rgba(214,154,19,0.25)',
          },
        ].map(m => {
          const isActive = filterState === m.key
          return (
            <div
              key={m.label}
              onClick={() => setFilterState(m.key as typeof filterState)}
              style={{
                background: m.bg,
                border: `1px solid ${isActive ? m.color : m.border}`,
                borderRadius: 12,
                padding: '14px 16px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? `0 0 12px ${m.bg}` : 'none',
              }}
              title={`Filter by ${m.label}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 9, fontWeight: 800, color: '#8A929B', letterSpacing: '0.08em' }}>
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
          4. SEARCH & CATEGORY FILTER CONTROLS
      ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          background: 'var(--admin-card-bg)',
          border: '1px solid var(--admin-border)',
          borderRadius: 14,
          padding: '14px 16px',
          marginBottom: 20,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--admin-card-shadow)',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 200 }}>
          <input
            type="text"
            placeholder="Search by title, category, description..."
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
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)', fontSize: 13 }}>
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

        {/* Category filter pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: '#687078', letterSpacing: '0.06em' }}>
            CATEGORY:
          </span>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '5px 12px',
              borderRadius: 999,
              border: `1px solid ${selectedCategory === 'all' ? '#11BCE6' : '#1E2A33'}`,
              background: selectedCategory === 'all' ? 'rgba(17,188,230,0.12)' : 'transparent',
              color: selectedCategory === 'all' ? '#11BCE6' : '#A0A7AE',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            All
          </button>
          {categoryOptions.map(cat => {
            const isSelected = selectedCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 999,
                  border: `1px solid ${isSelected ? '#11BCE6' : '#1E2A33'}`,
                  background: isSelected ? 'rgba(17,188,230,0.12)' : 'transparent',
                  color: isSelected ? '#11BCE6' : '#A0A7AE',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. GALLERY CARDS GRID
      ───────────────────────────────────────────────────────────── */}
      {loading ? (
        <div style={{ color: '#687078', fontSize: 13, padding: '60px 0', textAlign: 'center' }}>
          Loading {activeType === 'general' ? 'General' : 'Seat Cover'} gallery…
        </div>
      ) : displayedItems.length === 0 ? (
        <div
          style={{
            background: '#090D11',
            border: '1px solid #1C232B',
            borderRadius: 14,
            padding: '50px 20px',
            textAlign: 'center',
            color: '#687078',
            fontSize: 13,
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 10 }}>📸</div>
          <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: 14 }}>
            No gallery items found
          </div>
          <div style={{ fontSize: 12, color: '#8A929B', marginTop: 4 }}>
            {searchQuery
              ? `No items match "${searchQuery}".`
              : `No photos uploaded for ${activeType === 'general' ? 'General Gallery' : 'Seat Covers Our Work'} yet.`}
          </div>
          <button
            onClick={openAddModal}
            style={{
              marginTop: 16,
              background: '#11BCE6',
              color: '#02141B',
              fontWeight: 800,
              fontSize: 11,
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            + Upload First Photo
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          {displayedItems.map(item => (
            <div
              key={item.id}
              style={{
                background: 'var(--admin-card-bg)',
                border: '1px solid var(--admin-border)',
                borderRadius: 14,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'border-color 0.2s ease',
                boxShadow: 'var(--admin-card-shadow)',
              }}
            >
              {/* Image thumbnail container with badges */}
              <div style={{ position: 'relative', height: 180, background: 'var(--admin-subcard-bg)', overflow: 'hidden' }}>
                <img
                  src={item.image_url}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: item.published ? 1 : 0.6,
                    filter: item.published ? 'none' : 'grayscale(40%)',
                    transition: 'all 0.2s ease',
                  }}
                  loading="lazy"
                />

                {/* Badges row */}
                <div
                  style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    right: 10,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <span
                    style={{
                      background: 'rgba(5,7,8,0.85)',
                      backdropFilter: 'blur(6px)',
                      border: '1px solid rgba(17,188,230,0.35)',
                      color: '#11BCE6',
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                      padding: '3px 8px',
                      borderRadius: 6,
                    }}
                  >
                    {item.category}
                  </span>

                  <div style={{ display: 'flex', gap: 4 }}>
                    {item.featured && (
                      <span
                        style={{
                          background: 'rgba(214,154,19,0.9)',
                          color: '#FFFFFF',
                          fontSize: 10,
                          fontWeight: 900,
                          padding: '3px 7px',
                          borderRadius: 6,
                          letterSpacing: '0.04em',
                        }}
                      >
                        ⭐ FEATURED
                      </span>
                    )}
                    <span
                      style={{
                        background: item.published ? 'rgba(0,200,100,0.85)' : 'rgba(255,85,85,0.85)',
                        color: '#FFFFFF',
                        fontSize: 10,
                        fontWeight: 900,
                        padding: '3px 7px',
                        borderRadius: 6,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {item.published ? 'LIVE' : 'HIDDEN'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card body */}
              <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    fontFamily: 'Orbitron, sans-serif',
                    fontWeight: 800,
                    fontSize: 13,
                    color: 'var(--admin-text-main)',
                    lineHeight: 1.3,
                  }}
                >
                  {item.title}
                </div>

                {item.description && (
                  <div
                    style={{
                      fontSize: 11,
                      color: '#8A929B',
                      marginTop: 6,
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {item.description}
                  </div>
                )}

                <div
                  style={{
                    fontSize: 10,
                    color: '#5C656F',
                    marginTop: 'auto',
                    paddingTop: 10,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>Order: {item.sort_order}</span>
                  <span>{new Date(item.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>

                {/* Actions Bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginTop: 12,
                    paddingTop: 10,
                    borderTop: '1px solid #17202A',
                  }}
                >
                  {/* Hide/Publish Button */}
                  <button
                    onClick={() => togglePublished(item)}
                    style={{
                      flex: 1,
                      padding: '6px 8px',
                      borderRadius: 6,
                      border: `1px solid ${item.published ? '#1E2A33' : 'rgba(0,200,100,0.3)'}`,
                      background: item.published ? 'transparent' : 'rgba(0,200,100,0.1)',
                      color: item.published ? '#A0A7AE' : '#00C864',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                    title={item.published ? 'Hide from customer website' : 'Publish to customer website'}
                  >
                    {item.published ? '👁️ Hide' : '👁️ Publish'}
                  </button>

                  {/* Featured Button */}
                  <button
                    onClick={() => toggleFeatured(item)}
                    style={{
                      padding: '6px 8px',
                      borderRadius: 6,
                      border: '1px solid #1E2A33',
                      background: item.featured ? 'rgba(214,154,19,0.12)' : 'transparent',
                      color: item.featured ? '#D69A13' : '#687078',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                    title={item.featured ? 'Remove featured star' : 'Mark as featured'}
                  >
                    ⭐
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => openEditModal(item)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 6,
                      border: '1px solid rgba(17,188,230,0.25)',
                      background: 'rgba(17,188,230,0.08)',
                      color: '#11BCE6',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                    title="Edit title, category, description, or image"
                  >
                    ✏️ Edit
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => setDeleteConfirmItem(item)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 6,
                      border: '1px solid rgba(255,85,85,0.25)',
                      background: 'rgba(255,85,85,0.08)',
                      color: '#FF5555',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                    title="Delete permanently"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. UPLOAD / EDIT MODAL
      ───────────────────────────────────────────────────────────── */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--admin-modal-overlay)',
            backdropFilter: 'blur(6px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
          onClick={e => {
            if (e.target === e.currentTarget && !saving) setModalOpen(false)
          }}
        >
          <div
            style={{
              background: 'var(--admin-card-bg)',
              border: '1px solid var(--admin-border)',
              borderRadius: 18,
              width: '100%',
              maxWidth: 540,
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '18px 22px',
                borderBottom: '1px solid var(--admin-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: 'Orbitron, sans-serif',
                    fontWeight: 900,
                    fontSize: 15,
                    color: 'var(--admin-text-main)',
                    margin: 0,
                  }}
                >
                  {editingItem ? 'EDIT GALLERY ITEM' : 'UPLOAD NEW WORK PHOTO'}
                </h3>
                <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', marginTop: 2 }}>
                  Destination:{' '}
                  <span style={{ color: '#11BCE6', fontWeight: 800 }}>
                    {form.gallery_type === 'seat_cover' ? 'Seat Covers Our Work' : 'General Website Gallery'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                disabled={saving}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#687078',
                  cursor: 'pointer',
                  fontSize: 18,
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Form Error Banner */}
              {formError && (
                <div
                  style={{
                    padding: '10px 14px',
                    background: 'rgba(255,85,85,0.1)',
                    border: '1px solid rgba(255,85,85,0.3)',
                    borderRadius: 8,
                    color: '#FF6B6B',
                    fontSize: 12,
                    lineHeight: 1.4,
                  }}
                >
                  ⚠️ {formError}
                </div>
              )}

              {/* Gallery Partition Selector */}
              <div>
                <label style={formLabelStyle}>GALLERY DESTINATION</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, gallery_type: 'general' })}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: `1px solid ${form.gallery_type === 'general' ? '#11BCE6' : '#1E2A33'}`,
                      background: form.gallery_type === 'general' ? 'rgba(17,188,230,0.12)' : '#0D1217',
                      color: form.gallery_type === 'general' ? '#11BCE6' : '#A0A7AE',
                      fontWeight: 700,
                      fontSize: 11,
                      cursor: 'pointer',
                    }}
                  >
                    🌐 General Gallery
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, gallery_type: 'seat_cover' })}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: `1px solid ${form.gallery_type === 'seat_cover' ? '#11BCE6' : '#1E2A33'}`,
                      background: form.gallery_type === 'seat_cover' ? 'rgba(17,188,230,0.12)' : '#0D1217',
                      color: form.gallery_type === 'seat_cover' ? '#11BCE6' : '#A0A7AE',
                      fontWeight: 700,
                      fontSize: 11,
                      cursor: 'pointer',
                    }}
                  >
                    💺 Seat Covers Gallery
                  </button>
                </div>
              </div>

              {/* Image Upload / Preview */}
              <div>
                <label style={formLabelStyle}>WORK IMAGE (JPG, PNG, WEBP — MAX 5 MB) *</label>

                {/* Preview Box */}
                {previewUrl ? (
                  <div
                    style={{
                      position: 'relative',
                      height: 180,
                      borderRadius: 10,
                      overflow: 'hidden',
                      border: '1px solid #1E2A33',
                      background: '#050708',
                      marginBottom: 8,
                    }}
                  >
                    <img
                      src={previewUrl}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null)
                        setPreviewUrl(null)
                        setForm({ ...form, image_url: '', storage_path: null })
                        if (fileInputRef.current) fileInputRef.current.value = ''
                      }}
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        background: 'rgba(5,7,8,0.8)',
                        border: '1px solid rgba(255,85,85,0.4)',
                        color: '#FF5555',
                        padding: '4px 8px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      Change Image
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed #1E2A33',
                      borderRadius: 10,
                      padding: '24px 16px',
                      textAlign: 'center',
                      background: '#0D1217',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s ease',
                      marginBottom: 8,
                    }}
                  >
                    <div style={{ fontSize: 26, marginBottom: 4 }}>📷</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#11BCE6' }}>
                      Click to choose photo from computer
                    </div>
                    <div style={{ fontSize: 10, color: '#687078', marginTop: 2 }}>
                      JPG, PNG, WEBP up to 5 MB
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />

                {/* Direct Image URL input as fallback */}
                <div style={{ marginTop: 6 }}>
                  <input
                    type="text"
                    placeholder="Or paste direct image URL (e.g. https://...)"
                    value={form.image_url}
                    onChange={e => {
                      setForm({ ...form, image_url: e.target.value })
                      if (e.target.value.startsWith('http')) {
                        setPreviewUrl(e.target.value)
                      }
                    }}
                    style={formInputStyle}
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label style={formLabelStyle}>WORK TITLE *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LED Projector Retrofit on Hyundai Creta"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  style={formInputStyle}
                />
              </div>

              {/* Category */}
              <div>
                <label style={formLabelStyle}>CATEGORY *</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  style={formInputStyle}
                >
                  {(form.gallery_type === 'general' ? GENERAL_CATEGORIES : SEAT_COVER_CATEGORIES).map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                {form.category === 'Other' && (
                  <input
                    type="text"
                    placeholder="Type custom category name..."
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value)}
                    style={{ ...formInputStyle, marginTop: 6 }}
                  />
                )}
              </div>

              {/* Description */}
              <div>
                <label style={formLabelStyle}>DESCRIPTION (OPTIONAL)</label>
                <textarea
                  rows={2}
                  placeholder="Details about craftsmanship, materials used, car model, customer request..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  style={{ ...formInputStyle, resize: 'vertical' }}
                />
              </div>

              {/* Toggles & Sort Order */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: 10,
                  background: '#0D1217',
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: '1px solid #1E2A33',
                }}
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={e => setForm({ ...form, published: e.target.checked })}
                  />
                  <span style={{ fontSize: 11, fontWeight: 700, color: form.published ? '#00C864' : '#A0A7AE' }}>
                    {form.published ? '✓ Published' : 'Hidden'}
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={e => setForm({ ...form, featured: e.target.checked })}
                  />
                  <span style={{ fontSize: 11, fontWeight: 700, color: form.featured ? '#D69A13' : '#A0A7AE' }}>
                    {form.featured ? '⭐ Featured' : 'Standard'}
                  </span>
                </label>

                <div>
                  <label style={{ fontSize: 9, fontWeight: 800, color: '#687078', display: 'block', marginBottom: 2 }}>
                    SORT ORDER
                  </label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value, 10) || 0 })}
                    style={{
                      width: '100%',
                      background: '#070A0D',
                      border: '1px solid #1E2A33',
                      borderRadius: 6,
                      padding: '4px 8px',
                      color: '#FFFFFF',
                      fontSize: 11,
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: 8,
                    background: '#11BCE6',
                    color: '#02141B',
                    fontWeight: 900,
                    fontSize: 12,
                    letterSpacing: '0.08em',
                    border: 'none',
                    cursor: saving || uploading ? 'wait' : 'pointer',
                    opacity: saving || uploading ? 0.7 : 1,
                  }}
                >
                  {uploading
                    ? 'UPLOADING TO STORAGE…'
                    : saving
                    ? 'SAVING TO DATABASE…'
                    : editingItem
                    ? 'SAVE CHANGES ✓'
                    : 'UPLOAD WORK PHOTO →'}
                </button>
                <button
                  type="button"
                  disabled={saving || uploading}
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: '12px 18px',
                    borderRadius: 8,
                    background: '#0D1217',
                    border: '1px solid #1E2A33',
                    color: '#A0A7AE',
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          7. DELETE CONFIRMATION MODAL
      ───────────────────────────────────────────────────────────── */}
      {deleteConfirmItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--admin-modal-overlay)',
            backdropFilter: 'blur(6px)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            style={{
              background: 'var(--admin-card-bg)',
              border: '1px solid rgba(255,85,85,0.3)',
              borderRadius: 16,
              maxWidth: 420,
              width: '100%',
              padding: '24px 22px',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 900, color: '#FF5555', margin: 0, fontSize: 16 }}>
              DELETE GALLERY ITEM?
            </h3>
            <p style={{ fontSize: 12, color: 'var(--admin-text-sub)', marginTop: 10, lineHeight: 1.5 }}>
              Are you sure you want to permanently delete{' '}
              <strong style={{ color: 'var(--admin-text-main)' }}>"{deleteConfirmItem.title}"</strong>?
            </p>
            <div
              style={{
                fontSize: 11,
                color: 'var(--admin-text-muted)',
                background: 'var(--admin-subcard-bg)',
                padding: '8px 12px',
                borderRadius: 8,
                marginTop: 10,
                border: '1px solid var(--admin-border-subtle)',
              }}
            >
              This will remove the database record and delete the image file from Supabase Storage.
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button
                disabled={deleting}
                onClick={() => handleDelete(deleteConfirmItem)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 8,
                  background: '#FF5555',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: 12,
                  border: 'none',
                  cursor: deleting ? 'wait' : 'pointer',
                  opacity: deleting ? 0.7 : 1,
                }}
              >
                {deleting ? 'DELETING…' : 'YES, DELETE PERMANENTLY'}
              </button>
              <button
                disabled={deleting}
                onClick={() => setDeleteConfirmItem(null)}
                style={{
                  padding: '10px 18px',
                  borderRadius: 8,
                  background: '#0D1217',
                  border: '1px solid #1E2A33',
                  color: '#A0A7AE',
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const refreshBtnStyle: React.CSSProperties = {
  background: 'var(--admin-subcard-bg)',
  border: '1px solid var(--admin-border-subtle)',
  color: 'var(--admin-text-sub)',
  borderRadius: 8,
  padding: '8px 14px',
  fontSize: 11,
  fontWeight: 700,
  cursor: 'pointer',
}

const formLabelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 10,
  letterSpacing: '0.08em',
  fontWeight: 800,
  color: 'var(--admin-text-sub)',
  marginBottom: 6,
}

const formInputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--admin-input-bg)',
  border: '1px solid var(--admin-input-border)',
  borderRadius: 8,
  padding: '9px 12px',
  fontSize: 12,
  color: 'var(--admin-input-text)',
  outline: 'none',
  boxSizing: 'border-box',
}
