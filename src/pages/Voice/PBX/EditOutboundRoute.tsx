import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import PageMeta from '../../../components/common/PageMeta';

export default function EditOutboundRoute() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    outbound_name: '',
    destination: '',
    caller_id: '',
    allowed_extension: '',
    status: 'Active',
    assign_to: ''
  });

  useEffect(() => {
    // Simulate loading outbound route data
    setFormData({
      outbound_name: 'International Calls',
      destination: '00*',
      caller_id: '+1234567890',
      allowed_extension: '1001,1002,1003',
      status: 'Active',
      assign_to: 'Management'
    });
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating outbound route:', formData);
    navigate('/voice/pbx/outbound-route');
  };

  return (
    <>
      <PageMeta
        title="Edit Outbound Route | SOHUB Connect"
        description="Edit PBX Outbound Route"
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Outbound Route</h1>
            <p className="text-gray-600 dark:text-gray-400">Update outbound routing rule</p>
          </div>
          <button
            onClick={() => navigate('/voice/pbx/outbound-route')}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Outbound Routes
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
                  value={formData.outbound_name}
                  onChange={(e) => setFormData({...formData, outbound_name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Enter route name"
                  maxLength={200}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Destination Pattern *</label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="e.g., 9*, 00*, 911"
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Allowed Extensions *</label>
                <input
                  type="text"
                  value={formData.allowed_extension}
                  onChange={(e) => setFormData({...formData, allowed_extension: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="e.g., 1001,1002,1003 or ALL"
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
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              
              <div>
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
                onClick={() => navigate('/voice/pbx/outbound-route')}
                className="px-6 py-3 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update Outbound Route
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}