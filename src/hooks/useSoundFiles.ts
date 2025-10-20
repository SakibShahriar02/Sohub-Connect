import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface SoundFile {
  id: number;
  sound_name: string;
  file_name: string;
  file_url: string;
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
        .from('sound_files')
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

  const uploadSoundFile = async (file: File, soundData: Omit<SoundFile, 'id' | 'file_url' | 'created_at' | 'updated_at'>) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `sound-files/${Date.now()}.${fileExt}`;
      
      // Try to upload to avatars bucket first, then create sound-files bucket if needed
      let uploadError;
      let publicUrl;
      
      try {
        const { error } = await supabase.storage
          .from('avatars')
          .upload(fileName, file);
        
        if (error) throw error;
        
        const { data: { publicUrl: url } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
          
        publicUrl = url;
      } catch (err) {
        // If avatars bucket fails, try to create and use sound-files bucket
        try {
          await supabase.storage.createBucket('sound-files', { public: true });
          
          const { error } = await supabase.storage
            .from('sound-files')
            .upload(fileName.replace('sound-files/', ''), file);
            
          if (error) throw error;
          
          const { data: { publicUrl: url } } = supabase.storage
            .from('sound-files')
            .getPublicUrl(fileName.replace('sound-files/', ''));
            
          publicUrl = url;
        } catch (createErr) {
          throw new Error('Unable to upload file. Please contact administrator.');
        }
      }

      const { data, error } = await supabase
        .from('sound_files')
        .insert([{
          ...soundData,
          file_name: fileName,
          file_url: publicUrl
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
      let fileUrl = updates.file_url;
      let fileName = updates.file_name;

      if (newFile) {
        const fileExt = newFile.name.split('.').pop();
        fileName = `sound-files/${Date.now()}.${fileExt}`;
        
        try {
          const { error } = await supabase.storage
            .from('avatars')
            .upload(fileName, newFile);
            
          if (error) throw error;
          
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);
            
          fileUrl = publicUrl;
        } catch (err) {
          try {
            const { error } = await supabase.storage
              .from('sound-files')
              .upload(fileName.replace('sound-files/', ''), newFile);
              
            if (error) throw error;
            
            const { data: { publicUrl } } = supabase.storage
              .from('sound-files')
              .getPublicUrl(fileName.replace('sound-files/', ''));
              
            fileUrl = publicUrl;
          } catch (createErr) {
            throw new Error('Unable to upload file. Please contact administrator.');
          }
        }
      }

      const { data, error } = await supabase
        .from('sound_files')
        .update({
          ...updates,
          ...(newFile && { file_name: fileName, file_url: fileUrl }),
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
        try {
          await supabase.storage
            .from('avatars')
            .remove([soundFile.file_name]);
        } catch {
          try {
            await supabase.storage
              .from('sound-files')
              .remove([soundFile.file_name.replace('sound-files/', '')]);
          } catch {
            // Ignore storage deletion errors
          }
        }
      }

      const { error } = await supabase
        .from('sound_files')
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