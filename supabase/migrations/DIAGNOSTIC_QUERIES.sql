-- Quick diagnostic query to check if data exists and RLS is working
-- Run these queries one by one in Supabase SQL Editor to diagnose the issue

-- 1. Check if equipment exists
SELECT COUNT(*) as equipment_count FROM equipment;

-- 2. Check if maintenance requests exist
SELECT COUNT(*) as requests_count FROM maintenance_requests;

-- 3. Check if teams exist
SELECT COUNT(*) as teams_count FROM teams;

-- 4. Check current user's auth status
SELECT auth.uid() as current_user_id;

-- 5. Test equipment query with RLS (should return data if policies are correct)
SELECT id, name, serial_number, status, created_at 
FROM equipment 
LIMIT 5;

-- 6. Test maintenance requests query with RLS
SELECT id, subject, status, priority, created_at 
FROM maintenance_requests 
LIMIT 5;

-- 7. Check existing RLS policies on equipment
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'equipment';

-- 8. Check existing RLS policies on maintenance_requests
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'maintenance_requests';

-- If counts show data but SELECT returns nothing, RLS policies are blocking access
-- If counts show 0, there's no data in the database yet
