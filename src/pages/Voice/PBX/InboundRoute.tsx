import PageMeta from "../../../components/common/PageMeta";

export default function InboundRoute() {
  return (
    <>
      <PageMeta title="Inbound Route | Voice" description="PBX Inbound Route management" />
      
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Inbound Route</h1>
        
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-2">Inbound Route</h3>
            <p className="text-gray-600 dark:text-gray-400">Configure inbound call routing rules and destinations.</p>
          </div>
        </div>
      </div>
    </>
  );
}