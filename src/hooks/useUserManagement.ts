import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { supabaseAdmin } from '../lib/supabaseAdmin';

export interface User {
  id: string;
  user_id: string;
  name?: string;
  full_name?: string;
  email: string;
  phone?: string;
  mobileno?: string;
  address?: string;
  profile_picture?: string;
  nid_front?: string;
  nid_back?: string;
  certificate?: string;
  merchant_number?: number;
  role: string;
  role_id: number;
  status: 'Active' | 'Inactive' | 'Suspended';
  created_at: string;
  updated_at: string;
}

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users from profiles table...');
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id, user_id, name, full_name, email, phone, mobileno, address, 
          profile_picture, nid_front, nid_back, certificate, merchant_number,
          role_id, status, created_at, updated_at,
          roles (name)
        `);

      console.log('Supabase response:', { data, error });
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      const usersWithRoles = data?.map(user => ({
        ...user,
        role: user.roles?.name || 'No Role'
      })) || [];
      
      console.log('Users fetched:', usersWithRoles.length);
      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateUserId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `USR${timestamp}${random}`;
  };

  const generateMerchantNumber = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('merchant_number')
      .not('merchant_number', 'is', null)
      .order('merchant_number', { ascending: false })
      .limit(1)
      .single();
    
    return data?.merchant_number ? data.merchant_number + 1 : 1000;
  };

  const createUser = async (userData: Omit<User, 'id' | 'user_id' | 'created_at' | 'updated_at'>, password: string) => {
    try {
      // Check if user already exists in profiles
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', userData.email)
        .single();
      
      if (existingProfile) {
        throw new Error('A user with this email already exists');
      }

      // Create user in auth.users first
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: userData.email,
        password: password,
        email_confirm: true
      });

      if (authError) throw authError;

      const userId = generateUserId();
      const merchantNumber = await generateMerchantNumber();

      // Use upsert to handle potential duplicate IDs
      const { data, error } = await supabase
        .from('profiles')
        .upsert([{
          id: authData.user.id,
          user_id: userId,
          name: userData.name,
          full_name: userData.name,
          email: userData.email,
          phone: userData.mobileno,
          mobileno: userData.mobileno,
          address: userData.address,
          profile_picture: userData.profile_picture,
          nid_front: userData.nid_front,
          nid_back: userData.nid_back,
          certificate: userData.certificate,
          merchant_number: merchantNumber,
          role_id: userData.role_id,
          status: userData.status
        }], { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        // Rollback auth user if profile creation fails
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        throw error;
      }
      
      setUsers(prev => [data, ...prev]);
      return data;
    } catch (error: any) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setUsers(prev => prev.map(user => user.id === id ? data : user));
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const user = users.find(u => u.id === id);
      
      // Delete user files
      if (user) {
        const filesToDelete = [
          user.profile_picture,
          user.nid_front,
          user.nid_back,
          user.certificate
        ].filter(Boolean);

        for (const fileName of filesToDelete) {
          try {
            // Try both image and document paths
            await fetch(`/uploads/images/${fileName}`, { method: 'DELETE' });
          } catch {
            try {
              await fetch(`/uploads/documents/${fileName}`, { method: 'DELETE' });
            } catch (error) {
              console.warn('Failed to delete file:', fileName, error);
            }
          }
        }
      }

      // Delete from auth.users
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
      if (authError) throw authError;

      // Delete from profiles
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  const getUser = (id: string) => {
    return users.find(user => user.id === id);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    createUser,
    updateUser,
    deleteUser,
    getUser,
    refetch: fetchUsers
  };
};