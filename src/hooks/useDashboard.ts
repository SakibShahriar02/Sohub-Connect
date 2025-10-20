import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const useDashboard = () => {
  const [stats, setStats] = useState({
    totalExtensions: 0,
    activeExtensions: 0,
    totalTickets: 0,
    openTickets: 0,
    totalCalls: 0,
    answeredCalls: 0
  })
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      // Fetch extensions stats
      const { data: extensions } = await supabase
        .from('extensions')
        .select('status')

      const totalExtensions = extensions?.length || 0
      const activeExtensions = extensions?.filter(ext => ext.status === 'Active').length || 0

      // Fetch tickets stats
      const { data: tickets } = await supabase
        .from('tickets')
        .select('status')

      const totalTickets = tickets?.length || 0
      const openTickets = tickets?.filter(ticket => ticket.status === 'Open').length || 0

      // Fetch call logs stats
      const { data: calls } = await supabase
        .from('call_logs')
        .select('status')

      const totalCalls = calls?.length || 0
      const answeredCalls = calls?.filter(call => call.status === 'Answered').length || 0

      setStats({
        totalExtensions,
        activeExtensions,
        totalTickets,
        openTickets,
        totalCalls,
        answeredCalls
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return { stats, loading, refetch: fetchStats }
}