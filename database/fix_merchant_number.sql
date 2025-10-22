-- Remove the trigger that might be causing issues
DROP TRIGGER IF EXISTS trigger_assign_merchant_number ON profiles;
DROP FUNCTION IF EXISTS assign_merchant_number();
DROP FUNCTION IF EXISTS generate_merchant_number();
DROP SEQUENCE IF EXISTS merchant_number_seq;

-- Make merchant_number nullable
ALTER TABLE profiles ALTER COLUMN merchant_number DROP NOT NULL;

-- Remove duplicate merchant numbers by setting them to NULL
WITH duplicates AS (
  SELECT id, merchant_number,
    ROW_NUMBER() OVER (PARTITION BY merchant_number ORDER BY created_at) as rn
  FROM profiles 
  WHERE merchant_number IS NOT NULL
)
UPDATE profiles 
SET merchant_number = NULL 
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- Reset merchant numbers starting from 1000
WITH numbered_profiles AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) + 999 as new_merchant_number
  FROM profiles 
  WHERE merchant_number IS NULL
)
UPDATE profiles 
SET merchant_number = numbered_profiles.new_merchant_number
FROM numbered_profiles 
WHERE profiles.id = numbered_profiles.id;