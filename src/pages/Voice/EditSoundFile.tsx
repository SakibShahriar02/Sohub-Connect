import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { useSoundFiles } from "../../hooks/useSoundFilesLocal";
import Swal from 'sweetalert2';

export default function EditSoundFile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { soundFiles, updateSoundFile } = useSoundFiles();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    sound_name: '',
    file_name: '',
    status: 'Active' as 'Active' | 'Inactive',
    assign_to: ''
  });

  useEffect(() => {
    if (id && soundFiles.length > 0) {
      const soundFile = soundFiles.find(sf => sf.id === parseInt(id));
      if (soundFile) {
        setFormData({
          sound_name: soundFile.sound_name,
          file_name: soundFile.file_name,
          status: soundFile.status,
          assign_to: soundFile.assign_to
        });
      }
    }
  }, [id, soundFiles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;

    setLoading(true);
    try {
      await updateSoundFile(parseInt(id), formData, selectedFile || undefined);
      Swal.fire('Success', 'Sound file updated successfully!', 'success');
      navigate('/voice/sound-files');
    } catch (error) {
      Swal.fire('Error', 'Failed to update sound file', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <>
      <PageMeta title="Edit Sound File | Voice" description="Edit sound file" />
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Edit Sound File</h1>
          <Link
            to="/voice/sound-files"
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
                  Sound Name *
                </label>
                <input
                  type="text"
                  name="sound_name"
                  value={formData.sound_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current File
                </label>
                <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                  {formData.file_name}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Replace File (Optional)
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
                {selectedFile && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    New file: {selectedFile.name}
                  </p>
                )}
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
              
              <div className="md:col-span-2">
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
            
            <div className="flex justify-end space-x-4">
              <Link
                to="/voice/sound-files"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Sound File'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}