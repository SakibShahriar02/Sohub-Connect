import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import PageMeta from '../../components/common/PageMeta';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { updateExtensionInFreePBX } from '../../lib/freepbx';
import Swal from 'sweetalert2';

interface CallerID {
  id: number;
  caller_id: string;
  description: string;
}

export default function EditExtension() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { profile } = useAuth();
  const [callerIds, setCallerIds] = useState<CallerID[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    display_name: '',
    tech: 'pjsip',
    caller_id: '',
    extension_pass: '',
    status: 'Active'
  });

  useEffect(() => {
    if (profile?.id && id) {
      fetchCallerIds();
      fetchExtension();
    }
  }, [profile, id]);

  const fetchCallerIds = async () => {
    try {
      const { data, error } = await supabase
        .from('vb_callerid')
        .select('*')
        .eq('status', 'Active');

      if (error) throw error;
      setCallerIds(data || []);
    } catch (error) {
      console.error('Error fetching caller IDs:', error);
    }
  };

  const fetchExtension = async () => {
    try {
      const { data, error } = await supabase
        .from('pbx_extensions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setFormData({
        display_name: data.display_name || '',
        tech: data.tech || 'pjsip',
        caller_id: data.callerid?.toString() || '',
        extension_pass: data.extension_pass || '',
        status: data.status || 'Active'
      });
    } catch (error) {
      console.error('Error fetching extension:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to load extension data',
        icon: 'error',
        confirmButtonColor: '#3b82f6'
      }).then(() => {
        navigate('/voice/extensions');
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let freepbxSuccess = false;
      
      // Try to update extension in FreePBX first
      try {
        const { data: currentExt } = await supabase
          .from('pbx_extensions')
          .select('extension_code')
          .eq('id', id)
          .single();
        
        if (currentExt?.extension_code) {
          await updateExtensionInFreePBX({
            extension: currentExt.extension_code,
            name: formData.display_name,
            tech: formData.tech,
            secret: formData.extension_pass
          });
          freepbxSuccess = true;
        }
      } catch (freepbxError) {
        console.warn('FreePBX update failed, continuing with database only:', freepbxError);
      }
      
      // Update database
      const { error } = await supabase
        .from('pbx_extensions')
        .update({
          display_name: formData.display_name,
          tech: formData.tech,
          callerid: parseInt(formData.caller_id),
          extension_pass: formData.extension_pass,
          status: formData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      Swal.fire({
        title: 'Success!',
        text: freepbxSuccess 
          ? 'Extension updated successfully in both database and FreePBX!' 
          : 'Extension updated in database. FreePBX sync failed but changes are saved.',
        icon: 'success',
        confirmButtonColor: '#3b82f6'
      }).then(() => {
        navigate('/voice/extensions');
      });
    } catch (error: any) {
      console.error('Error updating extension:', error);
      Swal.fire({
        title: 'Error!',
        text: `Failed to update extension: ${error.message}`,
        icon: 'error',
        confirmButtonColor: '#3b82f6'
      });
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
      <PageMeta title="Edit Extension | PBX" description="Edit PBX extension" />
      
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/voice/extensions')}
            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Edit Extension</h1>
        </div>
        
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Display Name
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
                  Technology
                </label>
                <select
                  value={formData.tech}
                  onChange={(e) => setFormData(prev => ({ ...prev, tech: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="pjsip">PJSIP</option>
                  <option value="sip">SIP</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Caller ID
                </label>
                <select
                  value={formData.caller_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, caller_id: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  required
                >
                  <option value="">Select Caller ID</option>
                  {callerIds.map(cid => (
                    <option key={cid.id} value={cid.id}>{cid.caller_id}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Extension Password
                </label>
                <input
                  type="text"
                  value={formData.extension_pass}
                  onChange={(e) => setFormData(prev => ({ ...prev, extension_pass: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
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
            </div>
            
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Update Extension
              </button>
              <button
                type="button"
                onClick={() => navigate('/voice/extensions')}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}