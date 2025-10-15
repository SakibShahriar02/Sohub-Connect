import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import PageMeta from '../../../components/common/PageMeta';

export default function EditApprovedTrunk() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    client_merchant_no: '',
    provider: '',
    trunk_number: '',
    trunk_username: '',
    trunk_password: '',
    trunk_host: '',
    status: 'Pending'
  });

  useEffect(() => {
    // Simulate loading approved trunk data
    if (id) {
      const mockData = {
        client_merchant_no: 'MERCH001',
        provider: 'VoIP Provider A',
        trunk_number: '1234567890',
        trunk_username: 'trunk_user_1',
        trunk_password: 'secure_pass_1',
        trunk_host: '192.168.1.100',
        status: 'Active'
      };
      setFormData(mockData);
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating approved trunk:', id, formData);
    navigate('/voice/pbx/approved-trunks');
  };

  return (
    <>
      <PageMeta
        title="Edit Approved Trunk | SOHUB Connect"
        description="Edit PBX Approved Trunk"
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Approved Trunk</h1>
            <p className="text-gray-600 dark:text-gray-400">Update approved trunk configuration</p>
          </div>
          <button
            onClick={() => navigate('/voice/pbx/approved-trunks')}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Approved Trunks
          </button>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Client Merchant No *</label>
                <input
                  type="text"
                  value={formData.client_merchant_no}
                  onChange={(e) => setFormData({...formData, client_merchant_no: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Enter client merchant number"
                  maxLength={255}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Provider *</label>
                <input
                  type="text"
                  value={formData.provider}
                  onChange={(e) => setFormData({...formData, provider: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Enter provider name"
                  maxLength={255}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Trunk Number *</label>
                <input
                  type="text"
                  value={formData.trunk_number}
                  onChange={(e) => setFormData({...formData, trunk_number: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Enter trunk number"
                  maxLength={255}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Trunk Username *</label>
                <input
                  type="text"
                  value={formData.trunk_username}
                  onChange={(e) => setFormData({...formData, trunk_username: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Enter trunk username"
                  maxLength={255}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Trunk Password *</label>
                <input
                  type="password"
                  value={formData.trunk_password}
                  onChange={(e) => setFormData({...formData, trunk_password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Enter trunk password"
                  maxLength={255}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Trunk Host *</label>
                <input
                  type="text"
                  value={formData.trunk_host}
                  onChange={(e) => setFormData({...formData, trunk_host: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Enter trunk host (IP or domain)"
                  maxLength={255}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => navigate('/voice/pbx/approved-trunks')}
                className="px-6 py-3 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update Approved Trunk
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}