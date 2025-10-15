import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";

interface LoginCredential {
  id: number;
  user_id: number;
  username: string;
  role: string;
  active: number;
  last_login: string;
  created_at: string;
}

const dummyCredentials: LoginCredential[] = [
  {
    id: 1,
    user_id: 1,
    username: "john.doe",
    role: "Admin",
    active: 1,
    last_login: "2024-01-15 10:30:00",
    created_at: "2023-01-15 09:00:00"
  },
  {
    id: 2,
    user_id: 2,
    username: "jane.smith",
    role: "User",
    active: 1,
    last_login: "2024-01-14 16:45:00",
    created_at: "2023-02-20 11:30:00"
  },
  {
    id: 3,
    user_id: 3,
    username: "mike.johnson",
    role: "Manager",
    active: 0,
    last_login: "2024-01-10 14:20:00",
    created_at: "2023-03-10 08:15:00"
  }
];

export default function LoginDeactivate() {
  const [credentials, setCredentials] = useState<LoginCredential[]>(dummyCredentials);

  const toggleActive = (id: number) => {
    setCredentials(prev => 
      prev.map(cred => 
        cred.id === id ? { ...cred, active: cred.active === 1 ? 0 : 1 } : cred
      )
    );
  };

  return (
    <>
      <PageMeta title="Login Deactivate | User Management" description="Deactivate user login access" />
      
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Login Deactivate</h1>
        
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {credentials.map((credential) => (
                  <tr key={credential.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {credential.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {credential.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {credential.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        credential.active === 1
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {credential.active === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(credential.last_login).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => toggleActive(credential.id)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          credential.active === 1
                            ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30'
                            : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30'
                        }`}
                      >
                        {credential.active === 1 ? 'Deactivate' : 'Activate'}
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