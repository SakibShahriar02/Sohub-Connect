import { useState } from "react";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";

interface CallerID {
  id: number;
  date_time: string;
  trunk_id: string;
  name: string;
  caller_id: string;
  channels: string;
  status: string;
  assign_to: string;
  inbound_id: number;
}

const dummyCallerIDs: CallerID[] = [
  {
    id: 1,
    date_time: "2024-01-15 10:30:00",
    trunk_id: "TRK001",
    name: "Main Office",
    caller_id: "+1234567890",
    channels: "10",
    status: "Active",
    assign_to: "Sales Team, John Doe",
    inbound_id: 101
  },
  {
    id: 2,
    date_time: "2024-01-14 14:20:00",
    trunk_id: "TRK002",
    name: "Support Line",
    caller_id: "+1234567891",
    channels: "5",
    status: "Active",
    assign_to: "Support Team, Jane Smith",
    inbound_id: 102
  },
  {
    id: 3,
    date_time: "2024-01-13 09:15:00",
    trunk_id: "TRK003",
    name: "Marketing",
    caller_id: "+1234567892",
    channels: "3",
    status: "Inactive",
    assign_to: "Marketing Team",
    inbound_id: 103
  },
  {
    id: 4,
    date_time: "2024-01-12 16:45:00",
    trunk_id: "TRK004",
    name: "Customer Service",
    caller_id: "+1234567893",
    channels: "8",
    status: "Active",
    assign_to: "CS Team, Mike Johnson",
    inbound_id: 104
  },
  {
    id: 5,
    date_time: "2024-01-11 11:20:00",
    trunk_id: "TRK005",
    name: "Emergency Line",
    caller_id: "+1234567894",
    channels: "2",
    status: "Active",
    assign_to: "Emergency Response Team",
    inbound_id: 105
  },
  {
    id: 6,
    date_time: "2024-01-10 08:30:00",
    trunk_id: "TRK006",
    name: "HR Department",
    caller_id: "+1234567895",
    channels: "4",
    status: "Inactive",
    assign_to: "HR Team, Sarah Wilson",
    inbound_id: 106
  },
  {
    id: 7,
    date_time: "2024-01-09 13:15:00",
    trunk_id: "TRK007",
    name: "IT Helpdesk",
    caller_id: "+1234567896",
    channels: "6",
    status: "Active",
    assign_to: "IT Team, David Brown",
    inbound_id: 107
  },
  {
    id: 8,
    date_time: "2024-01-08 15:40:00",
    trunk_id: "TRK008",
    name: "Finance Dept",
    caller_id: "+1234567897",
    channels: "3",
    status: "Active",
    assign_to: "Finance Team",
    inbound_id: 108
  }
];

export default function CallerIDs() {
  const [callerIDs, setCallerIDs] = useState<CallerID[]>(dummyCallerIDs);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this caller ID?')) {
      setCallerIDs(callerIDs.filter(callerID => callerID.id !== id));
    }
  };

  return (
    <>
      <PageMeta title="Caller IDs | Voice" description="Caller ID management" />
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Caller IDs</h1>
          <Link
            to="/voice/caller-ids/add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add Caller ID
          </Link>
        </div>
        
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">ID</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Caller ID</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">Trunk</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">Channels</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">Status</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assigned To</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {callerIDs.map((callerID) => (
                  <tr key={callerID.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {callerID.id}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900 dark:text-white">
                      <div className="max-w-32 truncate" title={callerID.name}>
                        {callerID.name}
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {callerID.caller_id}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {callerID.trunk_id}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                      {callerID.channels}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        callerID.status === 'Active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {callerID.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900 dark:text-white">
                      <div className="max-w-36 truncate" title={callerID.assign_to}>
                        {callerID.assign_to}
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/voice/caller-ids/edit/${callerID.id}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(callerID.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Del
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