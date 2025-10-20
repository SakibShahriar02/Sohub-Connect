-- Update current admin user to Super Admin
-- Run this in Supabase SQL Editor

UPDATE profiles 
SET role = 'Super Admin' 
WHERE email = 'admin@sohub.com.bd';

-- Verify the update
SELECT email, role, full_name, status 
FROM profiles 
WHERE email = 'admin@sohub.com.bd';

