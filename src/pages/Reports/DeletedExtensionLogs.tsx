import { useState } from 'react';
import PageMeta from '../../components/common/PageMeta';

interface DeletedExtensionLog {
  id: number;
  extension_no: string;
  display_name: string;
  deleted_by: string;
  deleted_at: string;
  reason: string;
  original_status: string;
  assigned_to: string;
}

const dummyDeletedExtensionLogs: DeletedExtensionLog[] = [
  {
    id: 1,
    extension_no: '1005',
    display_name: 'Sarah Johnson',
    deleted_by: 'Admin User',
    deleted_at: '2024-01-20 14:30:00',
    reason: 'Employee terminated',
    original_status: 'Active',
    assigned_to: 'HR Department'
  },
  {
    id: 2,
    extension_no: '2008',
    display_name: 'Mark Wilson',
    deleted_by: 'System Admin',
    deleted_at: '2024-01-19 09:15:00',
    reason: 'Department restructure',
    original_status: 'Active',
    assigned_to: 'Marketing'
  },
  {
    id: 3,
    extension_no: '3012',
    display_name: 'Lisa Chen',
    deleted_by: 'IT Manager',
    deleted_at: '2024-01-18 16:45:00',
    reason: 'Role change - no longer needs extension',
    original_status: 'Inactive',
    assigned_to: 'IT Support'
  },
  {
    id: 4,
    extension_no: '1009',
    display_name: 'Robert Davis',
    deleted_by: 'Admin User',
    deleted_at: '2024-01-17 11:20:00',
    reason: 'Duplicate extension cleanup',
    original_status: 'Active',
    assigned_to: 'Sales'
  },
  {
    id: 5,
    extension_no: '4007',
    display_name: 'Jennifer Brown',
    deleted_by: 'HR Manager',
    deleted_at: '2024-01-16 13:10:00',
    reason: 'Contract ended',
    original_status: 'Active',
    assigned_to: 'Customer Service'
  },
  {
    id: 6,
    extension_no: '2015',
    display_name: 'Michael Taylor',
    deleted_by: 'System Admin',
    deleted_at: '2024-01-15 08:30:00',
    reason: 'Security policy violation',
    original_status: 'Suspended',
    assigned_to: 'Finance'
  }
];

export default function DeletedExtensionLogs() {
  const [deletedLogs] = useState<DeletedExtensionLog[]>(dummyDeletedExtensionLogs);

  return (
    <>
      <PageMeta
        title="Deleted Extension Logs | SOHUB Connect"
        description="View deleted extension logs and audit trail"
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Deleted Extension Logs</h1>
            <p className="text-gray-600 dark:text-gray-400">Audit trail of deleted extensions</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Extension Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Deleted By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Deleted At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reason</th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assigned To</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {deletedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{log.display_name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Ext: {log.extension_no}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{log.deleted_by}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(log.deleted_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="max-w-48 truncate text-sm text-gray-900 dark:text-white" title={log.reason}>
                        {log.reason}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{log.assigned_to}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {deletedLogs.length === 0 && (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            No deleted extension logs found.
          </div>
        )}
      </div>
    </>
  );
}