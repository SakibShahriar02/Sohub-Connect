import PageMeta from "../../components/common/PageMeta";

export default function SoundFiles() {
  return (
    <>
      <PageMeta title="Sound Files | Voice" description="Sound file management" />
      
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Sound Files</h1>
        
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.59-.79-1.59-1.76V9.51c0-.97.71-1.76 1.59-1.76h2.24z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-2">Sound Files</h3>
            <p className="text-gray-600 dark:text-gray-400">Upload and manage audio files for voice prompts and messages.</p>
          </div>
        </div>
      </div>
    </>
  );
}