import PageMeta from "../../../components/common/PageMeta";

export default function Extensions() {
  return (
    <>
      <PageMeta title="Extensions | Voice" description="PBX Extensions management" />
      
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Extensions</h1>
        
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-2">Extensions</h3>
            <p className="text-gray-600 dark:text-gray-400">Manage PBX extensions and user configurations.</p>
          </div>
        </div>
      </div>
    </>
  );
}