import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import type { DbCategory } from '../../../types/database'

const STORAGE_BUCKET = 'product-images'

const emptyCategory: Omit<DbCategory, 'created_at'> = {
  id: '',
  name: '',
  img: '',
  display_order: 0,
}

export default function CategoriesTab() {
  const [categories, setCategories] = useState<DbCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editCat, setEditCat] = useState<DbCategory | null>(null)
  const [form, setForm] = useState(emptyCategory)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fetchCategories() }, [])

  async function fetchCategories() {
    setLoading(true)
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })
    setCategories((data || []) as DbCategory[])
    setLoading(false)
  }

  function openAdd() {
    setEditCat(null)
    setForm(emptyCategory)
    setSaveError(null)
    setShowForm(true)
  }

  function openEdit(c: DbCategory) {
    setEditCat(c)
    setForm({ id: c.id, name: c.name, img: c.img, display_order: c.display_order })
    setSaveError(null)
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditCat(null)
    setSaveError(null)
  }

  // ── Image upload to Supabase Storage ──────────────────────
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const ext = file.name.split('.').pop()
    const filename = `categories/${form.id || 'temp'}-${Date.now()}.${ext}`

    setUploading(true)
    setSaveError(null)

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filename, file, { upsert: true, contentType: file.type })

    if (uploadError) {
      setSaveError(`Image upload failed: ${uploadError.message}`)
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(uploadData.path)

    setForm(prev => ({ ...prev, img: urlData.publicUrl }))
    setUploading(false)
    // Reset input
    if (fileRef.current) fileRef.current.value = ''
  }

  async function saveCategory(e: React.FormEvent) {
    e.preventDefault()
    if (!form.id.trim()) { setSaveError('Category ID is required.'); return }
    if (!form.name.trim()) { setSaveError('Category name is required.'); return }

    setSaving(true)
    setSaveError(null)

    const payload = {
      id: form.id.trim().toUpperCase().replace(/\s+/g, '_'),
      name: form.name.trim().toUpperCase(),
      img: form.img.trim(),
      display_order: form.display_order,
    }

    let error
    if (editCat) {
      const { error: e } = await supabase
        .from('categories')
        .update({ name: payload.name, img: payload.img, display_order: payload.display_order })
        .eq('id', editCat.id)
      error = e
    } else {
      const { error: e } = await supabase.from('categories').insert(payload)
      error = e
    }

    setSaving(false)
    if (error) {
      setSaveError(error.message)
    } else {
      await fetchCategories()
      closeForm()
    }
  }

  async function deleteCategory(id: string) {
    await supabase.from('categories').delete().eq('id', id)
    setCategories(prev => prev.filter(c => c.id !== id))
    setDeleteConfirm(null)
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 900, fontSize: 18, color: '#FFFFFF', margin: 0 }}>
            CATEGORIES
          </h2>
          <div style={{ fontSize: 11, color: '#687078', marginTop: 4 }}>
            {categories.length} categories · controls Shop page filter
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={fetchCategories} style={refreshBtnStyle}>↻ Refresh</button>
          <button onClick={openAdd} style={addBtnStyle}>+ Add Category</button>
        </div>
      </div>

      {/* Info banner */}
      <div style={{ background: 'rgba(17,188,230,0.06)', border: '1px solid rgba(17,188,230,0.18)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 11, color: '#A0A7AE', lineHeight: 1.6 }}>
        Categories appear in the Shop page filter strip. The <strong style={{ color: '#11BCE6' }}>Category ID</strong> must match the category field used on products (e.g. LIGHTING, INTERIOR).
      </div>

      {loading ? <LoadingRow /> : categories.length === 0 ? <EmptyRow text="No categories yet. Run the SQL seed or add one manually." /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {categories.map(c => (
            <div key={c.id} style={cardStyle}>
              {/* Image */}
              <div style={{ aspectRatio: '16/9', borderRadius: 10, overflow: 'hidden', background: '#0D1217', marginBottom: 12 }}>
                {c.img ? (
                  <img src={c.img} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: '#687078', fontSize: 11 }}>No image</div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: '#FFFFFF' }}>{c.name}</div>
                  <div style={{ fontSize: 10, color: '#687078', marginTop: 2 }}>ID: {c.id} · Order: {c.display_order}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button onClick={() => openEdit(c)} style={{ ...editBtnStyle, flex: 1 }}>Edit</button>
                {deleteConfirm === c.id ? (
                  <>
                    <button onClick={() => deleteCategory(c.id)} style={{ ...editBtnStyle, color: '#FF5555', borderColor: 'rgba(255,85,85,0.4)', flex: 1 }}>
                      Confirm Delete
                    </button>
                    <button onClick={() => setDeleteConfirm(null)} style={editBtnStyle}>✕</button>
                  </>
                ) : (
                  <button onClick={() => setDeleteConfirm(c.id)} style={{ ...editBtnStyle, color: '#FF5555', borderColor: 'rgba(255,85,85,0.3)' }}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== Add/Edit Modal ===== */}
      {showForm && (
        <div
          onClick={closeForm}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px 16px', overflowY: 'auto'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#090D11', border: '1px solid #1C232B', borderRadius: 18,
              width: '100%', maxWidth: 480, padding: '24px 22px', position: 'relative'
            }}
          >
            <button
              onClick={closeForm}
              style={{ position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: '50%', border: '1px solid #1E2A33', background: '#0D1217', color: '#A0A7AE', fontSize: 16, cursor: 'pointer', display: 'grid', placeItems: 'center' }}
              aria-label="Close"
            >×</button>

            <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 900, fontSize: 16, color: '#FFFFFF', margin: '0 0 20px' }}>
              {editCat ? 'EDIT CATEGORY' : 'ADD CATEGORY'}
            </h3>

            <form onSubmit={saveCategory} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* ID */}
              <div>
                <FormLabel label="CATEGORY ID *" />
                <input
                  type="text"
                  value={form.id}
                  onChange={e => setForm(p => ({ ...p, id: e.target.value }))}
                  placeholder="e.g. LIGHTING"
                  disabled={!!editCat}
                  required
                  style={{ ...inputStyle, opacity: editCat ? 0.5 : 1 }}
                />
                {!editCat && <div style={{ fontSize: 10, color: '#687078', marginTop: 4 }}>Uppercase, no spaces. Must match product category field. Cannot change after creation.</div>}
              </div>

              {/* Name */}
              <div>
                <FormLabel label="DISPLAY NAME *" />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. LIGHTING"
                  required
                  style={inputStyle}
                />
              </div>

              {/* Display order */}
              <div>
                <FormLabel label="DISPLAY ORDER" />
                <input
                  type="number"
                  value={form.display_order}
                  onChange={e => setForm(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))}
                  placeholder="1"
                  style={inputStyle}
                />
              </div>

              {/* Image URL */}
              <div>
                <FormLabel label="IMAGE" />
                {/* Current image preview */}
                {form.img && (
                  <div style={{ marginBottom: 10, borderRadius: 10, overflow: 'hidden', aspectRatio: '16/9', background: '#0D1217' }}>
                    <img src={form.img} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}

                {/* Upload from device */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="cat-img-upload"
                  />
                  <label
                    htmlFor="cat-img-upload"
                    style={{
                      ...addBtnStyle,
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      opacity: uploading ? 0.7 : 1, cursor: uploading ? 'not-allowed' : 'pointer',
                      padding: '8px 14px', fontSize: 11
                    }}
                  >
                    {uploading ? '⏳ Uploading…' : '⬆ Upload Image'}
                  </label>
                  <span style={{ fontSize: 10, color: '#687078', alignSelf: 'center' }}>or paste URL below</span>
                </div>

                <input
                  type="url"
                  value={form.img}
                  onChange={e => setForm(p => ({ ...p, img: e.target.value }))}
                  placeholder="https://images.unsplash.com/... or Supabase Storage URL"
                  style={inputStyle}
                />
              </div>

              {saveError && (
                <div style={{ background: 'rgba(255,60,60,0.08)', border: '1px solid rgba(255,60,60,0.25)', color: '#FF5555', borderRadius: 10, padding: '10px 13px', fontSize: 12 }}>
                  {saveError}
                </div>
              )}

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  style={{ ...addBtnStyle, flex: 1, padding: '12px', opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? 'SAVING…' : editCat ? 'UPDATE CATEGORY' : 'CREATE CATEGORY'}
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

function FormLabel({ label }: { label: string }) {
  return <div style={{ fontSize: 10, letterSpacing: '0.1em', fontWeight: 800, color: '#A0A7AE', marginBottom: 6 }}>{label}</div>
}

function LoadingRow() {
  return <div style={{ color: '#687078', fontSize: 13, padding: '40px 0', textAlign: 'center' }}>Loading…</div>
}

function EmptyRow({ text }: { text: string }) {
  return (
    <div style={{ background: '#090D11', border: '1px solid #1C232B', borderRadius: 14, padding: '40px 20px', textAlign: 'center', color: '#687078', fontSize: 13 }}>{text}</div>
  )
}

const cardStyle: React.CSSProperties = { background: '#090D11', border: '1px solid #1C232B', borderRadius: 14, padding: '14px 16px' }
const addBtnStyle: React.CSSProperties = { background: '#11BCE6', color: '#02141B', fontWeight: 900, fontSize: 11, letterSpacing: '0.06em', padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer' }
const refreshBtnStyle: React.CSSProperties = { background: '#0D1217', border: '1px solid #1E2A33', color: '#A0A7AE', borderRadius: 8, padding: '8px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }
const editBtnStyle: React.CSSProperties = { background: '#0D1217', border: '1px solid #1E2A33', color: '#A0A7AE', borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }
const inputStyle: React.CSSProperties = { background: '#0D1217', border: '1px solid #1E2A33', borderRadius: 10, padding: '10px 12px', color: '#FFFFFF', outline: 'none', width: '100%', fontSize: 12, boxSizing: 'border-box', minHeight: 40 }
