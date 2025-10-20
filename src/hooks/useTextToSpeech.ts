import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface TTS {
  id: string;
  tts_name: string;
  tts_text: string;
  tts_language: string;
  assign_to: string | null;
  status: 'Active' | 'Inactive';
  created_at: string;
}

export function useTextToSpeech() {
  const [ttsList, setTtsList] = useState<TTS[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTTS = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('text_to_speech')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTtsList(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch TTS');
    } finally {
      setLoading(false);
    }
  };

  const addTTS = async (tts: Omit<TTS, 'id' | 'created_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('text_to_speech')
        .insert([{ ...tts, created_by: user?.id }])
        .select()
        .single();

      if (error) throw error;
      setTtsList(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add TTS');
    }
  };

  const updateTTS = async (id: string, updates: Partial<Omit<TTS, 'id' | 'created_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('text_to_speech')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTtsList(prev => prev.map(tts => tts.id === id ? data : tts));
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update TTS');
    }
  };

  const deleteTTS = async (id: string) => {
    try {
      const { error } = await supabase
        .from('text_to_speech')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTtsList(prev => prev.filter(tts => tts.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete TTS');
    }
  };

  const getTTSById = useCallback(async (id: string): Promise<TTS | null> => {
    try {
      const { data, error } = await supabase
        .from('text_to_speech')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Failed to fetch TTS:', err);
      return null;
    }
  }, []);

  useEffect(() => {
    fetchTTS();
  }, []);

  return {
    ttsList,
    loading,
    error,
    addTTS,
    updateTTS,
    deleteTTS,
    getTTSById,
    refetch: fetchTTS
  };
}