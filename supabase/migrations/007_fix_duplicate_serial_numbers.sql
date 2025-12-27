-- Migration: Fix Duplicate Serial Numbers
-- Description: Removes duplicate serial numbers and ensures uniqueness

-- ============================================================================
-- STEP 1: Find and fix duplicate serial numbers
-- ============================================================================

-- Update duplicate serial numbers to make them unique
WITH duplicates AS (
  SELECT id, serial_number, 
         ROW_NUMBER() OVER (PARTITION BY serial_number ORDER BY created_at) as rn
  FROM equipment
  WHERE serial_number IS NOT NULL
)
UPDATE equipment
SET serial_number = equipment.serial_number || '-' || duplicates.rn
FROM duplicates
WHERE equipment.id = duplicates.id
  AND duplicates.rn > 1;

-- ============================================================================
-- STEP 2: Handle NULL serial numbers
-- ============================================================================

-- Generate unique serial numbers for equipment without one
UPDATE equipment
SET serial_number = 'SN-' || LPAD(id::text, 8, '0')
WHERE serial_number IS NULL OR serial_number = '';

-- ============================================================================
-- STEP 3: Ensure the unique constraint exists
-- ============================================================================

-- Drop the constraint if it exists (to recreate it)
ALTER TABLE equipment DROP CONSTRAINT IF EXISTS equipment_serial_number_key;

-- Recreate the unique constraint
ALTER TABLE equipment ADD CONSTRAINT equipment_serial_number_key UNIQUE (serial_number);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check for any remaining duplicates (should return 0 rows)
-- SELECT serial_number, COUNT(*) 
-- FROM equipment 
-- GROUP BY serial_number 
-- HAVING COUNT(*) > 1;
