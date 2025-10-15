import { useState } from 'react';
import { useNavigate } from 'react-router';
import PageMeta from '../../../components/common/PageMeta';
import { showDeleteConfirmation } from '../../../utils/deleteConfirmation';

interface ApprovedTrunk {
  id: number;
  requested_datetime: string;
  datetime: string;
  client_merchant_no: string;
  provider: string;
  trunk_number: string;
  trunk_username: string;
  trunk_password: string;
  trunk_host: string;
  status: string;
}

const dummyApprovedTrunks: ApprovedTrunk[] = [
  {
    id: 1,
    requested_datetime: '2024-01-15 09:30:00',
    datetime: '2024-01-15 10:00:00',
    client_merchant_no: 'MERCH001',
    provider: 'VoIP Provider A',
    trunk_number: '1234567890',
    trunk_username: 'trunk_user_1',
    trunk_password: 'secure_pass_1',
    trunk_host: '192.168.1.100',
    status: 'Active'
  },
  {
    id: 2,
    requested_datetime: '2024-01-16 11:20:00',
    datetime: '2024-01-16 12:00:00',
    client_merchant_no: 'MERCH002',
    provider: 'VoIP Provider B',
    trunk_number: '0987654321',
    trunk_username: 'trunk_user_2',
    trunk_password: 'secure_pass_2',
    trunk_host: '192.168.1.101',
    status: 'Active'
  },
  {
    id: 3,
    requested_datetime: '2024-01-17 14:45:00',
    datetime: '2024-01-17 15:30:00',
    client_merchant_no: 'MERCH003',
    provider: 'VoIP Provider C',
    trunk_number: '5555666777',
    trunk_username: 'trunk_user_3',
    trunk_password: 'secure_pass_3',
    trunk_host: '192.168.1.102',
    status: 'Inactive'
  },
  {
    id: 4,
    requested_datetime: '2024-01-18 08:15:00',
    datetime: '2024-01-18 09:00:00',
    client_merchant_no: 'MERCH004',
    provider: 'VoIP Provider D',
    trunk_number: '1111222333',
    trunk_username: 'trunk_user_4',
    trunk_password: 'secure_pass_4',
    trunk_host: '192.168.1.103',
    status: 'Pending'
  }
];

export default function ApprovedTrunks() {
  const navigate = useNavigate();
  const [approvedTrunks, setApprovedTrunks] = useState<ApprovedTrunk[]>(dummyApprovedTrunks);

  const handleAdd = () => {
    navigate('/voice/pbx/approved-trunks/add');
  };

  const handleEdit = (trunk: ApprovedTrunk) => {
    navigate(`/voice/pbx/approved-trunks/edit/${trunk.id}`);
  };

  const handleDelete = (trunk: ApprovedTrunk) => {
    showDeleteConfirmation({
      text: `Delete trunk ${trunk.trunk_number}? This action cannot be undone.`,
      onConfirm: () => setApprovedTrunks(approvedTrunks.filter(t => t.id !== trunk.id)),
      successText: 'Approved trunk has been deleted successfully.'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <>
      <PageMeta
        title="Approved Trunks | SOHUB Connect"
        description="Manage PBX Approved Trunks"
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Approved Trunks</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your approved trunk configurations</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Approved Trunk
          </button>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trunk Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Provider</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Host</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Merchant No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {approvedTrunks.map((trunk) => (
                  <tr key={trunk.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{trunk.trunk_number}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">ID: {trunk.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{trunk.provider}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{trunk.trunk_host}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{trunk.client_merchant_no}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(trunk.status)}`}>
                        {trunk.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(trunk)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(trunk)}
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