import PageMeta from "../../components/common/PageMeta";

export default function CallFlow() {
  return (
    <>
      <PageMeta title="Call Flow | Voice" description="Call flow management" />
      
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Call Flow</h1>
        
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-2">Coming Soon</h3>
            <p className="text-gray-600 dark:text-gray-400">Call Flow management feature is under development and will be available soon.</p>
          </div>
        </div>
      </div>
    </>
  );
}