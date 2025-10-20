import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface SoundFile {
  id: number;
  sound_name: string;
  file_name: string;
  file_data: string; // base64 encoded audio data
  status: 'Active' | 'Inactive';
  assign_to: string;
  created_at: string;
  updated_at: string;
}

export const useSoundFiles = () => {
  const [soundFiles, setSoundFiles] = useState<SoundFile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSoundFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('sound_files_simple')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSoundFiles(data || []);
    } catch (error) {
      console.error('Error fetching sound files:', error);
    } finally {
      setLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const uploadSoundFile = async (file: File, soundData: Omit<SoundFile, 'id' | 'file_data' | 'created_at' | 'updated_at'>) => {
    try {
      const fileData = await fileToBase64(file);

      const { data, error } = await supabase
        .from('sound_files_simple')
        .insert([{
          ...soundData,
          file_data: fileData
        }])
        .select()
        .single();

      if (error) throw error;
      
      setSoundFiles(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error uploading sound file:', error);
      throw error;
    }
  };

  const updateSoundFile = async (id: number, updates: Partial<SoundFile>, newFile?: File) => {
    try {
      let updateData = { ...updates };

      if (newFile) {
        const fileData = await fileToBase64(newFile);
        updateData = {
          ...updateData,
          file_name: newFile.name,
          file_data: fileData
        };
      }

      const { data, error } = await supabase
        .from('sound_files_simple')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setSoundFiles(prev => prev.map(sf => sf.id === id ? data : sf));
      return data;
    } catch (error) {
      console.error('Error updating sound file:', error);
      throw error;
    }
  };

  const deleteSoundFile = async (id: number) => {
    try {
      const { error } = await supabase
        .from('sound_files_simple')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setSoundFiles(prev => prev.filter(sf => sf.id !== id));
    } catch (error) {
      console.error('Error deleting sound file:', error);
      throw error;
    }
  };

  const getSoundFile = (id: number) => {
    return soundFiles.find(sf => sf.id === id);
  };

  useEffect(() => {
    fetchSoundFiles();
  }, []);

  return {
    soundFiles,
    loading,
    uploadSoundFile,
    updateSoundFile,
    deleteSoundFile,
    getSoundFile,
    refetch: fetchSoundFiles
  };
};