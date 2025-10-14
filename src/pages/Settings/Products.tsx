import PageMeta from "../../components/common/PageMeta";

export default function Products() {
  return (
    <>
      <PageMeta title="Products | Settings" description="Manage products and services" />
      
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Products</h1>
        
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-2">Products</h3>
            <p className="text-gray-600 dark:text-gray-400">Configure products, services, and pricing options.</p>
          </div>
        </div>
      </div>
    </>
  );
}