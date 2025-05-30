// src/dashboard/manager/page.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import ManagerSidebar from "@/app/sidebar/ManagerSidebar";
import { 
  BarChart3, 
  Clock, 
  AlertCircle, 
  Users, 
  FileText, 
  Bell, 
  User, 
  Settings, 
  ChevronDown, 
  Menu,
  LogOut,
  PieChart,
  LineChart,
  TrendingUp,
  CheckCircle,
  XCircle,
  ExternalLink,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import Chart component with ssr: false to prevent window is not defined error
const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <div className="h-80 w-full flex items-center justify-center bg-gray-50">Loading chart...</div>
});

const ManagerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Refs for handling click outside
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Sample notifications data
  const notifications = [
    { id: 1, title: "Team Performance Alert", message: "Team SLA compliance has dropped below 90%", time: "15 minutes ago", read: false },
    { id: 2, title: "Escalation Required", message: "Ticket #5872 requires manager approval", time: "30 minutes ago", read: false },
    { id: 3, title: "New Agent Request", message: "Agent John requested time off for next week", time: "2 hours ago", read: true },
  ];

  // Chart configurations
  const ticketTrendOptions = {
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      labels: { style: { colors: '#64748b' } }
    },
    yaxis: { labels: { style: { colors: '#64748b' } } },
    colors: ['#3b82f6', '#ef4444', '#10b981'],
    stroke: { curve: 'smooth' as const, width: 3 },
    legend: { position: 'top' as const },
    grid: { borderColor: '#e2e8f0' }
  };

  const ticketTrendSeries = [
    { name: 'New Tickets', data: [31, 40, 28, 51, 42, 20, 25] },
    { name: 'Resolved', data: [28, 32, 25, 47, 38, 25, 30] },
    { name: 'Escalated', data: [5, 8, 3, 4, 6, 2, 3] }
  ];

  const slaComplianceOptions = {
    chart: { toolbar: { show: false } },
    labels: ['Compliant', 'At Risk', 'Breached'],
    colors: ['#10b981', '#f59e0b', '#ef4444'],
    legend: { position: 'bottom' as const },
    dataLabels: { enabled: true },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: { show: true },
            value: { show: true },
            total: { show: true, label: 'Total Tickets', formatter: function() { return '330' } }
          }
        }
      }
    }
  };

  const slaComplianceSeries = [245, 73, 12];

  const teamPerformanceOptions = {
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    xaxis: {
      categories: ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa'],
      labels: { style: { colors: '#64748b' } }
    },
    yaxis: { 
      labels: { style: { colors: '#64748b' } },
      max: 100
    },
    colors: ['#3b82f6'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function(val: string) {
        return val + '%';
      },
      style: {
        fontSize: '12px',
        colors: ['#fff']
      }
    },
    grid: { borderColor: '#e2e8f0' }
  };

  const teamPerformanceSeries = [
    { name: 'Performance Score', data: [92, 88, 95, 78, 85, 90] }
  ];

  // Toggle functions
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (notificationsOpen) setProfileMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
    if (profileMenuOpen) setNotificationsOpen(false);
  };

  // Handle click outside for dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuRef, notificationsRef]);

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      <ManagerSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        {/* Header with Profile Menu */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleSidebar}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Menu size={20} className="text-gray-700" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800 hidden md:block">Manager Dashboard</h1>
              <h1 className="text-xl font-bold text-gray-800 md:hidden">Dashboard</h1>
            </div>
            
            {/* Profile & Settings Menu */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Notifications dropdown */}
              <div className="relative" ref={notificationsRef}>
                <button 
                  onClick={toggleNotifications}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell size={20} className="text-gray-700" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
                  )}
                </button>
                
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl py-1 z-10 border border-gray-100">
                    <div className="px-4 py-3 border-b">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                        <Link 
                          href="/notifications" 
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                          onClick={() => setNotificationsOpen(false)}
                        >
                          View All
                        </Link>
                      </div>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                          No new notifications
                        </div>
                      ) : (
                        notifications.map(notification => (
                          <div 
                            key={notification.id}
                            className={`px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer ${
                              notification.read ? 'opacity-70' : ''
                            }`}
                          >
                            <div className="flex justify-between">
                              <h4 className="text-sm font-medium text-gray-800">{notification.title}</h4>
                              <span className="text-xs text-gray-500">{notification.time}</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <Link href="/settings/manager/settings" className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Settings">
                <Settings size={20} className="text-gray-700" />
              </Link>
              
              {/* Profile dropdown menu */}
              <div className="relative" ref={profileMenuRef}>
                <button 
                  onClick={toggleProfileMenu}
                  className="flex items-center p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Profile menu"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={16} className="text-blue-600" />
                  </div>
                  <ChevronDown size={16} className="ml-1 text-gray-600 hidden md:block" />
                </button>
                
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl py-1 z-10 border border-gray-100">
                    <div className="p-4 border-b">
                      <div className="flex flex-col items-center mb-4">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-3 text-white">
                          <User size={32} />
                        </div>
                        <h3 className="text-lg font-medium">Sarah Johnson</h3>
                        <p className="text-gray-500 text-sm">Support Manager</p>
                      </div>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Email:</span>
                          <span className="text-gray-800 font-medium">sarah.johnson@company.com</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-500">Department:</span>
                          <span className="text-gray-800 font-medium">Customer Support</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-500">Manager ID:</span>
                          <span className="text-gray-800 font-medium">MGR-2023-005</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-500">Contact:</span>
                          <span className="text-gray-800 font-medium">+1 (555) 987-6543</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-4 py-3">
                      <Link 
                        href="/profile" 
                        className="block w-full text-center px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Edit Profile
                      </Link>
                    </div>
                    
                    <div className="px-4 py-3 border-t">
                      <Link 
                        href="/" 
                        className="block w-full text-center px-4 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Logout
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg mb-6 overflow-hidden">
            <div className="md:flex justify-between items-center p-6">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold text-white">Welcome back, Sarah!</h2>
                <p className="text-blue-100 mt-1">
                  <span className="font-semibold">Today's Summary:</span> 12 new tickets, 8 pending approvals, 3 SLA breaches
                </p>
              </div>
              <div className="flex space-x-3">
                <Link 
                  href="/tickets/manager/team-tickets"
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm flex items-center"
                >
                  <Users className="mr-2" size={16} />
                  View Team Tickets
                </Link>
              </div>
            </div>
          </div>

          {/* Dashboard Tabs */}
          <div className="mb-6 bg-white rounded-xl shadow-sm p-2 flex">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'overview' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('team')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'team' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Team Performance
            </button>
            <button 
              onClick={() => setActiveTab('tickets')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'tickets' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Ticket Analytics
            </button>
            <button 
              onClick={() => setActiveTab('sla')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'sla' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              SLA Compliance
            </button>
          </div>

          {/* Overview Tab Content */}
          {activeTab === 'overview' && (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-transform hover:scale-[1.02] hover:shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Team Tickets</h3>
                      <p className="text-sm text-gray-500 mt-1">Open / Pending / Escalated</p>
                      <div className="text-2xl font-bold mt-3 text-gray-900">245 / 73 / 12</div>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-50">
                      <BarChart3 className="text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Since yesterday:</span>
                      <span className="text-green-600 font-medium flex items-center">
                        <TrendingUp size={14} className="mr-1" /> +5.2%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-transform hover:scale-[1.02] hover:shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">SLA Compliance</h3>
                      <p className="text-sm text-gray-500 mt-1">Team Performance Score</p>
                      <div className="text-2xl font-bold mt-3 text-gray-900">92%</div>
                    </div>
                    <div className="p-3 rounded-lg bg-green-50">
                      <Clock className="text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Target:</span>
                      <span className="text-blue-600 font-medium">95%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-transform hover:scale-[1.02] hover:shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Avg. Resolution</h3>
                      <p className="text-sm text-gray-500 mt-1">Time to Resolve</p>
                      <div className="text-2xl font-bold mt-3 text-gray-900">1h 32m</div>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-50">
                      <Clock className="text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Last week:</span>
                      <span className="text-green-600 font-medium flex items-center">
                        <TrendingUp size={14} className="mr-1" /> -12m
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-transform hover:scale-[1.02] hover:shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Customer Satisfaction</h3>
                      <p className="text-sm text-gray-500 mt-1">Average Rating</p>
                      <div className="text-2xl font-bold mt-3 text-gray-900">4.8/5.0</div>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-50">
                      <Users className="text-amber-600" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Last month:</span>
                      <span className="text-green-600 font-medium flex items-center">
                        <TrendingUp size={14} className="mr-1" /> +0.2
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Weekly Ticket Trends</h3>
                    <div className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded">
                      Last 7 Days
                    </div>
                  </div>
                  <div className="h-80">
                    {typeof window !== 'undefined' && (
                      <Chart 
                        options={ticketTrendOptions}
                        series={ticketTrendSeries}
                        type="line"
                        height="100%"
                      />
                    )}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">SLA Compliance Status</h3>
                    <div className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded">
                      Current Month
                    </div>
                  </div>
                  <div className="h-80">
                    {typeof window !== 'undefined' && (
                      <Chart 
                        options={slaComplianceOptions}
                        series={slaComplianceSeries}
                        type="donut"
                        height="100%"
                      />
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Team Performance Tab Content */}
          {activeTab === 'team' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Team Performance Scores</h3>
                    <div className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded">
                      Current Month
                    </div>
                  </div>
                  <div className="h-80">
                    {typeof window !== 'undefined' && (
                      <Chart 
                        options={teamPerformanceOptions}
                        series={teamPerformanceSeries}
                        type="bar"
                        height="100%"
                      />
                    )}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Performers</h3>
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                      <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <User size={16} className="text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-800">Mike Johnson</h4>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">Performance Score</span>
                          <span className="text-xs font-medium text-green-600">95%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <User size={16} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-800">John Doe</h4>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">Performance Score</span>
                          <span className="text-xs font-medium text-blue-600">92%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                      <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <User size={16} className="text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-800">Jane Smith</h4>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">Performance Score</span>
                          <span className="text-xs font-medium text-purple-600">90%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Link 
                      href="/team/manager/performance-details" 
                      className="block w-full text-center px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors"
                    >
                      View Detailed Report
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Ticket Analytics Tab Content */}
          {activeTab === 'tickets' && (
            <>
              {/* Ticket Distribution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Ticket Categories</h3>
                    <div className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded">
                      This Month
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Technical Issues</span>
                        <span className="text-sm text-gray-500">42%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '42%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Account Issues</span>
                        <span className="text-sm text-gray-500">28%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '28%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Billing Issues</span>
                        <span className="text-sm text-gray-500">18%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '18%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Feature Requests</span>
                        <span className="text-sm text-gray-500">12%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: '12%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Ticket Priority</h3>
                    <div className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded">
                      This Month
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">High</span>
                        <span className="text-sm text-gray-500">15%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-red-600 h-2.5 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Medium</span>
                        <span className="text-sm text-gray-500">45%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Low</span>
                        <span className="text-sm text-gray-500">40%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Ticket Resolution Time */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Ticket Resolution Time</h3>
                  <div className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded">
                    Last 30 Days
                  </div>
                </div>
                <div className="h-80">
                  <Chart 
                    options={ticketTrendOptions}
                    series={ticketTrendSeries}
                    type="line"
                    height="100%"
                  />
                </div>
              </div>
            </>
          )}
          
          {/* SLA Compliance Tab Content */}
          {activeTab === 'sla' && (
            <>
              {/* SLA Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Overall Compliance</h3>
                      <p className="text-sm text-gray-500 mt-1">Current Month</p>
                      <div className="text-2xl font-bold mt-3 text-gray-900">92%</div>
                    </div>
                    <div className="p-3 rounded-lg bg-green-50">
                      <CheckCircle className="text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Target:</span>
                      <span className="text-blue-600 font-medium">95%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">SLA Breaches</h3>
                      <p className="text-sm text-gray-500 mt-1">Current Month</p>
                      <div className="text-2xl font-bold mt-3 text-gray-900">12</div>
                    </div>
                    <div className="p-3 rounded-lg bg-red-50">
                      <AlertCircle className="text-red-600" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Previous Month:</span>
                      <span className="text-red-600 font-medium">15</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">At Risk Tickets</h3>
                      <p className="text-sm text-gray-500 mt-1">Current Month</p>
                      <div className="text-2xl font-bold mt-3 text-gray-900">73</div>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-50">
                      <AlertTriangle className="text-amber-600" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Requires Attention:</span>
                      <span className="text-amber-600 font-medium">22%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* SLA Compliance Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">SLA Compliance Trend</h3>
                    <div className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded">
                      Last 6 Months
                    </div>
                  </div>
                  <div className="h-80">
                    <Chart 
                      options={{
                        chart: {
                          toolbar: { show: false },
                          zoom: { enabled: false },
                        },
                        xaxis: {
                          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                          labels: { style: { colors: '#64748b' } }
                        },
                        yaxis: { 
                          labels: { style: { colors: '#64748b' } },
                          min: 80,
                          max: 100
                        },
                        colors: ['#3b82f6', '#ef4444'],
                        stroke: { curve: 'smooth', width: 3 },
                        legend: { position: 'top' },
                        grid: { borderColor: '#e2e8f0' },
                        markers: { size: 5 }
                      }}
                      series={[
                        { name: 'Actual', data: [88, 91, 87, 89, 92, 92] },
                        { name: 'Target', data: [95, 95, 95, 95, 95, 95] }
                      ]}
                      type="line"
                      height="100%"
                    />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">SLA Status Breakdown</h3>
                    <div className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded">
                      Current Month
                    </div>
                  </div>
                  <div className="h-80">
                    <Chart 
                      options={slaComplianceOptions}
                      series={slaComplianceSeries}
                      type="donut"
                      height="100%"
                    />
                  </div>
                </div>
              </div>
              
              {/* SLA By Priority */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">SLA Compliance by Priority</h3>
                  <div className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded">
                    Current Month
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Priority
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Target Time
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Avg. Resolution
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Compliance
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-2.5 w-2.5 rounded-full bg-red-600 mr-2"></div>
                            <span className="font-medium text-gray-900">High</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          2 hours
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          1h 45m
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[100px]">
                              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '95%' }}></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">95%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Meeting Target
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-2.5 w-2.5 rounded-full bg-amber-500 mr-2"></div>
                            <span className="font-medium text-gray-900">Medium</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          8 hours
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          7h 12m
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[100px]">
                              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '92%' }}></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">92%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Meeting Target
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                            <span className="font-medium text-gray-900">Low</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          24 hours
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          22h 30m
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[100px]">
                              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '90%' }}></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">90%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Meeting Target
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* SLA Breach Details */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Recent SLA Breaches</h3>
                  <Link 
                    href="/tickets/manager/sla-breaches"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  >
                    View All <ExternalLink size={14} className="ml-1" />
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ticket ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subject
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Priority
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assigned To
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Breach Time
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          <Link href="/tickets/manager/view/TKT-5872">#TKT-5872</Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Server connectivity issue
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            High
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          John Doe
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          2h 45m (+45m)
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Breached
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          <Link href="/tickets/manager/view/TKT-5890">#TKT-5890</Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Payment gateway error
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                            Medium
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Jane Smith
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          9h 20m (+1h 20m)
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Breached
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          <Link href="/tickets/manager/view/TKT-5901">#TKT-5901</Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          User access request
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Low
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Mike Johnson
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          26h 15m (+2h 15m)
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Breached
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;