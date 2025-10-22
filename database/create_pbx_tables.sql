-- Create pbx_extensions table
CREATE TABLE IF NOT EXISTS pbx_extensions (
  id SERIAL PRIMARY KEY,
  date_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tech VARCHAR(50) DEFAULT 'pjsip',
  extension_code VARCHAR(20),
  extension_no VARCHAR(10),
  display_name VARCHAR(255),
  callerid INTEGER,
  extension_pass VARCHAR(50),
  status VARCHAR(20) DEFAULT 'Active',
  billing_date_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assign_to UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (assign_to) REFERENCES profiles(id)
);

-- Create vb_callerid table for caller IDs
CREATE TABLE IF NOT EXISTS vb_callerid (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  caller_id VARCHAR(20),
  description VARCHAR(255),
  channels INTEGER DEFAULT 1,
  assign_to UUID,
  status VARCHAR(20) DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (assign_to) REFERENCES profiles(id)
);

-- Insert sample caller IDs (replace with actual UUID from profiles table)
-- INSERT INTO vb_callerid (name, caller_id, description, channels, assign_to) VALUES 
-- ('Main Line', '01700000000', 'Default Caller ID', 2, 'actual-uuid-here'),
-- ('Support Line', '01800000000', 'Secondary Caller ID', 1, 'actual-uuid-here')
-- ON CONFLICT DO NOTHING;