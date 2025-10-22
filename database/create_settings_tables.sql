-- Create global_settings table
CREATE TABLE IF NOT EXISTS global_settings (
  id SERIAL PRIMARY KEY,
  system_name VARCHAR(255) DEFAULT 'SOHUB Connect',
  system_timezone VARCHAR(100) DEFAULT 'Asia/Dhaka',
  language VARCHAR(10) DEFAULT 'en',
  sip_domain VARCHAR(255) DEFAULT 'sip.sohub.com.bd',
  session_timeout INTEGER DEFAULT 30,
  password_policy VARCHAR(20) DEFAULT 'strong',
  two_factor_auth BOOLEAN DEFAULT false,
  currency VARCHAR(10) DEFAULT 'BDT',
  tax_rate DECIMAL(5,2) DEFAULT 15.00,
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  push_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email_config table
CREATE TABLE IF NOT EXISTS email_config (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255),
  protocol VARCHAR(255) NOT NULL DEFAULT 'smtp',
  smtp_host VARCHAR(255),
  smtp_user VARCHAR(255),
  smtp_pass VARCHAR(255),
  smtp_port VARCHAR(100) DEFAULT '587',
  smtp_encryption VARCHAR(10) DEFAULT 'tls',
  smtp_auth VARCHAR(10) NOT NULL DEFAULT 'true',
  branch_id INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create graphql_config table
CREATE TABLE IF NOT EXISTS graphql_config (
  id SERIAL PRIMARY KEY,
  endpoint VARCHAR(255) DEFAULT 'http://127.0.0.1/admin/api/api/gql',
  token_endpoint VARCHAR(255) DEFAULT 'http://localhost/admin/api/api/token',
  client_id VARCHAR(255) DEFAULT 'a64ae3de81d8f1f2196df3b88bc3fc3186d495614d83328d9c3823183d185a32',
  client_secret VARCHAR(255) DEFAULT 'f479509a48bfdbea86768fce8ed5c720',
  grant_type VARCHAR(50) DEFAULT 'client_credentials',
  scope VARCHAR(50) DEFAULT 'gql',
  timeout INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO global_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
INSERT INTO email_config (id, branch_id) VALUES (1, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO graphql_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;