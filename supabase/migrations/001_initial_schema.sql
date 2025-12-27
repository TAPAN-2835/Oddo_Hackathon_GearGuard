-- =====================================================
-- GearGuard Database Schema - Supabase Migration
-- =====================================================
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USERS & PROFILES
-- =====================================================

-- Extend auth.users with profiles
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'technician' CHECK (role IN ('admin', 'technician', 'manager')),
  department TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. TEAMS
-- =====================================================

CREATE TABLE public.teams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. EQUIPMENT CATEGORIES
-- =====================================================

CREATE TABLE public.equipment_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. EQUIPMENT
-- =====================================================

CREATE TABLE public.equipment (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  serial_number TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES public.equipment_categories(id),
  team_id UUID REFERENCES public.teams(id),
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Under Maintenance', 'Scrap')),
  location TEXT,
  purchase_date DATE,
  last_maintenance_date TIMESTAMP WITH TIME ZONE,
  next_maintenance_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. WORK CENTERS
-- =====================================================

CREATE TABLE public.work_centers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  location TEXT,
  description TEXT,
  capacity INTEGER DEFAULT 1,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. TECHNICIANS
-- =====================================================

CREATE TABLE public.technicians (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) UNIQUE,
  team_id UUID REFERENCES public.teams(id),
  specialization TEXT,
  status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'Busy', 'Off Duty')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. MAINTENANCE REQUESTS
-- =====================================================

CREATE TABLE public.maintenance_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  request_number TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  equipment_id UUID REFERENCES public.equipment(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id),
  assigned_technician_id UUID REFERENCES public.technicians(id),
  work_center_id UUID REFERENCES public.work_centers(id),
  type TEXT DEFAULT 'Corrective' CHECK (type IN ('Preventive', 'Corrective', 'Emergency')),
  status TEXT DEFAULT 'New' CHECK (status IN ('New', 'In Progress', 'Repaired', 'Scrap', 'Cancelled')),
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
  scheduled_date TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  estimated_hours DECIMAL(5,2),
  actual_hours DECIMAL(5,2),
  cost DECIMAL(10,2),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. NOTIFICATIONS
-- =====================================================

CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('success', 'warning', 'info', 'error')),
  read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. INDEXES for Performance
-- =====================================================

CREATE INDEX idx_equipment_team ON public.equipment(team_id);
CREATE INDEX idx_equipment_category ON public.equipment(category_id);
CREATE INDEX idx_equipment_status ON public.equipment(status);
CREATE INDEX idx_requests_equipment ON public.maintenance_requests(equipment_id);
CREATE INDEX idx_requests_team ON public.maintenance_requests(team_id);
CREATE INDEX idx_requests_status ON public.maintenance_requests(status);
CREATE INDEX idx_requests_technician ON public.maintenance_requests(assigned_technician_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);

-- =====================================================
-- 10. TRIGGERS for updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON public.equipment
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_centers_updated_at BEFORE UPDATE ON public.work_centers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_technicians_updated_at BEFORE UPDATE ON public.technicians
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON public.maintenance_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 11. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all, update own
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Teams: All authenticated users can read
CREATE POLICY "Teams are viewable by authenticated users"
  ON public.teams FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage teams"
  ON public.teams FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Equipment Categories: All authenticated users can read
CREATE POLICY "Categories are viewable by authenticated users"
  ON public.equipment_categories FOR SELECT
  TO authenticated
  USING (true);

-- Equipment: All authenticated users can read, admins can manage
CREATE POLICY "Equipment is viewable by authenticated users"
  ON public.equipment FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create equipment"
  ON public.equipment FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins and creators can update equipment"
  ON public.equipment FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'manager')
    )
  );

-- Work Centers: All authenticated users can read
CREATE POLICY "Work centers are viewable by authenticated users"
  ON public.work_centers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage work centers"
  ON public.work_centers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Technicians: All authenticated users can read
CREATE POLICY "Technicians are viewable by authenticated users"
  ON public.technicians FOR SELECT
  TO authenticated
  USING (true);

-- Maintenance Requests: All authenticated users can read and create
CREATE POLICY "Requests are viewable by authenticated users"
  ON public.maintenance_requests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create requests"
  ON public.maintenance_requests FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own requests or assigned requests"
  ON public.maintenance_requests FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    assigned_technician_id IN (
      SELECT id FROM public.technicians WHERE user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'manager')
    )
  );

-- Notifications: Users can only see their own
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- =====================================================
-- 12. SEED DATA
-- =====================================================

-- Insert default equipment categories
INSERT INTO public.equipment_categories (name, description) VALUES
  ('Mechanical', 'Mechanical equipment and machinery'),
  ('Electrical', 'Electrical systems and components'),
  ('Hydraulic', 'Hydraulic systems and equipment'),
  ('Pneumatic', 'Pneumatic systems and tools');

-- Insert default teams
INSERT INTO public.teams (name, description, color) VALUES
  ('Mechanical Team', 'Handles all mechanical maintenance', '#3b82f6'),
  ('Electrical Team', 'Handles electrical systems', '#f59e0b'),
  ('Hydraulics Team', 'Specializes in hydraulic systems', '#22c55e'),
  ('Pneumatics Team', 'Handles pneumatic equipment', '#ef4444');

-- Insert default work centers
INSERT INTO public.work_centers (name, location, description, capacity) VALUES
  ('Main Workshop', 'Building A', 'Primary maintenance workshop', 10),
  ('Field Service', 'Mobile', 'On-site maintenance team', 5),
  ('Emergency Bay', 'Building B', 'Emergency repair station', 3);

-- =====================================================
-- 13. FUNCTIONS for Auto-generating Request Numbers
-- =====================================================

CREATE OR REPLACE FUNCTION generate_request_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  year_part TEXT;
  sequence_part INTEGER;
BEGIN
  year_part := TO_CHAR(NOW(), 'YYYY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(request_number FROM 6) AS INTEGER)), 0) + 1
  INTO sequence_part
  FROM public.maintenance_requests
  WHERE request_number LIKE year_part || '-%';
  
  new_number := year_part || '-' || LPAD(sequence_part::TEXT, 4, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate request numbers
CREATE OR REPLACE FUNCTION set_request_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.request_number IS NULL THEN
    NEW.request_number := generate_request_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_request_number
  BEFORE INSERT ON public.maintenance_requests
  FOR EACH ROW
  EXECUTE FUNCTION set_request_number();

-- =====================================================
-- 14. FUNCTION to Create Notification
-- =====================================================

CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_title TEXT,
  p_message TEXT,
  p_type TEXT DEFAULT 'info',
  p_link TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, title, message, type, link)
  VALUES (p_user_id, p_title, p_message, p_type, p_link)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- Next steps:
-- 1. Set up Supabase client in your app
-- 2. Configure environment variables
-- 3. Replace mock data with Supabase queries
-- =====================================================
