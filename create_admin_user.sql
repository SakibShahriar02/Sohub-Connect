-- Create Admin User Directly in Database
-- Run this in Supabase SQL Editor after running database_schema.sql

-- Insert admin user directly into auth.users table
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at,
  is_anonymous
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@sohub.com.bd',
  crypt('passw0rd', gen_salt('bf')),
  NOW(),
  NULL,
  '',
  NOW(),
  '',
  NULL,
  '',
  '',
  NULL,
  NULL,
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Super Administrator"}',
  true,
  NOW(),
  NOW(),
  NULL,
  NULL,
  '',
  '',
  NULL,
  '',
  0,
  NULL,
  '',
  NULL,
  false,
  NULL,
  false
);

-- Create profile for the admin user
INSERT INTO profiles (id, email, full_name, role, department, designation, status)
SELECT 
  id,
  'admin@sohub.com.bd',
  'Super Administrator',
  'Super Admin',
  'IT Department',
  'System Administrator',
  'Active'
FROM auth.users 
WHERE email = 'admin@sohub.com.bd'
ON CONFLICT (id) DO UPDATE SET
  role = 'Super Admin',
  full_name = 'Super Administrator',
  department = 'IT Department',
  designation = 'System Administrator',
  status = 'Active';