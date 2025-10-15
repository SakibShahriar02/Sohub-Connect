import { useState } from "react";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";

interface QuickCall {
  id: number;
  date_time: string;
  assigned_to: string;
  call_to: string;
  caller_id: string;
  trunk_name: string;
  play_strategy: string;
  play_type: string;
  play: string;
  tech: string;
  tts_language: string;
  last_play_date_time: string;
  status: string;
}

const dummyQuickCalls: QuickCall[] = [
  {
    id: 1,
    date_time: "2024-01-15 10:30:00",
    assigned_to: "John Doe",
    call_to: "+1234567890",
    caller_id: "+1987654321",
    trunk_name: "Main Trunk",
    play_strategy: "Sequential",
    play_type: "TTS",
    play: "Welcome to our service",
    tech: "SIP",
    tts_language: "English (US)",
    last_play_date_time: "2024-01-15 14:20:00",
    status: "Active"
  },
  {
    id: 2,
    date_time: "2024-01-14 14:20:00",
    assigned_to: "Jane Smith",
    call_to: "+1234567891",
    caller_id: "+1987654322",
    trunk_name: "Support Trunk",
    play_strategy: "Random",
    play_type: "Audio",
    play: "support_message.wav",
    tech: "IAX2",
    tts_language: "English (US)",
    last_play_date_time: "2024-01-14 16:45:00",
    status: "Active"
  },
  {
    id: 3,
    date_time: "2024-01-13 09:15:00",
    assigned_to: "Mike Johnson",
    call_to: "+1234567892",
    caller_id: "+1987654323",
    trunk_name: "Marketing Trunk",
    play_strategy: "Loop",
    play_type: "TTS",
    play: "Thank you for your interest in our products",
    tech: "SIP",
    tts_language: "Spanish (ES)",
    last_play_date_time: "2024-01-13 11:30:00",
    status: "Inactive"
  },
  {
    id: 4,
    date_time: "2024-01-12 16:45:00",
    assigned_to: "Sarah Wilson",
    call_to: "+1234567893",
    caller_id: "+1987654324",
    trunk_name: "Emergency Trunk",
    play_strategy: "Immediate",
    play_type: "Audio",
    play: "emergency_alert.wav",
    tech: "SIP",
    tts_language: "English (US)",
    last_play_date_time: "2024-01-12 18:20:00",
    status: "Active"
  },
  {
    id: 5,
    date_time: "2024-01-11 11:20:00",
    assigned_to: "David Brown",
    call_to: "+1234567894",
    caller_id: "+1987654325",
    trunk_name: "IT Trunk",
    play_strategy: "Sequential",
    play_type: "TTS",
    play: "IT support is currently unavailable",
    tech: "IAX2",
    tts_language: "English (UK)",
    last_play_date_time: "2024-01-11 13:45:00",
    status: "Active"
  }
];

export default function QuickCall() {
  const [quickCalls, setQuickCalls] = useState<QuickCall[]>(dummyQuickCalls);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this quick call?')) {
      setQuickCalls(quickCalls.filter(call => call.id !== id));
    }
  };

  return (
    <>
      <PageMeta title="Quick Call | Voice" description="Quick call management" />
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Quick Call</h1>
          <Link
            to="/voice/quick-call/add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add Quick Call
          </Link>
        </div>
        
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">ID</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assigned To</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Call To</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trunk</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">Type</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Play Content</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">Status</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {quickCalls.map((call) => (
                  <tr key={call.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {call.id}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900 dark:text-white">
                      <div className="max-w-32 truncate" title={call.assigned_to}>
                        {call.assigned_to}
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {call.call_to}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900 dark:text-white">
                      <div className="max-w-32 truncate" title={call.trunk_name}>
                        {call.trunk_name}
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {call.play_type}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900 dark:text-white">
                      <div className="max-w-40 truncate" title={call.play}>
                        {call.play}
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        call.status === 'Active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {call.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/voice/quick-call/edit/${call.id}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(call.id)}
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