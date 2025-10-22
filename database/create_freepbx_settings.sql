-- Add FreePBX settings columns to global_settings table
ALTER TABLE global_settings 
ADD COLUMN IF NOT EXISTS freepbx_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS freepbx_token_url VARCHAR(255) DEFAULT 'https://voice.tolpar.com.bd/admin/api/api/token',
ADD COLUMN IF NOT EXISTS freepbx_graphql_url VARCHAR(255) DEFAULT 'https://voice.tolpar.com.bd/admin/api/api/gql',
ADD COLUMN IF NOT EXISTS freepbx_rest_url VARCHAR(255) DEFAULT 'https://voice.tolpar.com.bd/admin/api/api/rest',
ADD COLUMN IF NOT EXISTS freepbx_client_id VARCHAR(255) DEFAULT 'e76bdc5ea8c9b588ec0ce3a796bfb52e83a3a4925a6fb4f2935815ac05575c91',
ADD COLUMN IF NOT EXISTS freepbx_client_secret VARCHAR(255) DEFAULT '9afa837ebb1523b6a15437181f04aebb';

-- Update existing record with default values
UPDATE global_settings SET 
  freepbx_enabled = COALESCE(freepbx_enabled, true),
  freepbx_token_url = COALESCE(freepbx_token_url, 'https://voice.tolpar.com.bd/admin/api/api/token'),
  freepbx_graphql_url = COALESCE(freepbx_graphql_url, 'https://voice.tolpar.com.bd/admin/api/api/gql'),
  freepbx_rest_url = COALESCE(freepbx_rest_url, 'https://voice.tolpar.com.bd/admin/api/api/rest'),
  freepbx_client_id = COALESCE(freepbx_client_id, 'e76bdc5ea8c9b588ec0ce3a796bfb52e83a3a4925a6fb4f2935815ac05575c91'),
  freepbx_client_secret = COALESCE(freepbx_client_secret, '9afa837ebb1523b6a15437181f04aebb')
WHERE id = 1;