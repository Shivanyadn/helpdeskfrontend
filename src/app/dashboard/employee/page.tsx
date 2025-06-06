'use client';

import React, { useState, useRef, useEffect } from 'react';
import EmployeeSidebar from '@/app/sidebar/EmployeeSidebar';
import { 
  Ticket, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  MessageSquare,
  Search,
  Bell,
  User,
  Calendar,
  BarChart,
  Menu,
  TrendingUp,
  Download,
  Settings,
  ChevronDown,
  Briefcase,
  MessageCircle,
  AlertTriangle,
  X
} from 'lucide-react';
import Link from 'next/link';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Import the analytics components
import TicketStatusGraph from '@/app/analytics/employee/graph/view_ticket_status';
import { getTickets } from '@/api/tickets';

export default function EmployeeDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Refs for handling click outside
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const [showLiveChat, setShowLiveChat] = useState(false);
  // Sample notifications data
  const notifications = [
    { id: 1, title: "New Ticket Update", message: "Your ticket #4872 has been updated", time: "10 minutes ago", read: false },
    { id: 2, title: "Ticket Resolved", message: "Ticket #4856 has been resolved", time: "25 minutes ago", read: false },
    { id: 3, title: "Reminder", message: "Please provide feedback for ticket #4890", time: "1 hour ago", read: true },
  ];
  const [showWebChat, setShowWebChat] = useState(false);
  // Sample ticket details for tooltips
  const ticketDetails = [
    { label: "Last 24 hours", value: "1" },
    { label: "This Week", value: "3" },
    { label: "Response Time", value: "2h avg" },
    { label: "Satisfaction", value: "4.8/5" },
  ];

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

  const [showChatOptions, setShowChatOptions] = useState(false);

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

  const [ticketStats, setTicketStats] = useState({
    open: 0,
    inProgress: 0,
    resolved: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicketStats = async () => {
      try {
        setLoading(true);
        const tickets = await getTickets();

        const stats = {
          open: 0,
          inProgress: 0,
          resolved: 0,
          pending: 0,
        };

        tickets.forEach(ticket => {
          switch (ticket.status) {
            case 'Open':
              stats.open += 1;
              break;
            case 'In Progress':
              stats.inProgress += 1;
              break;
            case 'Resolved':
              stats.resolved += 1;
              break;
            case 'Pending':
              stats.pending += 1;
              break;
            default:
              break;
          }
        });

        setTicketStats(stats);
        setError(null);
      } catch (err) {
        console.error('Error fetching ticket stats:', err);
        setError('Failed to load ticket stats. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTicketStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
      <EmployeeSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        {/* Header with Profile Menu - Updated UI */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleSidebar}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Menu size={20} className="text-gray-700" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800 hidden md:block">Employee Dashboard</h1>
              <h1 className="text-xl font-bold text-gray-800 md:hidden">Dashboard</h1>
            </div>
            
            {/* Profile & Settings Menu - Updated UI */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              
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
                      {notifications.map(notification => (
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
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <Link href="/settings/employee/settings" className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Settings">
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
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-3 text-white">
                          <User size={32} />
                        </div>
                        <h3 className="text-lg font-medium">Shivanya</h3>
                        <p className="text-gray-500 text-sm">Employee</p>
                      </div>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Email:</span>
                          <span className="text-gray-800 font-medium">shivanya@company.com</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-500">Department:</span>
                          <span className="text-gray-800 font-medium">IT Support</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-4 py-3">
                      <Link 
                        href="/profile/employee/profile" 
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
                <h2 className="text-2xl font-bold text-white">Welcome back, Shivanya!</h2>
                <p className="text-blue-100 mt-1">You have 3 tickets that need your attention today</p>
              </div>
              <div className="flex space-x-3">
                <Link 
                  href="/tickets/employee/view-ticket"
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm flex items-center"
                >
                  <Ticket className="mr-2" size={16} />
                  View My Tickets
                </Link>
                <Link 
                  href="/reports/employee/ticket_status"
                  className="px-4 py-2 bg-blue-400 bg-opacity-25 text-white rounded-lg hover:bg-opacity-40 transition-colors font-medium text-sm"
                >
                  View Reports
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Cards - Updated with hover tooltips */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {loading ? (
              <div className="col-span-4 text-center text-gray-500">Loading ticket stats...</div>
            ) : error ? (
              <div className="col-span-4 text-center text-red-500">{error}</div>
            ) : (
              [
                { title: "Open Tickets", value: ticketStats.open, icon: <Ticket className="text-blue-500" />, change: "+1 from last week" },
                { title: "In Progress", value: ticketStats.inProgress, icon: <Clock className="text-orange-500" />, change: "No change" },
                { title: "Resolved", value: ticketStats.resolved, icon: <CheckCircle className="text-green-500" />, change: "+3 from last week" },
                { title: "Pending", value: ticketStats.pending, icon: <AlertCircle className="text-red-500" />, change: "-1 from last week" }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="relative group"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Card className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-transform group-hover:scale-[1.02] group-hover:shadow-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{stat.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">Last 7 days</p>
                        <div className="text-2xl font-bold mt-3 text-gray-900">{stat.value}</div>
                        <div className="flex items-center mt-2">
                          <TrendingUp size={14} className="text-green-500 mr-1" />
                          <span className="text-xs text-gray-500">{stat.change}</span>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        {stat.icon}
                      </div>
                    </div>
                  </Card>
                  
                  {/* Tooltip that appears on hover */}
                  {hoveredCard === index && (
                    <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-xl z-20 p-4 border border-gray-100 transition-opacity duration-200">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                        {stat.icon}
                        <span className="ml-2">{stat.title} Details</span>
                      </h4>
                      <div className="space-y-2">
                        {ticketDetails.map((detail, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{detail.label}</span>
                            <span className="text-sm font-medium text-gray-800">{detail.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

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
                  href="/tickets/employee/create-ticket"
                  className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-colors"
                >
                  <Briefcase className="mr-2" size={18} />
                  <span>Create Ticket</span>
                </Link>
                <Link 
                  href="/knowledge_base_faqs/employee/faqs"
                  className="flex items-center justify-center p-4 bg-white border border-gray-200 text-gray-800 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <MessageCircle className="mr-2" size={18} />
                  <span>Knowledge Base</span>
                </Link>
                <Link 
                  href="/tickets/employee/track-ticket"
                  className="flex items-center justify-center p-4 bg-white border border-gray-200 text-gray-800 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <MessageCircle className="mr-2" size={18} />
                  <span>Track Ticket</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Analytics Graph Section */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-6 text-gray-700 flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                <BarChart size={16} className="text-blue-600" />
              </span>
              Ticket Analytics
            </h2>
            <Card className="p-6 border-0">
              <div className="h-[400px]">
                <TicketStatusGraph />
              </div>
            </Card>
          </section>

          {/* Chat Options - Enhanced Floating Button with Popups */}
          <div className="fixed bottom-4 right-4 z-50">
            <div className="relative group">
              <button 
                className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all group-hover:scale-110"
                onClick={() => setShowChatOptions(!showChatOptions)}
              >
                <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" />
              </button>

              {/* Enhanced Chat Options Dropdown */}
              <div 
                className={`absolute bottom-full right-0 mb-4 w-72 bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform ${
                  showChatOptions ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
                }`}
              >
                <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600">
                  <h3 className="text-white font-semibold text-lg">Chat Support</h3>
                  <p className="text-blue-100 text-sm">Choose your preferred chat option</p>
                </div>

                <div className="p-3">
                  <button 
                    onClick={() => setShowWebChat(true)}
                    className="w-full flex items-center p-3 mb-2 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group"
                  >
                    <span className="w-10 h-10 flex items-center justify-center bg-green-500 rounded-full text-white mr-3 group-hover:scale-110 transition-transform">
                      <MessageCircle size={20} />
                    </span>
                    <div className="flex-1 text-left">
                      <h4 className="font-medium text-green-700">WhatsApp Chat</h4>
                      <p className="text-sm text-green-600">Connect via WhatsApp</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setShowLiveChat(true)}
                    className="w-full flex items-center p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
                  >
                    <span className="w-10 h-10 flex items-center justify-center bg-blue-500 rounded-full text-white mr-3 group-hover:scale-110 transition-transform">
                      <MessageSquare size={20} />
                    </span>
                    <div className="flex-1 text-left">
                      <h4 className="font-medium text-blue-700">Live Chat</h4>
                      <p className="text-sm text-blue-600">Chat with our support team</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* WhatsApp Chat Interface */}
              {showWebChat && (
                <div className="fixed bottom-20 right-4 w-96 h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden">
                  <div className="h-full flex flex-col">
                    {/* Chat Header */}
                    <div className="p-4 bg-gradient-to-r from-green-500 to-green-600 flex justify-between items-center">
                      <div>
                        <h3 className="text-white font-semibold">WhatsApp Support</h3>
                        <p className="text-green-100 text-sm">Connect with us on WhatsApp</p>
                      </div>
                      <button 
                        onClick={() => setShowWebChat(false)}
                        className="text-white hover:text-green-100 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {/* WhatsApp Preview Area */}
                    <div className="flex-1 p-6 flex flex-col items-center justify-center bg-gray-50">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <MessageCircle size={32} className="text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Connect on WhatsApp</h3>
                      <p className="text-gray-600 text-center mb-6">Chat with our support team directly through WhatsApp</p>
                      <button 
                        onClick={() => {
                          const supportNumber = '7338265989';
                          const message = 'Hello, I need assistance with my issue.';
                          const whatsappUrl = `https://wa.me/${supportNumber}?text=${encodeURIComponent(message)}`;
                          window.open(whatsappUrl, '_blank');
                          setShowWebChat(false);
                        }}
                        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
                      >
                        <MessageCircle size={20} className="mr-2" />
                        Open WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Live Chat Interface */}
              {showLiveChat && (
                <div className="fixed bottom-20 right-4 w-96 h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden">
                  <div className="h-full flex flex-col">
                    {/* Chat Header */}
                    <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 flex justify-between items-center">
                      <div>
                        <h3 className="text-white font-semibold">Live Support</h3>
                        <p className="text-blue-100 text-sm">We're here to help</p>
                      </div>
                      <button 
                        onClick={() => setShowLiveChat(false)}
                        className="text-white hover:text-blue-100 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {/* Chat Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto" id="chat-messages">
                      <div className="space-y-4">
                        {/* Sample message - you can map through actual messages here */}
                        <div className="flex items-start space-x-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User size={16} className="text-blue-600" />
                          </div>
                          <div className="bg-blue-50 rounded-lg p-3 max-w-[80%]">
                            <p className="text-sm text-gray-800">Hello! How can I help you today?</p>
                            <span className="text-xs text-gray-500 mt-1 block">Support Team • Just now</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Chat Input Area */}
                    <div className="p-4 border-t">
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          placeholder="Type your message..."
                          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}