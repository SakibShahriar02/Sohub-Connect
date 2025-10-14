export default function CallMetrics() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Running Calls */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="text-center">
          <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">0</h4>
          <span className="text-sm text-gray-500 dark:text-gray-400">Running Calls</span>
        </div>
      </div>

      {/* Total Answered Calls (Today) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="text-center">
          <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">13</h4>
          <span className="text-sm text-gray-500 dark:text-gray-400">Total Answered Calls (Today)</span>
        </div>
      </div>

      {/* Total Answered Calls (This Month) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:col-span-2 lg:col-span-2">
        <div className="text-center">
          <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">968</h4>
          <span className="text-sm text-gray-500 dark:text-gray-400">Total Answered Calls (This Month)</span>
        </div>
      </div>
    </div>
  );
}