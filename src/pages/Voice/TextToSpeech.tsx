import PageMeta from "../../components/common/PageMeta";

export default function TextToSpeech() {
  return (
    <>
      <PageMeta title="Text To Speech | Voice" description="Text to speech configuration" />
      
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Text To Speech</h1>
        
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.691 1.359 3.059 3.05 3.059h4.1a2.25 2.25 0 002.227-1.932L12 18.75a.75.75 0 011.5 0l.773 4.317A2.25 2.25 0 0016.5 21h4.1c1.691 0 3.05-1.368 3.05-3.059V6.309c0-1.691-1.359-3.059-3.05-3.059H16.5a2.25 2.25 0 00-2.227 1.932L12 9.75a.75.75 0 01-1.5 0L9.727 5.182A2.25 2.25 0 007.5 3.25H3.4c-1.691 0-3.05 1.368-3.05 3.059v11.582z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-2">Text To Speech</h3>
            <p className="text-gray-600 dark:text-gray-400">Configure text-to-speech settings and voice options.</p>
          </div>
        </div>
      </div>
    </>
  );
}