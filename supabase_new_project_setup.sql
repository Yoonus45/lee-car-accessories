-- ==============================================================================
-- LEE CAR ACCESSORIES — UNIFIED SUPABASE PROJECT INITIALIZATION SCRIPT
-- ==============================================================================
-- Target Project: rihhyyybzplxhpcldhfy (https://rihhyyybzplxhpcldhfy.supabase.co)
--
-- Instructions:
--   1. Open Supabase Dashboard -> SQL Editor -> "New query"
--   2. Paste the entire contents of this file
--   3. Click "Run" (or Ctrl + Enter)
--
-- Contents:
--   Section 1: Core Tables & Constraints (8 tables total)
--     - categories
--     - products
--     - order_requests (includes city, total_amount, items JSONB, 6-stage workflow)
--     - bookings
--     - contact_messages
--     - seat_cover_appointments
--     - gallery_items (with performance indexes)
--     - admin_users (RBAC whitelist)
--   Section 2: Security & RBAC Functions (is_admin with strict search_path)
--   Section 3: Row Level Security (RLS) Policies on all 8 tables
--   Section 4: Supabase Storage Buckets & Policies (product-images, gallery-images)
--   Section 5: Seed Data (5 Categories, 12 Products, 12 Gallery Showcase Items)
--   Section 6: Admin Whitelist Seeding & Account Linking Helper
--   Section 7: Verification & Integrity Check Query
-- ==============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 1: CORE TABLES & CONSTRAINTS
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id            TEXT PRIMARY KEY,                      -- Uppercase slug: 'LIGHTING', 'INTERIOR', etc.
  name          TEXT NOT NULL,                         -- Display name
  img           TEXT NOT NULL DEFAULT '',              -- Image URL (Storage or CDN)
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.categories              IS 'Product categories shown in Shop filter strip';
COMMENT ON COLUMN public.categories.id           IS 'Uppercase slug matching products.category foreign key';
COMMENT ON COLUMN public.categories.img          IS 'Category hero image banner';


-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id                TEXT PRIMARY KEY,                  -- URL-friendly slug e.g. 'led-headlight'
  name              TEXT NOT NULL,                     -- Uppercase catalogue name
  title             TEXT NOT NULL DEFAULT '',          -- Clean title for cards
  price             DECIMAL(10,2),                     -- NULL indicates contact_for_price
  mrp               DECIMAL(10,2),
  contact_for_price BOOLEAN NOT NULL DEFAULT FALSE,
  rating            DECIMAL(3,1) NOT NULL DEFAULT 5.0,
  reviews_count     INTEGER NOT NULL DEFAULT 0,
  image             TEXT NOT NULL DEFAULT '',          -- Primary showcase image URL
  images            TEXT[] NOT NULL DEFAULT '{}',     -- Array of all product photos
  category          TEXT NOT NULL
                    REFERENCES public.categories(id)
                    ON UPDATE CASCADE
                    ON DELETE RESTRICT,
  description       TEXT NOT NULL DEFAULT '',          -- Short excerpt for cards
  long_desc         TEXT NOT NULL DEFAULT '',          -- Detailed description for product page
  in_stock          BOOLEAN NOT NULL DEFAULT TRUE,     -- When FALSE, item is hidden from public shop
  display_order     INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.products                IS 'Product catalogue managed from Admin Dashboard';
COMMENT ON COLUMN public.products.category       IS 'FK to categories.id';
COMMENT ON COLUMN public.products.in_stock       IS 'Visibility toggle for public store';


-- 3. ORDER REQUESTS TABLE
-- Fully supports both single-item direct booking and multi-item cart checkout payloads
CREATE TABLE IF NOT EXISTS public.order_requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  customer_name   TEXT NOT NULL,
  customer_phone  TEXT NOT NULL,
  customer_email  TEXT,
  car_model       TEXT,
  product_id      TEXT NOT NULL
                  REFERENCES public.products(id)
                  ON UPDATE CASCADE
                  ON DELETE SET NULL,                  -- Keep order record even if product is deleted
  product_name    TEXT NOT NULL,                       -- Denormalized snapshot at order time
  quantity        INTEGER NOT NULL DEFAULT 1,
  address         TEXT,
  city            TEXT,                                -- Extended checkout city field
  notes           TEXT,
  total_amount    DECIMAL(10,2),                       -- Order subtotal amount in INR
  items           JSONB DEFAULT '[]'::jsonb,           -- Detailed cart items array snapshot
  status          TEXT NOT NULL DEFAULT 'new'
                  CHECK (status IN ('new', 'contacted', 'confirmed', 'ready', 'completed', 'cancelled'))
);

COMMENT ON TABLE  public.order_requests          IS 'Customer orders and checkout requests';
COMMENT ON COLUMN public.order_requests.status   IS 'Workflow: new -> contacted -> confirmed -> ready -> completed | cancelled';
COMMENT ON COLUMN public.order_requests.items    IS 'JSONB array of cart items: product_id, name, price, qty, image';


-- 4. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  customer_name    TEXT NOT NULL,
  customer_phone   TEXT NOT NULL,
  car_model        TEXT,
  service_required TEXT,
  preferred_date   DATE,
  preferred_time   TIME,
  notes            TEXT,
  status           TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'))
);

COMMENT ON TABLE public.bookings                 IS 'General store service appointment requests';


-- 5. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  customer_name   TEXT NOT NULL,
  customer_phone  TEXT NOT NULL,
  message         TEXT,
  status          TEXT NOT NULL DEFAULT 'unread'
                  CHECK (status IN ('unread', 'read', 'replied'))
);

COMMENT ON TABLE public.contact_messages         IS 'Inquiries from /contact page quick form';


-- 6. SEAT COVER APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.seat_cover_appointments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  full_name           TEXT NOT NULL,
  phone               TEXT NOT NULL,
  email               TEXT,
  car_brand           TEXT,
  car_model           TEXT NOT NULL,
  car_year            TEXT,
  preferred_date      DATE,
  preferred_time      TEXT,
  seat_cover_type     TEXT,
  material_preference TEXT,
  colour_preference   TEXT,
  notes               TEXT,
  status              TEXT NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'))
);

COMMENT ON TABLE public.seat_cover_appointments  IS 'Dedicated custom car seat cover consultation requests';


-- 7. GALLERY ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.gallery_items (
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

COMMENT ON TABLE  public.gallery_items               IS 'Portfolio showcase images for General Gallery and Seat Covers Our Work';
COMMENT ON COLUMN public.gallery_items.gallery_type  IS 'Partition: general (Main Gallery) or seat_cover (Seat Covers Our Work)';
COMMENT ON COLUMN public.gallery_items.storage_path  IS 'Relative path within gallery-images bucket for automatic deletion';

-- Gallery Performance Indexes
CREATE INDEX IF NOT EXISTS idx_gallery_items_type_pub 
  ON public.gallery_items (gallery_type, published, sort_order, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_gallery_items_cat 
  ON public.gallery_items (category);


-- 8. ADMIN USERS TABLE (RBAC Whitelist)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL UNIQUE,
  role        TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.admin_users              IS 'Explicit whitelist of authorized administrative staff';


-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 2: SECURITY & RBAC FUNCTION (is_admin)
-- ─────────────────────────────────────────────────────────────────────────────

-- Secure is_admin() function
-- Hardened: strictly binds to verified auth.uid() matching admin_users.user_id
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- 1. Reject anonymous callers immediately
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  -- 2. Strictly verify caller's immutable UUID against authorized admin_users
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
      AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public, auth, pg_temp;

-- Revoke public execution and grant only to client roles
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;


-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 3: ROW LEVEL SECURITY (RLS) POLICIES
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable RLS across all tables
ALTER TABLE public.categories              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_requests          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seat_cover_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users             ENABLE ROW LEVEL SECURITY;

-- ── 3.1 admin_users RLS ──
DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
CREATE POLICY "Admins can view admin_users"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage admin_users" ON public.admin_users;
CREATE POLICY "Admins can manage admin_users"
  ON public.admin_users FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- ── 3.2 categories RLS ──
DROP POLICY IF EXISTS "Public read categories" ON public.categories;
CREATE POLICY "Public read categories"
  ON public.categories FOR SELECT
  USING (TRUE);                              -- All categories publicly visible

DROP POLICY IF EXISTS "Admin access categories" ON public.categories;
CREATE POLICY "Admin access categories"
  ON public.categories FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- ── 3.3 products RLS ──
DROP POLICY IF EXISTS "Public read in-stock products" ON public.products;
CREATE POLICY "Public read in-stock products"
  ON public.products FOR SELECT
  USING (in_stock = TRUE);                   -- Customers only see active catalogue items

DROP POLICY IF EXISTS "Admin access products" ON public.products;
CREATE POLICY "Admin access products"
  ON public.products FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- ── 3.4 order_requests RLS ──
DROP POLICY IF EXISTS "Public insert order_requests" ON public.order_requests;
CREATE POLICY "Public insert order_requests"
  ON public.order_requests FOR INSERT
  WITH CHECK (TRUE);                         -- Public customers can submit orders only

DROP POLICY IF EXISTS "Admin access order_requests" ON public.order_requests;
CREATE POLICY "Admin access order_requests"
  ON public.order_requests FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- ── 3.5 bookings RLS ──
DROP POLICY IF EXISTS "Public insert bookings" ON public.bookings;
CREATE POLICY "Public insert bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (TRUE);                         -- Public customers can submit bookings only

DROP POLICY IF EXISTS "Admin access bookings" ON public.bookings;
CREATE POLICY "Admin access bookings"
  ON public.bookings FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- ── 3.6 contact_messages RLS ──
DROP POLICY IF EXISTS "Public insert contact_messages" ON public.contact_messages;
CREATE POLICY "Public insert contact_messages"
  ON public.contact_messages FOR INSERT
  WITH CHECK (TRUE);                         -- Public customers can submit messages only

DROP POLICY IF EXISTS "Admin access contact_messages" ON public.contact_messages;
CREATE POLICY "Admin access contact_messages"
  ON public.contact_messages FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- ── 3.7 seat_cover_appointments RLS ──
DROP POLICY IF EXISTS "Public insert seat_cover_appointments" ON public.seat_cover_appointments;
CREATE POLICY "Public insert seat_cover_appointments"
  ON public.seat_cover_appointments FOR INSERT
  WITH CHECK (TRUE);                         -- Public customers can submit seat cover requests only

DROP POLICY IF EXISTS "Admin access seat_cover_appointments" ON public.seat_cover_appointments;
CREATE POLICY "Admin access seat_cover_appointments"
  ON public.seat_cover_appointments FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- ── 3.8 gallery_items RLS ──
DROP POLICY IF EXISTS "Public read published gallery items" ON public.gallery_items;
CREATE POLICY "Public read published gallery items"
  ON public.gallery_items FOR SELECT
  USING (published = TRUE);                  -- Customers view published portfolio work only

DROP POLICY IF EXISTS "Admin access gallery items" ON public.gallery_items;
CREATE POLICY "Admin access gallery items"
  ON public.gallery_items FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 4: SUPABASE STORAGE BUCKETS & POLICIES
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 4.1 product-images Bucket ──
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  TRUE,                      -- Public: images load via CDN without tokens
  5242880,                   -- 5 MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE SET
  public = TRUE,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/jpg'];

-- product-images storage policies
DROP POLICY IF EXISTS "Public read product images"   ON storage.objects;
DROP POLICY IF EXISTS "Admin upload product images"  ON storage.objects;
DROP POLICY IF EXISTS "Admin update product images"  ON storage.objects;
DROP POLICY IF EXISTS "Admin delete product images"  ON storage.objects;

CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Admin upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admin update product images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admin delete product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images' AND public.is_admin());


-- ── 4.2 gallery-images Bucket ──
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery-images',
  'gallery-images',
  TRUE,                      -- Public: images load via CDN without tokens
  5242880,                   -- 5 MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE SET
  public = TRUE,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

-- gallery-images storage policies
DROP POLICY IF EXISTS "Public view gallery images"   ON storage.objects;
DROP POLICY IF EXISTS "Admin upload gallery images"  ON storage.objects;
DROP POLICY IF EXISTS "Admin update gallery images"  ON storage.objects;
DROP POLICY IF EXISTS "Admin delete gallery images"  ON storage.objects;

CREATE POLICY "Public view gallery images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery-images');

CREATE POLICY "Admin upload gallery images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'gallery-images' AND public.is_admin());

CREATE POLICY "Admin update gallery images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'gallery-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'gallery-images' AND public.is_admin());

CREATE POLICY "Admin delete gallery images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'gallery-images' AND public.is_admin());


-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 5: INITIAL SEED DATA
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 5.1 SEED CATEGORIES (5 Categories) ──
INSERT INTO public.categories (id, name, img, display_order) VALUES
(
  'LIGHTING', 'LIGHTING',
  'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400&h=400&fit=crop',
  1
),
(
  'INTERIOR', 'INTERIOR',
  'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=400&h=400&fit=crop',
  2
),
(
  'EXTERIOR', 'EXTERIOR',
  'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=400&fit=crop',
  3
),
(
  'AUDIO', 'AUDIO',
  'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=400&fit=crop',
  4
),
(
  'ACCESSORIES', 'ACCESSORIES',
  'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=400&h=400&fit=crop',
  5
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  img = EXCLUDED.img,
  display_order = EXCLUDED.display_order;


-- ── 5.2 SEED PRODUCTS (12 Baseline Catalogue Items) ──
INSERT INTO public.products
  (id, name, title, price, mrp, contact_for_price, rating, reviews_count,
   image, images, category, description, long_desc, in_stock, display_order)
VALUES

-- 1. LED Headlight
(
  'led-headlight',
  'LED HEADLIGHT BULB KIT - HD 120W 6000K',
  'High-Power LED Headlights 120W',
  3499, 4499, FALSE, 4.8, 64,
  'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&h=600&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=800&h=800&fit=crop'
  ],
  'LIGHTING',
  '6000K pure white beam with plug & play coupler fitting and IP68 waterproof housing.',
  'Engineered for night driving on high-speed ECR highways. Emits high-lumen 6000K pure white illumination with precise cutoff line so you do not blind oncoming drivers. 100% coupler-to-coupler installation without cutting factory wires. 50,000-hour lifespan with high-speed cooling fan and IP68 dust/water protection.',
  TRUE, 1
),

-- 2. Leather Seat Covers
(
  'car-seat-cover',
  'PREMIUM BUCKET FIT LEATHER SEAT COVERS',
  'Custom Bucket Fit Leather Seat Covers',
  NULL, NULL, TRUE, 4.9, 82,
  'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=600&h=600&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=800&fit=crop'
  ],
  'INTERIOR',
  'Custom tailored high-density foam PU leather seat covers for all major car models.',
  'Tailor-made bucket fit seat covers handcrafted for exact fitment on Maruti Suzuki, Hyundai, Tata, Mahindra, Toyota, and Honda vehicles. Made with breathable, high-grade PU leather, high-density memory cushioning, double stitching, and sweat-resistant perforations.',
  TRUE, 2
),

-- 3. Android Infotainment
(
  'android-system',
  '9" / 10" ANDROID TOUCH INFOTAINMENT SYSTEM',
  'Android Touchscreen Infotainment System',
  12999, 16499, FALSE, 4.9, 95,
  'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=600&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=800&fit=crop'
  ],
  'AUDIO',
  'IPS capacitive touch display, Wireless CarPlay & Android Auto, DSP audio & GPS navigation.',
  'Transform your vehicle dashboard with our ultra-crisp Android multimedia head unit. Features Gorilla Glass IPS capacitive touch display, built-in Wireless Apple CarPlay and Android Auto, offline & online Google Maps GPS navigation, Bluetooth 5.0 handsfree calling, steering wheel control integration, and 32-band DSP audio equalizer.',
  TRUE, 3
),

-- 4. Floor Mats
(
  'floor-mats-5d',
  '7D ALL-WEATHER CUSTOM MOULDED FLOOR MATS',
  '7D All-Weather Custom Floor Mats',
  2499, 3499, FALSE, 4.7, 71,
  'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&h=800&fit=crop'
  ],
  'INTERIOR',
  'Edge-to-edge raised border 7D mats with detachable curly layer for easy washing.',
  'Deep-dish 7D car mats custom laser-measured to cover floor walls and central hump. Constructed with 7 protective layers: wear-resistant PU leather, sponge cushion, EVA anti-vibration layer, non-slip bottom gecko claws, and a detachable top curly grass mat that traps mud, dirt, and water.',
  TRUE, 4
),

-- 5. RGB Ambient Light
(
  'ambient-light-rgb',
  '64-COLOR RGB FIBER OPTIC AMBIENT LIGHTING',
  '64-Color RGB Ambient Interior Lighting',
  2999, 3999, FALSE, 4.8, 58,
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&h=600&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1511910849309-0dffb8785146?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=800&fit=crop'
  ],
  'LIGHTING',
  'Concealed fiber optic ambient light for doors, dash and footwells with smartphone app sync.',
  'Bring Mercedes-Benz style ambient elegance into your cabin. Ultra-thin concealed optic fibers seamlessly tuck into door trims, dashboard creases, and footwell compartments without ugly exposed wires. Controlled via smartphone Bluetooth app with 64 colors, multiple dynamic breathing modes, brightness adjustment, and music-synchronized pulsing.',
  TRUE, 5
),

-- 6. Dash Camera
(
  'dash-camera-4k',
  '4K ULTRA HD DUAL DASH CAMERA WITH NIGHT VISION',
  'Dual-Lens 4K Dash Camera System',
  4999, 6999, FALSE, 4.8, 49,
  'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=600&h=600&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=800&h=800&fit=crop'
  ],
  'ACCESSORIES',
  'Front 4K + Rear 1080p recording, 24/7 parking surveillance and instant phone WiFi playback.',
  'Record every journey in crystal-clear 4K resolution. Equipped with Sony STARVIS sensor for stellar night vision on unlit roads, 170-degree wide-angle field of view, emergency collision G-sensor lock, seamless loop recording, and continuous parking guard surveillance.',
  TRUE, 6
),

-- 7. Fog Lamps
(
  'fog-lamp-projector',
  'BI-LED PROJECTOR FOG LAMPS (TRI-COLOR BEAM)',
  'Bi-LED Projector Fog Lamps',
  3299, 4299, FALSE, 4.7, 36,
  'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=600&h=600&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800&h=800&fit=crop'
  ],
  'LIGHTING',
  'Tri-color beam switch (White / Golden / Warm White) with high-low solenoid shutter.',
  'Superior optical projector lens with razor-sharp beam cutoff that cuts directly through coastal fog, rain, and highway dust without glare. Toggle between 6000K crisp white for clear nights, 3000K golden yellow for dense fog/monsoon, and 4300K warm white for all-weather highway driving.',
  TRUE, 7
),

-- 8. Steering Cover
(
  'steering-cover',
  'GENUINE LEATHER HAND-STITCHED STEERING COVER',
  'Hand-Stitched Leather Steering Cover',
  899, 1299, FALSE, 4.8, 73,
  'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&h=600&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&h=800&fit=crop'
  ],
  'INTERIOR',
  'Perforated grip zones, sweat-resistant finish, custom cross-stitch installation.',
  'Custom cross-stitched directly over your vehicle factory steering wheel by our skilled technicians. Made from sweat-resistant, anti-slip micro-perforated leather that enhances palm grip, reduces driver fatigue during long coastal drives, and protects the factory steering from peeling and sun degradation.',
  TRUE, 8
),

-- 9. Reverse Camera
(
  'reverse-camera',
  'AHD NIGHT VISION REVERSE CAMERA WITH GUIDELINES',
  'AHD Night Vision Reverse Camera',
  1699, 2299, FALSE, 4.8, 52,
  'https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=600&h=600&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=800&h=800&fit=crop'
  ],
  'ACCESSORIES',
  '170° wide angle fish-eye lens, starlight low-light sensor and dynamic trajectory guidelines.',
  'Park with absolute confidence in tight spaces. High-definition AHD sensor delivers clear color imagery even in pitch-black parking spots. Features 170-degree panoramic viewing angle to eliminate blind spots, dynamic curved reverse trajectory guidelines, and IP69K waterproof zinc-alloy body.',
  TRUE, 9
),

-- 10. Subwoofer
(
  'car-subwoofer',
  'UNDER-SEAT ACTIVE SUBWOOFER WITH BUILT-IN AMP',
  '10" Slim Active Subwoofer 600W',
  NULL, NULL, TRUE, 4.9, 44,
  'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=600&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=800&fit=crop'
  ],
  'AUDIO',
  '600W peak active subwoofer tucked neatly under the driver or passenger seat.',
  'Experience deep, chest-thumping bass frequencies without sacrificing a single inch of boot luggage space. Heavy-duty die-cast aluminium chassis houses a high-output subwoofer cone and an integrated high-efficiency Class-AB amplifier. Includes a wired cockpit bass remote control.',
  TRUE, 10
),

-- 11. Roof Rails
(
  'roof-rails',
  'AERODYNAMIC ALUMINIUM ROOF RAILS',
  'Aluminium Roof Rails',
  3499, 4499, FALSE, 4.6, 31,
  'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=600&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=800&fit=crop'
  ],
  'EXTERIOR',
  'Anodized aluminium alloy, drill-free 3M VHB mounting, muscular SUV styling.',
  'Elevate your car stance with tough anodized aluminium roof rails. Engineered for low wind resistance and zero whistling noise at highway speeds. High-tensile strength automotive bonding ensures drill-free installation with no danger of body rust or roof water leakage.',
  TRUE, 11
),

-- 12. Ceramic Coating
(
  'ceramic-detailing',
  'PRO 9H CERAMIC COATING & DETAILING KIT',
  '9H Ceramic Paint Protection & Detailing',
  2199, 2999, FALSE, 4.8, 38,
  'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=600&h=600&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=800&fit=crop'
  ],
  'ACCESSORIES',
  '9H hydrophobic liquid glass formula guarding against coastal salt air and UV oxidation.',
  'Specialized paint protection formulated to protect vehicle clear coats against the harsh coastal humidity, salt spray, and scorching UV sunshine of the Ramanathapuram ECR region. Creates a glass-like mirror shine with hyper-hydrophobic water beading that keeps dirt from sticking.',
  TRUE, 12
)
ON CONFLICT (id) DO NOTHING;


-- ── 5.3 SEED GALLERY ITEMS (12 Real Portfolio Items) ──
INSERT INTO public.gallery_items (id, title, description, category, image_url, gallery_type, featured, published, sort_order)
VALUES
  -- General Gallery Items (Main Showcase)
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


-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 6: ADMIN AUTHORIZATION & ACCOUNT LINKING
-- ─────────────────────────────────────────────────────────────────────────────

-- 6.1 Pre-seed the primary business admin email in the whitelist
-- Note: A pre-seeded entry with user_id = NULL confers NO admin permissions
-- until user_id is explicitly linked to an active auth.users record.
INSERT INTO public.admin_users (email, role)
VALUES ('leecaraccessories.rpt@gmail.com', 'admin')
ON CONFLICT (email) DO NOTHING;

-- 6.2 Initial link attempt:
-- If the admin account was ALREADY created in Supabase Auth before running this script,
-- this query links user_id immediately.
--
-- IMPORTANT (New/Empty Project):
-- On an empty project, auth.users has no records yet, so this query will link 0 rows.
-- AFTER creating your admin user in Supabase Dashboard (Authentication -> Users),
-- you MUST run the following command in the SQL Editor to complete authorization:
--
--   INSERT INTO public.admin_users (user_id, email, role)
--   SELECT id, email, 'admin'
--   FROM auth.users
--   WHERE LOWER(email) = LOWER('leecaraccessories.rpt@gmail.com')
--   ON CONFLICT (email) DO UPDATE SET user_id = EXCLUDED.user_id;
--
UPDATE public.admin_users a
SET user_id = u.id
FROM auth.users u
WHERE LOWER(a.email) = LOWER(u.email)
  AND a.user_id IS NULL;


-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 7: VERIFICATION & INTEGRITY CHECK QUERY
-- ─────────────────────────────────────────────────────────────────────────────

SELECT 'categories'               AS table_name, COUNT(*) AS row_count FROM public.categories
UNION ALL
SELECT 'products'                 AS table_name, COUNT(*) AS row_count FROM public.products
UNION ALL
SELECT 'order_requests'           AS table_name, COUNT(*) AS row_count FROM public.order_requests
UNION ALL
SELECT 'bookings'                 AS table_name, COUNT(*) AS row_count FROM public.bookings
UNION ALL
SELECT 'contact_messages'         AS table_name, COUNT(*) AS row_count FROM public.contact_messages
UNION ALL
SELECT 'seat_cover_appointments'  AS table_name, COUNT(*) AS row_count FROM public.seat_cover_appointments
UNION ALL
SELECT 'gallery_items'            AS table_name, COUNT(*) AS row_count FROM public.gallery_items
UNION ALL
SELECT 'admin_users'              AS table_name, COUNT(*) AS row_count FROM public.admin_users;
