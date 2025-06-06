// src/agent/reports/PerformanceReports.tsx

'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AgentSidebar from '@/app/sidebar/AgentSidebar';
import { BarChart3, Clock, Star, CheckCircle, Calendar, ArrowUpDown, TrendingUp, TrendingDown, Filter, Download, Printer, ChevronDown, Users, Award, Target, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface ResolutionTime {
  resolutionTimeInHours: string;
  sla: string; // Add this property
}

interface MonthlyData {
  labels: string[];
  datasets: {
    ticketsResolved: number[];
    resolutionTime: number[];
    satisfaction: number[];
    slaCompliance: number[];
  };
}

const PerformanceReports = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [timeRange, setTimeRange] = useState('3months');
  const [showFilters, setShowFilters] = useState(false);
  const [resolvedTickets, setResolvedTickets] = useState(0); // State for resolved tickets
  const [averageResolutionTime, setAverageResolutionTime] = useState(0); // State for average resolution time
  const [slaCompliance, setSlaCompliance] = useState(0); // State for SLA Compliance
  const [customerSatisfaction, setCustomerSatisfaction] = useState(0); // State for Customer Satisfaction
  const [monthlyData, setMonthlyData] = useState<MonthlyData>({
    labels: [],
    datasets: {
      ticketsResolved: [],
      resolutionTime: [],
      satisfaction: [],
      slaCompliance: [],
    },
  });
  const [categoryData, setCategoryData] = useState<{ labels: string[]; values: number[] }>({
    labels: [],
    values: [],
  });
  const [monthlyBreakdownData, setMonthlyBreakdownData] = useState<any[]>([]); // State for monthly breakdown data

  useEffect(() => {
    const fetchResolvedTickets = async () => {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token') || localStorage.getItem('auth_token') || '';
        if (!token) {
          throw new Error('Authentication token not found. Please log in again.');
        }

        // Fetch analytics data
        const response = await axios.get('http://localhost:5000/api/tickets/analytics', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          const performance = response.data.performance[0] || {};
          setResolvedTickets(performance.closed || 0); // Update resolved tickets count
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        alert('Failed to fetch analytics data. Please try again later.');
      }
    };

    const fetchResolutionTimes = async () => {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token') || localStorage.getItem('auth_token') || '';
        if (!token) {
          throw new Error('Authentication token not found. Please log in again.');
        }

        // Fetch resolution times data
        const response = await axios.get('http://localhost:5000/api/tickets/resolution-times', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          const resolutionTimes: ResolutionTime[] = response.data.resolutionTimes || [];
          const totalResolutionTime = resolutionTimes.reduce(
            (sum: number, ticket: ResolutionTime) => {
              return sum + parseFloat(ticket.resolutionTimeInHours);
            },
            0 // Initial value for sum
          );
          const averageTime = resolutionTimes.length > 0 ? parseFloat((totalResolutionTime / resolutionTimes.length).toFixed(2)) : 0;
          setAverageResolutionTime(averageTime); // Update average resolution time
        }
      } catch (error) {
        console.error('Error fetching resolution times:', error);
        alert('Failed to fetch resolution times. Please try again later.');
      }
    };

    const fetchAnalyticsData = async () => {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token') || localStorage.getItem('auth_token') || '';
        if (!token) {
          throw new Error('Authentication token not found. Please log in again.');
        }

        // Fetch analytics data
        const response = await axios.get('http://localhost:5000/api/tickets/analytics', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          const performance = response.data.performance[0] || {};
          const totalTickets = performance.assigned || 0;
          const slaBreaches = response.data.slaBreaches.length || 0;

          // Ensure totalTickets is greater than 0 and handle edge cases
          const slaCompliance =
            totalTickets > 0
              ? Math.max(0, ((totalTickets - slaBreaches) / totalTickets) * 100) // Ensure SLA Compliance is not negative
              : 0;

          // Update SLA Compliance state
          setSlaCompliance(parseFloat(slaCompliance.toFixed(2)));

          // Update Customer Satisfaction state
          const customerSatisfaction = parseFloat(performance.performanceScore) || 0;
          setCustomerSatisfaction(customerSatisfaction);
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        alert('Failed to fetch analytics data. Please try again later.');
      }
    };

    const fetchMonthlyPerformanceData = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('auth_token') || '';
        if (!token) {
          throw new Error('Authentication token not found. Please log in again.');
        }

        // Fetch analytics data
        const analyticsResponse = await axios.get('http://localhost:5000/api/tickets/analytics', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch resolution times data
        const resolutionTimesResponse = await axios.get('http://localhost:5000/api/tickets/resolution-times', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (analyticsResponse.data.success && resolutionTimesResponse.data.success) {
          const performance = analyticsResponse.data.performance[0] || {};
          const slaBreaches = analyticsResponse.data.slaBreaches || [];
          const resolutionTimes = resolutionTimesResponse.data.resolutionTimes || [];

          // Process SLA breaches to group by month
          const slaBreachesByMonth = slaBreaches.reduce((acc: Record<string, number>, breach: { sla: string }) => {
            const month = new Date(breach.sla).toLocaleString('default', { month: 'short', year: 'numeric' });
            acc[month] = (acc[month] || 0) + 1;
            return acc;
          }, {});

          // Process resolution times to calculate average by month
          const resolutionTimesByMonth = resolutionTimes.reduce(
            (acc: Record<string, { total: number; count: number }>, ticket: ResolutionTime) => {
              const month = new Date(ticket.sla || Date.now()).toLocaleString('default', { month: 'short', year: 'numeric' });
              if (!acc[month]) acc[month] = { total: 0, count: 0 };
              acc[month].total += parseFloat(ticket.resolutionTimeInHours);
              acc[month].count += 1;
              return acc;
            },
            {}
          );

          // Generate labels and datasets dynamically
          const labels = Object.keys(slaBreachesByMonth).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
          const ticketsResolved = labels.map((month) => performance.closed || 0);
          const resolutionTime = labels.map((month) => {
            const data = resolutionTimesByMonth[month];
            return data ? parseFloat((data.total / data.count).toFixed(2)) : 0;
          });
          const satisfaction = labels.map(() => parseFloat(performance.performanceScore) || 0);
          const slaCompliance = labels.map((month) => {
            const totalTickets = performance.assigned || 0;
            const breaches = slaBreachesByMonth[month] || 0;
            return totalTickets > 0 ? Math.max(0, ((totalTickets - breaches) / totalTickets) * 100) : 0;
          });

          // Debugging: Log the processed data
          console.log('Labels:', labels);
          console.log('Tickets Resolved:', ticketsResolved);
          console.log('Resolution Time:', resolutionTime);
          console.log('Satisfaction:', satisfaction);
          console.log('SLA Compliance:', slaCompliance);

          // Update monthly data state
          setMonthlyData({
            labels,
            datasets: {
              ticketsResolved,
              resolutionTime,
              satisfaction,
              slaCompliance,
            },
          });
        }
      } catch (error) {
        console.error('Error fetching monthly performance data:', error);
        alert('Failed to fetch monthly performance data. Please try again later.');
      }
    };

    const fetchCategoryData = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('auth_token') || '';
        if (!token) {
          throw new Error('Authentication token not found. Please log in again.');
        }

        // Fetch tickets data
        const response = await axios.get('http://localhost:5000/api/tickets', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          const tickets = response.data;

          // Calculate category distribution
          const categoryCounts = tickets.reduce((acc: Record<string, number>, ticket: { category: string }) => {
            acc[ticket.category] = (acc[ticket.category] || 0) + 1;
            return acc;
          }, {});

          const totalTickets = tickets.length;
          const categoryLabels = Object.keys(categoryCounts);
          const categoryValues = categoryLabels.map((category) =>
            parseFloat(((categoryCounts[category] / totalTickets) * 100).toFixed(2))
          );

          // Update category data state
          setCategoryData({
            labels: categoryLabels,
            values: categoryValues,
          });
        }
      } catch (error) {
        console.error('Error fetching category data:', error);
        alert('Failed to fetch category data. Please try again later.');
      }
    };

    fetchResolvedTickets();
    fetchResolutionTimes();
    fetchAnalyticsData();
    fetchMonthlyPerformanceData();
    fetchCategoryData();
  }, []);

  useEffect(() => {
    console.log('Monthly Data Updated:', monthlyData);
  }, [monthlyData]);

  useEffect(() => {
    const fetchMonthlyBreakdownData = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('auth_token') || '';
        if (!token) {
          throw new Error('Authentication token not found. Please log in again.');
        }

        // Fetch tickets data
        const response = await axios.get('http://localhost:5000/api/tickets', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          const tickets = response.data;

          // Group tickets by month
          const monthlyData = tickets.reduce((acc: Record<string, { resolved: number; resolutionTime: number; count: number }>, ticket: { createdAt: string; status: string; sla?: string }) => {
            const month = new Date(ticket.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
            if (!acc[month]) acc[month] = { resolved: 0, resolutionTime: 0, count: 0 };

            acc[month].count += 1;
            if (ticket.status === 'Closed') {
              acc[month].resolved += 1;
              const resolutionTime = ticket.sla ? (new Date(ticket.sla).getTime() - new Date(ticket.createdAt).getTime()) / (1000 * 60) : 0; // Resolution time in minutes
              acc[month].resolutionTime += resolutionTime;
            }

            return acc;
          }, {});

          // Generate table data
          const tableData = Object.keys(monthlyData).map((month) => {
            const data = monthlyData[month];
            const avgResolutionTime = data.resolved > 0 ? (data.resolutionTime / data.resolved).toFixed(2) : 'N/A';
            return {
              month,
              ticketsResolved: data.resolved,
              avgResolutionTime,
              customerRating: 'N/A', // Placeholder for customer rating
              slaCompliance: 'N/A', // Placeholder for SLA compliance
              performance: data.resolved > 0 ? 'Good' : 'Needs Improvement', // Example performance metric
            };
          });

          setMonthlyBreakdownData(tableData);
        }
      } catch (error) {
        console.error('Error fetching monthly breakdown data:', error);
        alert('Failed to fetch monthly breakdown data. Please try again later.');
      }
    };

    fetchMonthlyBreakdownData();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AgentSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header with actions */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                <BarChart3 className="mr-3 text-blue-600" size={28} />
                Performance Reports
              </h1>
              <p className="text-gray-600">
                Track your performance metrics and productivity statistics
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                >
                  <option value="1month">Last Month</option>
                  <option value="3months">Last 3 Months</option>
                  <option value="6months">Last 6 Months</option>
                  <option value="1year">Last Year</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
              </div>
              
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                <Filter size={16} />
                Filters
              </button>
              
              <button className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50">
                <Download size={16} />
                Export
              </button>
              
              <button className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50">
                <Printer size={16} />
                Print
              </button>
            </div>
          </div>
          
          {/* Filters panel */}
          {showFilters && (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 animate-fadeIn">
              <h3 className="font-medium text-gray-700 mb-3">Filter Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Category</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Categories</option>
                    <option>Software Issues</option>
                    <option>Hardware Issues</option>
                    <option>Network Issues</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Priority</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Priorities</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Status</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Statuses</option>
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                    <option>Closed</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Apply Filters</button>
              </div>
            </div>
          )}
          
          {/* Performance summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-800">Performance Summary</h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Last Updated: Today</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Tickets Resolved</p>
                    <h3 className="text-3xl font-bold mt-1 text-gray-800">{resolvedTickets}</h3>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <CheckCircle className="text-blue-600" size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <TrendingUp size={16} className="mr-1" />
                  <span>+12% from last month</span>
                </div>
                <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-1 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Average Resolution Time</p>
                    <h3 className="text-3xl font-bold mt-1 text-gray-800">{averageResolutionTime} hours</h3>
                  </div>
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Clock className="text-green-600" size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <TrendingDown size={16} className="mr-1" />
                  <span>-5 min from last month</span>
                </div>
                <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="bg-green-600 h-1 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Customer Satisfaction</p>
                    <h3 className="text-3xl font-bold mt-1 text-gray-800">{customerSatisfaction}%</h3>
                  </div>
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <Star className="text-yellow-600" size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <TrendingUp size={16} className="mr-1" />
                  <span>+2% from last month</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">SLA Compliance</p>
                    <h3 className="text-3xl font-bold mt-1 text-gray-800">{slaCompliance}%</h3>
                  </div>
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Award className="text-purple-600" size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <TrendingUp size={16} className="mr-1" />
                  <span>+3% from last month</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Performance comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-800">Monthly Performance Trends</h2>
              </div>
              <div className="p-6">
                {/* Bar chart visualization with SLA compliance */}
                <div className="h-64 relative">
                  {/* Bar chart for tickets resolved */}
                  <div className="absolute inset-0 h-full w-full pt-5 px-8 pb-6 flex items-end justify-between">
                    {monthlyData.datasets.ticketsResolved.map((val, i) => (
                      <div key={i} className="relative flex-1 mx-1">
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-sm"
                          style={{ height: `${val * 50}px` }} // Adjust height multiplier for better visualization
                          title={`${monthlyData.labels[i]}: ${val} tickets`}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 gap-4">
                  <div className="text-center">
                    <div className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                    <span className="text-xs text-gray-600">Tickets Resolved</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-800">Performance by Category</h2>
              </div>
              <div className="p-6">
                {/* Pie chart visualization */}
                <div className="h-48 relative flex items-center justify-center mb-4">
                  <svg viewBox="0 0 100 100" className="w-full h-full max-w-[180px] max-h-[180px]">
                    {categoryData.values.map((value, index) => {
                      const offset = categoryData.values.slice(0, index).reduce((sum, val) => sum + val, 0);
                      const strokeDashoffset = (282.6 * offset) / 100; // Adjust for percentage
                      const colors = ['#3b82f6', '#10b981', '#eab308', '#8b5cf6']; // Example colors

                      return (
                        <circle
                          key={index}
                          cx="50"
                          cy="50"
                          r="45"
                          fill="transparent"
                          stroke={colors[index % colors.length]}
                          strokeWidth="30"
                          strokeDasharray="282.6 282.6"
                          strokeDashoffset={strokeDashoffset}
                          transform="rotate(-90 50 50)"
                        />
                      );
                    })}

                    {/* Center circle */}
                    <circle cx="50" cy="50" r="30" fill="white" />

                    {/* Center text */}
                    <text x="50" y="48" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#374151">
                      Category
                    </text>
                    <text x="50" y="58" textAnchor="middle" fontSize="8" fill="#6b7280">
                      Distribution
                    </text>
                  </svg>
                </div>
                
                <div className="space-y-3">
                  {categoryData.labels.map((label, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: ['#3b82f6', '#10b981', '#eab308', '#8b5cf6'][index % 4] }}
                        ></div>
                        <span className="text-sm text-gray-700">{label}</span>
                      </div>
                      <span className="text-sm font-medium">{categoryData.values[index]}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Monthly breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-800">Monthly Performance Breakdown</h2>
              <Link href="/reports/agent/detailed_reports" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View Detailed Reports
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tickets Resolved</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Resolution Time</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Rating</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SLA Compliance</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {monthlyBreakdownData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar size={16} className="text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{row.month}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.ticketsResolved}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.avgResolutionTime} min</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900 mr-1">{row.customerRating}</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} size={12} className={`${star <= parseFloat(row.customerRating) ? 'text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.slaCompliance}%</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${row.performance === 'Excellent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {row.performance}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Insights and recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-start">
              <div className="p-2 bg-blue-100 rounded-lg mr-4 flex-shrink-0">
                <Target className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="font-medium text-blue-800 mb-1">Performance Insights</h3>
                <p className="text-blue-700 text-sm">
                  Your resolution time has improved by 5 minutes compared to last month, and your customer satisfaction rating has increased. Keep up the good work!
                </p>
                <div className="mt-3">
                  <Link href="/reports/agent/insights" className="text-blue-800 hover:text-blue-900 text-sm font-medium underline">
                    View All Insights
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-start">
              <div className="p-2 bg-green-100 rounded-lg mr-4 flex-shrink-0">
                <Users className="text-green-600" size={20} />
              </div>
              <div>
                <h3 className="font-medium text-green-800 mb-1">Team Comparison</h3>
                <p className="text-green-700 text-sm">
                  You're in the top 10% of agents for resolution time and customer satisfaction. Your SLA compliance is above the team average by 3%.
                </p>
                <div className="mt-3">
                  <Link href="/reports/agent/team_comparison" className="text-green-800 hover:text-green-900 text-sm font-medium underline">
                    View Team Stats
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Areas for improvement */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Areas for Improvement</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="p-2 bg-amber-50 rounded-lg mr-4 flex-shrink-0">
                    <AlertCircle className="text-amber-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">Network Issue Resolution</h3>
                    <p className="text-gray-600 text-sm">
                      Your average resolution time for network-related issues is 45 minutes, which is higher than the team average of 38 minutes. Consider reviewing the knowledge base for faster troubleshooting steps.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-2 bg-amber-50 rounded-lg mr-4 flex-shrink-0">
                    <AlertCircle className="text-amber-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">First Response Time</h3>
                    <p className="text-gray-600 text-sm">
                      Your first response time for high-priority tickets could be improved. The current average is 15 minutes, while the target is 10 minutes.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Link href="/training/agent/recommended_courses" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  View Recommended Training
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceReports;
