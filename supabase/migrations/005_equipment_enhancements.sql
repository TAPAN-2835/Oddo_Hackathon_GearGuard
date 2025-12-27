-- Migration: Equipment and Request Enhancements
-- Description: Adds department tracking, ownership, warranty info, team assignments, and duration tracking

-- ============================================================================
-- EQUIPMENT ENHANCEMENTS
-- ============================================================================

-- Add department and ownership tracking
ALTER TABLE equipment 
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS warranty_expiry_date DATE,
ADD COLUMN IF NOT EXISTS warranty_provider TEXT,
ADD COLUMN IF NOT EXISTS maintenance_team_id UUID REFERENCES teams(id),
ADD COLUMN IF NOT EXISTS default_technician_id UUID REFERENCES technicians(id);

-- Note: purchase_date already exists in schema

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_equipment_department ON equipment(department);
CREATE INDEX IF NOT EXISTS idx_equipment_assigned_to ON equipment(assigned_to);
CREATE INDEX IF NOT EXISTS idx_equipment_team ON equipment(maintenance_team_id);

-- ============================================================================
-- MAINTENANCE REQUEST ENHANCEMENTS
-- ============================================================================

-- Add team assignment to requests
ALTER TABLE maintenance_requests 
ADD COLUMN IF NOT EXISTS assigned_team_id UUID REFERENCES teams(id);

-- Add duration tracking to requests
ALTER TABLE maintenance_requests 
ADD COLUMN IF NOT EXISTS estimated_duration INTEGER, -- in minutes
ADD COLUMN IF NOT EXISTS actual_duration INTEGER,    -- in minutes
ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_requests_team ON maintenance_requests(assigned_team_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON maintenance_requests(status);

-- ============================================================================
-- UPDATE RLS POLICIES (if needed)
-- ============================================================================

-- Equipment policies already exist, no changes needed
-- Request policies already exist, no changes needed

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check equipment columns
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'equipment' 
-- ORDER BY ordinal_position;

-- Check maintenance_requests columns
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'maintenance_requests' 
-- ORDER BY ordinal_position;
