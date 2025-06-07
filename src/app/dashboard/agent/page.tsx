"use client";

import React, { useState, useRef, useEffect } from "react";
import AgentSidebar from "@/app/sidebar/AgentSidebar";
import {
  Briefcase,
  AlertTriangle,
  MessageCircle,
  GaugeCircle,
  MessageSquare,
  X,
  Bell,
  User,
  Settings,
  ChevronDown,
  Menu,
  BarChart,
} from "lucide-react";
import Link from "next/link";
// Update the import to include Line
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import axios from "axios";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);


const AgentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  // Refs for handling click outside
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  
  // Add state for chat options dropdown
  const [showChatOptions, setShowChatOptions] = useState(false);
  const chatOptionsRef = useRef<HTMLDivElement>(null);


  // Toggle chat panel
  const toggleChat = () => {
    setChatOpen(!chatOpen);
    // Close chat options if opening chat
    if (!chatOpen) {
      setShowChatOptions(false);
    }
  };

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
  
  // Sample notifications data
  const notifications = [
    { id: 1, title: "SLA Breach Alert", message: "Ticket #4872 is about to breach SLA in 30 minutes", time: "10 minutes ago", read: false },
    { id: 2, title: "New Message", message: "John added a comment to ticket #4856", time: "25 minutes ago", read: false },
    { id: 3, title: "New Ticket Assigned", message: "Ticket #4890 has been assigned to you", time: "1 hour ago", read: true },
  ];


  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleFont: {
          size: 13,
          family: "'Inter', sans-serif",
        },
        bodyFont: {
          size: 12,
          family: "'Inter', sans-serif",
        },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
            family: "'Inter', sans-serif",
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(243, 244, 246, 1)',
        },
        ticks: {
          font: {
            size: 11,
            family: "'Inter', sans-serif",
          },
          stepSize: 10,
        },
      },
    },
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

  // Add useEffect to handle clicking outside chat options dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (chatOptionsRef.current && !chatOptionsRef.current.contains(event.target as Node)) {
        setShowChatOptions(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [chatOptionsRef]);

  const [metricsOverview, setMetricsOverview] = useState({
    assignedTickets: 0,
    slaBreaches: 0,
    avgResolutionTime: "0h",
    customerSatisfaction: "0%",
  });
  const [performanceAnalytics, setPerformanceAnalytics] = useState<{
    labels: string[];
    ticketsAssigned: number[];
    ticketsResolved: number[];
    slaBreaches: number[];
  }>({
    labels: [],
    ticketsAssigned: [],
    ticketsResolved: [],
    slaBreaches: [],
  });

  // Fetch metrics and analytics data
  useEffect(() => {
    const fetchMetricsAndAnalytics = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('auth_token') || '';
        if (!token) {
          throw new Error('Authentication token not found. Please log in again.');
        }

        // Fetch tickets data
        const ticketsResponse = await axios.get('https://help.zenapi.co.in/api/tickets', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch resolution times data
        const resolutionTimesResponse = await axios.get('https://help.zenapi.co.in/api/tickets/resolution-times', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch analytics data
        const analyticsResponse = await axios.get('https://help.zenapi.co.in/api/tickets/analytics', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (ticketsResponse.data && resolutionTimesResponse.data.success && analyticsResponse.data.success) {
          const tickets = ticketsResponse.data;
          const resolutionTimes = resolutionTimesResponse.data.resolutionTimes;
          const analytics = analyticsResponse.data;

          // Metrics Overview
          const assignedTickets = tickets.length;
          const slaBreachesCount = analytics.slaBreaches.length;
          const avgResolutionTime = resolutionTimes.length
            ? (
                resolutionTimes.reduce((sum: number, ticket: { resolutionTimeInHours: string }) => sum + parseFloat(ticket.resolutionTimeInHours), 0) /
                resolutionTimes.length
              ).toFixed(2) + "h"
            : "0h";
          const customerSatisfaction = analytics.performance[0]?.performanceScore || "0%";

          setMetricsOverview({
            assignedTickets,
            slaBreaches: slaBreachesCount,
            avgResolutionTime,
            customerSatisfaction,
          });

          // Performance Analytics
          const monthlyData = tickets.reduce(
            (acc: Record<string, { assigned: number; resolved: number; breaches: number }>, ticket: { createdAt: string; status: string; ticketId: string }) => {
              const month = new Date(ticket.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
              if (!acc[month]) acc[month] = { assigned: 0, resolved: 0, breaches: 0 };

              acc[month].assigned += 1;
              if (ticket.status === 'Closed') acc[month].resolved += 1;
              if (analytics.slaBreaches.some((breach: { ticketId: string }) => breach.ticketId === ticket.ticketId)) acc[month].breaches += 1;

              return acc;
            },
            {}
          );

          const labels = Object.keys(monthlyData);
          const ticketsAssigned = labels.map((month) => monthlyData[month].assigned);
          const ticketsResolved = labels.map((month) => monthlyData[month].resolved);
          const slaBreaches = labels.map((month) => monthlyData[month].breaches);

          setPerformanceAnalytics({
            labels,
            ticketsAssigned,
            ticketsResolved,
            slaBreaches,
          });
        }
      } catch (error) {
        console.error('Error fetching metrics and analytics data:', error);
        alert('Failed to fetch metrics and analytics data. Please try again later.');
      }
    };

    fetchMetricsAndAnalytics();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
      <AgentSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        {/* Header with Profile Menu - Updated UI to match employee dashboard */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleSidebar}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Menu size={20} className="text-gray-700" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800 hidden md:block">Agent Dashboard</h1>
              <h1 className="text-xl font-bold text-gray-800 md:hidden">Dashboard</h1>
            </div>
            
            {/* Profile & Settings Menu - Updated UI */}
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
                      )
                      }
                    </div>
                  </div>
                )}
              </div>
              
              <Link href="/settings/agent/settings" className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Settings">
                <Settings size={20} className="text-gray-700" />
              </Link>
              
              {/* Profile dropdown menu - Updated UI */}
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
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-3 text-white">
                          <User size={32} />
                        </div>
                        <h3 className="text-lg font-medium">Pooja</h3>
                        <p className="text-gray-500 text-sm">Support Agent</p>
                      </div>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Email:</span>
                          <span className="text-gray-800 font-medium">pooja.m@exozen.in</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-500">Department:</span>
                          <span className="text-gray-800 font-medium">Customer Support</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-500">Agent ID:</span>
                          <span className="text-gray-800 font-medium">AGT-2023-001</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-500">Contact:</span>
                          <span className="text-gray-800 font-medium">+1 (555) 123-4567</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-4 py-3">
                      <Link 
                        href="/profile" 
                        className="block w-full text-center px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-colors"
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

        <div className="container mx-auto px-6 py-8">
          {/* Welcome Banner - New UI Element */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-md mb-8 overflow-hidden">
            <div className="md:flex justify-between items-center p-6">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold text-white">Welcome back, Pooja!</h2>
                <p className="text-blue-100 mt-1">You have assigned tickets that need your attention today</p>
              </div>
              <div className="flex space-x-3">
                <Link 
                  href="/tickets/agent/view-ticket"
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm flex items-center"
                >
                  <Briefcase className="mr-2" size={16} />
                  View Assigned Tickets
                </Link>
                <Link 
                  href="/analytics/agent/graph"
                  className="px-4 py-2 bg-blue-400 bg-opacity-25 text-white rounded-lg hover:bg-opacity-40 transition-colors font-medium text-sm"
                >
                  View Performance
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Cards - Updated to match employee dashboard style */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                <GaugeCircle size={16} className="text-blue-600" />
              </span>
              Metrics Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">Assigned Tickets</h3>
                <p className="text-sm text-gray-500 mt-1">Open, In-Progress, Closed</p>
                <div className="text-2xl font-bold mt-3 text-gray-900">{metricsOverview.assignedTickets}</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">SLA Breach Alerts</h3>
                <p className="text-sm text-gray-500 mt-1">Critical Cases</p>
                <div className="text-2xl font-bold mt-3 text-gray-900">{metricsOverview.slaBreaches}</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">Performance</h3>
                <p className="text-sm text-gray-500 mt-1">Resolution Time & Feedback</p>
                <div className="text-2xl font-bold mt-3 text-gray-900">
                  {metricsOverview.avgResolutionTime} • {metricsOverview.customerSatisfaction}
                </div>
              </div>
            </div>
          </section>

          {/* Quick Actions - Moved before Performance Analytics */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                <Briefcase size={16} className="text-blue-600" />
              </span>
              Quick Actions
            </h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link 
                  href="/tickets/agent/update-ticket"
                  className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-colors"
                >
                  <Briefcase className="mr-2" size={18} />
                  <span>Update Ticket Status</span>
                </Link>
                <Link 
                  href="/live_chat/agent/internal_notes"
                  className="flex items-center justify-center p-4 bg-white border border-gray-200 text-gray-800 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <MessageCircle className="mr-2" size={18} />
                  <span>Internal Notes </span>
                </Link>
                <Link 
                  href="/tickets/agent/assign-priority"
                  className="flex items-center justify-center p-4 bg-white border border-gray-200 text-gray-800 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <AlertTriangle className="mr-2" size={18} />
                  <span>View Escalated Tickets</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Performance Graph - Updated with chart type toggle */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                <BarChart size={16} className="text-blue-600" />
              </span>
              Performance Analytics
            </h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              {/* Chart Type Toggle */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setChartType('bar')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    chartType === 'bar'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Bar Chart
                </button>
                <button
                  onClick={() => setChartType('line')}
                  className={`ml-2 px-4 py-2 rounded-lg text-sm font-medium ${
                    chartType === 'line'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Line Chart
                </button>
              </div>

              {/* Chart Display */}
              <div className="h-80">
                {chartType === 'bar' ? (
                  <Bar
                    data={{
                      labels: performanceAnalytics.labels,
                      datasets: [
                        {
                          label: 'Tickets Assigned',
                          data: performanceAnalytics.ticketsAssigned,
                          backgroundColor: 'rgba(59, 130, 246, 0.6)',
                          borderColor: 'rgb(59, 130, 246)',
                          borderWidth: 2,
                        },
                        {
                          label: 'Tickets Resolved',
                          data: performanceAnalytics.ticketsResolved,
                          backgroundColor: 'rgba(16, 185, 129, 0.6)',
                          borderColor: 'rgb(16, 185, 129)',
                          borderWidth: 2,
                        },
                        {
                          label: 'SLA Breaches',
                          data: performanceAnalytics.slaBreaches,
                          backgroundColor: 'rgba(239, 68, 68, 0.6)',
                          borderColor: 'rgb(239, 68, 68)',
                          borderWidth: 2,
                        },
                      ],
                    }}
                    options={chartOptions}
                  />
                ) : (
                  <Line
                    data={{
                      labels: performanceAnalytics.labels,
                      datasets: [
                        {
                          label: 'Tickets Assigned',
                          data: performanceAnalytics.ticketsAssigned,
                          borderColor: 'rgb(59, 130, 246)',
                          backgroundColor: 'rgba(59, 130, 246, 0.2)',
                          borderWidth: 2,
                          tension: 0.4,
                        },
                        {
                          label: 'Tickets Resolved',
                          data: performanceAnalytics.ticketsResolved,
                          borderColor: 'rgb(16, 185, 129)',
                          backgroundColor: 'rgba(16, 185, 129, 0.2)',
                          borderWidth: 2,
                          tension: 0.4,
                        },
                        {
                          label: 'SLA Breaches',
                          data: performanceAnalytics.slaBreaches,
                          borderColor: 'rgb(239, 68, 68)',
                          backgroundColor: 'rgba(239, 68, 68, 0.2)',
                          borderWidth: 2,
                          tension: 0.4,
                        },
                      ],
                    }}
                    options={chartOptions}
                  />
                )}
              </div>
            </div>
          </section>
        </div>

      {/* Live Chat Button (Fixed at bottom right) */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all z-50"
        title="Live Chat"
      >
        <MessageSquare size={24} />
      </button>
      {showChatOptions && (
  <div ref={chatOptionsRef} className="chat-options-dropdown">
    {/* Options here */}
  </div>
)}


      {/* Live Chat Panel */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between bg-blue-600 text-white p-3">
            <h3 className="font-medium">Live Chat</h3>
            <button onClick={toggleChat} className="text-white hover:text-gray-200">
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 p-3 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="space-y-3">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg max-w-[80%] ml-auto">
                <p className="text-sm text-blue-800 dark:text-blue-100">Hello, how can I help you today?</p>
                <span className="text-xs text-blue-600 dark:text-blue-300 block mt-1">You, 10:30 AM</span>
              </div>
              
              <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-lg max-w-[80%]">
                <p className="text-sm text-gray-800 dark:text-gray-100">I am having trouble with my account login.</p>
                <span className="text-xs text-gray-500 dark:text-gray-400 block mt-1">Customer, 10:32 AM</span>
              </div>
            </div>
          </div>
          
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Type a message..." 
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default AgentDashboard;
