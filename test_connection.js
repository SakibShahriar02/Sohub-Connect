// Test Supabase Connection
// Run with: node test_connection.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://202.59.208.113:8000'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzYwODEwNDAwLCJleHAiOjE5MTg1NzY4MDB9._MBk9fPzT0YY3U-Ivk2FvazD06YTkkVjTPXFNJqbdns'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1)
    
    if (error) {
      console.error('Connection Error:', error.message)
      console.error('Error Details:', error)
    } else {
      console.log('✅ Connection successful!')
      console.log('Data:', data)
    }
    
    // Test auth
    const { data: authData, error: authError } = await supabase.auth.getSession()
    console.log('Auth test:', authError ? authError.message : 'Auth working')
    
  } catch (err) {
    console.error('Network Error:', err.message)
  }
}

testConnection()