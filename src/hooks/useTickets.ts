import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface Ticket {
  id: string
  unique_id: string
  ticket_type_id: string
  title: string
  description: string
  comment: string
  status: string
  priority: string
  assigned_to?: string
  created_by: string
  created_at: string
  ticket_types?: { name: string; color: string }
  profiles?: { full_name: string }
}

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          ticket_types(name, color),
          profiles(full_name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTickets(data || [])
    } catch (error) {
      console.error('Error fetching tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTicket = async (ticket: Omit<Ticket, 'id' | 'created_at' | 'unique_id'>) => {
    try {
      const uniqueId = `TKT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
      
      const { data, error } = await supabase
        .from('tickets')
        .insert([{ ...ticket, unique_id: uniqueId }])
        .select(`
          *,
          ticket_types(name, color),
          profiles(full_name)
        `)

      if (error) throw error
      if (data) setTickets(prev => [data[0], ...prev])
      return { success: true }
    } catch (error) {
      console.error('Error adding ticket:', error)
      return { success: false, error }
    }
  }

  const updateTicket = async (id: string, updates: Partial<Ticket>) => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          ticket_types(name, color),
          profiles(full_name)
        `)

      if (error) throw error
      if (data) {
        setTickets(prev => prev.map(ticket => ticket.id === id ? data[0] : ticket))
      }
      return { success: true }
    } catch (error) {
      console.error('Error updating ticket:', error)
      return { success: false, error }
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  return {
    tickets,
    loading,
    addTicket,
    updateTicket,
    refetch: fetchTickets
  }
}