import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router'

export default function RoleBasedRedirect() {
  const { profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!profile) {
    return <Navigate to="/signin" replace />
  }

  return <Navigate to="/dashboard" replace />
}