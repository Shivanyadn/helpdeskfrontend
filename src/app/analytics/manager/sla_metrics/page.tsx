// src/manager/analytics/SLAMetrics.tsx

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import ManagerSidebar from '@/app/sidebar/ManagerSidebar';
import { Calendar, TrendingUp, Clock, CheckCircle, AlertTriangle, Download, Filter } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const SLAMetrics = () => {
  const [filter, setFilter] = useState('Last 7 Days');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const chartRef = useRef<ChartJS<'line'> | null>(null);

  // Example ticket data for SLA metrics
  const tickets = [
    { id: 1, resolvedOnTime: true, responseTime: 30, resolutionTime: 60, priority: 'High', category: 'Technical' },
    { id: 2, resolvedOnTime: false, responseTime: 120, resolutionTime: 180, priority: 'Medium', category: 'Billing' },
    { id: 3, resolvedOnTime: true, responseTime: 45, resolutionTime: 90, priority: 'Low', category: 'Account' },
    { id: 4, resolvedOnTime: false, responseTime: 200, resolutionTime: 250, priority: 'High', category: 'Technical' },
    { id: 5, resolvedOnTime: true, responseTime: 30, resolutionTime: 75, priority: 'Medium', category: 'General' },
  ];

  // Calculate metrics
  const totalTickets = tickets.length;
  const resolvedOnTime = tickets.filter(t => t.resolvedOnTime).length;
  const overdueTickets = totalTickets - resolvedOnTime;
  const avgResponseTime = tickets.reduce((acc, t) => acc + t.responseTime, 0) / totalTickets;
  const avgResolutionTime = tickets.reduce((acc, t) => acc + t.resolutionTime, 0) / totalTickets;
  const slaComplianceRate = (resolvedOnTime / totalTickets) * 100;

  // Chart data
  const chartData = {
    trend: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      datasets: [
        {
          label: 'Resolved On Time',
          data: [4, 3, 5, 2, 4],
          borderColor: 'rgba(34, 197, 94, 1)',
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
        },
        {
          label: 'Overdue Tickets',
          data: [1, 2, 1, 3, 1],
          borderColor: 'rgba(239, 68, 68, 1)',
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
        },
      ],
    },
    compliance: {
      labels: ['Resolved On Time', 'Overdue'],
      datasets: [{
        data: [resolvedOnTime, overdueTickets],
        backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.8)'],
        borderColor: ['rgba(34, 197, 94, 1)', 'rgba(239, 68, 68, 1)'],
        borderWidth: 1,
      }],
    },
    responseTime: {
      labels: ['High', 'Medium', 'Low'],
      datasets: [{
        label: 'Avg. Response Time (min)',
        data: [
          tickets.filter(t => t.priority === 'High').reduce((acc, t) => acc + t.responseTime, 0) / 
            tickets.filter(t => t.priority === 'High').length || 0,
          tickets.filter(t => t.priority === 'Medium').reduce((acc, t) => acc + t.responseTime, 0) / 
            tickets.filter(t => t.priority === 'Medium').length || 0,
          tickets.filter(t => t.priority === 'Low').reduce((acc, t) => acc + t.responseTime, 0) / 
            tickets.filter(t => t.priority === 'Low').length || 0,
        ],
        backgroundColor: ['rgba(239, 68, 68, 0.7)', 'rgba(249, 115, 22, 0.7)', 'rgba(59, 130, 246, 0.7)'],
        borderRadius: 4,
      }],
    },
    responseVsResolution: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      datasets: [
        {
          label: 'Avg. Response Time',
          data: [30, 45, 35, 60, 40],
          borderColor: 'rgba(124, 58, 237, 1)',
          backgroundColor: 'rgba(124, 58, 237, 0.2)',
          fill: false,
          tension: 0.4,
          borderWidth: 2,
        },
        {
          label: 'Avg. Resolution Time',
          data: [90, 120, 100, 150, 110],
          borderColor: 'rgba(249, 115, 22, 1)',
          backgroundColor: 'rgba(249, 115, 22, 0.2)',
          fill: false,
          tension: 0.4,
          borderWidth: 2,
        },
      ],
    }
  };

  // Update chart when sidebar state changes
  useEffect(() => {
    if (chartRef.current) setTimeout(() => chartRef.current?.update(), 300);
  }, [sidebarOpen]);

  // Chart options
  const opts = {
    chart: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: { usePointStyle: true, padding: 20, font: { size: 12 } }
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#333',
          bodyColor: '#666',
          borderColor: '#ddd',
          borderWidth: 1,
          padding: 10,
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
          mode: 'index' as const,
          intersect: false,
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0, 0, 0, 0.05)' },
          ticks: { color: '#666' }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#666' }
        }
      },
      interaction: {
        mode: 'index' as const,
        intersect: false,
      }
    },
    doughnut: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: { usePointStyle: true, padding: 20, font: { size: 12 } }
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#333',
          bodyColor: '#666',
          borderColor: '#ddd',
          borderWidth: 1,
          padding: 10,
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
        }
      }
    }
  };

  // Reusable Tailwind classes
  const tw = {
    card: "bg-white rounded-lg shadow-sm border border-gray-200",
    cardPadded: "bg-white rounded-lg shadow-sm border border-gray-200 p-6",
    iconContainer: "p-3 rounded-full mr-4",
    tabButton: "py-4 px-6 font-medium text-sm border-b-2 whitespace-nowrap",
    activeTab: "border-blue-500 text-blue-600",
    inactiveTab: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
    insightCard: "p-4 rounded-lg border",
    tableHeader: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
    tableCell: "px-6 py-4 whitespace-nowrap text-sm",
    badge: "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
    chartContainer: "h-[300px]",
    chartContainerLg: "h-[400px]",
    sectionTitle: "font-semibold text-lg text-gray-800 mb-4",
    kpiCards: [
      { icon: <Filter className="h-6 w-6 text-blue-600" />, bg: "bg-blue-100", title: "Total Tickets", value: totalTickets },
      { icon: <CheckCircle className="h-6 w-6 text-green-600" />, bg: "bg-green-100", title: "SLA Compliance", value: `${slaComplianceRate.toFixed(1)}%` },
      { icon: <Clock className="h-6 w-6 text-purple-600" />, bg: "bg-purple-100", title: "Avg. Response Time", value: `${avgResponseTime.toFixed(1)} min` },
      { icon: <AlertTriangle className="h-6 w-6 text-orange-600" />, bg: "bg-orange-100", title: "Avg. Resolution Time", value: `${avgResolutionTime.toFixed(1)} min` }
    ],
    insights: [
      { bg: "bg-blue-50", border: "border-blue-100", title: { color: "text-blue-800", text: "SLA Compliance" }, 
        content: { color: "text-blue-700", text: `Current SLA compliance rate is at ${slaComplianceRate.toFixed(1)}%, which is ${slaComplianceRate >= 80 ? 'within' : 'below'} the target range.` } },
      { bg: "bg-green-50", border: "border-green-100", title: { color: "text-green-800", text: "Response Time" }, 
        content: { color: "text-green-700", text: `Average response time is ${avgResponseTime.toFixed(1)} minutes, which is ${avgResponseTime <= 60 ? 'better than' : 'exceeding'} the target of 60 minutes.` } },
      { bg: "bg-purple-50", border: "border-purple-100", title: { color: "text-purple-800", text: "Resolution Time" }, 
        content: { color: "text-purple-700", text: `Average resolution time is ${avgResolutionTime.toFixed(1)} minutes, which is ${avgResolutionTime <= 120 ? 'within' : 'exceeding'} the expected timeframe.` } },
      { bg: "bg-yellow-50", border: "border-yellow-100", title: { color: "text-yellow-800", text: "Recommendation" }, 
        content: { color: "text-yellow-700", text: "Focus on improving response times for high-priority tickets to enhance overall SLA compliance." } }
    ],
    tabs: [
      { id: 'overview', label: 'Overview' },
      { id: 'trends', label: 'Trends' },
      { id: 'by-priority', label: 'By Priority' },
      { id: 'details', label: 'Detailed Metrics' }
    ]
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ManagerSidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">SLA Metrics Analytics</h1>
                <p className="text-gray-600">Monitor service level agreement performance</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  {['Last 7 Days', 'Last 30 Days', 'Last 90 Days'].map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              <button 
                onClick={() => alert('Data export functionality would be implemented here')}
                className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
              >
                <Download className="h-4 w-4 mr-2 text-gray-600" />
                Export Data
              </button>
            </div>
          </div>
          
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {tw.kpiCards.map((card, i) => (
              <div key={i} className={tw.cardPadded}>
                <div className="flex items-center">
                  <div className={`${tw.iconContainer} ${card.bg}`}>{card.icon}</div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                    <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Tabs */}
          <div className={`${tw.card} overflow-hidden mb-6`}>
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px overflow-x-auto">
                {tw.tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${tw.tabButton} ${activeTab === tab.id ? tw.activeTab : tw.inactiveTab}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className={tw.sectionTitle}>SLA Compliance</h3>
                    <div className={`${tw.chartContainer} relative`}>
                      <Doughnut data={chartData.compliance} options={opts.doughnut} />
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-3xl font-bold text-gray-800">{slaComplianceRate.toFixed(1)}%</span>
                        <span className="text-sm text-gray-500">Compliance</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className={tw.sectionTitle}>Response vs Resolution Time</h3>
                    <div className={tw.chartContainer}>
                      <Line data={chartData.responseVsResolution} options={opts.chart} />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Trends Tab */}
              {activeTab === 'trends' && (
                <div>
                  <h3 className={tw.sectionTitle}>SLA Compliance Trend</h3>
                  <div className={tw.chartContainerLg}>
                    <Line 
                      data={chartData.trend} 
                      options={opts.chart} 
                      ref={chartRef}
                      key={`chart-${sidebarOpen}`}
                    />
                  </div>
                </div>
              )}
              
              {/* By Priority Tab */}
              {activeTab === 'by-priority' && (
                <div>
                  <h3 className={tw.sectionTitle}>Response Time by Priority</h3>
                  <div className={tw.chartContainerLg}>
                    <Line
                      data={chartData.responseTime}
                      options={{...opts.chart, indexAxis: 'y' as const}}
                    />
                  </div>
                </div>
              )}
              
              {/* Detailed Metrics Tab */}
              {activeTab === 'details' && (
                <div>
                  <h3 className={tw.sectionTitle}>Detailed SLA Metrics</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {['Ticket ID', 'Priority', 'Category', 'Response Time (min)', 'Resolution Time (min)', 'SLA Status'].map(h => (
                            <th key={h} scope="col" className={tw.tableHeader}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {tickets.map(t => (
                          <tr key={t.id} className="hover:bg-gray-50">
                            <td className={`${tw.tableCell} font-medium text-gray-900`}>#{t.id}</td>
                            <td className={tw.tableCell}>
                              <span className={`${tw.badge} ${
                                t.priority === 'High' ? 'bg-red-100 text-red-800' : 
                                t.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-blue-100 text-blue-800'}`}>
                                {t.priority}
                              </span>
                            </td>
                            <td className={`${tw.tableCell} text-gray-500`}>{t.category}</td>
                            <td className={`${tw.tableCell} text-gray-500`}>{t.responseTime}</td>
                            <td className={`${tw.tableCell} text-gray-500`}>{t.resolutionTime}</td>
                            <td className={tw.tableCell}>
                              <span className={`${tw.badge} ${t.resolvedOnTime ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {t.resolvedOnTime ? 'Met' : 'Missed'}
                              </span>
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50 font-medium">
                          <td className={tw.tableCell}>Total</td>
                          <td className={tw.tableCell}></td>
                          <td className={tw.tableCell}></td>
                          <td className={tw.tableCell}>{avgResponseTime.toFixed(1)}</td>
                          <td className={tw.tableCell}>{avgResolutionTime.toFixed(1)}</td>
                          <td className={tw.tableCell}>{`${slaComplianceRate.toFixed(1)}%`}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Insights section */}
          <div className={tw.cardPadded}>
            <h3 className={tw.sectionTitle}>Key Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tw.insights.map((insight, i) => (
                <div key={i} className={`${tw.insightCard} ${insight.bg} ${insight.border}`}>
                  <h4 className={`font-medium ${insight.title.color} mb-2`}>{insight.title.text}</h4>
                  <p className={insight.content.color}>{insight.content.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SLAMetrics;
