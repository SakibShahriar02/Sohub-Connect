import { useState } from "react";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { showDeleteConfirmation } from "../../utils/deleteConfirmation";

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
  },
  {
    id: 4,
    date_time: "2024-01-12 16:45:00",
    tts_name: "Spanish Welcome",
    tts_text: "Bienvenido a nuestro servicio al cliente. Por favor espere mientras lo conectamos con el próximo agente disponible.",
    tts_language: "Spanish (ES)",
    status: "Active",
    assign_to: "Spanish IVR"
  },
  {
    id: 5,
    date_time: "2024-01-11 11:20:00",
    tts_name: "Emergency Alert",
    tts_text: "This is an emergency notification. Please follow the instructions provided by your supervisor.",
    tts_language: "English (US)",
    status: "Inactive",
    assign_to: "Emergency System"
  },
  {
    id: 6,
    date_time: "2024-01-10 08:30:00",
    tts_name: "Thank You Message",
    tts_text: "Thank you for calling. Your call is important to us. Have a great day!",
    tts_language: "English (US)",
    status: "Active",
    assign_to: "Call End"
  }
];

export default function TextToSpeech() {
  const [ttsList, setTtsList] = useState<TTS[]>(dummyTTS);

  const handleDelete = (tts: TTS) => {
    showDeleteConfirmation({
      text: `Delete ${tts.tts_name}?`,
      onConfirm: () => setTtsList(ttsList.filter(t => t.id !== tts.id)),
      successText: 'TTS entry has been deleted successfully.'
    });
  };

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
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">ID</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">TTS Name</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Text Preview</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">Language</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">Status</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assigned To</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {ttsList.map((tts) => (
                  <tr key={tts.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {tts.id}
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
                        {tts.tts_language.replace(' (US)', '').replace(' (ES)', '')}
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
                      <div className="max-w-32 truncate" title={tts.assign_to}>
                        {tts.assign_to}
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