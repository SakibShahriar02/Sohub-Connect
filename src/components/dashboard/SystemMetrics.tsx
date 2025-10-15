import { useEffect, useState } from 'react';

export default function SystemMetrics() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const secondAngle = (time.getSeconds() * 6) - 90;
  const minuteAngle = (time.getMinutes() * 6) - 90;
  const hourAngle = ((time.getHours() % 12) * 30 + time.getMinutes() * 0.5) - 90;

  const systemData = [
    {
      name: "CPU Usage",
      value: 0.5,
      total: "8 Cores",
      usage: "0.04GHz",
      color: "bg-blue-500",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      )
    },
    {
      name: "Memory",
      value: 8.83,
      total: "15.51 GB",
      usage: "1.37 GB",
      color: "bg-green-500",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      )
    },
    {
      name: "Disk Space",
      value: 37.49,
      total: "49.98 GB",
      usage: "18.74 GB",
      color: "bg-orange-500",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] h-full flex flex-col">
      {/* Analog Clock */}
      <div className="mb-6">
        <div className="flex flex-col items-center space-y-3">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">Current Time</h4>
          
          {/* Clock */}
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24" viewBox="0 0 100 100">
              {/* Clock face */}
              <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300 dark:text-gray-600" />
              
              {/* Hour markers */}
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30) - 90;
                const x1 = 50 + 40 * Math.cos(angle * Math.PI / 180);
                const y1 = 50 + 40 * Math.sin(angle * Math.PI / 180);
                const x2 = 50 + 35 * Math.cos(angle * Math.PI / 180);
                const y2 = 50 + 35 * Math.sin(angle * Math.PI / 180);
                return (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2" className="text-gray-400 dark:text-gray-500" />
                );
              })}
              
              {/* Hour hand */}
              <line
                x1="50" y1="50"
                x2={50 + 25 * Math.cos(hourAngle * Math.PI / 180)}
                y2={50 + 25 * Math.sin(hourAngle * Math.PI / 180)}
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                className="text-gray-700 dark:text-gray-300"
              />
              
              {/* Minute hand */}
              <line
                x1="50" y1="50"
                x2={50 + 35 * Math.cos(minuteAngle * Math.PI / 180)}
                y2={50 + 35 * Math.sin(minuteAngle * Math.PI / 180)}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-gray-600 dark:text-gray-400"
              />
              
              {/* Second hand */}
              <line
                x1="50" y1="50"
                x2={50 + 38 * Math.cos(secondAngle * Math.PI / 180)}
                y2={50 + 38 * Math.sin(secondAngle * Math.PI / 180)}
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                className="text-red-500"
              />
              
              {/* Center dot */}
              <circle cx="50" cy="50" r="3" fill="currentColor" className="text-gray-700 dark:text-gray-300" />
            </svg>
          </div>
          
          {/* Digital time */}
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {time.toLocaleTimeString('en-US', { hour12: true })}
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          System Status
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-600 dark:text-green-400">Online</span>
        </div>
      </div>
      
      {/* System Metrics */}
      <div className="space-y-6">
        {systemData.map((item, index) => (
          <div key={index} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-gray-600 dark:text-gray-400">
                    {item.icon}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.usage} / {item.total}
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {item.value}%
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${item.color}`}
                style={{ width: `${Math.min(item.value, 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}