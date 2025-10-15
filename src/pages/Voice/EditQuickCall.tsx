import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
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
  }
];

export default function EditQuickCall() {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    assigned_to: '',
    call_to: '',
    caller_id: '',
    trunk_name: '',
    play_strategy: 'Sequential',
    play_type: 'TTS',
    play: '',
    tech: 'SIP',
    tts_language: 'English (US)',
    status: 'Active'
  });

  useEffect(() => {
    if (id) {
      const quickCall = dummyQuickCalls.find(q => q.id === parseInt(id));
      if (quickCall) {
        setFormData({
          assigned_to: quickCall.assigned_to,
          call_to: quickCall.call_to,
          caller_id: quickCall.caller_id,
          trunk_name: quickCall.trunk_name,
          play_strategy: quickCall.play_strategy,
          play_type: quickCall.play_type,
          play: quickCall.play,
          tech: quickCall.tech,
          tts_language: quickCall.tts_language,
          status: quickCall.status
        });
      }
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form updated:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <PageMeta title="Edit Quick Call | Voice" description="Edit quick call configuration" />
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Edit Quick Call</h1>
          <Link
            to="/voice/quick-call"
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
                  Assigned To *
                </label>
                <input
                  type="text"
                  name="assigned_to"
                  value={formData.assigned_to}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Call To *
                </label>
                <input
                  type="tel"
                  name="call_to"
                  value={formData.call_to}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Caller ID
                </label>
                <input
                  type="tel"
                  name="caller_id"
                  value={formData.caller_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Trunk Name
                </label>
                <input
                  type="text"
                  name="trunk_name"
                  value={formData.trunk_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Play Strategy
                </label>
                <select
                  name="play_strategy"
                  value={formData.play_strategy}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="Sequential">Sequential</option>
                  <option value="Random">Random</option>
                  <option value="Loop">Loop</option>
                  <option value="Immediate">Immediate</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Play Type
                </label>
                <select
                  name="play_type"
                  value={formData.play_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="TTS">TTS</option>
                  <option value="Audio">Audio</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tech
                </label>
                <select
                  name="tech"
                  value={formData.tech}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="SIP">SIP</option>
                  <option value="IAX2">IAX2</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  TTS Language
                </label>
                <select
                  name="tts_language"
                  value={formData.tts_language}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="English (US)">English (US)</option>
                  <option value="English (UK)">English (UK)</option>
                  <option value="Spanish (ES)">Spanish (ES)</option>
                  <option value="French (FR)">French (FR)</option>
                </select>
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
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Play Content *
              </label>
              <textarea
                name="play"
                value={formData.play}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Enter text for TTS or audio file name..."
                required
              />
            </div>
            
            <div className="flex justify-end space-x-4">
              <Link
                to="/voice/quick-call"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Quick Call
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}