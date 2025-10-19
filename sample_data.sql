-- Sample Data for SOHUB Connect
-- Run this AFTER running database_schema.sql

-- Insert ticket types
INSERT INTO ticket_types (name, description, color) VALUES
('Technical Support', 'Technical issues and system problems', '#EF4444'),
('Billing', 'Billing and payment related queries', '#F59E0B'),
('General Inquiry', 'General questions and information requests', '#3B82F6'),
('Feature Request', 'New feature requests and suggestions', '#10B981'),
('Bug Report', 'Software bugs and issues', '#8B5CF6')
ON CONFLICT (name) DO NOTHING;

-- Create Super Admin user (you need to sign up first with this email)
-- Email: admin@sohub.com
-- Password: Admin@123456

-- After signing up, run this to update the profile to Super Admin
-- Note: Replace the UUID with the actual user ID from auth.users table
INSERT INTO profiles (id, email, full_name, role, department, designation, status)
SELECT 
  id,
  'admin@sohub.com',
  'Super Administrator',
  'Super Admin',
  'IT Department',
  'System Administrator',
  'Active'
FROM auth.users 
WHERE email = 'admin@sohub.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'Super Admin',
  full_name = 'Super Administrator',
  department = 'IT Department',
  designation = 'System Administrator',
  status = 'Active';

-- Insert sample extensions
INSERT INTO extensions (display_name, extension_code, extension_no, extension_pass, assign_to, callerid, created_by) 
SELECT 
  'Reception Desk',
  'EXT001',
  '1001',
  'ext1001',
  'Reception',
  'Reception <1001>',
  p.id
FROM profiles p 
WHERE p.email = 'admin@sohub.com'
ON CONFLICT (extension_code) DO NOTHING;

INSERT INTO extensions (display_name, extension_code, extension_no, extension_pass, assign_to, callerid, created_by) 
SELECT 
  'Sales Department',
  'EXT002',
  '1002',
  'ext1002',
  'Sales',
  'Sales <1002>',
  p.id
FROM profiles p 
WHERE p.email = 'admin@sohub.com'
ON CONFLICT (extension_code) DO NOTHING;

INSERT INTO extensions (display_name, extension_code, extension_no, extension_pass, assign_to, callerid, created_by) 
SELECT 
  'Support Team',
  'EXT003',
  '1003',
  'ext1003',
  'Support',
  'Support <1003>',
  p.id
FROM profiles p 
WHERE p.email = 'admin@sohub.com'
ON CONFLICT (extension_code) DO NOTHING;

-- Insert sample ring group
INSERT INTO ring_groups (name, description, strategy, timeout, created_by)
SELECT 
  'Sales Team',
  'All sales representatives',
  'ring_all',
  30,
  p.id
FROM profiles p 
WHERE p.email = 'admin@sohub.com';

-- Insert sample IVR menu
INSERT INTO ivr_menus (name, description, welcome_message, timeout, max_retries, created_by)
SELECT 
  'Main Menu',
  'Primary IVR menu for incoming calls',
  'Welcome to SOHUB Connect. Press 1 for Sales, Press 2 for Support, Press 0 for Reception.',
  10,
  3,
  p.id
FROM profiles p 
WHERE p.email = 'admin@sohub.com';

-- Insert sample tickets
INSERT INTO tickets (unique_id, ticket_type_id, title, description, comment, status, priority, created_by) 
SELECT 
  'TKT-2024-001',
  tt.id,
  'System Setup Complete',
  'Initial system setup and configuration completed successfully',
  'All basic configurations are in place',
  'Resolved',
  'Medium',
  p.id
FROM profiles p, ticket_types tt
WHERE p.email = 'admin@sohub.com' AND tt.name = 'Technical Support';

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type)
SELECT 
  p.id,
  'Welcome to SOHUB Connect',
  'Your account has been set up successfully. You can now start managing your communication system.',
  'success'
FROM profiles p 
WHERE p.email = 'admin@sohub.com';

INSERT INTO notifications (user_id, title, message, type)
SELECT 
  p.id,
  'System Ready',
  'All extensions and configurations are ready for use.',
  'info'
FROM profiles p 
WHERE p.email = 'admin@sohub.com';