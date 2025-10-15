import { useState } from 'react';
import { useNavigate } from 'react-router';
import PageMeta from '../../../components/common/PageMeta';
import { showDeleteConfirmation } from '../../../utils/deleteConfirmation';

interface RingGroup {
  id: number;
  date_time: string;
  group_number: number;
  description: string;
  extension_list: string;
  allowed_extension: string;
  status: string;
  assign_to: string;
  ring_srategy: string;
  ring_time: string;
  play_music: string;
  last_updated: string;
}

const dummyRingGroups: RingGroup[] = [
  {
    id: 1,
    date_time: '2024-01-15 10:30:00',
    group_number: 100,
    description: 'Sales Team',
    extension_list: '1001,1002,1003',
    allowed_extension: '1001',
    status: 'Active',
    assign_to: 'Sales Manager',
    ring_srategy: 'Ring All',
    ring_time: '30',
    play_music: 'default.wav',
    last_updated: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    date_time: '2024-01-16 14:20:00',
    group_number: 200,
    description: 'Support Team',
    extension_list: '2001,2002,2003,2004',
    allowed_extension: '2001',
    status: 'Active',
    assign_to: 'Support Lead',
    ring_srategy: 'Round Robin',
    ring_time: '20',
    play_music: 'hold_music.wav',
    last_updated: '2024-01-16 14:20:00'
  },
  {
    id: 3,
    date_time: '2024-01-17 09:15:00',
    group_number: 300,
    description: 'Marketing Department',
    extension_list: '3001,3002,3003',
    allowed_extension: '3001',
    status: 'Active',
    assign_to: 'Marketing Head',
    ring_srategy: 'Sequential',
    ring_time: '25',
    play_music: 'marketing_hold.wav',
    last_updated: '2024-01-17 09:15:00'
  },
  {
    id: 4,
    date_time: '2024-01-18 16:45:00',
    group_number: 400,
    description: 'Technical Support',
    extension_list: '4001,4002,4003,4004,4005',
    allowed_extension: '4001',
    status: 'Inactive',
    assign_to: 'Tech Lead',
    ring_srategy: 'Random',
    ring_time: '15',
    play_music: 'tech_music.wav',
    last_updated: '2024-01-18 16:45:00'
  },
  {
    id: 5,
    date_time: '2024-01-19 11:30:00',
    group_number: 500,
    description: 'Executive Team',
    extension_list: '5001,5002',
    allowed_extension: '5001',
    status: 'Active',
    assign_to: 'CEO Office',
    ring_srategy: 'Ring All',
    ring_time: '45',
    play_music: 'executive_hold.wav',
    last_updated: '2024-01-19 11:30:00'
  }
];

export default function RingGroup() {
  const navigate = useNavigate();
  const [ringGroups, setRingGroups] = useState<RingGroup[]>(dummyRingGroups);

  const handleAdd = () => {
    navigate('/voice/pbx/ring-group/add');
  };

  const handleEdit = (group: RingGroup) => {
    navigate(`/voice/pbx/ring-group/edit/${group.id}`);
  };

  const handleDelete = (group: RingGroup) => {
    showDeleteConfirmation({
      text: `Delete ${group.description}? This action cannot be undone.`,
      onConfirm: () => setRingGroups(ringGroups.filter(g => g.id !== group.id)),
      successText: 'Ring group has been deleted successfully.'
    });
  };

  return (
    <>
      <PageMeta
        title="Ring Group | SOHUB Connect"
        description="Manage PBX Ring Groups"
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ring Groups</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your PBX ring groups</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Ring Group
          </button>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Group Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Group Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Extensions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ring Strategy</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {ringGroups.map((group) => (
                  <tr key={group.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{group.description}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">ID: {group.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{group.group_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div className="max-w-32 truncate" title={group.extension_list}>
                        {group.extension_list}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{group.ring_srategy}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        group.status === 'Active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {group.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{group.assign_to}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(group)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(group)}
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