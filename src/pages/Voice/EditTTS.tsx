import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";

interface TTS {
  id: number;
  date_time: string;
  tts_name: string;
  tts_text: string;
  tts_language: string;
  status: string;
  assign_to: string;
}

const dummyTTS: TTS[] = [
  {
    id: 1,
    date_time: "2024-01-15 10:30:00",
    tts_name: "Welcome Greeting",
    tts_text: "Welcome to our customer service. Please hold while we connect you to the next available agent.",
    tts_language: "English (US)",
    status: "Active",
    assign_to: "Main IVR"
  },
  {
    id: 2,
    date_time: "2024-01-14 14:20:00",
    tts_name: "Business Hours",
    tts_text: "Our business hours are Monday to Friday, 9 AM to 6 PM. Please call back during business hours or leave a message.",
    tts_language: "English (US)",
    status: "Active",
    assign_to: "After Hours"
  },
  {
    id: 3,
    date_time: "2024-01-13 09:15:00",
    tts_name: "Queue Message",
    tts_text: "You are currently number 3 in the queue. Your estimated wait time is 5 minutes.",
    tts_language: "English (US)",
    status: "Active",
    assign_to: "Queue System"
  }
];

export default function EditTTS() {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    tts_name: '',
    tts_text: '',
    tts_language: 'English (US)',
    status: 'Active',
    assign_to: ''
  });

  useEffect(() => {
    if (id) {
      const tts = dummyTTS.find(t => t.id === parseInt(id));
      if (tts) {
        setFormData({
          tts_name: tts.tts_name,
          tts_text: tts.tts_text,
          tts_language: tts.tts_language,
          status: tts.status,
          assign_to: tts.assign_to
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
      <PageMeta title="Edit Text To Speech | Voice" description="Edit TTS configuration" />
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Edit Text To Speech</h1>
          <Link
            to="/voice/text-to-speech"
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
                  TTS Name *
                </label>
                <input
                  type="text"
                  name="tts_name"
                  value={formData.tts_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Language
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
                  <option value="German (DE)">German (DE)</option>
                  <option value="Italian (IT)">Italian (IT)</option>
                  <option value="Portuguese (PT)">Portuguese (PT)</option>
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
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                TTS Text *
              </label>
              <textarea
                name="tts_text"
                value={formData.tts_text}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Enter the text that will be converted to speech..."
                required
              />
            </div>
            
            <div className="flex justify-end space-x-4">
              <Link
                to="/voice/text-to-speech"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update TTS
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}