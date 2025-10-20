import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface CallerId {
  id: string
  name: string
  caller_id: string
  channels: number
  status: string
  assigned_to: string | null
  created_at: string
}

export const useCallerIds = () => {
  const [callerIds, setCallerIds] = useState<CallerId[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCallerIds = async () => {
    try {
      const { data, error } = await supabase
        .from('caller_ids')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCallerIds(data || [])
    } catch (error) {
      console.error('Error fetching caller IDs:', error)
    } finally {
      setLoading(false)
    }
  }

  const addCallerId = async (callerId: Omit<CallerId, 'id' | 'created_at'> & { created_by?: string | null }) => {
    try {
      const { data, error } = await supabase
        .from('caller_ids')
        .insert([{
          name: callerId.name,
          caller_id: callerId.caller_id,
          channels: callerId.channels || 1,
          status: callerId.status || 'Active',
          created_by: callerId.created_by || null
        }])
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      if (data && data.length > 0) {
        setCallerIds(prev => [data[0], ...prev])
        return { success: true }
      }
      return { success: false, error: 'No data returned' }
    } catch (error) {
      console.error('Error adding caller ID:', error)
      return { success: false, error }
    }
  }

  const updateCallerId = async (id: string, updates: Partial<CallerId>) => {
    try {
      const { data, error } = await supabase
        .from('caller_ids')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      if (data) {
        setCallerIds(prev => prev.map(cid => cid.id === id ? data[0] : cid))
      }
      return { success: true }
    } catch (error) {
      console.error('Error updating caller ID:', error)
      return { success: false, error }
    }
  }

  const deleteCallerId = async (id: string) => {
    try {
      const { error } = await supabase
        .from('caller_ids')
        .delete()
        .eq('id', id)

      if (error) throw error
      setCallerIds(prev => prev.filter(cid => cid.id !== id))
      return { success: true }
    } catch (error) {
      console.error('Error deleting caller ID:', error)
      return { success: false, error }
    }
  }

  useEffect(() => {
    fetchCallerIds()
  }, [])

  return {
    callerIds,
    loading,
    addCallerId,
    updateCallerId,
    deleteCallerId,
    refetch: fetchCallerIds
  }
}