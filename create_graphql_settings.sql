-- Create freepbx_settings table for GraphQL configuration
CREATE TABLE IF NOT EXISTS freepbx_settings (
    id SERIAL PRIMARY KEY,
    token_url TEXT DEFAULT 'http://localhost/admin/api/api/token',
    gql_url TEXT DEFAULT 'http://127.0.0.1/admin/api/api/gql',
    client_id TEXT DEFAULT 'a64ae3de81d8f1f2196df3b88bc3fc3186d495614d83328d9c3823183d185a32',
    client_secret TEXT DEFAULT 'f479509a48bfdbea86768fce8ed5c720',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default configuration
INSERT INTO freepbx_settings (token_url, gql_url, client_id, client_secret) 
VALUES (
    'http://localhost/admin/api/api/token',
    'http://127.0.0.1/admin/api/api/gql',
    'a64ae3de81d8f1f2196df3b88bc3fc3186d495614d83328d9c3823183d185a32',
    'f479509a48bfdbea86768fce8ed5c720'
) ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE freepbx_settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON freepbx_settings
    FOR ALL USING (auth.role() = 'authenticated');