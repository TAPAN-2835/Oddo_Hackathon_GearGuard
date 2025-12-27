-- Complete RLS Policies for All Tables
-- This migration adds comprehensive RLS policies for all tables in the system

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Create new policies
CREATE POLICY "Users can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- ============================================================================
-- TEAMS TABLE
-- ============================================================================
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view teams" ON public.teams;
DROP POLICY IF EXISTS "Authenticated users can create teams" ON public.teams;
DROP POLICY IF EXISTS "Authenticated users can update teams" ON public.teams;
DROP POLICY IF EXISTS "Authenticated users can delete teams" ON public.teams;

CREATE POLICY "Anyone can view teams"
ON public.teams FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create teams"
ON public.teams FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update teams"
ON public.teams FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete teams"
ON public.teams FOR DELETE
TO authenticated
USING (true);

-- ============================================================================
-- WORK CENTERS TABLE
-- ============================================================================
ALTER TABLE public.work_centers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view work centers" ON public.work_centers;
DROP POLICY IF EXISTS "Authenticated users can create work centers" ON public.work_centers;
DROP POLICY IF EXISTS "Authenticated users can update work centers" ON public.work_centers;
DROP POLICY IF EXISTS "Authenticated users can delete work centers" ON public.work_centers;

CREATE POLICY "Anyone can view work centers"
ON public.work_centers FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create work centers"
ON public.work_centers FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update work centers"
ON public.work_centers FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete work centers"
ON public.work_centers FOR DELETE
TO authenticated
USING (true);

-- ============================================================================
-- EQUIPMENT CATEGORIES TABLE
-- ============================================================================
ALTER TABLE public.equipment_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view equipment categories" ON public.equipment_categories;
DROP POLICY IF EXISTS "Authenticated users can create equipment categories" ON public.equipment_categories;
DROP POLICY IF EXISTS "Authenticated users can update equipment categories" ON public.equipment_categories;
DROP POLICY IF EXISTS "Authenticated users can delete equipment categories" ON public.equipment_categories;

CREATE POLICY "Anyone can view equipment categories"
ON public.equipment_categories FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create equipment categories"
ON public.equipment_categories FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update equipment categories"
ON public.equipment_categories FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete equipment categories"
ON public.equipment_categories FOR DELETE
TO authenticated
USING (true);

-- ============================================================================
-- EQUIPMENT TABLE
-- ============================================================================
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view equipment" ON public.equipment;
DROP POLICY IF EXISTS "Authenticated users can create equipment" ON public.equipment;
DROP POLICY IF EXISTS "Authenticated users can update equipment" ON public.equipment;
DROP POLICY IF EXISTS "Authenticated users can delete equipment" ON public.equipment;

CREATE POLICY "Anyone can view equipment"
ON public.equipment FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create equipment"
ON public.equipment FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update equipment"
ON public.equipment FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete equipment"
ON public.equipment FOR DELETE
TO authenticated
USING (true);

-- ============================================================================
-- TECHNICIANS TABLE
-- ============================================================================
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view technicians" ON public.technicians;
DROP POLICY IF EXISTS "Authenticated users can create technicians" ON public.technicians;
DROP POLICY IF EXISTS "Authenticated users can update technicians" ON public.technicians;
DROP POLICY IF EXISTS "Authenticated users can delete technicians" ON public.technicians;

CREATE POLICY "Anyone can view technicians"
ON public.technicians FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create technicians"
ON public.technicians FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update technicians"
ON public.technicians FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete technicians"
ON public.technicians FOR DELETE
TO authenticated
USING (true);

-- ============================================================================
-- MAINTENANCE REQUESTS TABLE
-- ============================================================================
ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view maintenance requests" ON public.maintenance_requests;
DROP POLICY IF EXISTS "Authenticated users can create maintenance requests" ON public.maintenance_requests;
DROP POLICY IF EXISTS "Authenticated users can update maintenance requests" ON public.maintenance_requests;
DROP POLICY IF EXISTS "Authenticated users can delete maintenance requests" ON public.maintenance_requests;

CREATE POLICY "Anyone can view maintenance requests"
ON public.maintenance_requests FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create maintenance requests"
ON public.maintenance_requests FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update maintenance requests"
ON public.maintenance_requests FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete maintenance requests"
ON public.maintenance_requests FOR DELETE
TO authenticated
USING (true);

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Authenticated users can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;

CREATE POLICY "Users can view own notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can create notifications"
ON public.notifications FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can update own notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own notifications"
ON public.notifications FOR DELETE
TO authenticated
USING (user_id = auth.uid());
