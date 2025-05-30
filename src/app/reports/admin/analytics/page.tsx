'use client';

import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  Title, 
  Tooltip, 
  Legend, 
  LineElement, 
  CategoryScale, 
  LinearScale, 
  PointElement,
  BarElement,
  ArcElement
} from 'chart.js';
import AdminSidebar from "@/app/sidebar/AdminSidebar";
import { Menu, Calendar, Filter, Download, RefreshCw, TrendingUp, Clock, MessageSquare, ThumbsUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Register necessary chart components
ChartJS.register(
  Title, 
  Tooltip, 
  Legend, 
  LineElement, 
  CategoryScale, 
  LinearScale, 
  PointElement,
  BarElement,
  ArcElement
);

const AnalyticsReportPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [timeRange]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Tickets Resolved',
        data: [50, 100, 150, 130, 200, 250],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Tickets Opened',
        data: [30, 60, 90, 70, 120, 180],
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const barData = {
    labels: ['IT Support', 'Network', 'Software', 'Hardware', 'Account Access'],
    datasets: [
      {
        label: 'Tickets by Category',
        data: [65, 45, 73, 30, 50],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
      },
    ],
  };

  const doughnutData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        data: [25, 55, 20],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        padding: 10,
        cornerRadius: 4,
        titleFont: {
          size: 13
        },
        bodyFont: {
          size: 12
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)'
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      }
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        padding: 10,
        cornerRadius: 4
      }
    },
    cutout: '70%',
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 transition-all duration-300 overflow-auto ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar} 
                className="md:hidden"
              >
                <Menu />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Analytics Dashboard</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Comprehensive view of helpdesk performance metrics</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-md px-3 py-1.5 shadow-sm border border-gray-200 dark:border-gray-700">
                <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Select defaultValue="month" onValueChange={(value) => {
                  setTimeRange(value);
                  setLoading(true);
                }}>
                  <SelectTrigger className="border-0 p-0 h-auto w-[110px] shadow-none focus:ring-0">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" size="sm" className="gap-1 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
              
              <Button variant="outline" size="sm" className="gap-1 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className={`gap-1 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 ${loading ? 'animate-spin' : ''}`}
                onClick={() => setLoading(true)}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Loading...' : 'Refresh'}</span>
              </Button>
            </div>
          </div>
          
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tickets</span>
                    <div className="flex items-end mt-2">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">1,248</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <span className="text-xs px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded">+12.5%</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">vs previous period</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Resolution Time</span>
                    <div className="flex items-end mt-2">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">3.8 hrs</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <span className="text-xs px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded">-8.2%</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">vs previous period</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">First Response Time</span>
                    <div className="flex items-end mt-2">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">12 min</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <span className="text-xs px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded">-20%</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">vs previous period</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer Satisfaction</span>
                    <div className="flex items-end mt-2">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">94%</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <ThumbsUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <span className="text-xs px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded">+2%</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">vs previous period</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts */}
          <Tabs defaultValue="overview" className="mb-6">
            <TabsList className="mb-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1 rounded-md">
              <TabsTrigger value="overview" className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700">Overview</TabsTrigger>
              <TabsTrigger value="performance" className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700">Performance</TabsTrigger>
              <TabsTrigger value="categories" className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700">Categories</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-800">
                    <CardTitle className="text-lg font-semibold">Ticket Volume Trends</CardTitle>
                    <CardDescription>Opened vs Resolved tickets over time</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-[300px]">
                      {loading ? (
                        <div className="h-full flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                      ) : (
                        <Line data={lineData} options={chartOptions} />
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="text-xs text-gray-500 border-t border-gray-100 dark:border-gray-800 pt-3">
                    Last updated: {new Date().toLocaleDateString()}
                  </CardFooter>
                </Card>
                
                <div className="grid grid-cols-1 gap-6">
                  <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-800">
                      <CardTitle className="text-lg font-semibold">Tickets by Priority</CardTitle>
                      <CardDescription>Distribution across priority levels</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center pt-4">
                      <div style={{ height: '240px', width: '100%', maxWidth: '400px' }}>
                        {loading ? (
                          <div className="h-full flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                          </div>
                        ) : (
                          <Doughnut data={doughnutData} options={doughnutOptions} />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-800">
                      <CardTitle className="text-lg font-semibold">Top Performing Agents</CardTitle>
                      <CardDescription>Based on resolution time and satisfaction</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      {loading ? (
                        <div className="h-[180px] flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {['Alex Morgan', 'Jamie Chen', 'Sam Wilson'].map((name, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium">
                                  {name.charAt(0)}
                                </div>
                                <span className="font-medium">{name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{95 - index * 3}%</span>
                                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-blue-500 rounded-full" 
                                    style={{ width: `${95 - index * 3}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="performance">
              <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Detailed performance analysis</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  {loading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-md font-medium">Response Time Breakdown</h3>
                        <div className="space-y-3">
                          {['Critical Issues', 'High Priority', 'Medium Priority', 'Low Priority'].map((category, index) => (
                            <div key={index} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{category}</span>
                                <span className="font-medium">{Math.floor(10 + index * 15)} min</span>
                              </div>
                              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${
                                    index === 0 ? 'bg-red-500' : 
                                    index === 1 ? 'bg-orange-500' : 
                                    index === 2 ? 'bg-yellow-500' : 
                                    'bg-green-500'
                                  }`}
                                  style={{ width: `${90 - index * 15}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-md font-medium">Agent Workload</h3>
                        <div className="space-y-3">
                          {['Alex Morgan', 'Jamie Chen', 'Sam Wilson', 'Taylor Reed', 'Jordan Smith'].map((name, index) => (
                            <div key={index} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{name}</span>
                                <span className="font-medium">{Math.floor(15 + Math.random() * 20)} tickets</span>
                              </div>
                              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-500 rounded-full" 
                                  style={{ width: `${85 - Math.random() * 30}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="categories">
              <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                  <CardTitle>Tickets by Category</CardTitle>
                  <CardDescription>Distribution across different categories</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-[400px]">
                    {loading ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    ) : (
                      <Bar data={barData} options={chartOptions} />
                    )}
                  </div>
                </CardContent>
                <CardFooter className="text-xs text-gray-500 border-t border-gray-100 dark:border-gray-800 pt-3">
                  Last updated: {new Date().toLocaleDateString()}
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReportPage;
