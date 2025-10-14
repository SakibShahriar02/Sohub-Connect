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
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 xl:col-span-4">
          <SystemMetrics />
        </div>

        <div className="col-span-12 xl:col-span-8">
          <CallsChart />
        </div>

        <div className="col-span-12">
          <CallMetrics />
        </div>
      </div>
    </>
  );
}
