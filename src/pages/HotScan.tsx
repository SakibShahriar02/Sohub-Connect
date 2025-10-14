import PageMeta from "../components/common/PageMeta";

export default function HotScan() {
  return (
    <>
      <PageMeta title="Hot Scan | SOHUB Connect" description="Hot Scan feature coming soon" />
      
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="mb-8">
            <svg className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white/90 mb-4">
            Hot Scan
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            This feature is coming soon. Stay tuned for updates!
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium dark:bg-orange-900 dark:text-orange-200">
            🔥 Coming Soon
          </div>
        </div>
      </div>
    </>
  );
}