import { useState } from 'react';
import { useNavigate } from 'react-router';
import PageMeta from '../../../components/common/PageMeta';
import { showDeleteConfirmation } from '../../../utils/deleteConfirmation';

interface Extension {
  id: number;
  display_name: string;
  extension_code: string;
  extension_no: string;
  extension_pass: string;
  status: string;
  assign_to: string;
  tech: string;
  callerid: string;
  date_time: string;
}

const dummyExtensions: Extension[] = [
  {
    id: 1,
    display_name: "John Doe",
    extension_code: "EXT001",
    extension_no: "1001",
    extension_pass: "pass123",
    status: "Active",
    assign_to: "Sales",
    tech: "SIP",
    callerid: "John Doe <1001>",
    date_time: "2024-01-15 09:30:00"
  },
  {
    id: 2,
    display_name: "Jane Smith",
    extension_code: "EXT002",
    extension_no: "1002",
    extension_pass: "pass456",
    status: "Active",
    assign_to: "Support",
    tech: "SIP",
    callerid: "Jane Smith <1002>",
    date_time: "2024-01-14 14:20:00"
  },
  {
    id: 3,
    display_name: "Mike Wilson",
    extension_code: "EXT003",
    extension_no: "1003",
    extension_pass: "pass789",
    status: "Inactive",
    assign_to: "Marketing",
    tech: "SIP",
    callerid: "Mike Wilson <1003>",
    date_time: "2024-01-13 11:45:00"
  }
];

export default function Extensions() {
  const navigate = useNavigate();
  const [extensions, setExtensions] = useState<Extension[]>(dummyExtensions);

  const handleAdd = () => {
    navigate('/voice/pbx/extensions/add');
  };

  const handleEdit = (extension: Extension) => {
    navigate(`/voice/pbx/extensions/edit/${extension.id}`);
  };

  const handleDelete = (extension: Extension) => {
    showDeleteConfirmation({
      text: `Delete ${extension.display_name}?`,
      onConfirm: () => setExtensions(extensions.filter(ext => ext.id !== extension.id)),
      successText: 'Extension has been deleted successfully.'
    });
  };

  return (
    <>
      <PageMeta
        title="Extensions | SOHUB Connect"
        description="Manage PBX Extensions"
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Extensions</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your PBX extensions</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Extension
          </button>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Display Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Extension No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tech</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {extensions.map((extension) => (
                  <tr key={extension.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{extension.display_name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{extension.extension_code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{extension.extension_no}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        extension.status === 'Active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {extension.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{extension.assign_to}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{extension.tech}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(extension)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(extension)}
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