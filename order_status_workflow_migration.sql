-- ================================================================
-- LEE CAR ACCESSORIES — SAFE ORDER STATUS WORKFLOW MIGRATION
-- ================================================================
-- Run this in: Supabase Dashboard → SQL Editor → New Query
--
-- This migration upgrades the manual order workflow from:
--   ['new', 'contacted', 'completed', 'cancelled']
-- to the full realistic manual business workflow:
--   ['new', 'contacted', 'confirmed', 'ready', 'completed', 'cancelled']
--
-- Workflow:
--   NEW → CONTACTED → CONFIRMED → READY FOR FITMENT/SHIPPING → COMPLETED
--   (Any active order can transition to CANCELLED)
--
-- SAFETY GUARANTEES:
--   - Does NOT delete or drop existing orders table.
--   - Does NOT alter or delete any existing order rows.
--   - Preserves all customer details, phone, car, product, and history.
--   - Safely removes existing check constraint on 'status' and replaces it.
--   - Preserves strict Row Level Security (RLS) policies.
-- ================================================================

-- ─────────────────────────────────────────────────────────────
-- 1. SAFELY UPDATE CHECK CONSTRAINT ON order_requests.status
-- ─────────────────────────────────────────────────────────────
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Locate and drop any existing check constraint on order_requests that checks status
    FOR r IN (
        SELECT con.conname
        FROM pg_constraint con
        JOIN pg_class rel ON rel.oid = con.conrelid
        JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
        WHERE rel.relname = 'order_requests'
          AND con.contype = 'c'
          AND pg_get_constraintdef(con.oid) ILIKE '%status%'
    ) LOOP
        EXECUTE 'ALTER TABLE order_requests DROP CONSTRAINT IF EXISTS ' || quote_ident(r.conname);
        RAISE NOTICE 'Dropped existing status constraint: %', r.conname;
    END LOOP;
END $$;

-- Explicitly ensure default name is dropped if present
ALTER TABLE order_requests DROP CONSTRAINT IF EXISTS order_requests_status_check;

-- Add updated check constraint with all 6 workflow statuses
ALTER TABLE order_requests
  ADD CONSTRAINT order_requests_status_check
  CHECK (status IN ('new', 'contacted', 'confirmed', 'ready', 'completed', 'cancelled'));

-- Ensure default remains 'new'
ALTER TABLE order_requests
  ALTER COLUMN status SET DEFAULT 'new';

-- Update documentation comment
COMMENT ON COLUMN order_requests.status IS 'Workflow: new → contacted → confirmed → ready → completed | cancelled';


-- ─────────────────────────────────────────────────────────────
-- 2. VERIFY ROW LEVEL SECURITY (RLS) REMAINS STRICT
-- ─────────────────────────────────────────────────────────────
ALTER TABLE order_requests ENABLE ROW LEVEL SECURITY;

-- 1) Public customers can ONLY insert new order requests
DROP POLICY IF EXISTS "Public insert order_requests" ON order_requests;
CREATE POLICY "Public insert order_requests"
  ON order_requests FOR INSERT
  WITH CHECK (TRUE);

-- 2) Only verified admins (via is_admin()) have full access
DROP POLICY IF EXISTS "Admin access order_requests" ON order_requests;
CREATE POLICY "Admin access order_requests"
  ON order_requests FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());


-- ─────────────────────────────────────────────────────────────
-- 3. AUDIT & VERIFICATION QUERY
-- ─────────────────────────────────────────────────────────────
-- Shows current distribution of orders by status (all existing rows preserved)
SELECT 
  status, 
  COUNT(*) AS order_count
FROM order_requests
GROUP BY status
ORDER BY order_count DESC;

-- Confirm check constraint definition in pg catalog
SELECT 
  conname AS constraint_name, 
  pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'order_requests'::regclass
  AND contype = 'c';
