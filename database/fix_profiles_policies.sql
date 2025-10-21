-- Drop existing policies to prevent recursion
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;

-- Create simple, non-recursive policies
CREATE POLICY "Allow all operations for service role" ON profiles FOR ALL USING (true);
CREATE POLICY "Users can read all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert profiles" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update profiles" ON profiles FOR UPDATE USING (true);
CREATE POLICY "Users can delete profiles" ON profiles FOR DELETE USING (true);