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
    extension_pass: '',
    status: 'Active'
  });
  const [showPassword, setShowPassword] = useState(false);

  const generatePassword = () => {
    return Math.random().toString(36).slice(-8) + Math.floor(Math.random() * 100);
  };

  useEffect(() => {
    if (profile?.id) {
      fetchNextExtension();
      // Auto-generate password on load
      setFormData(prev => ({
        ...prev,
        extension_pass: generatePassword()
      }));
    }
  }, [profile]);



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
      // Silent error handling
    }
  };

  const generateExtensionCode = (extensionNo: string) => {
    return `${profile?.merchant_number || ''}${extensionNo}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const extensionCode = generateExtensionCode(nextExtension);
      const password = formData.extension_pass || generatePassword();
      
      let freepbxSuccess = false;
      
      // Try to create extension in FreePBX first
      try {
        clearFreePBXConfigCache();
        await createExtensionInFreePBX({
          extension: extensionCode,
          name: formData.display_name,
          tech: formData.tech,
          secret: password
        });
        freepbxSuccess = true;
      } catch (freepbxError) {
        // Silent fail for FreePBX
      }
      
      // Save to database
      const { error } = await supabase
        .from('pbx_extensions')
        .insert({
          extension_code: extensionCode,
          extension_no: nextExtension,
          display_name: formData.display_name,
          tech: formData.tech,
          callerid: 1,
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
      Swal.fire({
        title: 'Error!',
        text: 'Failed to create extension',
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
                  Extension Password
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.extension_pass}
                      onChange={(e) => setFormData(prev => ({ ...prev, extension_pass: e.target.value }))}
                      className="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      placeholder="Auto-generated password"
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