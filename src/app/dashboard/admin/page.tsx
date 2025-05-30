'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Ticket,
  Settings,
  Book,
  MessageSquare,
  Monitor,
  BarChart,
  ShieldCheck,
  ChevronDown,
  X,
  User,
  FileText,
  PieChart,
  Menu,
  Bell,
  Search,
  HelpCircle,
  Calendar,
  Clock,
  TrendingUp,
  Users,
  Filter,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

// Dynamically import charts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Dashboard content components
const DashboardContent = () => {
  // Chart options for ticket status distribution
  const ticketStatusOptions: ApexOptions = {
    chart: {
      type: 'donut' as const,
      toolbar: {
        show: false
      }
    },
    colors: ['#3B82F6', '#F59E0B', '#10B981', '#6366F1'],
    labels: ['Open', 'In Progress', 'Resolved', 'Closed'],
    legend: {
      position: 'bottom',
      fontSize: '14px',
      fontFamily: 'Inter, sans-serif',
      markers: {
        size: 12, // ✅ valid
        shape: 'circle' // ✅ optional: 'circle' | 'square'
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Tickets',
              fontSize: '16px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              color: '#334155'
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          height: 250
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  // Chart options for ticket trends
  const ticketTrendsOptions : ApexOptions = {
    chart: {
      type: 'area',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    colors: ['#3B82F6', '#F59E0B'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '14px',
      fontFamily: 'Inter, sans-serif',
      offsetY: -8
    },
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 4
    },
    tooltip: {
      theme: 'light'
    }
  };

  // Chart options for response time
  const responseTimeOptions: ApexOptions = {
    chart: {
      type: 'bar', // ✅ must be the literal 'bar', not from a `string` variable
      toolbar: {
        show: true,
      },
    },
    colors: ['#3B82F6'],
    plotOptions: {
      bar: {
        borderRadius: 6,
        horizontal: false,
        columnWidth: '40%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Avg. Time (hrs)',
      },
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} hrs`,
      },
    },
  };

  return (
    <div className="p-6 space-y-6">
      {/* Enhanced Header with Search and Notifications */}
      <header className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <div className="flex items-center mt-1 space-x-2">
              <Calendar size={16} className="text-gray-500" />
              <p className="text-gray-500 text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative flex-1 md:max-w-xs">
              <input 
                type="text" 
                placeholder="Search tickets, users..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            
            <div className="relative">
              <button className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 relative">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-sm">
                <User size={18} className="text-white" />
              </div>
              <div className="hidden md:block">
                <h3 className="text-sm font-medium text-gray-800">Admin User</h3>
                <p className="text-xs text-gray-500">System Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <button className="flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all">
          <Ticket size={18} />
          <span className="font-medium">Ticket Details</span>
        </button>
        <button className="flex items-center justify-center space-x-2 p-3 bg-white border border-gray-200 text-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all">
          <Users size={18} />
          <span className="font-medium">Manage Users</span>
        </button>
        <button className="flex items-center justify-center space-x-2 p-3 bg-white border border-gray-200 text-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all">
          <Book size={18} />
          <span className="font-medium">Knowledge Base</span>
        </button>
        <button className="flex items-center justify-center space-x-2 p-3 bg-white border border-gray-200 text-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all">
          <FileText size={18} />
          <span className="font-medium">Reports</span>
        </button>
      </div>

      {/* Stats Overview with improved visuals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[
          { title: "Total Tickets", value: "1,284", change: "+12%", icon: <Ticket className="text-blue-500" />, bgColor: "bg-blue-50" },
          { title: "Open Tickets", value: "284", change: "-5%", icon: <MessageSquare className="text-orange-500" />, bgColor: "bg-orange-50" },
          { title: "Resolved Today", value: "64", change: "+8%", icon: <ShieldCheck className="text-green-500" />, bgColor: "bg-green-50" },
          { title: "Avg. Response Time", value: "2.4h", change: "-10%", icon: <Clock className="text-purple-500" />, bgColor: "bg-purple-50" },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-800">{stat.value}</h3>
                <div className="flex items-center mt-2">
                  <span className={`text-xs font-medium inline-flex items-center space-x-1 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    <TrendingUp size={14} />
                    <span>{stat.change} from last week</span>
                  </span>
                </div>
              </div>
              <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                {React.cloneElement(stat.icon, { size: 24 })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Ticket Status Distribution Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Ticket Status</h2>
            <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1">
              <Filter size={14} />
              <span>Filter</span>
            </button>
          </div>
          <div className="h-[300px]">
            {typeof window !== 'undefined' && (
              <Chart
                options={ticketStatusOptions}
                series={[45, 30, 15, 10]}
                type="donut"
                height="100%"
              />
            )}
          </div>
        </div>

        {/* Ticket Trends Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Weekly Ticket Trends</h2>
            <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1">
              <Filter size={14} />
              <span>Filter</span>
            </button>
          </div>
          <div className="h-[300px]">
            {typeof window !== 'undefined' && (
              <Chart
                options={ticketTrendsOptions}
                series={[
                  {
                    name: 'New Tickets',
                    data: [31, 40, 28, 51, 42, 25, 20]
                  },
                  {
                    name: 'Resolved Tickets',
                    data: [25, 32, 38, 32, 35, 22, 18]
                  }
                ]}
                type="area"
                height="100%"
              />
            )}
          </div>
        </div>

        {/* Response Time Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Response Time</h2>
            <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1">
              <Filter size={14} />
              <span>Filter</span>
            </button>
          </div>
          <div className="h-[300px]">
            {typeof window !== 'undefined' && (
              <Chart
                options={responseTimeOptions}
                series={[
                  {
                    name: 'Avg. Response Time',
                    data: [2.8, 2.3, 3.1, 2.5, 2.1, 1.8, 2.4]
                  }
                ]}
                type="bar"
                height="100%"
              />
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity and Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tickets */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Recent Tickets</h2>
            <div className="flex items-center space-x-2">
              <button className="p-1.5 bg-gray-50 rounded-lg hover:bg-gray-100 text-gray-600">
                <Filter size={16} />
              </button>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                View All
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { id: "TKT-1234", subject: "Login issue with mobile app", status: "Open", priority: "High", assignedTo: "John Doe" },
                  { id: "TKT-1233", subject: "Password reset not working", status: "In Progress", priority: "Medium", assignedTo: "Jane Smith" },
                  { id: "TKT-1232", subject: "Error in payment gateway", status: "Open", priority: "Critical", assignedTo: "Unassigned" },
                  { id: "TKT-1231", subject: "Feature request: Dark mode", status: "Closed", priority: "Low", assignedTo: "Mike Johnson" },
                  { id: "TKT-1230", subject: "Data sync issue between devices", status: "In Progress", priority: "Medium", assignedTo: "Sarah Williams" },
                ].map((ticket, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{ticket.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{ticket.subject}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        ticket.status === 'Open' ? 'bg-blue-100 text-blue-800' : 
                        ticket.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        ticket.priority === 'Critical' ? 'bg-red-100 text-red-800' : 
                        ticket.priority === 'High' ? 'bg-orange-100 text-orange-800' : 
                        ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{ticket.assignedTo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-100 text-center">
            <Link href="/tickets/admin/view-ticket" className="text-sm font-medium text-blue-600 hover:text-blue-800">
              View All Tickets
            </Link>
          </div>
        </div>

        {/* Activity Feed with improved styling */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
              View All
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {[
                { user: "John Doe", action: "assigned ticket TKT-1234 to Jane Smith", time: "10 minutes ago", icon: <User size={16} className="text-blue-600" />, color: "bg-blue-100" },
                { user: "System", action: "escalated ticket TKT-1232 to Critical priority", time: "25 minutes ago", icon: <Bell size={16} className="text-red-600" />, color: "bg-red-100" },
                { user: "Jane Smith", action: "closed ticket TKT-1229", time: "1 hour ago", icon: <ShieldCheck size={16} className="text-green-600" />, color: "bg-green-100" },
                { user: "Mike Johnson", action: "added a comment to TKT-1233", time: "2 hours ago", icon: <MessageSquare size={16} className="text-yellow-600" />, color: "bg-yellow-100" },
                { user: "Sarah Williams", action: "created a new knowledge base article", time: "3 hours ago", icon: <Book size={16} className="text-purple-600" />, color: "bg-purple-100" },
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 ${activity.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                    {activity.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center space-x-1">
                      <Clock size={12} />
                      <span>{activity.time}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-gray-100 text-center">
            <Link href="/reports/admin/activity" className="text-sm font-medium text-blue-600 hover:text-blue-800">
              View All Activity
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AdminSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();
  const [showTicketsSubMenu, setShowTicketsSubMenu] = useState(false);
  const [showAssignmentRulesSubMenu, setShowAssignmentRulesSubMenu] = useState(false);
  const [showKnowledgeBaseSubMenu, setShowKnowledgeBaseSubMenu] = useState(false);
  const [showLiveChatSubMenu, setShowLiveChatSubMenu] = useState(false);
  const [showAssetSubMenu, setShowAssetSubMenu] = useState(false);
  const [showReportsSubMenu, setShowReportsSubMenu] = useState(false);
  const [showAnalyticsSubMenu, setShowAnalyticsSubMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Function to check if the current path starts with a specific prefix
  const isPath = (prefix: string) => pathname.startsWith(prefix);

  useEffect(() => {
    if (pathname.startsWith("/tickets/admin")) {
      setShowTicketsSubMenu(true);
    } else if (pathname.startsWith("/tickets/admin")) {
      setShowAssignmentRulesSubMenu(true);
    } else if (pathname.startsWith("/knowledge-base/admin")) {
      setShowKnowledgeBaseSubMenu(true);
    } else if (pathname.startsWith("/live_chat/admin")) {
      setShowLiveChatSubMenu(true);
    } else if (pathname.startsWith("/asset/admin")) {
      setShowAssetSubMenu(true);
    } else if (pathname.startsWith("/reports/admin")) {
      setShowReportsSubMenu(true);
    } else if (pathname.startsWith("/analytics/admin")) {
      setShowAnalyticsSubMenu(true);
    }

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, [pathname]);

  const ticketSubLinks = [
    { label: "View Tickets", href: "/tickets/admin/view-ticket" },
    { label: "Assign Tickets", href: "/tickets/admin/assign-ticket" },
    { label: "Rules & Automation", href: "/tickets/admin/rules-and-automation" },
  ];

  const assignmentRulesSubLinks = [
    { label: "Auto-Assign", href: "/tickets/admin/auto-assign" },
    { label: "Escalation", href: "/sla_management/admin/escalations" },
  ];

  const knowledgeBaseSubLinks = [
    { label: "Create Article", href: "/knowledge_base_faqs/admin/create" },
    { label: "Edit Article", href: "/knowledge_base_faqs/admin/edit" },
    { label: "Delete Article", href: "/knowledge_base_faqs/admin/delete" },
  ];

  const liveChatSubLinks = [
    { label: "Setup WhatsApp", href: "/live_chat/admin/setup_whatsapp" },
    { label: "IVR Configuration", href: "/live_chat/admin/ivr" },
  ];

  const assetSubLinks = [
    { label: "Assign Asset Managers", href: "/asset/admin/assign_asset" },
  ];

  const reportsSubLinks = [
    { label: "Excel Reports", href: "/reports/admin/excel" },
    { label: "PDF Reports", href: "/reports/admin/pdf" },
  ];

  const analyticsSubLinks = [
    { label: "Analytics Metrics", href: "/reports/admin/analytics" },
  ];

  // Animation variants with improved transitions
  const sidebarVariants = {
    open: { 
      x: 0, 
      width: 250, 
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        duration: 0.3 
      } 
    },
    closed: { 
      x: 0, 
      width: 80, 
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        duration: 0.3 
      } 
    },
  };

  const subMenuVariants = {
    open: { 
      height: "auto", 
      opacity: 1,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.05,
        delayChildren: 0.05
      }
    },
    closed: { 
      height: 0, 
      opacity: 0,
      transition: { 
        duration: 0.2
      }
    }
  };

  const itemVariants = {
    open: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.2,
        ease: "easeOut" 
      } 
    },
    closed: { 
      opacity: 0, 
      y: -5, 
      transition: { 
        duration: 0.1 
      } 
    }
  };
  
  return (
    <motion.aside
      initial={false}
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      className={`fixed top-0 left-0 h-full bg-white shadow-xl z-50 overflow-hidden transition-all duration-300 ${
        !isOpen && "hover:w-[250px]"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          {isOpen ? (
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-md">
                <ShieldCheck size={18} className="text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Admin Portal</h2>
            </div>
          ) : (
            <div className="w-9 h-9 mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-md">
              <ShieldCheck size={18} className="text-white" />
            </div>
          )}
          
          {isOpen && (
            <button 
              onClick={toggleSidebar} 
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* User Section */}
        <div
          className={`p-5 border-b border-gray-100 ${
            isOpen ? "flex items-center space-x-3" : "flex flex-col items-center"
          }`}
        >
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shadow-sm">
            <User size={20} className="text-blue-600" />
          </div>
          {isOpen && (
            <div>
              <h3 className="text-sm font-medium text-gray-800">Admin User</h3>
              <p className="text-xs text-gray-500">System Administrator</p>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
          {/* Dashboard Link */}
          <Link
            href="/dashboard/admin"
            className={`flex items-center ${
              isOpen ? "justify-start px-4" : "justify-center"
            } py-3 rounded-lg transition-all duration-200 ${
              pathname === "/dashboard/admin"
                ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100"
            } hover:scale-[1.02]`}
          >
            <div>
              <Home size={20} />
            </div>
            {isOpen && <span className="ml-3 text-sm font-medium">Dashboard</span>}
          </Link>

          {/* Expandable Menus */}
          {[
            {
              label: "Tickets",
              icon: <Ticket size={20} />,
              subLinks: ticketSubLinks,
              isOpen: showTicketsSubMenu,
              toggle: () => setShowTicketsSubMenu((prev) => !prev),
              isActive: isPath("/tickets/admin") && !isPath("/tickets/admin"),
            },
            {
              label: "Assignment Rules",
              icon: <Settings size={20} />,
              subLinks: assignmentRulesSubLinks,
              isOpen: showAssignmentRulesSubMenu,
              toggle: () => setShowAssignmentRulesSubMenu((prev) => !prev),
              isActive: isPath("/tickets/admin"),
            },
            {
              label: "Knowledge Base",
              icon: <Book size={20} />,
              subLinks: knowledgeBaseSubLinks,
              isOpen: showKnowledgeBaseSubMenu,
              toggle: () => setShowKnowledgeBaseSubMenu((prev) => !prev),
              isActive: isPath("/knowledge-base/admin"),
            },
            {
              label: "Live Chat Config",
              icon: <MessageSquare size={20} />,
              subLinks: liveChatSubLinks,
              isOpen: showLiveChatSubMenu,
              toggle: () => setShowLiveChatSubMenu((prev) => !prev),
              isActive: isPath("/live_chat/admin"),
            },
            {
              label: "Asset & IT Mgmt",
              icon: <Monitor size={20} />,
              subLinks: assetSubLinks,
              isOpen: showAssetSubMenu,
              toggle: () => setShowAssetSubMenu((prev) => !prev),
              isActive: isPath("/asset/admin"),
            },
            {
              label: "Reports",
              icon: <FileText size={20} />,
              subLinks: reportsSubLinks,
              isOpen: showReportsSubMenu,
              toggle: () => setShowReportsSubMenu((prev) => !prev),
              isActive: isPath("/reports/admin"),
            },
            {
              label: "Analytics",
              icon: <PieChart size={20} />,
              subLinks: analyticsSubLinks,
              isOpen: showAnalyticsSubMenu,
              toggle: () => setShowAnalyticsSubMenu((prev) => !prev),
              isActive: isPath("/analytics/admin"),
            },
          ].map(({ label, icon, subLinks, isOpen: menuOpen, toggle, isActive }) => (
            <div key={label} className="space-y-1">
              <button
                onClick={toggle}
                className={`w-full flex items-center ${
                  isOpen ? "justify-between px-4" : "justify-center"
                } py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                } hover:scale-[1.02]`}
              >
                <div className="flex items-center">
                  <div className={`${isActive ? "text-blue-600" : ""}`}>
                    {icon}
                  </div>
                  {isOpen && <span className="ml-3 text-sm font-medium">{label}</span>}
                </div>
                {isOpen && (
                  <motion.div
                    animate={{ rotate: menuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                )}
              </button>
              
              <AnimatePresence>
                {(menuOpen || (isActive && !isOpen)) && (
                  <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={subMenuVariants}
                    className="overflow-hidden"
                  >
                    <div className={`pl-${isOpen ? "10" : "0"} space-y-1`}>
                      {subLinks.map((link) => (
                        <motion.div key={link.href} variants={itemVariants}>
                          <Link
                            href={link.href}
                            className={`flex items-center ${
                              isOpen ? "pl-4 pr-4" : "justify-center"
                            } py-2 rounded-lg ${
                              pathname === link.href
                                ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-sm"
                                : "text-gray-600 hover:bg-gray-100"
                            } transition-colors text-sm`}
                          >
                            {!isOpen && (
                              <div className="w-6 h-6 flex items-center justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                              </div>
                            )}
                            {isOpen && <span>{link.label}</span>}
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>
        
        {/* System Settings Link at bottom */}
        <div className="p-4 border-t border-gray-100">
          <Link
            href="/settings/admin/settings"
            className={`flex items-center ${
              isOpen ? "justify-start px-4" : "justify-center"
            } py-3 rounded-lg transition-all duration-200 ${
              pathname === "/settings/admin/settings"
                ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <div>
              <ShieldCheck size={20} />
            </div>
            {isOpen && <span className="ml-3 text-sm font-medium">System Settings</span>}
          </Link>
        </div>
      </div>
    </motion.aside>
  );
};

// Main Dashboard Page Component
const AdminDashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-[250px]' : 'ml-[80px]'}`}>
        {/* Mobile Header with Menu Button */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-md">
              <ShieldCheck size={16} className="text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Admin Portal</h2>
          </div>
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={16} className="text-blue-600" />
          </div>
        </div>
        
        {/* Dashboard Content */}
        <DashboardContent />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
