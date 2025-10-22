import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import PageMeta from '../../components/common/PageMeta';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { graphqlService } from '../../lib/graphql';

interface Extension {
  id: number;
  extension_code: string;
  extension_no: string;
  display_name: string;
  tech: string;
  status: string;
  caller_id_number: string;
  created_at: string;
}

interface CallerID {
  id: number;
  caller_id: string;
  description: string;
}

export default function Extensions() {
  const { user, profile } = useAuth();
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [callerIds, setCallerIds] = useState<CallerID[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [nextExtension, setNextExtension] = useState('101');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    display_name: '',
    extension_pass: '',
    status: 'Active'
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [deleteModal, setDeleteModal] = useState<{show: boolean, extension: Extension | null}>({show: false, extension: null});
  const [deleting, setDeleting] = useState(false);
  const [editModal, setEditModal] = useState<{show: boolean, extension: Extension | null}>({show: false, extension: null});
  const [editFormData, setEditFormData] = useState({
    display_name: '',
    extension_pass: '',
    status: 'Active'
  });
  const [updating, setUpdating] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filteredExtensions, setFilteredExtensions] = useState<Extension[]>([]);
  const [totalExtensions, setTotalExtensions] = useState(0);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({message, type});
    setTimeout(() => setToast(null), 3000);
  };

  const generatePassword = () => {
    return Math.random().toString(36).slice(-8) + Math.floor(Math.random() * 100);
  };


  const fetchExtensions = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      let query = supabase
        .from('pbx_extensions')
        .select(`
          *,
          profiles!pbx_extensions_assign_to_fkey(full_name)
        `)
        .order('id', { ascending: false });
      
      // If not super admin, filter by user's extensions
      if (profile?.role !== 'Super Admin') {
        query = query.eq('assign_to', profile?.id);
      }

      const { data: extensionsData, error } = await query;
      if (error) throw error;
      
      const extensionsList = extensionsData || [];
      setExtensions(extensionsList);
      setTotalExtensions(extensionsList.length);
      
    } catch (error) {
      showToast('Failed to load extensions', 'error');
      setExtensions([]);
      setTotalExtensions(0);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterExtensions = (extensionsList: Extension[], search: string) => {
    let filtered = extensionsList;
    
    if (search) {
      filtered = extensionsList.filter(ext => 
        ext.display_name.toLowerCase().includes(search.toLowerCase()) ||
        ext.extension_no.includes(search) ||
        ext.extension_code.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    setFilteredExtensions(filtered);
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    filterExtensions(extensions, value);
  };

  const exportToCSV = () => {
    const csvData = filteredExtensions.map(ext => ({
      'Extension Number': ext.extension_no,
      'Extension Code': ext.extension_code,
      'Display Name': ext.display_name,
      'Technology': ext.tech.toUpperCase(),
      'Created By': ext.profiles?.full_name || 'Unknown',
      'Status': ext.status,
      'Created': new Date(ext.created_at).toLocaleDateString()
    }));
    
    const csvContent = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extensions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Pagination
  const totalPages = Math.ceil(filteredExtensions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExtensions = filteredExtensions.slice(startIndex, endIndex);





  const generateExtensionCode = (extensionNo: string) => {
    return `${profile?.merchant_number || ''}${extensionNo}`;
  };

  const handleAddExtension = () => {
    setShowModal(true);
    
    // Calculate next extension number from current data
    let nextNumber = '101';
    if (extensions.length > 0) {
      const numbers = extensions.map(ext => parseInt(ext.extension_no)).filter(num => !isNaN(num));
      const maxNumber = Math.max(...numbers, 100);
      nextNumber = (maxNumber + 1).toString();
    }
    setNextExtension(nextNumber);
    
    setFormData({
      display_name: '',
      extension_pass: generatePassword(),
      status: 'Active'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const extensionCode = generateExtensionCode(nextExtension);
      const password = formData.extension_pass || generatePassword();
      
      let graphqlSuccess = false;
      
      // Try to create extension in GraphQL first
      try {
        await graphqlService.createExtension({
          extensionId: extensionCode,
          name: formData.display_name,
          tech: 'pjsip',
          callerID: extensionCode,
          secret: password
        });
        graphqlSuccess = true;
      } catch (graphqlError) {
        console.error('GraphQL creation failed:', graphqlError);
      }
      
      // Save to database
      const { error } = await supabase
        .from('pbx_extensions')
        .insert({
          extension_code: extensionCode,
          extension_no: nextExtension,
          display_name: formData.display_name,
          tech: 'pjsip',
          callerid: null,
          extension_pass: password,
          status: formData.status,
          assign_to: profile?.id,
          date_time: new Date().toISOString(),
          billing_date_time: new Date().toISOString()
        });

      if (error) throw error;
      
      setShowModal(false);
      await fetchExtensions();
      showToast(graphqlSuccess ? 'Extension created successfully!' : 'Extension created in database only', 'success');
    } catch (error: any) {
      showToast('Failed to create extension', 'error');
    }
    
    setSubmitting(false);
  };

  useEffect(() => {
    if (profile?.id) {
      fetchExtensions();
    }
  }, [profile?.id]);

  useEffect(() => {
    filterExtensions(extensions, searchTerm);
  }, [extensions, searchTerm]);



  const handleEdit = (extension: Extension) => {
    setEditModal({show: true, extension});
    setEditFormData({
      display_name: extension.display_name,
      extension_pass: extension.extension_pass || '',
      status: extension.status
    });
  };

  const handleDelete = (extension: Extension) => {
    setDeleteModal({show: true, extension});
  };

  const confirmDelete = async () => {
    if (!deleteModal.extension) return;
    
    setDeleting(true);
    try {
      let graphqlSuccess = false;
      
      // Try to delete from GraphQL first
      try {
        if (deleteModal.extension.extension_code) {
          await graphqlService.deleteExtension(deleteModal.extension.extension_code);
          graphqlSuccess = true;
        }
      } catch (graphqlError) {
        console.error('GraphQL deletion failed:', graphqlError);
      }
      
      // Delete from database
      const { error } = await supabase
        .from('pbx_extensions')
        .delete()
        .eq('id', deleteModal.extension.id);

      if (error) throw error;
      
      setDeleteModal({show: false, extension: null});
      await fetchExtensions();
      showToast('Extension deleted successfully!', 'success');
    } catch (error: any) {
      showToast('Failed to delete extension', 'error');
    }
    setDeleting(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal.extension) return;
    
    setUpdating(true);
    try {
      // Try to update in GraphQL first
      let graphqlSuccess = false;
      try {
        if (editFormData.extension_pass.trim()) {
          await graphqlService.updateExtension({
            extensionId: editModal.extension.extension_code,
            name: editFormData.display_name,
            tech: editModal.extension.tech,
            callerID: editModal.extension.extension_code,
            secret: editFormData.extension_pass
          });
          graphqlSuccess = true;
        }
      } catch (graphqlError) {
        console.error('GraphQL update failed:', graphqlError);
      }
      
      const updateData: any = {
        display_name: editFormData.display_name,
        status: editFormData.status
      };
      
      // Only update password if provided
      if (editFormData.extension_pass.trim()) {
        updateData.extension_pass = editFormData.extension_pass;
      }
      
      const { error } = await supabase
        .from('pbx_extensions')
        .update(updateData)
        .eq('id', editModal.extension.id);

      if (error) throw error;
      
      setEditModal({show: false, extension: null});
      await fetchExtensions();
      showToast(graphqlSuccess ? 'Extension updated successfully!' : 'Extension updated in database only', 'success');
    } catch (error: any) {
      showToast('Failed to update extension', 'error');
    }
    setUpdating(false);
  };



  if (loading || (!profile?.id && extensions.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading extensions...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta title="Extensions | PBX" description="Manage PBX extensions" />
      
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Extensions</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {totalExtensions} total extensions
              {profile?.role === 'Super Admin' && ' (all users)'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => fetchExtensions(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={exportToCSV}
              disabled={filteredExtensions.length === 0}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </button>
            <button
              onClick={async () => {
                const result = await graphqlService.testConnection();
                showToast(result.message, result.success ? 'success' : 'error');
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Test GraphQL
            </button>
            <button
              onClick={handleAddExtension}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Add Extension
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search extensions..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
          {searchTerm && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filteredExtensions.length} of {totalExtensions} extensions
            </p>
          )}
        </div>



        {/* Extensions List */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Extension</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Display Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Technology</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentExtensions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      {searchTerm ? 'No extensions match your search.' : 'No extensions found. Create your first extension!'}
                    </td>
                  </tr>
                ) : currentExtensions.map((extension) => (
                  <tr key={extension.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                      {extension.extension_no}
                      <div className="text-xs text-gray-500">({extension.extension_code})</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {extension.display_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {extension.tech.toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {extension.profiles?.full_name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        extension.status === 'Active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {extension.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(extension)}
                          className="flex items-center gap-1 px-3 py-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Edit extension"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(extension)}
                          className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete extension"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredExtensions.length)} of {filteredExtensions.length} extensions
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Previous
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Add Extension Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-[999999] animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 w-full max-w-md mx-4 animate-in zoom-in-95 slide-in-from-bottom-4 duration-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Add Extension</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Extension Number
                  </label>
                  <input
                    type="text"
                    value={nextExtension}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Full code: {generateExtensionCode(nextExtension)}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    value={formData.display_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Extension Password *
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.extension_pass}
                        onChange={(e) => setFormData(prev => ({ ...prev, extension_pass: e.target.value }))}
                        className="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, extension_pass: generatePassword() }))}
                      className="px-3 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                      title="Generate new password"
                    >
                      🔄
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-3 rounded-lg transition-colors"
                  >
                    {submitting ? 'Creating...' : 'Create Extension'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Extension Modal */}
        {editModal.show && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-[999999] animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 w-full max-w-md mx-4 animate-in zoom-in-95 slide-in-from-bottom-4 duration-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Edit Extension</h2>
                <button
                  onClick={() => setEditModal({show: false, extension: null})}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Extension Number
                  </label>
                  <input
                    type="text"
                    value={editModal.extension?.extension_no || ''}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Code: {editModal.extension?.extension_code}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    value={editFormData.display_name}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, display_name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Extension Password *
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showEditPassword ? "text" : "password"}
                        value={editFormData.extension_pass}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, extension_pass: e.target.value }))}
                        className="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowEditPassword(!showEditPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {showEditPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditFormData(prev => ({ ...prev, extension_pass: generatePassword() }))}
                      className="px-3 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                      title="Generate new password"
                    >
                      🔄
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={updating}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-3 rounded-lg transition-colors"
                  >
                    {updating ? 'Updating...' : 'Update Extension'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditModal({show: false, extension: null})}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.show && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-[999999] animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 w-full max-w-sm mx-4 animate-in zoom-in-95 slide-in-from-bottom-4 duration-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Extension</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Are you sure you want to delete this extension?</p>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-4">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{deleteModal.extension?.display_name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Extension: {deleteModal.extension?.extension_no}</p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => setDeleteModal({show: false, extension: null})}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toast && (
          <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-top-2 duration-300 ${
            toast.type === 'success' 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white'
          }`}>
            <div className="flex items-center gap-2">
              {toast.type === 'success' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span className="font-medium">{toast.message}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}