-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    module VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
    id SERIAL PRIMARY KEY,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(role_id, permission_id)
);

-- Update profiles table to use role_id instead of role text
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role_id INTEGER REFERENCES roles(id);

-- Insert default roles
INSERT INTO roles (name, description) VALUES
('Super Admin', 'Full system access'),
('Admin', 'Administrative access'),
('Manager', 'Management level access'),
('User', 'Basic user access')
ON CONFLICT (name) DO NOTHING;

-- Insert permissions
INSERT INTO permissions (name, description, module) VALUES
('user.create', 'Create users', 'user_management'),
('user.read', 'View users', 'user_management'),
('user.update', 'Update users', 'user_management'),
('user.delete', 'Delete users', 'user_management'),
('sound_files.create', 'Upload sound files', 'voice'),
('sound_files.read', 'View sound files', 'voice'),
('sound_files.update', 'Update sound files', 'voice'),
('sound_files.delete', 'Delete sound files', 'voice'),
('extensions.create', 'Create extensions', 'pbx'),
('extensions.read', 'View extensions', 'pbx'),
('extensions.update', 'Update extensions', 'pbx'),
('extensions.delete', 'Delete extensions', 'pbx'),
('reports.read', 'View reports', 'reports'),
('settings.update', 'Modify settings', 'settings')
ON CONFLICT (name) DO NOTHING;

-- Assign permissions to Super Admin (all permissions)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'Super Admin'
ON CONFLICT DO NOTHING;

-- Assign permissions to Admin (most permissions except user management)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'Admin' 
AND p.name NOT IN ('user.create', 'user.delete', 'settings.update')
ON CONFLICT DO NOTHING;

-- Assign permissions to Manager (read/update only)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'Manager' 
AND p.name LIKE '%.read' OR p.name LIKE '%.update'
ON CONFLICT DO NOTHING;

-- Assign permissions to User (read only)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'User' 
AND p.name LIKE '%.read'
ON CONFLICT DO NOTHING;