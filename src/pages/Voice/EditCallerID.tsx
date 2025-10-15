import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
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
  }
];

export default function EditCallerID() {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    trunk_id: '',
    name: '',
    caller_id: '',
    channels: '',
    status: 'Active',
    assign_to: '',
    inbound_id: ''
  });

  useEffect(() => {
    if (id) {
      const callerID = dummyCallerIDs.find(c => c.id === parseInt(id));
      if (callerID) {
        setFormData({
          trunk_id: callerID.trunk_id,
          name: callerID.name,
          caller_id: callerID.caller_id,
          channels: callerID.channels,
          status: callerID.status,
          assign_to: callerID.assign_to,
          inbound_id: callerID.inbound_id.toString()
        });
      }
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form updated:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <PageMeta title="Edit Caller ID | Voice" description="Edit caller ID configuration" />
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Edit Caller ID</h1>
          <Link
            to="/voice/caller-ids"
            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ← Back to List
          </Link>
        </div>
        
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Trunk ID *
                </label>
                <input
                  type="text"
                  name="trunk_id"
                  value={formData.trunk_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Caller ID *
                </label>
                <input
                  type="tel"
                  name="caller_id"
                  value={formData.caller_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Channels
                </label>
                <input
                  type="number"
                  name="channels"
                  value={formData.channels}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assign To
                </label>
                <input
                  type="text"
                  name="assign_to"
                  value={formData.assign_to}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Inbound ID
                </label>
                <input
                  type="number"
                  name="inbound_id"
                  value={formData.inbound_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Link
                to="/voice/caller-ids"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Caller ID
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}