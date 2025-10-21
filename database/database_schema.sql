-- SOHUB Connect Database Schema (Drop & Recreate)
-- Run this in Supabase SQL Editor

-- =========================
-- DROP TABLES (if exists)
-- =========================
DROP TABLE IF EXISTS text_to_speech CASCADE;
DROP TABLE IF EXISTS caller_ids CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS ivr_options CASCADE;
DROP TABLE IF EXISTS ivr_menus CASCADE;
DROP TABLE IF EXISTS ring_group_members CASCADE;
DROP TABLE IF EXISTS ring_groups CASCADE;
DROP TABLE IF EXISTS call_logs CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS ticket_types CASCADE;
DROP TABLE IF EXISTS extensions CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- =========================
-- CREATE TABLES
-- =========================

-- Profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'User' CHECK (role IN ('Super Admin', 'Admin', 'Manager', 'User')),
  department TEXT,
  designation TEXT,
  phone TEXT,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Extensions
CREATE TABLE extensions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  display_name TEXT NOT NULL,
  extension_code TEXT UNIQUE NOT NULL,
  extension_no TEXT UNIQUE NOT NULL,
  extension_pass TEXT NOT NULL,
  assign_to TEXT,
  callerid TEXT,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ticket Types
CREATE TABLE ticket_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tickets
CREATE TABLE tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  unique_id TEXT UNIQUE NOT NULL,
  ticket_type_id UUID REFERENCES ticket_types(id),
  title TEXT NOT NULL,
  description TEXT,
  comment TEXT,
  status TEXT DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Closed')),
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
  assigned_to UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Call Logs
CREATE TABLE call_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  caller_id TEXT,
  callee_id TEXT,
  extension_id UUID REFERENCES extensions(id),
  call_type TEXT CHECK (call_type IN ('Inbound', 'Outbound', 'Internal')),
  duration INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('Answered', 'Missed', 'Busy', 'Failed')),
  recording_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ring Groups
CREATE TABLE ring_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  strategy TEXT DEFAULT 'ring_all' CHECK (strategy IN ('ring_all', 'round_robin', 'sequential')),
  timeout INTEGER DEFAULT 30,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ring Group Members
CREATE TABLE ring_group_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ring_group_id UUID REFERENCES ring_groups(id) ON DELETE CASCADE,
  extension_id UUID REFERENCES extensions(id) ON DELETE CASCADE,
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(ring_group_id, extension_id)
);

-- IVR Menus
CREATE TABLE ivr_menus (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  welcome_message TEXT,
  timeout INTEGER DEFAULT 10,
  max_retries INTEGER DEFAULT 3,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- IVR Options
CREATE TABLE ivr_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ivr_menu_id UUID REFERENCES ivr_menus(id) ON DELETE CASCADE,
  digit TEXT NOT NULL,
  action_type TEXT CHECK (action_type IN ('transfer_extension', 'transfer_external', 'play_message', 'hangup')),
  action_value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(ivr_menu_id, digit)
);

-- Notifications
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Caller IDs
CREATE TABLE caller_ids (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  caller_id TEXT UNIQUE NOT NULL,
  channels INTEGER DEFAULT 1,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  assigned_to UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Text to Speech
CREATE TABLE text_to_speech (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tts_name TEXT NOT NULL,
  tts_text TEXT NOT NULL,
  tts_language TEXT DEFAULT 'English (US)',
  assign_to TEXT,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================
-- Enable RLS
-- =========================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE extensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ring_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE ring_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE ivr_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE ivr_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE caller_ids ENABLE ROW LEVEL SECURITY;
ALTER TABLE text_to_speech ENABLE ROW LEVEL SECURITY;

-- =========================
-- RLS Policies
-- =========================
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('Super Admin', 'Admin'))
);

CREATE POLICY "Users can view extensions" ON extensions FOR SELECT USING (true);
CREATE POLICY "Admins can manage extensions" ON extensions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('Super Admin', 'Admin'))
);

CREATE POLICY "Users can view own tickets" ON tickets FOR SELECT USING (
  created_by = auth.uid() OR assigned_to = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('Super Admin', 'Admin'))
);

CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can view caller ids" ON caller_ids FOR SELECT USING (true);
CREATE POLICY "Admins can manage caller ids" ON caller_ids FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('Super Admin', 'Admin'))
);

CREATE POLICY "Users can view tts" ON text_to_speech FOR SELECT USING (true);
CREATE POLICY "Admins can manage tts" ON text_to_speech FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('Super Admin', 'Admin'))
);

-- =========================
-- Trigger Functions
-- =========================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_extensions_updated_at BEFORE UPDATE ON extensions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_caller_ids_updated_at BEFORE UPDATE ON caller_ids FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_text_to_speech_updated_at BEFORE UPDATE ON text_to_speech FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================
-- Drop existing trigger & function (safe rerun)
-- =========================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- =========================
-- Handle New User Trigger
-- =========================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
