import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface SoundFile {
  id: number;
  sound_name: string;
  file_name: string;
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
        .from('sound_files_local')
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

  const uploadSoundFile = async (file: File, soundData: Omit<SoundFile, 'id' | 'file_name' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Starting file upload...');
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload-sound', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const { fileName } = await response.json();
      console.log('File uploaded successfully:', fileName);

      console.log('Saving to Supabase...', { ...soundData, file_name: fileName });
      const { data, error } = await supabase
        .from('sound_files_local')
        .insert([{
          ...soundData,
          file_name: fileName
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Saved to Supabase successfully:', data);
      setSoundFiles(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error uploading sound file:', error);
      throw error;
    }
  };

  const updateSoundFile = async (id: number, updates: Partial<SoundFile>, newFile?: File) => {
    try {
      let fileName = updates.file_name;

      if (newFile) {
        const oldSoundFile = soundFiles.find(sf => sf.id === id);
        
        const formData = new FormData();
        formData.append('file', newFile);
        
        const response = await fetch('/api/upload-sound', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) throw new Error('Upload failed');
        
        const result = await response.json();
        fileName = result.fileName;
        
        // Delete old file
        if (oldSoundFile?.file_name) {
          await fetch(`/api/delete-sound/${oldSoundFile.file_name}`, {
            method: 'DELETE',
          });
        }
      }

      const { data, error } = await supabase
        .from('sound_files_local')
        .update({
          ...updates,
          ...(newFile && { file_name: fileName }),
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
      const soundFile = soundFiles.find(sf => sf.id === id);
      
      if (soundFile?.file_name) {
        await fetch(`/api/delete-sound/${soundFile.file_name}`, {
          method: 'DELETE',
        });
      }

      const { error } = await supabase
        .from('sound_files_local')
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

  const getFileUrl = (fileName: string) => {
    return `/uploads/soundfiles/${fileName}`;
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
    getFileUrl,
    refetch: fetchSoundFiles
  };
};