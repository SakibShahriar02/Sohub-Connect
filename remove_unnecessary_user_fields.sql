-- Remove unnecessary columns from profiles table
ALTER TABLE profiles DROP COLUMN IF EXISTS gender;
ALTER TABLE profiles DROP COLUMN IF EXISTS department;
ALTER TABLE profiles DROP COLUMN IF EXISTS designation;
ALTER TABLE profiles DROP COLUMN IF EXISTS joining_date;
ALTER TABLE profiles DROP COLUMN IF EXISTS birthday;
ALTER TABLE profiles DROP COLUMN IF EXISTS blood_group;
ALTER TABLE profiles DROP COLUMN IF EXISTS marital_status;