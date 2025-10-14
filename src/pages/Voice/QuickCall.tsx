import PageMeta from "../../components/common/PageMeta";

export default function QuickCall() {
  return (
    <>
      <PageMeta title="Quick Call | Voice" description="Quick call functionality" />
      
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Quick Call</h1>
        
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-2">Quick Call</h3>
            <p className="text-gray-600 dark:text-gray-400">Manage quick call shortcuts and speed dial configurations.</p>
          </div>
        </div>
      </div>
    </>
  );
}