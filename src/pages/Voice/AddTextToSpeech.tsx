import { useState } from 'react';
import { useNavigate } from 'react-router';
import PageMeta from '../../components/common/PageMeta';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import { useUsers } from '../../hooks/useUsers';
import Swal from 'sweetalert2';

const languages = [
  'English (US)',
  'English (UK)',
  'Spanish (ES)',
  'French (FR)',
  'German (DE)',
  'Italian (IT)',
  'Portuguese (PT)',
  'Dutch (NL)',
  'Russian (RU)',
  'Chinese (CN)',
  'Japanese (JP)',
  'Korean (KR)',
  'Arabic (AR)',
  'Hindi (IN)'
];

export default function AddTextToSpeech() {
  const navigate = useNavigate();
  const { addTTS } = useTextToSpeech();
  const { users } = useUsers();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tts_name: '',
    tts_text: '',
    tts_language: 'English (US)',
    assign_to: '',
    status: 'Active' as 'Active' | 'Inactive'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tts_name.trim() || !formData.tts_text.trim()) {
      Swal.fire('Error', 'Please fill in all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      await addTTS(formData);
      Swal.fire('Success', 'TTS entry has been added successfully', 'success');
      navigate('/voice/text-to-speech');
    } catch (error) {
      Swal.fire('Error', error instanceof Error ? error.message : 'Failed to add TTS entry', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="Add Text To Speech | Voice" description="Add new text to speech entry" />
      
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/voice/text-to-speech')}
            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Add Text To Speech</h1>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  TTS Name *
                </label>
                <input
                  type="text"
                  value={formData.tts_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, tts_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter TTS name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Language
                </label>
                <select
                  value={formData.tts_language}
                  onChange={(e) => setFormData(prev => ({ ...prev, tts_language: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assign To
                </label>
                <select
                  value={formData.assign_to}
                  onChange={(e) => setFormData(prev => ({ ...prev, assign_to: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">Select User</option>
                  {users.map(user => (
                    <option key={user.id} value={user.full_name || user.email}>
                      {user.full_name || user.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'Active' | 'Inactive' }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                TTS Text *
              </label>
              <textarea
                value={formData.tts_text}
                onChange={(e) => setFormData(prev => ({ ...prev, tts_text: e.target.value }))}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                placeholder="Enter the text that will be converted to speech..."
                required
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Character count: {formData.tts_text.length}
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/voice/text-to-speech')}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
              >
                {loading ? 'Adding...' : 'Add TTS'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}