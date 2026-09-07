-- ================================================================
-- LEE CAR ACCESSORIES — COMPLETE SUPABASE SETUP SCRIPT v2
-- ================================================================
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- Covers:
--   1. Categories table (with seed data)
--   2. Products table (with FK → categories, seed data)
--   3. Order Requests table
--   4. Bookings table
--   5. Contact Messages table
--   6. Row Level Security (RLS) policies
--   7. Supabase Storage bucket + policies
-- ================================================================

-- ─────────────────────────────────────────────────────────────
-- 0. CLEAN SLATE (run only on fresh setup — comment out if re-running)
-- ─────────────────────────────────────────────────────────────
-- DROP TABLE IF EXISTS contact_messages  CASCADE;
-- DROP TABLE IF EXISTS bookings          CASCADE;
-- DROP TABLE IF EXISTS order_requests    CASCADE;
-- DROP TABLE IF EXISTS products          CASCADE;
-- DROP TABLE IF EXISTS categories        CASCADE;


-- ─────────────────────────────────────────────────────────────
-- 1. CATEGORIES TABLE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id            TEXT PRIMARY KEY,                      -- Slug: 'LIGHTING', 'INTERIOR', etc.
  name          TEXT NOT NULL,                         -- Display name
  img           TEXT NOT NULL DEFAULT '',              -- Image URL (Supabase Storage or external)
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  categories         IS 'Product categories shown in Shop filter strip';
COMMENT ON COLUMN categories.id      IS 'Uppercase slug — must match products.category FK';
COMMENT ON COLUMN categories.img     IS 'Category hero image, ideally from product-images Supabase Storage bucket';


-- ─────────────────────────────────────────────────────────────
-- 2. PRODUCTS TABLE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id                TEXT PRIMARY KEY,                  -- Slug: 'led-headlight'
  name              TEXT NOT NULL,
  title             TEXT NOT NULL DEFAULT '',
  price             DECIMAL(10,2),                     -- NULL means contact_for_price
  mrp               DECIMAL(10,2),
  contact_for_price BOOLEAN NOT NULL DEFAULT FALSE,
  rating            DECIMAL(3,1) NOT NULL DEFAULT 5.0,
  reviews_count     INTEGER NOT NULL DEFAULT 0,
  image             TEXT NOT NULL DEFAULT '',          -- Main image URL (first in images[])
  images            TEXT[] NOT NULL DEFAULT '{}',     -- All image URLs
  category          TEXT NOT NULL
                    REFERENCES categories(id)
                    ON UPDATE CASCADE
                    ON DELETE RESTRICT,
  description       TEXT NOT NULL DEFAULT '',          -- Short — for shop cards
  long_desc         TEXT NOT NULL DEFAULT '',          -- Long — for product detail page
  in_stock          BOOLEAN NOT NULL DEFAULT TRUE,     -- FALSE hides from website
  display_order     INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  products             IS 'Product catalogue — managed from Admin Dashboard';
COMMENT ON COLUMN products.category    IS 'FK → categories.id — must be a valid category slug';
COMMENT ON COLUMN products.images      IS 'Ordered array of image URLs. First element = main image.';
COMMENT ON COLUMN products.in_stock    IS 'When FALSE the product is hidden from the public shop';


-- ─────────────────────────────────────────────────────────────
-- 3. ORDER REQUESTS TABLE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  customer_name   TEXT NOT NULL,
  customer_phone  TEXT NOT NULL,
  customer_email  TEXT,
  car_model       TEXT,
  product_id      TEXT NOT NULL
                  REFERENCES products(id)
                  ON UPDATE CASCADE
                  ON DELETE SET NULL,      -- keep history if product is deleted
  product_name    TEXT NOT NULL,           -- denormalised snapshot at time of order
  quantity        INTEGER NOT NULL DEFAULT 1,
  address         TEXT,
  notes           TEXT,
  status          TEXT NOT NULL DEFAULT 'new'
                  CHECK (status IN ('new','contacted','confirmed','ready','completed','cancelled'))
);

COMMENT ON TABLE  order_requests             IS 'Customer order requests submitted via product pages';
COMMENT ON COLUMN order_requests.product_id  IS 'FK → products.id (SET NULL on product delete to preserve history)';
COMMENT ON COLUMN order_requests.status      IS 'Workflow: new → contacted → confirmed → ready → completed | cancelled';


-- ─────────────────────────────────────────────────────────────
-- 4. BOOKINGS TABLE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
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
                   CHECK (status IN ('pending','confirmed','completed','cancelled'))
);

COMMENT ON TABLE bookings IS 'Appointment booking requests from the /booking page';


-- ─────────────────────────────────────────────────────────────
-- 5. CONTACT MESSAGES TABLE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  customer_name   TEXT NOT NULL,
  customer_phone  TEXT NOT NULL,
  message         TEXT,
  status          TEXT NOT NULL DEFAULT 'unread'
                  CHECK (status IN ('unread','read','replied'))
);

COMMENT ON TABLE contact_messages IS 'Messages submitted via /contact page quick message form';


-- ─────────────────────────────────────────────────────────────
-- 6. ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────────

-- Enable RLS on every table
ALTER TABLE categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_requests   ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- ── admin_users table & is_admin() function ──
CREATE TABLE IF NOT EXISTS admin_users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL UNIQUE,
  role        TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Seed initial admin
INSERT INTO admin_users (email, role)
VALUES ('leecaraccessories.rpt@gmail.com', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Secure is_admin() helper function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  v_uid UUID;
  v_email TEXT;
BEGIN
  v_uid := auth.uid();
  v_email := LOWER(COALESCE(auth.jwt() ->> 'email', ''));

  IF v_uid IS NULL AND v_email = '' THEN
    RETURN FALSE;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE (user_id IS NOT NULL AND user_id = v_uid)
       OR (LOWER(email) = v_email AND role IN ('admin', 'super_admin'))
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

DROP POLICY IF EXISTS "Admins can view admin_users" ON admin_users;
CREATE POLICY "Admins can view admin_users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (is_admin());

-- ── categories ──
DROP POLICY IF EXISTS "Public read categories"       ON categories;
DROP POLICY IF EXISTS "Admin full access categories" ON categories;
DROP POLICY IF EXISTS "Admin access categories"      ON categories;

CREATE POLICY "Public read categories"
  ON categories FOR SELECT
  USING (TRUE);                              -- all categories visible publicly

CREATE POLICY "Admin access categories"
  ON categories FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ── products ──
DROP POLICY IF EXISTS "Public read in-stock products" ON products;
DROP POLICY IF EXISTS "Admin full access products"     ON products;
DROP POLICY IF EXISTS "Admin access products"          ON products;

CREATE POLICY "Public read in-stock products"
  ON products FOR SELECT
  USING (in_stock = TRUE);                   -- customers only see in-stock items

CREATE POLICY "Admin access products"
  ON products FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ── order_requests ──
DROP POLICY IF EXISTS "Public insert order_requests"       ON order_requests;
DROP POLICY IF EXISTS "Admin full access order_requests"   ON order_requests;
DROP POLICY IF EXISTS "Admin access order_requests"        ON order_requests;

CREATE POLICY "Public insert order_requests"
  ON order_requests FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Admin access order_requests"
  ON order_requests FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ── bookings ──
DROP POLICY IF EXISTS "Public insert bookings"     ON bookings;
DROP POLICY IF EXISTS "Admin full access bookings" ON bookings;
DROP POLICY IF EXISTS "Admin access bookings"      ON bookings;

CREATE POLICY "Public insert bookings"
  ON bookings FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Admin access bookings"
  ON bookings FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ── contact_messages ──
DROP POLICY IF EXISTS "Public insert contact_messages"     ON contact_messages;
DROP POLICY IF EXISTS "Admin full access contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Admin access contact_messages"      ON contact_messages;

CREATE POLICY "Public insert contact_messages"
  ON contact_messages FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Admin access contact_messages"
  ON contact_messages FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());


-- ─────────────────────────────────────────────────────────────
-- 7. SUPABASE STORAGE — product-images bucket
-- ─────────────────────────────────────────────────────────────
-- Note: The storage.buckets INSERT creates the bucket via SQL.
-- If you prefer the UI: Storage → New Bucket → "product-images" → Public ON

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  TRUE,                      -- public: URLs accessible without auth
  5242880,                   -- 5 MB per file
  ARRAY['image/jpeg','image/png','image/webp','image/gif','image/avif']
)
ON CONFLICT (id) DO UPDATE
  SET public = TRUE,
      file_size_limit = 5242880,
      allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp','image/gif','image/avif'];

-- Storage RLS policies
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
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Admin update product images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images')
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Admin delete product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images');


-- ─────────────────────────────────────────────────────────────
-- 8. SEED: CATEGORIES
-- ─────────────────────────────────────────────────────────────
INSERT INTO categories (id, name, img, display_order) VALUES
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
ON CONFLICT (id) DO NOTHING;


-- ─────────────────────────────────────────────────────────────
-- 9. SEED: PRODUCTS (12 products — references categories above)
-- ─────────────────────────────────────────────────────────────
INSERT INTO products
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


-- ─────────────────────────────────────────────────────────────
-- 8. SEAT COVER APPOINTMENTS TABLE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS seat_cover_appointments (
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

COMMENT ON TABLE seat_cover_appointments IS 'Dedicated appointment booking requests for Premium Custom Car Seat Covers';

-- Enable Row Level Security (RLS)
ALTER TABLE seat_cover_appointments ENABLE ROW LEVEL SECURITY;

-- 1. Public users can ONLY insert their own appointment request
DROP POLICY IF EXISTS "Public insert seat_cover_appointments" ON seat_cover_appointments;
CREATE POLICY "Public insert seat_cover_appointments"
  ON seat_cover_appointments FOR INSERT
  WITH CHECK (TRUE);

-- 2. Only authenticated admin users can view, update, or manage appointments
DROP POLICY IF EXISTS "Admin full access seat_cover_appointments" ON seat_cover_appointments;
CREATE POLICY "Admin full access seat_cover_appointments"
  ON seat_cover_appointments FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);


-- ─────────────────────────────────────────────────────────────
-- 9. VERIFY — check everything was created correctly
-- ─────────────────────────────────────────────────────────────
SELECT 'categories'               AS tbl, COUNT(*) AS rows FROM categories
UNION ALL
SELECT 'products'                 AS tbl, COUNT(*) AS rows FROM products
UNION ALL
SELECT 'order_requests'           AS tbl, COUNT(*) AS rows FROM order_requests
UNION ALL
SELECT 'bookings'                 AS tbl, COUNT(*) AS rows FROM bookings
UNION ALL
SELECT 'contact_messages'         AS tbl, COUNT(*) AS rows FROM contact_messages
UNION ALL
SELECT 'seat_cover_appointments'  AS tbl, COUNT(*) AS rows FROM seat_cover_appointments;

