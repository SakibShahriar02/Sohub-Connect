-- Create profiles for existing auth users
INSERT INTO profiles (id, user_id, name, email, role, status)
SELECT 
  u.id,
  'USR' || LPAD((ROW_NUMBER() OVER (ORDER BY u.created_at))::text, 3, '0'),
  COALESCE(u.raw_user_meta_data->>'name', 'User'),
  u.email,
  CASE 
    WHEN u.email = 'admin@sohub.com.bd' THEN 'Super Admin'
    ELSE 'Viewer'
  END,
  'Active'
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = u.id);