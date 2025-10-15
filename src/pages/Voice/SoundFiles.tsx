import { useState } from "react";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";

interface SoundFile {
  id: number;
  date_time: string;
  update_datetime: string;
  sound_name: string;
  file_name: string;
  status: string;
  assign_to: string;
}

const dummySoundFiles: SoundFile[] = [
  {
    id: 1,
    date_time: "2024-01-15 10:30:00",
    update_datetime: "2024-01-15 10:30:00",
    sound_name: "Welcome Message",
    file_name: "welcome.wav",
    status: "Active",
    assign_to: "Main IVR"
  },
  {
    id: 2,
    date_time: "2024-01-14 14:20:00",
    update_datetime: "2024-01-16 09:15:00",
    sound_name: "Hold Music",
    file_name: "hold_music.mp3",
    status: "Active",
    assign_to: "Queue System"
  },
  {
    id: 3,
    date_time: "2024-01-13 09:15:00",
    update_datetime: "2024-01-13 09:15:00",
    sound_name: "Goodbye Message",
    file_name: "goodbye.wav",
    status: "Inactive",
    assign_to: "Call End"
  },
  {
    id: 4,
    date_time: "2024-01-12 16:45:00",
    update_datetime: "2024-01-14 11:30:00",
    sound_name: "Business Hours",
    file_name: "business_hours.wav",
    status: "Active",
    assign_to: "Time Routing"
  },
  {
    id: 5,
    date_time: "2024-01-11 11:20:00",
    update_datetime: "2024-01-11 11:20:00",
    sound_name: "Emergency Alert",
    file_name: "emergency.wav",
    status: "Active",
    assign_to: "Emergency System"
  },
  {
    id: 6,
    date_time: "2024-01-10 08:30:00",
    update_datetime: "2024-01-12 14:20:00",
    sound_name: "Menu Options",
    file_name: "menu_options.wav",
    status: "Active",
    assign_to: "Main Menu"
  }
];

export default function SoundFiles() {
  const [soundFiles, setSoundFiles] = useState<SoundFile[]>(dummySoundFiles);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this sound file?')) {
      setSoundFiles(soundFiles.filter(file => file.id !== id));
    }
  };

  return (
    <>
      <PageMeta title="Sound Files | Voice" description="Sound file management" />
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Sound Files</h1>
          <Link
            to="/voice/sound-files/add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add Sound File
          </Link>
        </div>
        
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sound Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">File Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Updated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {soundFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {file.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {file.sound_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {file.file_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        file.status === 'Active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {file.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {file.assign_to}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(file.date_time).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(file.update_datetime).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        to={`/voice/sound-files/edit/${file.id}`}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(file.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
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