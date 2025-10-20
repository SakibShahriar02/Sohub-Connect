-- Create sound_files_simple table (stores audio as base64)
CREATE TABLE IF NOT EXISTS sound_files_simple (
    id SERIAL PRIMARY KEY,
    sound_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_data TEXT NOT NULL, -- base64 encoded audio data
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    assign_to VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE sound_files_simple ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view sound files" ON sound_files_simple FOR SELECT USING (true);
CREATE POLICY "Users can insert sound files" ON sound_files_simple FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update sound files" ON sound_files_simple FOR UPDATE USING (true);
CREATE POLICY "Users can delete sound files" ON sound_files_simple FOR DELETE USING (true);

-- Create updated_at trigger
CREATE TRIGGER update_sound_files_simple_updated_at 
    BEFORE UPDATE ON sound_files_simple 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();