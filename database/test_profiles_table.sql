-- Test if profiles table exists and has data
SELECT * FROM profiles LIMIT 5;

-- Check table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Check if there are any existing auth users
SELECT id, email FROM auth.users LIMIT 5;

-- Insert profile for existing auth user (replace with actual user ID)
-- First get a user ID: SELECT id FROM auth.users LIMIT 1;
-- Then use that ID in the insert below

-- Example (replace 'your-actual-user-id' with real UUID from auth.users):
-- INSERT INTO profiles (id, user_id, name, email, role, status) 
-- VALUES (
--   'your-actual-user-id', 
--   'USR001', 
--   'Test User', 
--   'test@example.com', 
--   'Super Admin', 
--   'Active'
-- ) ON CONFLICT (id) DO NOTHING;