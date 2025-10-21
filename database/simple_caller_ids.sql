-- Simple caller_ids setup
-- Run this if the other version doesn't work

-- Drop existing table if it has issues
DROP TABLE IF EXISTS caller_ids CASCADE;

-- Create table
CREATE TABLE caller_ids (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  number TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'Active',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE caller_ids ENABLE ROW LEVEL SECURITY;

-- Simple policy - allow all for now
CREATE POLICY "Allow all operations" ON caller_ids FOR ALL USING (true);

-- Insert test data
INSERT INTO caller_ids (name, number, description, status) VALUES
('Main Office', '+1234567890', 'Primary business number', 'Active'),
('Sales Department', '+1234567891', 'Sales team direct line', 'Active'),
('Support Line', '+1234567892', 'Customer support', 'Active');