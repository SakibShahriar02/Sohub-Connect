import SystemMetrics from "../../components/dashboard/SystemMetrics";
import CallMetrics from "../../components/dashboard/CallMetrics";
import CallsChart from "../../components/dashboard/CallsChart";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Dashboard | SOHUB Connect"
        description="This is Dashboard page for SOHUB Connect"
      />
      
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor your system performance and call analytics in real-time
        </p>
      </div>

      {/* Main Dashboard Grid */}
      <div className="space-y-6">
        {/* Top Row - Metrics Cards */}
        <div className="grid grid-cols-1 gap-6">
          <CallMetrics />
        </div>

        {/* Middle Row - Chart and System Info */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <CallsChart />
          </div>
          <div className="xl:col-span-1">
            <SystemMetrics />
          </div>
        </div>
      </div>
    </>
  );
}
