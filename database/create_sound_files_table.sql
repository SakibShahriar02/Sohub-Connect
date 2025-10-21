-- Create sound_files table
CREATE TABLE IF NOT EXISTS sound_files (
    id SERIAL PRIMARY KEY,
    sound_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    assign_to VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for sound files (run this in Supabase dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('sound-files', 'sound-files', true);

-- Enable RLS
ALTER TABLE sound_files ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view sound files" ON sound_files FOR SELECT USING (true);
CREATE POLICY "Users can insert sound files" ON sound_files FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update sound files" ON sound_files FOR UPDATE USING (true);
CREATE POLICY "Users can delete sound files" ON sound_files FOR DELETE USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sound_files_updated_at 
    BEFORE UPDATE ON sound_files 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();