import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function CallsChart() {
  const options: ApexOptions = {
    legend: {
      show: false,
    },
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 300,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.4,
        opacityTo: 0.1,
      },
    },
    markers: {
      size: 5,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 7,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (val) {
          return val + " calls";
        },
      },
    },
    xaxis: {
      type: "category",
      categories: [
        "Mon",
        "Tue", 
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
      title: {
        text: "",
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  const series = [
    {
      name: "Calls",
      data: [45, 52, 38, 67, 49, 43, 58],
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Call Analytics
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Last 7 days performance overview
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Calls</span>
          </div>
        </div>
      </div>
      
      {/* Chart */}
      <div className="max-w-full overflow-hidden">
        <Chart options={options} series={series} type="area" height={300} />
      </div>
      
      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Peak Day</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">Thu</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Average</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">50.3</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">352</p>
          </div>
        </div>
      </div>
    </div>
  );
}