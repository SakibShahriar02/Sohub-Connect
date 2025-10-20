import { useState, useEffect } from 'react';
import PageMeta from '../../components/common/PageMeta';
import { showDeleteConfirmation } from '../../utils/deleteConfirmation';
import { useRoles } from '../../hooks/useRoles';
import { supabase } from '../../lib/supabase';
import Swal from 'sweetalert2';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  user_count: number;
  created_at: string;
  status: string;
}

export default function RolePermission() {
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions'>('roles');
  const { roles, permissions, loading } = useRoles();
  const [rolesWithPermissions, setRolesWithPermissions] = useState<any[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  useEffect(() => {
    const fetchRolesWithPermissions = async () => {
      try {
        // Fetch roles with permissions
        const { data: rolesData, error: rolesError } = await supabase
          .from('roles')
          .select(`
            *,
            role_permissions (
              permissions (
                id,
                name,
                description,
                module
              )
            )
          `);

        if (rolesError) throw rolesError;
        
        // Fetch user counts for each role
        const rolesWithCounts = await Promise.all(
          (rolesData || []).map(async (role) => {
            const { count, error: countError } = await supabase
              .from('profiles')
              .select('*', { count: 'exact', head: true })
              .eq('role_id', role.id);
            
            if (countError) console.error('Error counting users for role:', role.name, countError);
            
            return {
              ...role,
              permissions: role.role_permissions?.map((rp: any) => rp.permissions.id) || [],
              user_count: count || 0
            };
          })
        );
        
        setRolesWithPermissions(rolesWithCounts);
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchRolesWithPermissions();
  }, []);

  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });

  const handleDeleteRole = (role: any) => {
    showDeleteConfirmation({
      text: `Delete role "${role.name}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const { error } = await supabase
            .from('roles')
            .delete()
            .eq('id', role.id);
          
          if (error) throw error;
          
          // Refetch roles to update the list
          const { data: updatedRoles } = await supabase
            .from('roles')
            .select(`
              *,
              role_permissions (
                permissions (
                  id,
                  name,
                  description,
                  module
                )
              )
            `);
          
          const rolesWithCounts = await Promise.all(
            (updatedRoles || []).map(async (role) => {
              const { count } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('role_id', role.id);
              
              return {
                ...role,
                permissions: role.role_permissions?.map((rp: any) => rp.permissions.id) || [],
                user_count: count || 0
              };
            })
          );
          
          setRolesWithPermissions(rolesWithCounts);
          Swal.fire('Success', 'Role deleted successfully!', 'success');
        } catch (error) {
          Swal.fire('Error', 'Failed to delete role', 'error');
        }
      },
      successText: 'Role has been deleted successfully.'
    });
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsEditingRole(true);
  };

  const handleSaveRole = async () => {
    if (!selectedRole) return;
    
    try {
      // Update role basic info
      const { error: roleError } = await supabase
        .from('roles')
        .update({
          name: selectedRole.name,
          description: selectedRole.description
        })
        .eq('id', selectedRole.id);
      
      if (roleError) throw roleError;
      
      // Update permissions
      await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', selectedRole.id);
      
      const permissionIds = permissions
        .filter(p => selectedRole.permissions.includes(p.id))
        .map(p => ({ role_id: selectedRole.id, permission_id: p.id }));
      
      if (permissionIds.length > 0) {
        const { error: permError } = await supabase
          .from('role_permissions')
          .insert(permissionIds);
        
        if (permError) throw permError;
      }
      
      // Refetch roles to update user counts
      const { data: updatedRoles } = await supabase
        .from('roles')
        .select(`
          *,
          role_permissions (
            permissions (
              id,
              name,
              description,
              module
            )
          )
        `);
      
      const rolesWithCounts = await Promise.all(
        (updatedRoles || []).map(async (role) => {
          const { count } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('role_id', role.id);
          
          return {
            ...role,
            permissions: role.role_permissions?.map((rp: any) => rp.permissions.id) || [],
            user_count: count || 0
          };
        })
      );
      
      setRolesWithPermissions(rolesWithCounts);
      setIsEditingRole(false);
      setSelectedRole(null);
      Swal.fire('Success', 'Role updated successfully!', 'success');
    } catch (error) {
      Swal.fire('Error', 'Failed to update role', 'error');
    }
  };

  const handleAddRole = async () => {
    try {
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .insert([{
          name: newRole.name,
          description: newRole.description
        }])
        .select()
        .single();
      
      if (roleError) throw roleError;
      
      // Add permissions
      const permissionIds = permissions
        .filter(p => newRole.permissions.includes(p.id))
        .map(p => ({ role_id: roleData.id, permission_id: p.id }));
      
      if (permissionIds.length > 0) {
        const { error: permError } = await supabase
          .from('role_permissions')
          .insert(permissionIds);
        
        if (permError) throw permError;
      }
      
      // Refetch roles to update the list
      const { data: updatedRoles } = await supabase
        .from('roles')
        .select(`
          *,
          role_permissions (
            permissions (
              id,
              name,
              description,
              module
            )
          )
        `);
      
      const rolesWithCounts = await Promise.all(
        (updatedRoles || []).map(async (role) => {
          const { count } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('role_id', role.id);
          
          return {
            ...role,
            permissions: role.role_permissions?.map((rp: any) => rp.permissions.id) || [],
            user_count: count || 0
          };
        })
      );
      
      setRolesWithPermissions(rolesWithCounts);
      setIsAddingRole(false);
      setNewRole({ name: '', description: '', permissions: [] });
      Swal.fire('Success', 'Role created successfully!', 'success');
    } catch (error) {
      Swal.fire('Error', 'Failed to create role', 'error');
    }
  };

  const toggleNewRolePermission = (permissionId: string) => {
    const hasPermission = newRole.permissions.includes(permissionId);
    const updatedPermissions = hasPermission
      ? newRole.permissions.filter(p => p !== permissionId)
      : [...newRole.permissions, permissionId];
    
    setNewRole({
      ...newRole,
      permissions: updatedPermissions
    });
  };

  const togglePermission = (permissionId: string) => {
    if (selectedRole) {
      const hasPermission = selectedRole.permissions.includes(permissionId);
      const updatedPermissions = hasPermission
        ? selectedRole.permissions.filter(p => p !== permissionId)
        : [...selectedRole.permissions, permissionId];
      
      setSelectedRole({
        ...selectedRole,
        permissions: updatedPermissions
      });
    }
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, any[]>);

  if (loading || loadingRoles) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Role & Permissions | SOHUB Connect"
        description="Manage user roles and access permissions"
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Role & Permissions</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage user roles and access control</p>
              </div>
            </div>
            <button
              onClick={() => setIsAddingRole(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Role
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('roles')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'roles'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Roles
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'permissions'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Permissions
            </button>
          </nav>
        </div>

        {activeTab === 'roles' && (
          <div className={`${isEditingRole || isAddingRole ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : ''}`}>
            {/* Roles List */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Roles</h3>
                </div>
              </div>
              <div className={`divide-y divide-gray-200 dark:divide-gray-700 ${isEditingRole || isAddingRole ? 'max-h-96 overflow-y-auto' : ''}`}>
                {rolesWithPermissions.map((role) => (
                  <div key={role.id} className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                    selectedRole?.id === role.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : ''
                  }`} onClick={() => handleEditRole(role)}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{role.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{role.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {role.user_count} users
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {role.permissions.length} permissions
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditRole(role)}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200"
                          title="Edit Role"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteRole(role)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
                          title="Delete Role"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Role Form */}
            {isAddingRole && (
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Role</h3>
                  </div>
                  <button
                    onClick={() => setIsAddingRole(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role Name</label>
                    <input
                      type="text"
                      value={newRole.name}
                      onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      placeholder="Enter role name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                    <textarea
                      value={newRole.description}
                      onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      placeholder="Enter role description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Permissions</label>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                        <div key={category}>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">{category}</h4>
                          <div className="space-y-2 ml-4">
                            {categoryPermissions.map((permission) => (
                              <div key={permission.id} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={newRole.permissions.includes(permission.id)}
                                  onChange={() => toggleNewRolePermission(permission.id)}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <div className="ml-3">
                                  <label className="text-sm text-gray-700 dark:text-gray-300">{permission.name}</label>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{permission.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleAddRole}
                      disabled={!newRole.name.trim()}
                      className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Create Role
                    </button>
                    <button
                      onClick={() => setIsAddingRole(false)}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Role Editor */}
            {isEditingRole && selectedRole && (
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Role: {selectedRole.name}</h3>
                  </div>
                  <button
                    onClick={() => setIsEditingRole(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role Name</label>
                    <input
                      type="text"
                      value={selectedRole.name}
                      onChange={(e) => setSelectedRole({...selectedRole, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                    <textarea
                      value={selectedRole.description}
                      onChange={(e) => setSelectedRole({...selectedRole, description: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Permissions</label>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                        <div key={category}>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">{category}</h4>
                          <div className="space-y-2 ml-4">
                            {categoryPermissions.map((permission) => (
                              <div key={permission.id} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={selectedRole.permissions.includes(permission.id)}
                                  onChange={() => togglePermission(permission.id)}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <div className="ml-3">
                                  <label className="text-sm text-gray-700 dark:text-gray-300">{permission.name}</label>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{permission.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleSaveRole}
                      className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditingRole(false)}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'permissions' && (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Permissions</h3>
            </div>
            <div className="space-y-6">
              {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                <div key={category} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      {category}
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categoryPermissions.map((permission) => (
                      <div key={permission.id} className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1">
                            <h5 className="text-sm font-medium text-gray-900 dark:text-white">{permission.name}</h5>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{permission.description}</p>
                            <code className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded mt-2 inline-block border border-blue-200 dark:border-blue-800">
                              {permission.id}
                            </code>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}