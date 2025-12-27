-- Migration: Fix RLS Policies for Data Access
-- Description: Ensures all authenticated users can read equipment, requests, and dashboard data

-- ============================================================================
-- EQUIPMENT POLICIES - Allow all authenticated users to read
-- ============================================================================

-- Drop ALL existing policies on equipment
DROP POLICY IF EXISTS "Users can view equipment" ON equipment;
DROP POLICY IF EXISTS "Users can view own equipment" ON equipment;
DROP POLICY IF EXISTS "Authenticated users can view all equipment" ON equipment;
DROP POLICY IF EXISTS "Authenticated users can insert equipment" ON equipment;
DROP POLICY IF EXISTS "Authenticated users can update equipment" ON equipment;
DROP POLICY IF EXISTS "Authenticated users can delete equipment" ON equipment;

-- Allow all authenticated users to view all equipment
CREATE POLICY "Authenticated users can view all equipment"
ON equipment FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to insert equipment
CREATE POLICY "Authenticated users can insert equipment"
ON equipment FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update equipment
CREATE POLICY "Authenticated users can update equipment"
ON equipment FOR UPDATE
TO authenticated
USING (true);

-- ============================================================================
-- MAINTENANCE REQUESTS POLICIES - Allow all authenticated users to read
-- ============================================================================

-- Drop ALL existing policies on maintenance_requests
DROP POLICY IF EXISTS "Users can view requests" ON maintenance_requests;
DROP POLICY IF EXISTS "Users can view own requests" ON maintenance_requests;
DROP POLICY IF EXISTS "Users can view assigned requests" ON maintenance_requests;
DROP POLICY IF EXISTS "Authenticated users can view all requests" ON maintenance_requests;
DROP POLICY IF EXISTS "Authenticated users can insert requests" ON maintenance_requests;
DROP POLICY IF EXISTS "Authenticated users can update requests" ON maintenance_requests;
DROP POLICY IF EXISTS "Authenticated users can delete requests" ON maintenance_requests;

-- Allow all authenticated users to view all requests
CREATE POLICY "Authenticated users can view all requests"
ON maintenance_requests FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to insert requests
CREATE POLICY "Authenticated users can insert requests"
ON maintenance_requests FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update requests
CREATE POLICY "Authenticated users can update requests"
ON maintenance_requests FOR UPDATE
TO authenticated
USING (true);

-- ============================================================================
-- TEAMS POLICIES
-- ============================================================================

-- Drop ALL existing policies on teams
DROP POLICY IF EXISTS "Users can view teams" ON teams;
DROP POLICY IF EXISTS "Authenticated users can view all teams" ON teams;
DROP POLICY IF EXISTS "Authenticated users can insert teams" ON teams;
DROP POLICY IF EXISTS "Authenticated users can update teams" ON teams;

-- Allow all authenticated users to view teams
CREATE POLICY "Authenticated users can view all teams"
ON teams FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to manage teams
CREATE POLICY "Authenticated users can insert teams"
ON teams FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update teams"
ON teams FOR UPDATE
TO authenticated
USING (true);

-- ============================================================================
-- TECHNICIANS POLICIES
-- ============================================================================

-- Drop ALL existing policies on technicians
DROP POLICY IF EXISTS "Users can view technicians" ON technicians;
DROP POLICY IF EXISTS "Authenticated users can view all technicians" ON technicians;

-- Allow all authenticated users to view technicians
CREATE POLICY "Authenticated users can view all technicians"
ON technicians FOR SELECT
TO authenticated
USING (true);

-- ============================================================================
-- EQUIPMENT CATEGORIES POLICIES
-- ============================================================================

-- Drop ALL existing policies on equipment_categories
DROP POLICY IF EXISTS "Users can view categories" ON equipment_categories;
DROP POLICY IF EXISTS "Authenticated users can view all categories" ON equipment_categories;

-- Allow all authenticated users to view categories
CREATE POLICY "Authenticated users can view all categories"
ON equipment_categories FOR SELECT
TO authenticated
USING (true);

-- ============================================================================
-- WORK CENTERS POLICIES
-- ============================================================================

-- Drop ALL existing policies on work_centers
DROP POLICY IF EXISTS "Users can view work centers" ON work_centers;
DROP POLICY IF EXISTS "Authenticated users can view all work_centers" ON work_centers;
DROP POLICY IF EXISTS "Authenticated users can insert work_centers" ON work_centers;
DROP POLICY IF EXISTS "Authenticated users can update work_centers" ON work_centers;

-- Allow all authenticated users to view work centers
CREATE POLICY "Authenticated users can view all work_centers"
ON work_centers FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to manage work centers
CREATE POLICY "Authenticated users can insert work_centers"
ON work_centers FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update work_centers"
ON work_centers FOR UPDATE
TO authenticated
USING (true);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check all policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;
