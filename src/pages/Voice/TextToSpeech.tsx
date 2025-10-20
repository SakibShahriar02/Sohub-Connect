import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { showDeleteConfirmation } from "../../utils/deleteConfirmation";
import { useTextToSpeech, TTS } from "../../hooks/useTextToSpeech";

export default function TextToSpeech() {
  const { ttsList, loading, deleteTTS } = useTextToSpeech();

  const handleDelete = (tts: TTS) => {
    showDeleteConfirmation({
      text: `Delete ${tts.tts_name}?`,
      onConfirm: () => deleteTTS(tts.id),
      successText: 'TTS entry has been deleted successfully.'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <PageMeta title="Text To Speech | Voice" description="Text to speech configuration" />
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Text To Speech</h1>
          <Link
            to="/voice/text-to-speech/add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add TTS
          </Link>
        </div>
        
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-8">#</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">TTS Name</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Text Preview</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">Language</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">Status</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assigned To</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {ttsList.map((tts, index) => (
                  <tr key={tts.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {index + 1}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900 dark:text-white">
                      <div className="max-w-32 truncate" title={tts.tts_name}>
                        {tts.tts_name}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900 dark:text-white">
                      <div className="max-w-40 truncate" title={tts.tts_text}>
                        {tts.tts_text.substring(0, 40)}...
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div className="truncate" title={tts.tts_language}>
                        {tts.tts_language}
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        tts.status === 'Active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {tts.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900 dark:text-white">
                      <div className="max-w-32 truncate" title={tts.assign_to || 'Not assigned'}>
                        {tts.assign_to || 'Not assigned'}
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/voice/text-to-speech/edit/${tts.id}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(tts)}
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