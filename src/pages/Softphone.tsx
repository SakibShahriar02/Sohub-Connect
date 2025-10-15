import PageMeta from '../components/common/PageMeta';

export default function Softphone() {
  return (
    <>
      <PageMeta
        title="Softphone | SOHUB Connect"
        description="Softphone application coming soon"
      />
      
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Softphone
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Coming Soon
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              We're working hard to bring you an amazing softphone experience. Stay tuned!
            </p>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">
                Expected launch: Q2 2025
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}