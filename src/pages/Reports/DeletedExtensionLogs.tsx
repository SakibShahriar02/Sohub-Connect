import PageMeta from "../../components/common/PageMeta";

export default function DeletedExtensionLogs() {
  return (
    <>
      <PageMeta title="Deleted Extension Logs | Reports" description="Deleted extension logs and audit trail" />
      
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Deleted Extension Logs</h1>
        
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-2">Deleted Extension Logs</h3>
            <p className="text-gray-600 dark:text-gray-400">View logs of deleted extensions and audit trail information.</p>
          </div>
        </div>
      </div>
    </>
  );
}