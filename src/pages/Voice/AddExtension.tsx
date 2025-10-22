import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import PageMeta from '../../components/common/PageMeta';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { createExtensionInFreePBX, clearFreePBXConfigCache } from '../../lib/freepbx';
import Swal from 'sweetalert2';

interface CallerID {
  id: number;
  caller_id: string;
  description: string;
}

export default function AddExtension() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [callerIds, setCallerIds] = useState<CallerID[]>([]);
  const [nextExtension, setNextExtension] = useState('101');
  
  const [formData, setFormData] = useState({
    display_name: '',
    tech: 'pjsip',
    caller_id: '',
    extension_pass: '',
    status: 'Active'
  });

  useEffect(() => {
    if (profile?.id) {
      fetchCallerIds();
      fetchNextExtension();
    }
  }, [profile]);

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

  const fetchNextExtension = async () => {
    try {
      const { data, error } = await supabase
        .from('pbx_extensions')
        .select('extension_no')
        .order('id', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      if (data && data.length > 0) {
        const lastExt = parseInt(data[0].extension_no);
        setNextExtension((lastExt + 1).toString());
      } else {
        setNextExtension('101');
      }
    } catch (error) {
      console.error('Error fetching next extension:', error);
    }
  };

  const generateExtensionCode = (extensionNo: string) => {
    return `${profile?.merchant_number || ''}${extensionNo}`;
  };

  const generatePassword = () => {
    return Math.random().toString(36).slice(-8);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const extensionCode = generateExtensionCode(nextExtension);
      const password = formData.extension_pass || generatePassword();
      
      let freepbxSuccess = false;
      
      // Try to create extension in FreePBX first
      try {
        clearFreePBXConfigCache(); // Clear cache to get latest settings
        await createExtensionInFreePBX({
          extension: extensionCode,
          name: formData.display_name,
          tech: formData.tech,
          secret: password
        });
        freepbxSuccess = true;
      } catch (freepbxError) {
        console.warn('FreePBX creation failed, continuing with database only:', freepbxError);
      }
      
      // Save to database
      const { error } = await supabase
        .from('pbx_extensions')
        .insert({
          extension_code: extensionCode,
          extension_no: nextExtension,
          display_name: formData.display_name,
          tech: formData.tech,
          callerid: parseInt(formData.caller_id),
          extension_pass: password,
          status: formData.status,
          assign_to: profile?.id,
          date_time: new Date().toISOString(),
          billing_date_time: new Date().toISOString()
        });

      if (error) throw error;
      
      Swal.fire({
        title: 'Success!',
        text: freepbxSuccess 
          ? 'Extension created successfully in both database and FreePBX!' 
          : 'Extension created in database. FreePBX sync failed but extension is saved.',
        icon: 'success',
        confirmButtonColor: '#3b82f6'
      }).then(() => {
        navigate('/voice/extensions');
      });
    } catch (error: any) {
      console.error('Error creating extension:', error);
      Swal.fire({
        title: 'Error!',
        text: `Failed to create extension: ${error.message}`,
        icon: 'error',
        confirmButtonColor: '#3b82f6'
      });
    }
  };

  return (
    <>
      <PageMeta title="Add Extension | PBX" description="Add a new PBX extension" />
      
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
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Add Extension</h1>
        </div>
        
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  placeholder="Auto-generated if empty"
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
                Create Extension
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