import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface Extension {
  id: string
  display_name: string
  extension_code: string
  extension_no: string
  extension_pass: string
  assign_to: string
  callerid: string
  status: string
  created_at: string
}

export const useExtensions = () => {
  const [extensions, setExtensions] = useState<Extension[]>([])
  const [loading, setLoading] = useState(true)

  const fetchExtensions = async () => {
    try {
      const { data, error } = await supabase
        .from('extensions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setExtensions(data || [])
    } catch (error) {
      console.error('Error fetching extensions:', error)
    } finally {
      setLoading(false)
    }
  }

  const addExtension = async (extension: Omit<Extension, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('extensions')
        .insert([extension])
        .select()

      if (error) throw error
      if (data) setExtensions(prev => [data[0], ...prev])
      return { success: true }
    } catch (error) {
      console.error('Error adding extension:', error)
      return { success: false, error }
    }
  }

  const updateExtension = async (id: string, updates: Partial<Extension>) => {
    try {
      const { data, error } = await supabase
        .from('extensions')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      if (data) {
        setExtensions(prev => prev.map(ext => ext.id === id ? data[0] : ext))
      }
      return { success: true }
    } catch (error) {
      console.error('Error updating extension:', error)
      return { success: false, error }
    }
  }

  const deleteExtension = async (id: string) => {
    try {
      const { error } = await supabase
        .from('extensions')
        .delete()
        .eq('id', id)

      if (error) throw error
      setExtensions(prev => prev.filter(ext => ext.id !== id))
      return { success: true }
    } catch (error) {
      console.error('Error deleting extension:', error)
      return { success: false, error }
    }
  }

  useEffect(() => {
    fetchExtensions()
  }, [])

  return {
    extensions,
    loading,
    addExtension,
    updateExtension,
    deleteExtension,
    refetch: fetchExtensions
  }
}