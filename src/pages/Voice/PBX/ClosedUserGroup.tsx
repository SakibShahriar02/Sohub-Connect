import { useState } from 'react';
import { useNavigate } from 'react-router';
import PageMeta from '../../../components/common/PageMeta';
import { showDeleteConfirmation } from '../../../utils/deleteConfirmation';

interface ClosedUserGroup {
  id: number;
  date_time: string;
  cug_name: string;
  cug_number: string;
  status: string;
  assign_to: string;
}

const dummyClosedUserGroups: ClosedUserGroup[] = [
  {
    id: 1,
    date_time: '2024-01-15 09:30:00',
    cug_name: 'Management CUG',
    cug_number: 'CUG001',
    status: 'Active',
    assign_to: 'Management'
  },
  {
    id: 2,
    date_time: '2024-01-16 11:20:00',
    cug_name: 'Sales Team CUG',
    cug_number: 'CUG002',
    status: 'Active',
    assign_to: 'Sales Department'
  },
  {
    id: 3,
    date_time: '2024-01-17 14:45:00',
    cug_name: 'Support CUG',
    cug_number: 'CUG003',
    status: 'Inactive',
    assign_to: 'Support Team'
  },
  {
    id: 4,
    date_time: '2024-01-18 08:15:00',
    cug_name: 'Executive CUG',
    cug_number: 'CUG004',
    status: 'Active',
    assign_to: 'Executive Board'
  }
];

export default function ClosedUserGroup() {
  const navigate = useNavigate();
  const [closedUserGroups, setClosedUserGroups] = useState<ClosedUserGroup[]>(dummyClosedUserGroups);

  const handleAdd = () => {
    navigate('/voice/pbx/closed-user-group/add');
  };

  const handleEdit = (cug: ClosedUserGroup) => {
    navigate(`/voice/pbx/closed-user-group/edit/${cug.id}`);
  };

  const handleDelete = (cug: ClosedUserGroup) => {
    showDeleteConfirmation({
      text: `Delete ${cug.cug_name}? This action cannot be undone.`,
      onConfirm: () => setClosedUserGroups(closedUserGroups.filter(c => c.id !== cug.id)),
      successText: 'Closed user group has been deleted successfully.'
    });
  };

  return (
    <>
      <PageMeta
        title="Closed User Group | SOHUB Connect"
        description="Manage PBX Closed User Groups"
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Closed User Groups</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your closed user group configurations</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Closed User Group
          </button>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">CUG Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">CUG Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {closedUserGroups.map((cug) => (
                  <tr key={cug.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{cug.cug_name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">ID: {cug.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{cug.cug_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        cug.status === 'Active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {cug.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{cug.assign_to}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(cug)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(cug)}
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