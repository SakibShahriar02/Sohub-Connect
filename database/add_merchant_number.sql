-- Add merchant_number column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS merchant_number INTEGER UNIQUE;

-- Create a sequence for merchant numbers starting from 1000
CREATE SEQUENCE IF NOT EXISTS merchant_number_seq START 1000;

-- Create a function to generate the next merchant number
CREATE OR REPLACE FUNCTION generate_merchant_number()
RETURNS INTEGER AS $$
BEGIN
    RETURN nextval('merchant_number_seq');
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to auto-assign merchant number on insert
CREATE OR REPLACE FUNCTION assign_merchant_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.merchant_number IS NULL THEN
        NEW.merchant_number := generate_merchant_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS trigger_assign_merchant_number ON profiles;
CREATE TRIGGER trigger_assign_merchant_number
    BEFORE INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION assign_merchant_number();