-- Test caller_ids table
-- Run this to check if everything is working

-- Check if table exists
SELECT table_name FROM information_schema.tables WHERE table_name = 'caller_ids';

-- Check table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'caller_ids';

-- Check if there's any data
SELECT * FROM caller_ids;

-- Check if admin profile exists
SELECT id, email, full_name FROM profiles WHERE email = 'admin@sohub.com';