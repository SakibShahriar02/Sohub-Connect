-- Temporarily disable RLS to test
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Test query
SELECT * FROM profiles;