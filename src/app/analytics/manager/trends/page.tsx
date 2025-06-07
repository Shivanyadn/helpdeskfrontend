// src/manager/analytics/Trends.tsx

'use client';

import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ManagerSidebar from '@/app/sidebar/ManagerSidebar';
import { Calendar, TrendingUp, Clock, CheckCircle, Download } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Trends = () => {
  const [timePeriod, setTimePeriod] = useState('Last 30 Days');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Example trend data (should be replaced with dynamic data from your backend)
  const trendData = {
    resolutionTime: [60, 45, 70, 80, 50, 65, 90, 110, 95, 80, 55, 60], // Example resolution times over the past 30 days
    responseTime: [30, 40, 35, 50, 45, 25, 30, 35, 40, 50, 45, 30],   // Example response times over the past 30 days
    slaCompliance: [80, 75, 85, 90, 95, 70, 80, 88, 92, 95, 93, 89],  // Example SLA compliance percentage (resolved on time)
  };

  // Calculate averages for KPI cards
  const avgResolutionTime = Math.round(trendData.resolutionTime.reduce((a, b) => a + b, 0) / trendData.resolutionTime.length);
  const avgResponseTime = Math.round(trendData.responseTime.reduce((a, b) => a + b, 0) / trendData.responseTime.length);
  const avgSlaCompliance = Math.round(trendData.slaCompliance.reduce((a, b) => a + b, 0) / trendData.slaCompliance.length);

  // Chart data for trends
  const resolutionTimeChartData = {
    labels: Array.from({ length: trendData.resolutionTime.length }, (_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: 'Resolution Time (min)',
        data: trendData.resolutionTime,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const responseTimeChartData = {
    labels: Array.from({ length: trendData.responseTime.length }, (_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: 'Response Time (min)',
        data: trendData.responseTime,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const slaComplianceChartData = {
    labels: Array.from({ length: trendData.slaCompliance.length }, (_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: 'SLA Compliance (%)',
        data: trendData.slaCompliance,
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Function to export data as CSV
  const exportData = () => {
    alert('Data export functionality would be implemented here');
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const, // Explicitly set to a valid value
      },
      tooltip: {
        enabled: true,
        mode: 'index' as const, // Explicitly set to a valid value
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: 'Days',
        },
      },
      y: {
        grid: {
          color: 'rgba(200, 200, 200, 0.2)',
        },
        title: {
          display: true,
          text: 'Values',
        },
      },
    },
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ManagerSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <div className="p-6">
          {/* Header with title and actions */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Analytics Trends</h1>
                <p className="text-gray-600">Track performance metrics over time</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="Last 7 Days">Last 7 Days</option>
                  <option value="Last 30 Days">Last 30 Days</option>
                  <option value="Last 90 Days">Last 90 Days</option>
                </select>
              </div>
              
              <button 
                onClick={exportData}
                className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
              >
                <Download className="h-4 w-4 mr-2 text-gray-600" />
                Export Data
              </button>
            </div>
          </div>
          
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-teal-100 mr-4">
                  <Clock className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Avg. Resolution Time</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold text-gray-800">{avgResolutionTime}</h3>
                    <span className="ml-1 text-gray-600">min</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 mr-4">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Avg. Response Time</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold text-gray-800">{avgResponseTime}</h3>
                    <span className="ml-1 text-gray-600">min</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-100 mr-4">
                  <CheckCircle className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Avg. SLA Compliance</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold text-gray-800">{avgSlaCompliance}</h3>
                    <span className="ml-1 text-gray-600">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs for chart selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`py-4 px-6 font-medium text-sm border-b-2 ${
                    activeTab === 'all'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  All Metrics
                </button>
                <button
                  onClick={() => setActiveTab('resolution')}
                  className={`py-4 px-6 font-medium text-sm border-b-2 ${
                    activeTab === 'resolution'
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Resolution Time
                </button>
                <button
                  onClick={() => setActiveTab('response')}
                  className={`py-4 px-6 font-medium text-sm border-b-2 ${
                    activeTab === 'response'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Response Time
                </button>
                <button
                  onClick={() => setActiveTab('sla')}
                  className={`py-4 px-6 font-medium text-sm border-b-2 ${
                    activeTab === 'sla'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  SLA Compliance
                </button>
                <button
                  onClick={() => setActiveTab('comparison')}
                  className={`py-4 px-6 font-medium text-sm border-b-2 ${
                    activeTab === 'comparison'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Comparison
                </button>
              </nav>
            </div>
            
            <div className="p-6">
              {/* Chart content based on active tab */}
              {(activeTab === 'all' || activeTab === 'resolution') && (
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-teal-500 rounded-full mr-2"></div>
                    <h3 className="font-semibold text-lg text-gray-800">Resolution Time Trend</h3>
                  </div>
                  <div className="h-[300px] w-full">
                    <Line data={resolutionTimeChartData} options={chartOptions} />
                  </div>
                </div>
              )}
              
              {(activeTab === 'all' || activeTab === 'response') && (
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <h3 className="font-semibold text-lg text-gray-800">Response Time Trend</h3>
                  </div>
                  <div className="h-[300px] w-full">
                    <Line data={responseTimeChartData} options={chartOptions} />
                  </div>
                </div>
              )}
              
              {(activeTab === 'all' || activeTab === 'sla') && (
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    <h3 className="font-semibold text-lg text-gray-800">SLA Compliance Trend</h3>
                  </div>
                  <div className="h-[300px] w-full">
                    <Line data={slaComplianceChartData} options={chartOptions} />
                  </div>
                </div>
              )}
              
              {(activeTab === 'all' || activeTab === 'comparison') && (
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <h3 className="font-semibold text-lg text-gray-800">Resolution vs Response Time</h3>
                  </div>
                  <div className="h-[300px] w-full">
                    <Bar
                      data={{
                        labels: Array.from({ length: trendData.resolutionTime.length }, (_, i) => `Day ${i + 1}`),
                        datasets: [
                          {
                            label: 'Resolution Time (min)',
                            data: trendData.resolutionTime,
                            backgroundColor: 'rgba(75, 192, 192, 0.7)',
                            borderRadius: 4,
                          },
                          {
                            label: 'Response Time (min)',
                            data: trendData.responseTime,
                            backgroundColor: 'rgba(153, 102, 255, 0.7)',
                            borderRadius: 4,
                          },
                        ],
                      }}
                      options={chartOptions}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Insights section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">Key Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-2">Resolution Time</h4>
                <p className="text-blue-700">Average resolution time has decreased by 15% compared to the previous period, indicating improved efficiency.</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <h4 className="font-medium text-green-800 mb-2">SLA Compliance</h4>
                <p className="text-green-700">SLA compliance has maintained above 85% throughout the period, with a peak of 95% on day 5.</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <h4 className="font-medium text-purple-800 mb-2">Response Time</h4>
                <p className="text-purple-700">Response times show consistent performance with an average of {avgResponseTime} minutes across all tickets.</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <h4 className="font-medium text-yellow-800 mb-2">Recommendation</h4>
                <p className="text-yellow-700">Focus on maintaining the current response time while working to further reduce resolution times for complex issues.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trends;
