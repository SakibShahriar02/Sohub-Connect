import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import PageMeta from '../../components/common/PageMeta';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { deleteExtensionInFreePBX } from '../../lib/freepbx';
import Swal from 'sweetalert2';

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


  const fetchExtensions = async () => {
    try {
      console.log('Fetching extensions for profile:', profile?.id);
      const { data: extensionsData, error } = await supabase
        .from('pbx_extensions')
        .select('*')
        .order('id', { ascending: false });
      
      console.log('Extensions query result:', { data: extensionsData, error });

      if (error) throw error;
      
      // Fetch caller IDs to match with extensions
      const { data: callerIdsData } = await supabase
        .from('vb_callerid')
        .select('*');
      
      const formattedData = extensionsData?.map(ext => {
        const callerIdMatch = callerIdsData?.find(cid => cid.id === ext.callerid);
        return {
          ...ext,
          caller_id_number: callerIdMatch?.caller_id || 'N/A'
        };
      }) || [];
      
      setExtensions(formattedData);
    } catch (error) {
      console.error('Error fetching extensions:', error);
    }
  };

  const fetchCallerIds = async () => {
    try {
      console.log('Fetching caller IDs for profile:', profile?.id);
      const { data, error } = await supabase
        .from('vb_callerid')
        .select('*')
        .eq('status', 'Active');
      
      console.log('Caller IDs query result:', { data, error });

      if (error) throw error;
      setCallerIds(data || []);
    } catch (error) {
      console.error('Error fetching caller IDs:', error);
    }
  };

  useEffect(() => {
    console.log('Profile in Extensions:', profile);
    if (profile?.id) {
      console.log('Fetching data for profile ID:', profile.id);
      fetchExtensions();
      fetchCallerIds();
    }
    setLoading(false);
  }, [profile]);



  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the extension from FreePBX and deactivate it in database',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        let freepbxSuccess = false;
        
        // Try to delete from FreePBX first
        try {
          const { data: extension } = await supabase
            .from('pbx_extensions')
            .select('extension_code')
            .eq('id', id)
            .single();
          
          if (extension?.extension_code) {
            await deleteExtensionInFreePBX(extension.extension_code);
            freepbxSuccess = true;
          }
        } catch (freepbxError) {
          console.warn('FreePBX deletion failed, continuing with database only:', freepbxError);
        }
        
        // Deactivate in database
        const { error } = await supabase
          .from('pbx_extensions')
          .update({ status: 'Inactive' })
          .eq('id', id);

        if (error) throw error;
        
        fetchExtensions();
        Swal.fire({
          title: 'Deleted!',
          text: freepbxSuccess 
            ? 'Extension has been deleted from FreePBX and deactivated in database.' 
            : 'Extension deactivated in database. FreePBX sync failed.',
          icon: 'success',
          confirmButtonColor: '#3b82f6'
        });
      } catch (error: any) {
        Swal.fire({
          title: 'Error!',
          text: `Failed to delete extension: ${error.message}`,
          icon: 'error',
          confirmButtonColor: '#3b82f6'
        });
      }
    }
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <PageMeta title="Extensions | PBX" description="Manage PBX extensions" />
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Extensions</h1>
          <Link
            to="/voice/extensions/add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add Extension
          </Link>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Caller ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {extensions.map((extension) => (
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
                      {extension.caller_id_number}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        to={`/voice/extensions/edit/${extension.id}`}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(extension.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}