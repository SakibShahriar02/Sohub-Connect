export default function SystemMetrics() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
        Current Status
      </h3>
      
      <div className="space-y-6">
        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-gray-800 dark:text-white/90">Running</span>
          </div>
        </div>

        {/* CPU Info */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-800 dark:text-white/90">CPU Info</h4>
          <div className="pl-4 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Total Cores:</span>
              <span className="text-gray-800 dark:text-white/90">8</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Use:</span>
              <span className="text-gray-800 dark:text-white/90">0.04GHz / 0.50%</span>
            </div>
          </div>
        </div>

        {/* Memory Info */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-800 dark:text-white/90">Memory Info</h4>
          <div className="pl-4 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Total:</span>
              <span className="text-gray-800 dark:text-white/90">15.51 GB</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Use:</span>
              <span className="text-gray-800 dark:text-white/90">8.83%</span>
            </div>
          </div>
        </div>

        {/* Disk Space Info */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-800 dark:text-white/90">Disk Space Info</h4>
          <div className="pl-4 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Total:</span>
              <span className="text-gray-800 dark:text-white/90">49.98 GB</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Use:</span>
              <span className="text-gray-800 dark:text-white/90">37.49%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}