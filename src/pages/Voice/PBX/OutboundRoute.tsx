import { useState } from 'react';
import { useNavigate } from 'react-router';
import PageMeta from '../../../components/common/PageMeta';
import { showDeleteConfirmation } from '../../../utils/deleteConfirmation';

interface OutboundRoute {
  id: number;
  date_time: string;
  outbound_name: string;
  destination: string;
  caller_id: string;
  allowed_extension: string;
  status: string;
  assign_to: string;
}

const dummyOutboundRoutes: OutboundRoute[] = [
  {
    id: 1,
    date_time: "2024-01-15 09:30:00",
    outbound_name: "International Calls",
    destination: "00*",
    caller_id: "+1234567890",
    allowed_extension: "1001,1002,1003",
    status: "Active",
    assign_to: "Management"
  },
  {
    id: 2,
    date_time: "2024-01-14 14:20:00",
    outbound_name: "Local Calls",
    destination: "9*",
    caller_id: "+1234567891",
    allowed_extension: "ALL",
    status: "Active",
    assign_to: "All Users"
  },
  {
    id: 3,
    date_time: "2024-01-13 11:45:00",
    outbound_name: "Emergency Services",
    destination: "911",
    caller_id: "+1234567892",
    allowed_extension: "ALL",
    status: "Active",
    assign_to: "Emergency"
  },
  {
    id: 4,
    date_time: "2024-01-12 16:10:00",
    outbound_name: "Premium Numbers",
    destination: "1900*",
    caller_id: "+1234567893",
    allowed_extension: "1001,1005",
    status: "Inactive",
    assign_to: "Restricted"
  }
];

export default function OutboundRoute() {
  const navigate = useNavigate();
  const [outboundRoutes, setOutboundRoutes] = useState<OutboundRoute[]>(dummyOutboundRoutes);

  const handleAdd = () => {
    navigate('/voice/pbx/outbound-route/add');
  };

  const handleEdit = (route: OutboundRoute) => {
    navigate(`/voice/pbx/outbound-route/edit/${route.id}`);
  };

  const handleDelete = (route: OutboundRoute) => {
    showDeleteConfirmation({
      text: `Delete ${route.outbound_name}? This action cannot be undone.`,
      onConfirm: () => setOutboundRoutes(outboundRoutes.filter(r => r.id !== route.id)),
      successText: 'Outbound route has been deleted successfully.'
    });
  };

  return (
    <>
      <PageMeta
        title="Outbound Route | SOHUB Connect"
        description="Manage PBX Outbound Routes"
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Outbound Routes</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your PBX outbound routing</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Outbound Route
          </button>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Route Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Destination</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Caller ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Allowed Extensions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {outboundRoutes.map((route) => (
                  <tr key={route.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{route.outbound_name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">ID: {route.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{route.destination}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{route.caller_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div className="max-w-32 truncate" title={route.allowed_extension}>
                        {route.allowed_extension}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        route.status === 'Active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {route.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{route.assign_to}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(route)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(route)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
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