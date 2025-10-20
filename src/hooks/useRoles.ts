import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface Permission {
  id: number;
  name: string;
  description: string;
  module: string;
}

export const useRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');

      if (error) throw error;
      setRoles(data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('module, name');

      if (error) throw error;
      setPermissions(data || []);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  const getUserPermissions = async (roleId: number) => {
    try {
      const { data, error } = await supabase
        .from('role_permissions')
        .select(`
          permissions (
            id,
            name,
            description,
            module
          )
        `)
        .eq('role_id', roleId);

      if (error) throw error;
      return data?.map(rp => rp.permissions).flat() || [];
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      return [];
    }
  };

  const hasPermission = (userPermissions: Permission[], permission: string) => {
    return userPermissions.some(p => p.name === permission);
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchRoles(), fetchPermissions()]);
      setLoading(false);
    };
    loadData();
  }, []);

  return {
    roles,
    permissions,
    loading,
    getUserPermissions,
    hasPermission,
    refetch: () => Promise.all([fetchRoles(), fetchPermissions()])
  };
};