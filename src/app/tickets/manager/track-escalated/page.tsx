'use client';

import { useEffect, useState, useRef } from 'react';
import ManagerSidebar from '@/app/sidebar/ManagerSidebar';
import { 
  Bell, 
  User, 
  Settings, 
  ChevronDown, 
  Menu,
  Filter,
  Search,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";

interface EscalatedTicket {
  id: string;
  subject: string;
  escalatedBy: string;
  reason: string;
  status: 'Open' | 'Pending Review' | 'Resolved';
  priority: 'High' | 'Medium' | 'Low';
  createdAt: string;
  escalatedAt: string;
}

const EscalatedTicketsPage = () => {
  const [tickets, setTickets] = useState<EscalatedTicket[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Refs for handling click outside
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

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
    { id: 1, title: "New Escalation", message: "Ticket #ESC1003 has been escalated", time: "5 minutes ago", read: false },
    { id: 2, title: "SLA Breach Alert", message: "Escalated ticket #ESC1001 is about to breach SLA", time: "30 minutes ago", read: false },
  ];

  useEffect(() => {
    // Mock escalated ticket data
    const mockEscalatedTickets: EscalatedTicket[] = [
      {
        id: 'ESC1001',
        subject: 'Data loss after update',
        escalatedBy: 'John Doe',
        reason: 'Issue unresolved for 3 days',
        status: 'Open',
        priority: 'High',
        createdAt: '2025-03-30',
        escalatedAt: '2025-04-02',
      },
      {
        id: 'ESC1002',
        subject: 'Critical application downtime',
        escalatedBy: 'Jane Smith',
        reason: 'Customer reported critical outage',
        status: 'Pending Review',
        priority: 'High',
        createdAt: '2025-04-01',
        escalatedAt: '2025-04-03',
      },
      {
        id: 'ESC1003',
        subject: 'VPN connectivity issues',
        escalatedBy: 'Mike Johnson',
        reason: 'Multiple users affected',
        status: 'Open',
        priority: 'Medium',
        createdAt: '2025-04-02',
        escalatedAt: '2025-04-04',
      },
      {
        id: 'ESC1004',
        subject: 'Email delivery delays',
        escalatedBy: 'Sarah Williams',
        reason: 'Issue persists after initial fix',
        status: 'Resolved',
        priority: 'Medium',
        createdAt: '2025-04-01',
        escalatedAt: '2025-04-03',
      },
    ];
    setTickets(mockEscalatedTickets);
  }, []);

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

  // Filter tickets based on search query and status filter
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.escalatedBy.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Open':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Open
          </span>
        );
      case 'Pending Review':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending Review
          </span>
        );
      case 'Resolved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Resolved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  // Get priority badge styling
  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'High':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
            Medium
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
            Low
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
            {priority}
          </span>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
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
              <h1 className="text-2xl font-bold text-gray-800 hidden md:block">Escalated Tickets</h1>
              <h1 className="text-xl font-bold text-gray-800 md:hidden">Escalated Tickets</h1>
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
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-3 text-white">
                          <User size={32} />
                        </div>
                        <h3 className="text-lg font-medium">Sarah Johnson</h3>
                        <p className="text-gray-500 text-sm">Support Manager</p>
                      </div>
                      
                      {/* ... profile details ... */}
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
          {/* Page Header with Stats - Updated to match dashboard */}
          <div className="bg-blue-600 rounded-xl shadow-md mb-8 overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-2">Escalated Tickets Management</h2>
              <p className="text-blue-100 mb-6">Track and manage tickets that have been escalated to management level</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-500 text-sm">Open Escalations</p>
                      <p className="text-gray-900 text-2xl font-bold mt-1">
                        {tickets.filter(t => t.status === 'Open').length}
                      </p>
                    </div>
                    <div className="p-2 bg-red-100 rounded-full">
                      <AlertCircle className="text-red-500" size={20} />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-500 text-sm">Pending Review</p>
                      <p className="text-gray-900 text-2xl font-bold mt-1">
                        {tickets.filter(t => t.status === 'Pending Review').length}
                      </p>
                    </div>
                    <div className="p-2 bg-yellow-100 rounded-full">
                      <Clock className="text-yellow-500" size={20} />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-500 text-sm">Resolved</p>
                      <p className="text-gray-900 text-2xl font-bold mt-1">
                        {tickets.filter(t => t.status === 'Resolved').length}
                      </p>
                    </div>
                    <div className="p-2 bg-green-100 rounded-full">
                      <CheckCircle className="text-green-500" size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Controls - Updated to match dashboard style */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <Filter size={16} className="text-blue-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-700">Search & Filter</h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search tickets by ID, subject, or agent..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Filter by:</span>
                  <select
                    className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="Open">Open</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Tickets Table - Updated to match dashboard style */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <ArrowUpRight size={16} className="text-blue-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-700">Escalated Tickets</h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Escalated By</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Escalated Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTickets.length > 0 ? (
                      filteredTickets.map((ticket) => (
                        <tr key={ticket.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{ticket.id}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{ticket.subject}</div>
                            <div className="text-xs text-gray-500 mt-1">{ticket.reason}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <User size={14} className="text-blue-600" />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{ticket.escalatedBy}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {ticket.status === 'Open' ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Open
                              </span>
                            ) : ticket.status === 'Pending Review' ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <Clock className="w-3 h-3 mr-1" />
                                Pending Review
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Resolved
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {ticket.priority === 'High' ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                                High
                              </span>
                            ) : ticket.priority === 'Medium' ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                                Medium
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                Low
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{ticket.escalatedAt}</div>
                            <div className="text-xs text-gray-500">Created: {ticket.createdAt}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Link 
                              href={`/tickets/manager/details/${ticket.id}`}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              View
                            </Link>
                            <Link 
                              href={`/tickets/manager/resolve/${ticket.id}`}
                              className="text-green-600 hover:text-green-900"
                            >
                              Resolve
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-10 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="p-3 bg-gray-100 rounded-full mb-3">
                              <Search className="h-6 w-6 text-gray-400" />
                            </div>
                            <p className="text-gray-500 text-lg font-medium">No escalated tickets found</p>
                            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter criteria</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscalatedTicketsPage;
