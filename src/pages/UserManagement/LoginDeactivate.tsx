import PageMeta from "../../components/common/PageMeta";

export default function LoginDeactivate() {
  return (
    <>
      <PageMeta title="Login Deactivate | User Management" description="Deactivate user login access" />
      
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Login Deactivate</h1>
        
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-2">Login Deactivate</h3>
            <p className="text-gray-600 dark:text-gray-400">Deactivate user login access and manage account restrictions.</p>
          </div>
        </div>
      </div>
    </>
  );
}