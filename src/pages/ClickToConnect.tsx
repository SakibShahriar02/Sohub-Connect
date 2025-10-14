import PageMeta from "../components/common/PageMeta";

export default function ClickToConnect() {
  return (
    <>
      <PageMeta title="Click to Connect | SOHUB Connect" description="Click to Connect feature coming soon" />
      
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="mb-8">
            <svg className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white/90 mb-4">
            Click to Connect
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            This feature is coming soon. Stay tuned for updates!
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium dark:bg-blue-900 dark:text-blue-200">
            🚀 Coming Soon
          </div>
        </div>
      </div>
    </>
  );
}