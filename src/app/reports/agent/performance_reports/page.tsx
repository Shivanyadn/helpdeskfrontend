// src/agent/reports/PerformanceReports.tsx

'use client';

import React, { useState } from 'react';
import AgentSidebar from '@/app/sidebar/AgentSidebar';
import { BarChart3, Clock, Star, CheckCircle, Calendar, ArrowUpDown, TrendingUp, TrendingDown, Filter, Download, Printer, ChevronDown, Users, Award, Target, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const PerformanceReports = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [timeRange, setTimeRange] = useState('3months');
  const [showFilters, setShowFilters] = useState(false);

  // Add the missing data definitions here
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: {
      ticketsResolved: [108, 115, 120, 118, 125, 130],
      resolutionTime: [35, 32, 30, 28, 27, 25],
      satisfaction: [4.6, 4.7, 4.8, 4.8, 4.9, 4.9],
      slaCompliance: [92, 95, 98, 97, 99, 99]
    }
  };

  const categoryData = {
    labels: ['Software', 'Hardware', 'Network', 'Other'],
    values: [45, 30, 15, 10]
  };

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
                    <h3 className="text-3xl font-bold mt-1 text-gray-800">120</h3>
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
                    <h3 className="text-3xl font-bold mt-1 text-gray-800">30 min</h3>
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
                    <h3 className="text-3xl font-bold mt-1 text-gray-800">4.8/5</h3>
                  </div>
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <Star className="text-yellow-600" size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <TrendingUp size={16} className="mr-1" />
                  <span>+0.2 from last month</span>
                </div>
                <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="bg-yellow-500 h-1 rounded-full" style={{ width: '96%' }}></div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">SLA Compliance</p>
                    <h3 className="text-3xl font-bold mt-1 text-gray-800">98%</h3>
                  </div>
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Award className="text-purple-600" size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <TrendingUp size={16} className="mr-1" />
                  <span>+3% from last month</span>
                </div>
                <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="bg-purple-600 h-1 rounded-full" style={{ width: '98%' }}></div>
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
                  {/* Chart background grid */}
                  <div className="absolute inset-0 grid grid-cols-6 grid-rows-5">
                    {Array(30).fill(0).map((_, i) => (
                      <div key={i} className="border-r border-t border-gray-100"></div>
                    ))}
                  </div>
                  
                  {/* Y-axis labels */}
                  <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-xs text-gray-500 py-2">
                    <span>140</span>
                    <span>120</span>
                    <span>100</span>
                    <span>80</span>
                    <span>60</span>
                    <span>40</span>
                  </div>
                  
                  {/* X-axis labels */}
                  <div className="absolute bottom-0 inset-x-0 flex justify-between text-xs text-gray-500 px-6">
                    {monthlyData.labels.map((month, i) => (
                      <span key={i}>{month}</span>
                    ))}
                  </div>
                  
                  {/* Bar chart for tickets resolved */}
                  <div className="absolute inset-0 h-full w-full pt-5 px-8 pb-6 flex items-end justify-between">
                    {monthlyData.datasets.ticketsResolved.map((val, i) => (
                      <div key={i} className="relative flex-1 mx-1">
                        <div 
                          className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-sm transition-all duration-500 ease-in-out hover:bg-blue-600"
                          style={{ height: `${val * 1.2}px` }}
                          title={`${monthlyData.labels[i]}: ${val} tickets`}
                        ></div>
                        
                        {/* Resolution time indicator */}
                        <div 
                          className="absolute bottom-0 left-0 right-0 border-t-2 border-green-500 border-dashed z-10"
                          style={{ bottom: `${monthlyData.datasets.resolutionTime[i] * 4}px` }}
                          title={`Avg Resolution: ${monthlyData.datasets.resolutionTime[i]} min`}
                        ></div>
                        
                        {/* Satisfaction indicator - small circle */}
                        <div 
                          className="absolute w-3 h-3 rounded-full bg-yellow-500 z-20"
                          style={{ 
                            bottom: `${monthlyData.datasets.satisfaction[i] * 30}px`,
                            left: '50%',
                            transform: 'translateX(-50%)'
                          }}
                          title={`Satisfaction: ${monthlyData.datasets.satisfaction[i]}/5`}
                        ></div>
                        
                        {/* SLA Compliance indicator - purple line */}
                        <div 
                          className="absolute bottom-0 left-0 right-0 border-t-2 border-purple-600 z-10"
                          style={{ bottom: `${monthlyData.datasets.slaCompliance[i] * 1.5}px` }}
                          title={`SLA Compliance: ${monthlyData.datasets.slaCompliance[i]}%`}
                        ></div>
                        
                        {/* SLA Compliance marker */}
                        <div 
                          className="absolute w-2 h-2 bg-purple-600 rounded-sm z-20"
                          style={{ 
                            bottom: `${monthlyData.datasets.slaCompliance[i] * 1.5}px`,
                            left: '50%',
                            transform: 'translateX(-50%)'
                          }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                    <span className="text-xs text-gray-600">Tickets Resolved</span>
                  </div>
                  <div className="text-center">
                    <div className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                    <span className="text-xs text-gray-600">Resolution Time</span>
                  </div>
                  <div className="text-center">
                    <div className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                    <span className="text-xs text-gray-600">Satisfaction</span>
                  </div>
                  <div className="text-center">
                    <div className="inline-block w-3 h-3 bg-purple-500 rounded-full mr-1"></div>
                    <span className="text-xs text-gray-600">SLA Compliance</span>
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
                    {/* Software Issues - 45% */}
                    <circle cx="50" cy="50" r="45" fill="transparent" stroke="#3b82f6" strokeWidth="30" strokeDasharray="282.6 282.6" strokeDashoffset="0" transform="rotate(-90 50 50)" />
                    
                    {/* Hardware Issues - 30% */}
                    <circle cx="50" cy="50" r="45" fill="transparent" stroke="#10b981" strokeWidth="30" strokeDasharray="282.6 282.6" strokeDashoffset="84.78" transform="rotate(-90 50 50)" />
                    
                    {/* Network Issues - 15% */}
                    <circle cx="50" cy="50" r="45" fill="transparent" stroke="#eab308" strokeWidth="30" strokeDasharray="282.6 282.6" strokeDashoffset="169.56" transform="rotate(-90 50 50)" />
                    
                    {/* Other - 10% */}
                    <circle cx="50" cy="50" r="45" fill="transparent" stroke="#8b5cf6" strokeWidth="30" strokeDasharray="282.6 282.6" strokeDashoffset="226.08" transform="rotate(-90 50 50)" />
                    
                    {/* Center circle */}
                    <circle cx="50" cy="50" r="30" fill="white" />
                    
                    {/* Center text */}
                    <text x="50" y="48" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#374151">Category</text>
                    <text x="50" y="58" textAnchor="middle" fontSize="8" fill="#6b7280">Distribution</text>
                  </svg>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-700">Software Issues</span>
                    </div>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-700">Hardware Issues</span>
                    </div>
                    <span className="text-sm font-medium">30%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-700">Network Issues</span>
                    </div>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-700">Other</span>
                    </div>
                    <span className="text-sm font-medium">10%</span>
                  </div>
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
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar size={16} className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">March 2023</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">120</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">30 min</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900 mr-1">4.8/5</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={12} className={`${star <= 4.8 ? 'text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">98%</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Excellent
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar size={16} className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">February 2023</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">115</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">32 min</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900 mr-1">4.7/5</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={12} className={`${star <= 4.7 ? 'text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">95%</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Excellent
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar size={16} className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">January 2023</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">108</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">35 min</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900 mr-1">4.6/5</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={12} className={`${star <= 4.6 ? 'text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">92%</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Good
                      </span>
                    </td>
                  </tr>
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
