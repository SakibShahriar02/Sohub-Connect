import { useState } from 'react';
import { useNavigate } from 'react-router';
import PageMeta from '../../../components/common/PageMeta';

export default function AddInboundRoute() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    inbound_name: '',
    caller_id: '',
    call_flow: 'IVR Menu',
    status: 'Active',
    assign_to: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding inbound route:', formData);
    navigate('/voice/pbx/inbound-route');
  };

  return (
    <>
      <PageMeta
        title="Add Inbound Route | SOHUB Connect"
        description="Add new PBX Inbound Route"
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Inbound Route</h1>
            <p className="text-gray-600 dark:text-gray-400">Create a new inbound routing rule</p>
          </div>
          <button
            onClick={() => navigate('/voice/pbx/inbound-route')}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Inbound Routes
          </button>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Route Name *</label>
                <input
                  type="text"
                  value={formData.inbound_name}
                  onChange={(e) => setFormData({...formData, inbound_name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Enter route name"
                  maxLength={20}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Caller ID *</label>
                <input
                  type="text"
                  value={formData.caller_id}
                  onChange={(e) => setFormData({...formData, caller_id: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Enter caller ID"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Call Flow *</label>
                <select
                  value={formData.call_flow}
                  onChange={(e) => setFormData({...formData, call_flow: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  required
                >
                  <option value="IVR Menu">IVR Menu</option>
                  <option value="Direct Extension">Direct Extension</option>
                  <option value="Ring Group">Ring Group</option>
                  <option value="Voicemail">Voicemail</option>
                  <option value="Queue">Queue</option>
                  <option value="Conference">Conference</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assign To *</label>
                <input
                  type="text"
                  value={formData.assign_to}
                  onChange={(e) => setFormData({...formData, assign_to: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Enter team/department"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => navigate('/voice/pbx/inbound-route')}
                className="px-6 py-3 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Inbound Route
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}