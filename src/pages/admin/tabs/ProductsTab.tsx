import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { formatINR } from '../../../lib/currency'
import type { DbCategory, DbProduct } from '../../../types/database'

const STORAGE_BUCKET = 'product-images'

const emptyProduct: Omit<DbProduct, 'created_at' | 'updated_at'> = {
  id: '',
  name: '',
  title: '',
  price: null,
  mrp: null,
  contact_for_price: false,
  rating: 5.0,
  reviews_count: 0,
  image: '',
  images: [],
  category: 'ACCESSORIES',
  description: '',
  long_desc: '',
  in_stock: true,
  display_order: 0,
}

export default function ProductsTab() {
  const [products, setProducts] = useState<DbProduct[]>([])
  const [categories, setCategories] = useState<DbCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState<DbProduct | null>(null)
  const [form, setForm] = useState(emptyProduct)
  const [imageUrls, setImageUrls] = useState<string[]>([]) // List of current image URLs
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [urlInput, setUrlInput] = useState('') // for adding a URL manually
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('display_order', { ascending: true })
    setProducts((data || []) as DbProduct[])
    setLoading(false)
  }

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('*').order('display_order')
    setCategories((data || []) as DbCategory[])
  }

  function openAdd() {
    setEditProduct(null)
    setForm(emptyProduct)
    setImageUrls([])
    setUrlInput('')
    setSaveError(null)
    setShowForm(true)
  }

  function openEdit(p: DbProduct) {
    setEditProduct(p)
    setForm({
      id: p.id, name: p.name, title: p.title,
      price: p.price, mrp: p.mrp, contact_for_price: p.contact_for_price,
      rating: p.rating, reviews_count: p.reviews_count,
      image: p.image, images: p.images, category: p.category,
      description: p.description, long_desc: p.long_desc,
      in_stock: p.in_stock, display_order: p.display_order,
    })
    setImageUrls(p.images || [])
    setUrlInput('')
    setSaveError(null)
    setShowForm(true)
  }

  function closeForm() { setShowForm(false); setEditProduct(null); setSaveError(null) }

  function handleField(key: string, value: unknown) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  // ── Image management ─────────────────────────────────────

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const ext = file.name.split('.').pop()
    const productSlug = form.id.trim() || `new-${Date.now()}`
    const filename = `products/${productSlug}-${Date.now()}.${ext}`

    setUploading(true)
    setSaveError(null)

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filename, file, { upsert: true, contentType: file.type })

    if (uploadError) {
      setSaveError(`Upload failed: ${uploadError.message}`)
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(uploadData.path)

    const newUrl = urlData.publicUrl
    setImageUrls(prev => [...prev, newUrl])
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function deleteImageFromStorage(url: string) {
    // Extract the path after the bucket name in the URL
    const pathMatch = url.match(/\/product-images\/(.+)$/)
    if (pathMatch) {
      await supabase.storage.from(STORAGE_BUCKET).remove([pathMatch[1]])
    }
    setImageUrls(prev => prev.filter(u => u !== url))
  }

  function addUrlManually() {
    const trimmed = urlInput.trim()
    if (!trimmed) return
    setImageUrls(prev => [...prev, trimmed])
    setUrlInput('')
  }

  function removeUrl(url: string) {
    // If the image is in Supabase Storage, delete it from storage too
    deleteImageFromStorage(url)
    setImageUrls(prev => prev.filter(u => u !== url))
  }

  function moveUp(idx: number) {
    if (idx === 0) return
    setImageUrls(prev => {
      const next = [...prev]
      ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
      return next
    })
  }

  function moveDown(idx: number) {
    setImageUrls(prev => {
      if (idx >= prev.length - 1) return prev
      const next = [...prev]
      ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
      return next
    })
  }

  // ── Save ─────────────────────────────────────────────────

  async function saveProduct(e: React.FormEvent) {
    e.preventDefault()
    if (!form.id.trim()) { setSaveError('Product ID (slug) is required.'); return }
    if (!form.name.trim()) { setSaveError('Product name is required.'); return }

    setSaving(true)
    setSaveError(null)

    const payload = {
      ...form,
      id: form.id.trim().toLowerCase().replace(/\s+/g, '-'),
      images: imageUrls,
      image: imageUrls[0] || form.image || '',
    }

    let error
    if (editProduct) {
      const { error: e } = await supabase
        .from('products')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', editProduct.id)
      error = e
    } else {
      const { error: e } = await supabase.from('products').insert(payload)
      error = e
    }

    setSaving(false)
    if (error) { setSaveError(error.message) } else { await fetchProducts(); closeForm() }
  }

  async function toggleStock(id: string, current: boolean) {
    await supabase.from('products').update({ in_stock: !current, updated_at: new Date().toISOString() }).eq('id', id)
    setProducts(prev => prev.map(p => p.id === id ? { ...p, in_stock: !current } : p))
  }

  async function deleteProduct(id: string) {
    await supabase.from('products').delete().eq('id', id)
    setProducts(prev => prev.filter(p => p.id !== id))
    setDeleteConfirm(null)
  }

  // ── Render ───────────────────────────────────────────────

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 900, fontSize: 18, color: 'var(--admin-text-main)', margin: 0 }}>
            PRODUCTS
          </h2>
          <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', marginTop: 4 }}>
            {products.length} products · {products.filter(p => p.in_stock).length} in stock
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={fetchProducts} style={refreshBtnStyle}>↻ Refresh</button>
          <button onClick={openAdd} style={addBtnStyle}>+ Add Product</button>
        </div>
      </div>

      {products.length === 0 && !loading && (
        <div style={{ background: 'rgba(214,154,19,0.08)', border: '1px solid rgba(214,154,19,0.25)', borderRadius: 12, padding: '14px 16px', marginBottom: 16 }}>
          <div style={{ color: '#D69A13', fontWeight: 800, fontSize: 12 }}>ℹ No products yet</div>
          <div style={{ color: 'var(--admin-text-sub)', fontSize: 12, marginTop: 4 }}>
            Run the <code>supabase_setup.sql</code> seed script to import all 12 products, or add them manually.
          </div>
        </div>
      )}

      {loading ? <LoadingRow /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {products.map(p => (
            <div key={p.id} style={{ ...cardStyle, display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Thumbnail */}
              <div style={{ width: 68, height: 68, borderRadius: 10, overflow: 'hidden', background: 'var(--admin-subcard-bg)', border: '1px solid var(--admin-border-subtle)', flexShrink: 0 }}>
                {p.image ? (
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: 'var(--admin-text-muted)', fontSize: 10 }}>No img</div>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--admin-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', marginTop: 2 }}>
                  <span style={{ color: '#00C8F0' }}>{p.category}</span>
                  {' · '}
                  {p.contact_for_price ? 'Contact for Price' : formatINR(p.price)}
                  {' · '}<span style={{ color: '#D69A13' }}>★ {p.rating}</span>
                  {' · '}{p.images?.length ?? 0} image{p.images?.length !== 1 ? 's' : ''}
                </div>
                <div style={{ fontSize: 10, color: 'var(--admin-text-sub)', marginTop: 2 }}>ID: {p.id} · Order: {p.display_order}</div>
              </div>

              {/* Stock toggle */}
              <button
                onClick={() => toggleStock(p.id, p.in_stock)}
                style={{
                  padding: '5px 12px', borderRadius: 999, fontSize: 10, fontWeight: 800,
                  border: `1px solid ${p.in_stock ? '#00C864' : '#FF5555'}`,
                  background: p.in_stock ? 'rgba(0,200,100,0.1)' : 'rgba(255,85,85,0.1)',
                  color: p.in_stock ? '#00C864' : '#FF5555',
                  cursor: 'pointer', flexShrink: 0
                }}
              >
                {p.in_stock ? 'In Stock' : 'Out of Stock'}
              </button>

              <button onClick={() => openEdit(p)} style={editBtnStyle}>Edit</button>

              {deleteConfirm === p.id ? (
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => deleteProduct(p.id)} style={{ ...editBtnStyle, color: '#FF5555', borderColor: 'rgba(255,85,85,0.4)' }}>Confirm Delete</button>
                  <button onClick={() => setDeleteConfirm(null)} style={editBtnStyle}>✕</button>
                </div>
              ) : (
                <button onClick={() => setDeleteConfirm(p.id)} style={{ ...editBtnStyle, color: '#FF5555', borderColor: 'rgba(255,85,85,0.3)' }}>Delete</button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ===== Add/Edit Product Modal ===== */}
      {showForm && (
        <div
          onClick={closeForm}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'var(--admin-modal-overlay)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            padding: '20px 16px', overflowY: 'auto'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--admin-card-bg)', border: '1px solid var(--admin-border)', borderRadius: 18,
              width: '100%', maxWidth: 720, padding: '24px 22px',
              position: 'relative', marginTop: 20, marginBottom: 40,
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}
          >
            <button
              onClick={closeForm}
              style={{ position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--admin-border-subtle)', background: 'var(--admin-subcard-bg)', color: 'var(--admin-text-sub)', fontSize: 16, cursor: 'pointer', display: 'grid', placeItems: 'center' }}
              aria-label="Close"
            >×</button>

            <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 900, fontSize: 16, color: 'var(--admin-text-main)', margin: '0 0 20px' }}>
              {editProduct ? 'EDIT PRODUCT' : 'ADD PRODUCT'}
            </h3>

            <form onSubmit={saveProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

              {/* === BASIC INFO === */}
              <div style={sectionHeader}>BASIC INFORMATION</div>

              <div style={fullCol}>
                <FormLabel label="PRODUCT ID (slug) *" />
                <input type="text" value={form.id}
                  onChange={e => handleField('id', e.target.value)}
                  placeholder="e.g. led-headlight" disabled={!!editProduct} required
                  style={{ ...inputStyle, opacity: editProduct ? 0.5 : 1 }} />
                {!editProduct && <div style={{ fontSize: 10, color: '#687078', marginTop: 4 }}>Lowercase with hyphens. Cannot change after creation.</div>}
              </div>

              <div style={fullCol}>
                <FormLabel label="PRODUCT NAME *" />
                <input type="text" value={form.name} onChange={e => handleField('name', e.target.value)}
                  placeholder="LED HEADLIGHT BULB KIT - 120W 6000K" required style={inputStyle} />
              </div>

              <div style={fullCol}>
                <FormLabel label="DISPLAY TITLE" />
                <input type="text" value={form.title} onChange={e => handleField('title', e.target.value)}
                  placeholder="High-Power LED Headlights 120W" style={inputStyle} />
              </div>

              <div>
                <FormLabel label="CATEGORY" />
                <select value={form.category} onChange={e => handleField('category', e.target.value)} style={inputStyle}>
                  {categories.length > 0
                    ? categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                    : ['LIGHTING','INTERIOR','AUDIO','EXTERIOR','ACCESSORIES'].map(c => <option key={c} value={c}>{c}</option>)
                  }
                </select>
              </div>

              <div>
                <FormLabel label="DISPLAY ORDER" />
                <input type="number" value={form.display_order}
                  onChange={e => handleField('display_order', parseInt(e.target.value) || 0)}
                  placeholder="0" style={inputStyle} />
              </div>

              {/* === PRICING === */}
              <div style={sectionHeader}>PRICING</div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, ...fullCol }}>
                <input type="checkbox" id="cfp" checked={form.contact_for_price}
                  onChange={e => handleField('contact_for_price', e.target.checked)}
                  style={{ width: 16, height: 16, cursor: 'pointer' }} />
                <label htmlFor="cfp" style={{ fontSize: 11, fontWeight: 700, color: '#A0A7AE', cursor: 'pointer' }}>
                  Contact for Price (hides price fields)
                </label>
              </div>

              {!form.contact_for_price && (
                <>
                  <div>
                    <FormLabel label="PRICE (₹)" />
                    <input type="number" value={form.price?.toString() ?? ''}
                      onChange={e => handleField('price', e.target.value ? parseFloat(e.target.value) : null)}
                      placeholder="3499" style={inputStyle} />
                  </div>
                  <div>
                    <FormLabel label="MRP (₹)" />
                    <input type="number" value={form.mrp?.toString() ?? ''}
                      onChange={e => handleField('mrp', e.target.value ? parseFloat(e.target.value) : null)}
                      placeholder="4499" style={inputStyle} />
                  </div>
                </>
              )}

              {/* === RATINGS === */}
              <div>
                <FormLabel label="RATING (0–5)" />
                <input type="number" step="0.1" min="0" max="5" value={form.rating}
                  onChange={e => handleField('rating', parseFloat(e.target.value) || 5)}
                  placeholder="4.8" style={inputStyle} />
              </div>
              <div>
                <FormLabel label="REVIEW COUNT" />
                <input type="number" value={form.reviews_count}
                  onChange={e => handleField('reviews_count', parseInt(e.target.value) || 0)}
                  placeholder="64" style={inputStyle} />
              </div>

              {/* === STOCK === */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="checkbox" id="instock" checked={form.in_stock}
                  onChange={e => handleField('in_stock', e.target.checked)}
                  style={{ width: 16, height: 16, cursor: 'pointer' }} />
                <label htmlFor="instock" style={{ fontSize: 11, fontWeight: 700, color: '#A0A7AE', cursor: 'pointer' }}>
                  In Stock (visible on website)
                </label>
              </div>

              {/* === DESCRIPTIONS === */}
              <div style={sectionHeader}>DESCRIPTIONS</div>

              <div style={fullCol}>
                <FormLabel label="SHORT DESCRIPTION" />
                <textarea value={form.description} onChange={e => handleField('description', e.target.value)}
                  rows={2} placeholder="Brief product description for shop cards"
                  style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div style={fullCol}>
                <FormLabel label="LONG DESCRIPTION / SPECIFICATIONS" />
                <textarea value={form.long_desc} onChange={e => handleField('long_desc', e.target.value)}
                  rows={4} placeholder="Full product description for the product detail page"
                  style={{ ...inputStyle, resize: 'vertical' }} />
              </div>

              {/* === IMAGE MANAGEMENT === */}
              <div style={sectionHeader}>PRODUCT IMAGES</div>

              <div style={fullCol}>
                <div style={{ fontSize: 11, color: '#A0A7AE', marginBottom: 10 }}>
                  First image = main display image. Drag to reorder (use ↑↓ buttons). Upload to Supabase Storage or paste any public URL.
                </div>

                {/* Current images grid */}
                {imageUrls.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10, marginBottom: 14 }}>
                    {imageUrls.map((url, idx) => (
                      <div key={url + idx} style={{
                        background: '#0D1217', border: `2px solid ${idx === 0 ? '#11BCE6' : '#1E2A33'}`,
                        borderRadius: 10, overflow: 'hidden', position: 'relative'
                      }}>
                        <img src={url} alt={`Image ${idx + 1}`}
                          style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                        {idx === 0 && (
                          <div style={{ position: 'absolute', top: 4, left: 4, background: '#11BCE6', color: '#02141B', fontSize: 9, fontWeight: 900, padding: '2px 6px', borderRadius: 4 }}>
                            MAIN
                          </div>
                        )}
                        {/* Controls */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, padding: '6px 4px', background: 'rgba(0,0,0,0.5)' }}>
                          <button type="button" onClick={() => moveUp(idx)}
                            style={{ ...iconBtnStyle, opacity: idx === 0 ? 0.3 : 1 }}>↑</button>
                          <button type="button" onClick={() => moveDown(idx)}
                            style={{ ...iconBtnStyle, opacity: idx === imageUrls.length - 1 ? 0.3 : 1 }}>↓</button>
                          <button type="button" onClick={() => removeUrl(url)}
                            style={{ ...iconBtnStyle, color: '#FF5555', borderColor: 'rgba(255,85,85,0.4)' }}>✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload button */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="prod-img-upload"
                  />
                  <label
                    htmlFor="prod-img-upload"
                    style={{
                      ...addBtnStyle,
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      opacity: uploading ? 0.7 : 1, cursor: uploading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {uploading ? '⏳ Uploading…' : '⬆ Upload Image'}
                  </label>
                  <span style={{ fontSize: 10, color: '#687078' }}>Uploads to Supabase Storage (product-images bucket)</span>
                </div>

                {/* Manual URL input */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="url"
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addUrlManually() } }}
                    placeholder="Or paste image URL and press Add / Enter"
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button type="button" onClick={addUrlManually}
                    style={{ ...refreshBtnStyle, padding: '10px 14px', whiteSpace: 'nowrap' }}>
                    Add URL
                  </button>
                </div>
                {imageUrls.length === 0 && (
                  <div style={{ fontSize: 10, color: '#687078', marginTop: 6 }}>
                    No images yet. Upload an image or paste a URL above.
                  </div>
                )}
              </div>

              {/* ── Error & Submit ── */}
              {saveError && (
                <div style={{ ...fullCol, background: 'rgba(255,60,60,0.08)', border: '1px solid rgba(255,60,60,0.25)', color: '#FF5555', borderRadius: 10, padding: '10px 13px', fontSize: 12 }}>
                  {saveError}
                </div>
              )}

              <div style={{ ...fullCol, display: 'flex', gap: 10 }}>
                <button type="submit" disabled={saving || uploading}
                  style={{ ...addBtnStyle, flex: 1, padding: '12px', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'SAVING…' : editProduct ? 'UPDATE PRODUCT' : 'CREATE PRODUCT'}
                </button>
                <button type="button" onClick={closeForm} style={{ ...refreshBtnStyle, padding: '12px 20px' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Helpers ──

function FormLabel({ label }: { label: string }) {
  return <div style={{ fontSize: 10, letterSpacing: '0.1em', fontWeight: 800, color: 'var(--admin-text-sub)', marginBottom: 6 }}>{label}</div>
}

function LoadingRow() {
  return <div style={{ color: 'var(--admin-text-muted)', fontSize: 13, padding: '40px 0', textAlign: 'center' }}>Loading…</div>
}

const cardStyle: React.CSSProperties = { background: 'var(--admin-card-bg)', border: '1px solid var(--admin-border)', borderRadius: 14, padding: '14px 16px', boxShadow: 'var(--admin-card-shadow)' }
const addBtnStyle: React.CSSProperties = { background: '#11BCE6', color: '#02141B', fontWeight: 900, fontSize: 11, letterSpacing: '0.06em', padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer' }
const refreshBtnStyle: React.CSSProperties = { background: 'var(--admin-subcard-bg)', border: '1px solid var(--admin-border-subtle)', color: 'var(--admin-text-sub)', borderRadius: 8, padding: '8px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }
const editBtnStyle: React.CSSProperties = { background: 'var(--admin-subcard-bg)', border: '1px solid var(--admin-border-subtle)', color: 'var(--admin-text-sub)', borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }
const inputStyle: React.CSSProperties = { background: 'var(--admin-input-bg)', border: '1px solid var(--admin-input-border)', borderRadius: 10, padding: '10px 12px', color: 'var(--admin-input-text)', outline: 'none', width: '100%', fontSize: 12, boxSizing: 'border-box', minHeight: 40 }
const iconBtnStyle: React.CSSProperties = { background: 'var(--admin-subcard-bg)', border: '1px solid var(--admin-border-subtle)', color: 'var(--admin-text-sub)', borderRadius: 6, padding: '2px 6px', fontSize: 11, cursor: 'pointer' }
const fullCol: React.CSSProperties = { gridColumn: '1 / -1' }
const sectionHeader: React.CSSProperties = {
  gridColumn: '1 / -1',
  fontSize: 10, letterSpacing: '0.14em', fontWeight: 900, color: '#11BCE6',
  paddingBottom: 8, borderBottom: '1px solid var(--admin-border)', marginTop: 6
}

