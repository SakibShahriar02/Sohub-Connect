import { useAuth } from '../context/AuthContext';

interface PermissionGuardProps {
  children: React.ReactNode;
  requireSuperAdmin?: boolean;
  allowedRoles?: string[];
  fallback?: React.ReactNode;
}

export default function PermissionGuard({ 
  children, 
  requireSuperAdmin = false, 
  allowedRoles = [], 
  fallback = null 
}: PermissionGuardProps) {
  const { profile, isSuperAdmin } = useAuth();

  // Super Admin can access everything
  if (isSuperAdmin) {
    return <>{children}</>;
  }

  // Check if super admin is required
  if (requireSuperAdmin) {
    return <>{fallback}</>;
  }

  // Check allowed roles
  if (allowedRoles.length > 0 && profile && !allowedRoles.includes(profile.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}