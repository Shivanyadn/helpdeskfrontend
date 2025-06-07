'use client';

import React, { useState, useEffect } from 'react';
import EmployeeSidebar from '@/app/sidebar/EmployeeSidebar';
import { ArrowLeft, BarChart, LineChart, Calendar, Filter, Download, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import TicketStatusGraph from './view_ticket_status';
import { getTickets, TicketResponse } from '@/api/tickets';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

export default function AnalyticsGraphPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'doughnut'>('bar');
  const [timeRange, setTimeRange] = useState<'6months' | '3months' | '1month'>('6months');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch ticket data when component mounts or timeRange changes
  useEffect(() => { fetchTicketData(); }, [timeRange]);

  const fetchTicketData = async () => {
    try {
      setLoading(true);
      setIsRefreshing(true);
      setTickets(await getTickets());
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  // Generate ticket trend data from actual tickets
  const generateTicketTrendData = () => {
    const today = new Date();
    const months: string[] = [];
    const monthsData = { created: {}, resolved: {} } as { created: Record<string, number>; resolved: Record<string, number> };
    const monthsToShow = timeRange === '6months' ? 6 : timeRange === '3months' ? 3 : 1;
    
    // Initialize months based on selected time range
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = month.toLocaleString('default', { month: 'long' });
      months.push(monthName);
      monthsData.created[monthName] = 0;
      monthsData.resolved[monthName] = 0;
    }

    // Count tickets by month
    tickets.forEach(ticket => {
      if (ticket.createdAt) {
        const createdDate = new Date(ticket.createdAt);
        const createdMonth = createdDate.toLocaleString('default', { month: 'long' });
        if (monthsData.created[createdMonth] !== undefined) monthsData.created[createdMonth]++;
      }
      
      if (ticket.status === 'Resolved' && ticket.createdAt) {
        const resolvedDate = new Date(ticket.createdAt);
        const resolvedMonth = resolvedDate.toLocaleString('default', { month: 'long' });
        if (monthsData.resolved[resolvedMonth] !== undefined) monthsData.resolved[resolvedMonth]++;
      }
    });

    return {
      labels: months,
      datasets: [
        {
          label: 'Tickets Created',
          data: months.map(month => monthsData.created[month]),
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 2,
        },
        {
          label: 'Tickets Resolved',
          data: months.map(month => monthsData.resolved[month]),
          backgroundColor: 'rgba(16, 185, 129, 0.6)',
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 2,
        },
      ],
    };
  };

  // Use actual ticket data for charts or fallback to empty data
  const ticketData = tickets.length > 0 ? generateTicketTrendData() : {
    labels: timeRange === '6months' ? ['January', 'February', 'March', 'April', 'May', 'June'] : 
            timeRange === '3months' ? ['April', 'May', 'June'] : ['June'],
    datasets: [
      {
        label: 'Tickets Created',
        data: Array(timeRange === '6months' ? 6 : timeRange === '3months' ? 3 : 1).fill(0),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
      },
      {
        label: 'Tickets Resolved',
        data: Array(timeRange === '6months' ? 6 : timeRange === '3months' ? 3 : 1).fill(0),
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
      },
    ],
  };

  // Generate status data from actual tickets
  const generateStatusData = () => {
    const statusCounts: Record<string, number> = {};
    tickets.forEach(ticket => { statusCounts[ticket.status] = (statusCounts[ticket.status] || 0) + 1; });
    
    return {
      labels: Object.keys(statusCounts),
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: ['rgba(59, 130, 246, 0.7)', 'rgba(245, 158, 11, 0.7)', 'rgba(16, 185, 129, 0.7)', 'rgba(107, 114, 128, 0.7)'],
        borderColor: ['rgb(59, 130, 246)', 'rgb(245, 158, 11)', 'rgb(16, 185, 129)', 'rgb(107, 114, 128)'],
        borderWidth: 1,
      }],
    };
  };

  const statusData = tickets.length > 0 ? generateStatusData() : {
    labels: ['Open', 'In Progress', 'Resolved', 'Closed'],
    datasets: [{
      data: [15, 25, 40, 20],
      backgroundColor: ['rgba(59, 130, 246, 0.7)', 'rgba(245, 158, 11, 0.7)', 'rgba(16, 185, 129, 0.7)', 'rgba(107, 114, 128, 0.7)'],
      borderColor: ['rgb(59, 130, 246)', 'rgb(245, 158, 11)', 'rgb(16, 185, 129)', 'rgb(107, 114, 128)'],
      borderWidth: 1,
    }],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { font: { size: 12, family: "'Inter', sans-serif" }, usePointStyle: true, padding: 20 },
      },
      title: { display: false },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleFont: { size: 13, family: "'Inter', sans-serif" },
        bodyFont: { size: 12, family: "'Inter', sans-serif" },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: chartType !== 'doughnut' ? {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11, family: "'Inter', sans-serif" } },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(243, 244, 246, 1)' },
        ticks: { font: { size: 11, family: "'Inter', sans-serif" }, stepSize: 5 },
      },
    } : undefined,
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'right' as const,
        labels: { font: { size: 12, family: "'Inter', sans-serif" }, usePointStyle: true, padding: 20 },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleFont: { size: 13, family: "'Inter', sans-serif" },
        bodyFont: { size: 12, family: "'Inter', sans-serif" },
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  // Calculate ticket stats
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(ticket => ticket.status === 'Open').length;
  const resolvedTickets = tickets.filter(ticket => ticket.status === 'Resolved').length;
  const resolutionRate = totalTickets > 0 ? (resolvedTickets / totalTickets * 100).toFixed(0) : '0';
  
  // Calculate average resolution time
  const calculateAvgResolutionTime = () => {
    const resolvedTickets = tickets.filter(ticket => ticket.status === 'Resolved' && ticket.createdAt);
    if (resolvedTickets.length === 0) return "N/A";
    
    const totalResolutionTime = resolvedTickets.reduce((sum: number, ticket) => {
      const createdDate = new Date(ticket.createdAt);
      const resolvedDate = ticket.updatedAt && typeof ticket.updatedAt === 'string' 
        ? new Date(ticket.updatedAt) : new Date(ticket.createdAt);
      return sum + Math.abs(resolvedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    }, 0);
    
    return `${(totalResolutionTime / resolvedTickets.length).toFixed(1)} days`;
  };

  const avgResolutionTime = loading ? "..." : calculateAvgResolutionTime();

  // Reusable Tailwind classes
  const cls = {
    btn: "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
    btnOutline: "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50",
    btnActive: "bg-blue-100 text-blue-700 border border-blue-200",
    card: "bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100",
    statCard: "p-4 md:p-6",
    chartControls: {
      bar: { type: 'bar', icon: <BarChart size={14} />, label: 'Bar' },
      line: { type: 'line', icon: <LineChart size={14} />, label: 'Line' },
      doughnut: { type: 'doughnut', icon: <span className="w-3.5 h-3.5 rounded-full border-2 border-current inline-block"></span>, label: 'Doughnut' }
    },
    timeRanges: [
      { range: '1month', label: '1M' },
      { range: '3months', label: '3M' },
      { range: '6months', label: '6M' }
    ],
    stats: [
      { 
        title: 'Open Tickets', 
        value: loading ? "..." : openTickets,
        badge: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
        label: 'since last week'
      },
      { 
        title: 'Resolution Rate', 
        value: loading ? "..." : `${resolutionRate}%`,
        badge: { bg: 'bg-green-100', text: 'text-green-800' },
        label: 'vs previous period'
      },
      { 
        title: 'Avg. Resolution Time', 
        value: loading ? "..." : avgResolutionTime,
        badge: { bg: 'bg-green-100', text: 'text-green-800' },
        label: 'faster than last month'
      }
    ]
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <EmployeeSidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-[250px]' : 'ml-[80px]'} overflow-auto`}>
        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Ticket Analytics</h1>
              <div className="flex items-center gap-2">
                <Link href="/dashboard/employee" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                  <ArrowLeft size={14} /><span>Back to Dashboard</span>
                </Link>
                <span className="text-gray-400">|</span>
                <p className="text-sm text-gray-600">View your ticket statistics and trends</p>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <button onClick={fetchTicketData} className={`${cls.btn} ${cls.btnOutline}`}>
                <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
                <span>Refresh</span>
              </button>
              <button className={`${cls.btn} ${cls.btnOutline}`}>
                <Download size={14} /><span>Export</span>
              </button>
            </div>
          </div>
          
          {/* Filters and Controls */}
          <div className={`${cls.card} mb-6`}>
            <div className="border-b border-gray-100 px-4 md:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center">
                <Filter size={16} className="text-blue-600 mr-2" />
                <h2 className="font-semibold text-gray-800">Analytics Controls</h2>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gray-500" />
                <span className="text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-wrap gap-2">
                {Object.values(cls.chartControls).map(item => (
                  <button
                    key={item.type}
                    onClick={() => setChartType(item.type as 'bar' | 'line' | 'doughnut')} // Replaced `any` with specific type
                    className={`${cls.btn} ${chartType === item.type ? cls.btnActive : cls.btnOutline}`}
                  >
                    {item.icon}<span>{item.label}</span>
                  </button>
                ))}
              </div>
              
              <div className="flex items-center bg-white rounded-lg border border-gray-200 divide-x divide-gray-200">
                {cls.timeRanges.map(item => (
                  <button
                    key={item.range}
                    onClick={() => setTimeRange(item.range as '1month' | '3months' | '6months')} // Replaced `any` with specific type
                    className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                      timeRange === item.range ? 'text-blue-700 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Chart Display */}
          <div className={`${cls.card} p-6`}>
            {loading ? (
              <div className="flex justify-center items-center h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="h-[400px]">
                {chartType === 'bar' ? <Bar options={chartOptions} data={ticketData} /> :
                 chartType === 'line' ? <Line options={chartOptions} data={ticketData} /> :
                 <Doughnut options={doughnutOptions} data={statusData} />}
              </div>
            )}
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm overflow-hidden text-white p-4 md:p-6">
              <h3 className="text-sm font-medium text-blue-100 mb-1">Total Tickets</h3>
              <p className="text-2xl md:text-3xl font-bold">{loading ? "..." : totalTickets}</p>
              <div className="flex items-center mt-2 text-xs text-blue-100">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-blue-400 bg-opacity-30 text-white text-xs mr-1">
                  {loading ? "..." : "—"}
                </span>
                <span>vs previous period</span>
              </div>
            </div>
            
            {cls.stats.map((stat, index) => (
              <div key={index} className={`${cls.card} ${cls.statCard}`}>
                <h3 className="text-sm font-medium text-gray-500 mb-1">{stat.title}</h3>
                <p className="text-2xl md:text-3xl font-bold text-gray-800">{stat.value}</p>
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full ${stat.badge.bg} ${stat.badge.text} text-xs mr-1`}>
                    {loading ? "..." : "—"}
                  </span>
                  <span>{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Ticket Status Graph Component */}
          <div className="mt-6">
            <TicketStatusGraph />
          </div>
        </div>
      </div>
    </div>
  );
}