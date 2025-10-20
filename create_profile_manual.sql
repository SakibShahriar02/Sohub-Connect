-- Manual Profile Creation
-- Run this if the profile is not being created automatically

-- First, check if user exists in auth.users
SELECT id, email FROM auth.users WHERE email = 'admin@sohub.com';

-- Create profile manually (replace the UUID with the actual user ID from above query)
INSERT INTO profiles (id, email, full_name, role, department, designation, status, created_at, updated_at)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@sohub.com'),
  'admin@sohub.com',
  'Super Administrator',
  'Super Admin',
  'IT Department',
  'System Administrator',
  'Active',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  full_name = 'Super Administrator',
  role = 'Super Admin',
  department = 'IT Department',
  designation = 'System Administrator',
  status = 'Active',
  updated_at = NOW();

-- Verify the profile was created
SELECT * FROM profiles WHERE email = 'admin@sohub.com';