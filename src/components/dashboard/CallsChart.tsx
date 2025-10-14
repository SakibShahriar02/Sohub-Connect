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
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
        Last 7 Days Calls
      </h3>
      <div className="max-w-full overflow-x-auto">
        <Chart options={options} series={series} type="area" height={300} />
      </div>
    </div>
  );
}