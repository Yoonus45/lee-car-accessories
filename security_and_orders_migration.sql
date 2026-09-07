-- ================================================================
-- LEE CAR ACCESSORIES — SECURITY FIX & AUTHORIZATION MIGRATION
-- ================================================================
-- Run this in: Supabase Dashboard → SQL Editor → New Query
--
-- This migration fixes the "TO authenticated USING (TRUE)" vulnerability
-- by establishing a strict Role-Based Access Control (RBAC) whitelist:
--   1. Creates admin_users whitelist table
--   2. Seeds initial admin: leecaraccessories.rpt@gmail.com
--   3. Automatically links auth.users ID if account already exists
--   4. Creates SECURITY DEFINER function is_admin()
--   5. Drops all insecure "USING (TRUE)" admin policies
--   6. Implements strict is_admin() policies across:
--      - order_requests
--      - bookings
--      - contact_messages
--      - seat_cover_appointments
--      - products (admin writes)
--      - categories (admin writes)
--      - admin_users (admin view)
-- ================================================================

-- ─────────────────────────────────────────────────────────────
-- 1. ADMIN USERS WHITELIST TABLE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL UNIQUE,
  role        TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE admin_users IS 'Whitelist of authorized administrative staff for Lee Car Accessories';

-- Enable RLS on admin_users table
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────
-- 2. SEED INITIAL PRIMARY ADMIN
-- ─────────────────────────────────────────────────────────────
-- Safely insert the primary business administrator
INSERT INTO admin_users (email, role)
VALUES ('leecaraccessories.rpt@gmail.com', 'admin')
ON CONFLICT (email) DO NOTHING;

-- If the user already registered in Supabase Auth, link their user_id
UPDATE admin_users
SET user_id = u.id
FROM auth.users u
WHERE admin_users.email = u.email
  AND admin_users.user_id IS NULL;

-- ─────────────────────────────────────────────────────────────
-- 3. SECURE is_admin() SECURITY DEFINER FUNCTION
-- ─────────────────────────────────────────────────────────────
-- This function runs with elevated privileges to check admin_users
-- without triggering circular RLS recursion. It verifies whether
-- the caller's auth.uid() or verified JWT email is in admin_users.
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

-- Admins can view the admin whitelist
DROP POLICY IF EXISTS "Admins can view admin_users" ON admin_users;
CREATE POLICY "Admins can view admin_users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (is_admin());


-- ─────────────────────────────────────────────────────────────
-- 4. ORDER REQUESTS — STRICT RLS
-- ─────────────────────────────────────────────────────────────
ALTER TABLE order_requests ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "Public insert order_requests"     ON order_requests;
DROP POLICY IF EXISTS "Admin full access order_requests" ON order_requests;
DROP POLICY IF EXISTS "Admin access order_requests"      ON order_requests;

-- Public can ONLY insert orders (cannot read, update, or delete)
CREATE POLICY "Public insert order_requests"
  ON order_requests FOR INSERT
  WITH CHECK (TRUE);

-- Only verified admins can read, update status, and manage orders
CREATE POLICY "Admin access order_requests"
  ON order_requests FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());


-- ─────────────────────────────────────────────────────────────
-- 5. BOOKINGS — STRICT RLS
-- ─────────────────────────────────────────────────────────────
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "Public insert bookings"     ON bookings;
DROP POLICY IF EXISTS "Admin full access bookings" ON bookings;
DROP POLICY IF EXISTS "Admin access bookings"      ON bookings;

-- Public can ONLY submit bookings
CREATE POLICY "Public insert bookings"
  ON bookings FOR INSERT
  WITH CHECK (TRUE);

-- Only verified admins can read, update status, and manage bookings
CREATE POLICY "Admin access bookings"
  ON bookings FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());


-- ─────────────────────────────────────────────────────────────
-- 6. CONTACT MESSAGES — STRICT RLS
-- ─────────────────────────────────────────────────────────────
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "Public insert contact_messages"     ON contact_messages;
DROP POLICY IF EXISTS "Admin full access contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Admin access contact_messages"      ON contact_messages;

-- Public can ONLY send messages
CREATE POLICY "Public insert contact_messages"
  ON contact_messages FOR INSERT
  WITH CHECK (TRUE);

-- Only verified admins can read, update, or delete contact messages
CREATE POLICY "Admin access contact_messages"
  ON contact_messages FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());


-- ─────────────────────────────────────────────────────────────
-- 7. SEAT COVER APPOINTMENTS — STRICT RLS
-- ─────────────────────────────────────────────────────────────
-- Ensure table exists
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

ALTER TABLE seat_cover_appointments ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "Public insert seat_cover_appointments"     ON seat_cover_appointments;
DROP POLICY IF EXISTS "Admin full access seat_cover_appointments" ON seat_cover_appointments;
DROP POLICY IF EXISTS "Admin access seat_cover_appointments"      ON seat_cover_appointments;

-- Public can ONLY submit appointments
CREATE POLICY "Public insert seat_cover_appointments"
  ON seat_cover_appointments FOR INSERT
  WITH CHECK (TRUE);

-- Only verified admins can read, update, or delete seat cover appointments
CREATE POLICY "Admin access seat_cover_appointments"
  ON seat_cover_appointments FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());


-- ─────────────────────────────────────────────────────────────
-- 8. PRODUCTS & CATEGORIES — CATALOG RLS
-- ─────────────────────────────────────────────────────────────
-- Products: public read in-stock, admin full access
DROP POLICY IF EXISTS "Public read in-stock products" ON products;
DROP POLICY IF EXISTS "Admin full access products"     ON products;
DROP POLICY IF EXISTS "Admin access products"          ON products;

CREATE POLICY "Public read in-stock products"
  ON products FOR SELECT
  USING (in_stock = TRUE);

CREATE POLICY "Admin access products"
  ON products FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Categories: public read all, admin full access
DROP POLICY IF EXISTS "Public read categories"       ON categories;
DROP POLICY IF EXISTS "Admin full access categories" ON categories;
DROP POLICY IF EXISTS "Admin access categories"      ON categories;

CREATE POLICY "Public read categories"
  ON categories FOR SELECT
  USING (TRUE);

CREATE POLICY "Admin access categories"
  ON categories FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());


-- ─────────────────────────────────────────────────────────────
-- 9. VERIFICATION QUERY
-- ─────────────────────────────────────────────────────────────
SELECT 'admin_users'              AS tbl, COUNT(*) AS count FROM admin_users
UNION ALL
SELECT 'order_requests'           AS tbl, COUNT(*) AS count FROM order_requests
UNION ALL
SELECT 'bookings'                 AS tbl, COUNT(*) AS count FROM bookings
UNION ALL
SELECT 'contact_messages'         AS tbl, COUNT(*) AS count FROM contact_messages
UNION ALL
SELECT 'seat_cover_appointments'  AS tbl, COUNT(*) AS count FROM seat_cover_appointments;
