"use client";

import React, { useState, useRef, useEffect } from "react";
import AgentSidebar from "@/app/sidebar/AgentSidebar";
import StatGrid from "@/components/dashboard/StatGrid";
import ActionButtons from "@/components/dashboard/ActionButtons";
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
  LogOut,
  ChevronDown,
  Menu,
  BarChart,
  LineChart,
  PieChart,
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

const agentStats = [
  {
    title: "Assigned Tickets",
    value: "320",
    description: "Open, In-Progress, Closed",
    icon: <Briefcase className="text-blue-600" />,
    bgColor: "bg-blue-50",
  },
  {
    title: "SLA Breach Alerts",
    value: "5",
    description: "Critical Cases",
    icon: <AlertTriangle className="text-red-600" />,
    bgColor: "bg-red-50",
  },
  {
    title: "Performance",
    value: "2h Avg • 4.7★",
    description: "Resolution Time & Feedback",
    icon: <GaugeCircle className="text-green-600" />,
    bgColor: "bg-green-50",
  },
];

const AgentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [timeRange, setTimeRange] = useState<'6months' | '3months' | '1month'>('6months');
  
  // Add state for hover tooltips
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
  // Define the missing data structures with proper types
  // Type for ticket details
  type TicketDetail = {
    label: string;
    value: string;
  };
  
  // Type for SLA breach details
  type SLABreachDetail = {
    label: string;
    value: string;
    timeLeft?: string;
  };
  
  // Type for performance details
  type PerformanceDetail = {
    label: string;
    value: string;
  };
  
  // Sample data for card tooltips
  const assignedTicketsDetails: TicketDetail[] = [
    { label: "Open Tickets", value: "145" },
    { label: "In Progress", value: "98" },
    { label: "Pending", value: "42" },
    { label: "Resolved Today", value: "35" },
  ];

  const slaBreachDetails: SLABreachDetail[] = [
    { label: "Critical", value: "2", timeLeft: "< 30 min" },
    { label: "High", value: "3", timeLeft: "< 2 hours" },
    { label: "Oldest Ticket", value: "#TKT-4872", timeLeft: "25 min left" },
  ];

  const performanceDetails: PerformanceDetail[] = [
    { label: "Avg. Resolution Time", value: "2h 15m" },
    { label: "Customer Satisfaction", value: "4.7/5" },
    { label: "First Response", value: "8m avg" },
    { label: "SLA Compliance", value: "96%" },
  ];
  
  // Refs for handling click outside
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  
  // Add state for chat options dropdown
  const [showChatOptions, setShowChatOptions] = useState(false);
  const chatOptionsRef = useRef<HTMLDivElement>(null);

  // Toggle chat options dropdown
  const toggleChatOptions = () => {
    setShowChatOptions(!showChatOptions);
  };

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

  // Sample data for the chart
  const ticketData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Tickets Assigned',
        data: [32, 45, 38, 41, 52, 48],
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
      },
      {
        label: 'Tickets Resolved',
        data: [28, 40, 35, 38, 47, 43],
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
      },
      {
        label: 'SLA Breaches',
        data: [4, 5, 3, 3, 5, 5],
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2,
      }
    ]
  };

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
                      )}
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
                        <h3 className="text-lg font-medium">John Doe</h3>
                        <p className="text-gray-500 text-sm">Support Agent</p>
                      </div>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Email:</span>
                          <span className="text-gray-800 font-medium">john.doe@company.com</span>
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
                <h2 className="text-2xl font-bold text-white">Welcome back, John!</h2>
                <p className="text-blue-100 mt-1">You have 5 tickets that need your attention today</p>
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
              {/* Assigned Tickets Card with Hover Tooltip */}
              <div 
                className="relative group"
                onMouseEnter={() => setHoveredCard(0)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-transform group-hover:scale-[1.02] group-hover:shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{agentStats[0].title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{agentStats[0].description}</p>
                      <div className="text-2xl font-bold mt-3 text-gray-900">{agentStats[0].value}</div>
                    </div>
                    <div className={`p-3 rounded-lg ${agentStats[0].bgColor}`}>
                      {agentStats[0].icon}
                    </div>
                  </div>
                </div>
                
                {/* Tooltip that appears on hover */}
                {hoveredCard === 0 && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-xl z-20 p-4 border border-gray-100 transition-opacity duration-200">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <Briefcase className="mr-2" size={16} />
                      Assigned Tickets Breakdown
                    </h4>
                    <div className="space-y-2">
                      {assignedTicketsDetails.map((detail, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{detail.label}</span>
                          <span className="text-sm font-medium text-gray-800">{detail.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <Link 
                        href="/tickets/agent/view-ticket"
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View All Tickets →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              
              {/* SLA Breach Alerts Card with Hover Tooltip */}
              <div 
                className="relative group"
                onMouseEnter={() => setHoveredCard(1)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-transform group-hover:scale-[1.02] group-hover:shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{agentStats[1].title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{agentStats[1].description}</p>
                      <div className="text-2xl font-bold mt-3 text-gray-900">{agentStats[1].value}</div>
                    </div>
                    <div className={`p-3 rounded-lg ${agentStats[1].bgColor}`}>
                      {agentStats[1].icon}
                    </div>
                  </div>
                </div>
                
                {/* Tooltip that appears on hover */}
                {hoveredCard === 1 && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-xl z-20 p-4 border border-gray-100 transition-opacity duration-200">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <AlertTriangle className="mr-2" size={16} />
                      SLA Breach Alerts
                    </h4>
                    <div className="space-y-2">
                      {slaBreachDetails.map((detail, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{detail.label}</span>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-800 mr-2">{detail.value}</span>
                            {detail.timeLeft && (
                              <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded-full">
                                {detail.timeLeft}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <Link 
                        href="/tickets/agent/assign-priority"
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View All SLA Alerts →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Performance Card with Hover Tooltip */}
              <div 
                className="relative group"
                onMouseEnter={() => setHoveredCard(2)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-transform group-hover:scale-[1.02] group-hover:shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{agentStats[2].title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{agentStats[2].description}</p>
                      <div className="text-2xl font-bold mt-3 text-gray-900">{agentStats[2].value}</div>
                    </div>
                    <div className={`p-3 rounded-lg ${agentStats[2].bgColor}`}>
                      {agentStats[2].icon}
                    </div>
                  </div>
                </div>
                
                {/* Tooltip that appears on hover */}
                {hoveredCard === 2 && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-xl z-20 p-4 border border-gray-100 transition-opacity duration-200">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <GaugeCircle className="mr-2" size={16} />
                      Performance Metrics
                    </h4>
                    <div className="space-y-2">
                      {performanceDetails.map((detail, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{detail.label}</span>
                          <span className="text-sm font-medium text-gray-800">{detail.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <Link 
                        href="/analytics/agent/graph"
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Detailed Analytics →
                      </Link>
                    </div>
                  </div>
                )}
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

          {/* Performance Graph - Updated with month selection */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                <BarChart size={16} className="text-blue-600" />
              </span>
              Performance Analytics
            </h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 space-y-3 md:space-y-0">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setChartType('bar')}
                    className={`p-2 rounded-md ${chartType === 'bar' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <BarChart size={18} />
                  </button>
                  <button 
                    onClick={() => setChartType('line')}
                    className={`p-2 rounded-md ${chartType === 'line' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <LineChart size={18} />
                  </button>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setTimeRange('1month')}
                    className={`px-3 py-1 text-sm rounded-md ${timeRange === '1month' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                  >
                    1 Month
                  </button>
                  <button
                    onClick={() => setTimeRange('3months')}
                    className={`px-3 py-1 text-sm rounded-md ${timeRange === '3months' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                  >
                    3 Months
                  </button>
                  <button
                    onClick={() => setTimeRange('6months')}
                    className={`px-3 py-1 text-sm rounded-md ${timeRange === '6months' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                  >
                    6 Months
                  </button>
                </div>
                
                <Link 
                  href="/analytics/agent/graph"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Detailed Analytics
                </Link>
              </div>
              <div className="h-80">
                {chartType === 'bar' ? (
                  <Bar data={ticketData} options={chartOptions} />
                ) : (
                  <Line data={ticketData} options={chartOptions} />
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
                <p className="text-sm text-gray-800 dark:text-gray-100">I'm having trouble with my account login.</p>
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
