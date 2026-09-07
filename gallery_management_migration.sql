-- ================================================================
-- LEE CAR ACCESSORIES — DYNAMIC GALLERY & SEAT COVER MANAGEMENT MIGRATION
-- ================================================================
-- Run this in: Supabase Dashboard → SQL Editor → New Query
--
-- This migration creates:
--   1. gallery_items table with strict validation and RLS
--   2. Indexes for fast category and gallery_type filtering
--   3. Strict RLS policies:
--        - Public can ONLY SELECT published items (published = TRUE)
--        - Authenticated Admins (is_admin()) have full access
--   4. gallery-images Storage bucket with public read and admin write policies
-- ================================================================

-- ─────────────────────────────────────────────────────────────
-- 1. CREATE gallery_items TABLE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title         TEXT NOT NULL,
  description   TEXT,
  category      TEXT NOT NULL,
  image_url     TEXT NOT NULL,
  storage_path  TEXT,
  gallery_type  TEXT NOT NULL CHECK (gallery_type IN ('general', 'seat_cover')),
  featured      BOOLEAN NOT NULL DEFAULT FALSE,
  published     BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order    INTEGER NOT NULL DEFAULT 0
);

COMMENT ON TABLE gallery_items                IS 'Portfolio showcase images for General Gallery and Seat Covers Our Work';
COMMENT ON COLUMN gallery_items.gallery_type  IS 'Partition: general (Main Gallery) or seat_cover (Seat Covers Our Work)';
COMMENT ON COLUMN gallery_items.published     IS 'When TRUE visible to public; when FALSE visible only to admins';
COMMENT ON COLUMN gallery_items.featured      IS 'Pin to top/spotlight in showcase';
COMMENT ON COLUMN gallery_items.storage_path  IS 'Path within gallery-images Supabase Storage bucket for automated deletion';

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_gallery_items_type_pub 
  ON gallery_items (gallery_type, published, sort_order, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_gallery_items_cat 
  ON gallery_items (category);


-- ─────────────────────────────────────────────────────────────
-- 2. ROW LEVEL SECURITY (RLS) POLICIES
-- ─────────────────────────────────────────────────────────────
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

-- 1) Public users can ONLY view published gallery items
DROP POLICY IF EXISTS "Public read published gallery items" ON gallery_items;
CREATE POLICY "Public read published gallery items"
  ON gallery_items FOR SELECT
  USING (published = TRUE);

-- 2) Verified admins have full CRUD access (VIEW ALL, INSERT, UPDATE, DELETE)
DROP POLICY IF EXISTS "Admin full access gallery items" ON gallery_items;
DROP POLICY IF EXISTS "Admin access gallery items"      ON gallery_items;
CREATE POLICY "Admin access gallery items"
  ON gallery_items FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());


-- ─────────────────────────────────────────────────────────────
-- 3. SUPABASE STORAGE SETUP (gallery-images bucket)
-- ─────────────────────────────────────────────────────────────
-- Create bucket if not exists with 5MB limit and image MIME types
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery-images',
  'gallery-images',
  TRUE,
  5242880, -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE SET
  public = TRUE,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

-- Storage RLS: Public can view uploaded gallery images
DROP POLICY IF EXISTS "Public view gallery images" ON storage.objects;
CREATE POLICY "Public view gallery images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery-images');

-- Storage RLS: Verified admins can upload images
DROP POLICY IF EXISTS "Admin upload gallery images" ON storage.objects;
CREATE POLICY "Admin upload gallery images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'gallery-images' AND is_admin());

-- Storage RLS: Verified admins can update images
DROP POLICY IF EXISTS "Admin update gallery images" ON storage.objects;
CREATE POLICY "Admin update gallery images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'gallery-images' AND is_admin())
  WITH CHECK (bucket_id = 'gallery-images' AND is_admin());

-- Storage RLS: Verified admins can delete images
DROP POLICY IF EXISTS "Admin delete gallery images" ON storage.objects;
CREATE POLICY "Admin delete gallery images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'gallery-images' AND is_admin());


-- ─────────────────────────────────────────────────────────────
-- 4. SEED INITIAL REAL SHOWCASE ITEMS (Safe ON CONFLICT DO NOTHING)
-- ─────────────────────────────────────────────────────────────
-- Seeds starting portfolio items so both galleries are immediately populated
INSERT INTO gallery_items (id, title, description, category, image_url, gallery_type, featured, published, sort_order)
VALUES
  -- General Gallery Items
  ('11111111-0000-0000-0000-000000000001', 'LED Projector Headlight Upgrade', 'High-beam LED projector installation with crisp cutoff line and custom DRL integration.', 'Lighting', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&fit=crop', 'general', true, true, 1),
  ('11111111-0000-0000-0000-000000000002', 'Android Touchscreen Infotainment', '9-inch HD capacitive Android player with Apple CarPlay and reverse camera integration.', 'Audio', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&fit=crop', 'general', true, true, 2),
  ('11111111-0000-0000-0000-000000000003', '7D Custom Carbon Floor Mats', 'All-weather laser-fit carbon finish floor mats for complete floor protection.', 'Interior', 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=900&fit=crop', 'general', false, true, 3),
  ('11111111-0000-0000-0000-000000000004', 'Ambient Fiber-Optic Cabin Lighting', '64-colour smartphone-controlled cabin ambient lighting across dash and doors.', 'Lighting', 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=900&fit=crop', 'general', true, true, 4),
  ('11111111-0000-0000-0000-000000000005', 'Side Stepper & Roof Rail Fitment', 'Heavy-duty aluminium foot steps and aerodynamic roof rails installed on compact SUV.', 'Exterior', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=900&fit=crop', 'general', false, true, 5),
  ('11111111-0000-0000-0000-000000000006', 'High-Output LED Fog Lamp Conversion', 'Dual-colour white/amber waterproof fog lamp setup for all-weather coastal highway driving.', 'Lighting', 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=900&fit=crop', 'general', false, true, 6),

  -- Seat Covers "Our Work" Items
  ('22222222-0000-0000-0000-000000000001', 'Custom Dual-Tone Bucket Fit', 'Precision molded dual-tone black and tan finish with reinforced side bolsters.', 'Dual Tone', 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=900&fit=crop', 'seat_cover', true, true, 1),
  ('22222222-0000-0000-0000-000000000002', 'Classic Tan Luxury Interior', 'Warm tan Italian leatherette styling tailored for comfortable daily commutes.', 'Classic Luxury', 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=900&fit=crop', 'seat_cover', true, true, 2),
  ('22222222-0000-0000-0000-000000000003', 'High-Contrast Sport Stitching', 'Aggressive diamond quilting with heavy-gauge precision contrast threads.', 'Sport Stitching', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=900&fit=crop', 'seat_cover', false, true, 3),
  ('22222222-0000-0000-0000-000000000004', 'Deep Charcoal Full Interior Fitment', 'Complete 3-row bespoke seat cover installation with headrest integration.', 'Custom Fit', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&fit=crop', 'seat_cover', true, true, 4),
  ('22222222-0000-0000-0000-000000000005', 'Perforated Breathable Center Panel', 'Micro-perforated center inserts providing ventilation in coastal climates.', 'Luxury Leather', 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=900&fit=crop', 'seat_cover', false, true, 5),
  ('22222222-0000-0000-0000-000000000006', 'Bespoke Contrast Edge Piping', 'Sleek custom piping accentuating the factory seat curves with snug contouring.', 'Bucket Fit', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&fit=crop', 'seat_cover', false, true, 6)
ON CONFLICT (id) DO NOTHING;


-- ─────────────────────────────────────────────────────────────
-- 5. VERIFICATION QUERY
-- ─────────────────────────────────────────────────────────────
SELECT 
  gallery_type, 
  published, 
  COUNT(*) AS item_count 
FROM gallery_items 
GROUP BY gallery_type, published;
