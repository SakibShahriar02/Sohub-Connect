-- Add caller_ids table to existing schema
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS caller_ids (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  number TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE caller_ids ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view caller IDs" ON caller_ids FOR SELECT USING (true);
CREATE POLICY "Admins can manage caller IDs" ON caller_ids FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('Super Admin', 'Admin'))
);

-- Create trigger for updated_at
CREATE TRIGGER update_caller_ids_updated_at BEFORE UPDATE ON caller_ids FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM profiles WHERE email = 'admin@sohub.com') THEN
    INSERT INTO caller_ids (name, number, description, status, created_by)
    SELECT 
      'Main Office',
      '+1234567890',
      'Primary business number',
      'Active',
      p.id
    FROM profiles p 
    WHERE p.email = 'admin@sohub.com'
    AND NOT EXISTS (SELECT 1 FROM caller_ids WHERE name = 'Main Office');
    
    INSERT INTO caller_ids (name, number, description, status, created_by)
    SELECT 
      'Sales Department',
      '+1234567891',
      'Sales team direct line',
      'Active',
      p.id
    FROM profiles p 
    WHERE p.email = 'admin@sohub.com'
    AND NOT EXISTS (SELECT 1 FROM caller_ids WHERE name = 'Sales Department');
  END IF;
END $$;