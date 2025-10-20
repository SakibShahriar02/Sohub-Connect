-- Add document columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profile_picture TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS nid_front TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS nid_back TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS certificate TEXT;