-- ================================================================
-- LEE CAR ACCESSORIES — SEAT COVER APPOINTMENTS MIGRATION
-- ================================================================
-- Run this in: Supabase Dashboard → SQL Editor → New Query
--
-- Creates:
--   1. seat_cover_appointments table
--   2. RLS Policies:
--      - Public users: INSERT only (cannot SELECT, UPDATE, or DELETE)
--      - Authenticated admins: Full access (SELECT, UPDATE status, DELETE)
-- ================================================================

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
-- They CANNOT SELECT (read), UPDATE, or DELETE any rows
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
