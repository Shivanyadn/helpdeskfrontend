'use client';

import { useEffect, useState } from 'react';
import EmployeeSidebar from '@/app/sidebar/EmployeeSidebar';
import { Search, Filter, Clock, AlertCircle, Tag, ArrowUpRight, RefreshCw, CheckCircle, XCircle, Loader2, ChevronRight, User, MessageSquare, Download,  BarChart4, Printer, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUserTickets} from '@/api/tickets';

interface Ticket {
  id: string;
  subject: string;
  status: string;
  createdAt: string;
  priority: string;
  assignedTo?: string;
  assignedAt?: string;
  lastUpdated?: string;
  category?: string;
  department?: string;
  estimatedTime?: string;
  attachments?: number;
  timeline?: {
    date: string;
    status: string;
    description: string;
    user?: string;
  }[];
  expanded?: boolean;
}

export default function TrackTicketPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeView, setActiveView] = useState('list');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRangeFilter, setDateRangeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
const [error, setError] = useState<string | null>(null);


  // Function to fetch tickets from API
  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const ticketsData = await getUserTickets();
      console.log('API response:', ticketsData);
      
      // First, let's update the transformation of API response to handle missing properties safely
      // Transform API response to match our Ticket interface
      const transformedTickets: Ticket[] = ticketsData.map(ticket => ({
        id: ticket.ticketId || ticket._id,
        subject: ticket.title || 'No Title',
        status: ticket.status || 'Open',
        createdAt: new Date(ticket.createdAt).toISOString().split('T')[0],
        priority: ticket.priority || 'Medium',
        assignedTo: ticket.assignedTo ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}` : undefined,
        assignedAt: ticket.assignedTo ? new Date(ticket.createdAt).toISOString().split('T')[0] : undefined,
        lastUpdated: ticket.sla ? new Date(ticket.sla).toISOString().split('T')[0] : undefined,
        category: ticket.category || 'Uncategorized', // Changed from ticket.issueCategory
        department: 'IT Support',
        estimatedTime: ticket.sla ? '24 hours' : undefined,
        attachments: ticket.attachments?.length || 0,
        timeline: [
          { 
            date: new Date(ticket.createdAt).toLocaleString(), 
            status: 'Created', 
            description: 'Ticket created', 
            user: 'You' 
          },
          ...(ticket.assignedTo ? [{
            date: new Date(ticket.createdAt).toLocaleString(),
            status: 'Assigned',
            description: `Assigned to ${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`,
            user: 'System'
          }] : []),
          ...(ticket.status === 'In Progress' ? [{
            date: new Date(ticket.createdAt).toLocaleString(),
            status: 'In Progress',
            description: 'Technician working on the issue',
            user: ticket.assignedTo ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}` : 'Support Team'
          }] : []),
          ...(ticket.status === 'Resolved' || ticket.status === 'Closed' ? [{
            date: ticket.sla ? new Date(ticket.sla).toLocaleString() : new Date().toLocaleString(),
            status: ticket.status,
            description: 'Issue has been resolved', // Changed from ticket.resolution
            user: ticket.assignedTo ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}` : 'Support Team'
          }] : [])
        ],
        expanded: false
      }));
      
      setTickets(transformedTickets);
      
      
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Failed to load tickets. Please try again later.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const refreshTickets = () => {
    setIsRefreshing(true);
    fetchTickets();
  };


  const exportSelectedTickets = () => {
    // Implementation for exporting tickets
    alert(`Exporting ${selectedTickets.length} tickets`);
  };

  const printSelectedTickets = () => {
    // Implementation for printing tickets
    window.print();
  };


  useEffect(() => {
    fetchTickets();
  }, []);



  // Apply filters and sorting
  const getFilteredAndSortedTickets = () => {
    // First apply filters
    const result = tickets.filter(ticket => {
      const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || ticket.priority === priorityFilter;
      const matchesCategory = categoryFilter === 'All' || ticket.category === categoryFilter;
      
      // Date range filtering
      let matchesDateRange = true;
      if (dateRangeFilter !== 'all') {
        const today = new Date();
        const ticketDate = new Date(ticket.createdAt);
        const diffTime = Math.abs(today.getTime() - ticketDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (dateRangeFilter === 'today' && diffDays > 1) matchesDateRange = false;
        if (dateRangeFilter === 'week' && diffDays > 7) matchesDateRange = false;
        if (dateRangeFilter === 'month' && diffDays > 30) matchesDateRange = false;
      }
      
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesDateRange;
    });
    
    // Then apply sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'priority') {
        const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
        return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
      } else if (sortBy === 'status') {
        const statusOrder = { 'Open': 0, 'In Progress': 1, 'Resolved': 2, 'Closed': 3 };
        return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
      }
      return 0;
    });
    
    return result;
  };

  const filteredTickets = getFilteredAndSortedTickets();

  // Get status color based on ticket status
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Closed':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  // Get status icon based on ticket status
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Open':
        return <AlertCircle size={14} className="text-blue-600" />;
      case 'In Progress':
        return <Loader2 size={14} className="text-amber-600" />;
      case 'Resolved':
        return <CheckCircle size={14} className="text-green-600" />;
      case 'Closed':
        return <XCircle size={14} className="text-slate-600" />;
      default:
        return null;
    }
  };

  // Get priority color based on ticket priority
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };



  return (
    <div className="flex h-screen bg-slate-100">
      <EmployeeSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-[250px]' : 'ml-[80px]'} overflow-auto`}>
        <div className="p-6">
          {/* Header with breadcrumb */}
          <div className="mb-6">
            <div className="flex items-center text-sm text-slate-500 mb-2">
              <Link href="/dashboard/employee" className="hover:text-indigo-600">Dashboard</Link>
              <ChevronRight size={14} className="mx-1" />
              <span className="text-slate-700 font-medium">Track Tickets</span>
              {error && (
          <div className="bg-red-100 border border-red-300 text-red-800 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Ticket Tracking</h1>
                <p className="text-sm text-slate-500 mt-1">Monitor and track the status of your support tickets</p>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.refresh()}
                  className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Refresh page"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>
            <hr className="border-t border-slate-200 my-4" />
          </div>
          
          
          {/* Search, Filter and View Controls */}
          <div className="bg-white p-5 rounded-xl shadow-md mb-6 border border-slate-200">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by ticket ID or subject"
                  className="pl-10 w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Filter size={16} />
                  <span>Filters</span>
                  {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                
                <div className="flex items-center gap-2 ml-auto">
                  <div className="flex border border-slate-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setActiveView('list')}
                      className={`p-2.5 ${activeView === 'list' ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                      title="List view"
                    >
                      <FileText size={18} />
                    </button>
                    <button
                      onClick={() => setActiveView('kanban')}
                      className={`p-2.5 ${activeView === 'kanban' ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                      title="Kanban view"
                    >
                      <BarChart4 size={18} />
                    </button>
                  </div>
                  
                  <select
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="priority">Priority</option>
                    <option value="status">Status</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Advanced Filters */}
            {showFilters && (
              <div className="pt-4 border-t border-slate-200 mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                  >
                    <option value="All">All Priorities</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Software">Software</option>
                    <option value="Network">Network</option>
                    <option value="Email">Email</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date Range</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={dateRangeFilter}
                    onChange={(e) => setDateRangeFilter(e.target.value)}
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          
          {/* Bulk Actions */}
          {selectedTickets.length > 0 && (
            <div className="bg-indigo-50 p-3 rounded-lg mb-4 flex items-center justify-between border border-indigo-200">
              <div className="flex items-center">
                <span className="text-sm font-medium text-indigo-700 mr-4">{selectedTickets.length} tickets selected</span>
                <button 
                  onClick={() => setSelectedTickets([])}
                  className="text-xs text-indigo-600 hover:text-indigo-800"
                >
                  Clear selection
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={exportSelectedTickets}
                  className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                  title="Export selected"
                >
                  <Download size={18} />
                </button>
                <button
                  onClick={printSelectedTickets}
                  className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                  title="Print selected"
                >
                  <Printer size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
{error && (
  <div className="bg-red-100 border border-red-300 text-red-800 p-3 rounded-md mt-4 text-sm">
    {error}
  </div>
)}
          
          {/* Tickets List */}
          {loading ? (
            <div className="bg-white p-8 rounded-xl shadow-md flex items-center justify-center border border-slate-200">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
                </div>
                <p className="text-slate-600 font-medium">Loading your tickets...</p>
              </div>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-1">No tickets found</h3>
                <p className="text-slate-500">
                  {searchQuery || statusFilter !== 'All' || priorityFilter !== 'All'
                    ? "Try adjusting your search or filter criteria" 
                    : "You don't have any tickets yet"}
                </p>
                {(searchQuery || statusFilter !== 'All' || priorityFilter !== 'All') && (
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('All');
                      setPriorityFilter('All');
                    }}
                    className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
              <div className="border-b border-slate-200 px-6 py-4 flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-800">
                <h2 className="font-semibold text-white">Your Tickets ({filteredTickets.length})</h2>
                <button 
                  className="text-sm text-white hover:text-white/90 flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors"
                  onClick={refreshTickets}
                  disabled={isRefreshing}
                >
                  <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
                  <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
                </button>
              </div>
              
              <div className="divide-y divide-slate-100">
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-6 hover:bg-slate-50 transition-colors"
                  >
                    {/* Ticket Header */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-5">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h2 className="text-lg font-semibold text-slate-800">{ticket.subject}</h2>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium border flex items-center gap-1.5 ${getStatusColor(ticket.status)}`}>
                            {getStatusIcon(ticket.status)}
                            {ticket.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <Tag size={14} className="text-slate-400" />
                            <span>{ticket.id}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <AlertCircle size={14} className="text-slate-400" />
                            <span className={`px-2 py-0.5 rounded-full text-xs border ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority} Priority
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link 
                          href={`/tickets/employee/view-ticket?id=${ticket.id}`}
                          className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-lg transition-colors shadow-md flex items-center gap-1.5"
                        >
                          <span>View Details</span>
                          <ArrowUpRight size={14} />
                        </Link>
                      </div>
                    </div>
                    
                    {/* Ticket Progress Tracker */}
                    <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-200">
                      <h3 className="text-sm font-medium text-slate-700 mb-4">Ticket Progress</h3>
                      
                      {/* Progress Steps */}
                      <div className="relative">
                        <div className="absolute left-[15px] top-0 h-full w-0.5 bg-slate-200"></div>
                        
                        <div className="space-y-6">
                          {/* Created Step - Always present */}
                          <div className="flex items-start">
                            <div className="bg-blue-500 rounded-full w-[30px] h-[30px] flex items-center justify-center z-10">
                              <CheckCircle size={16} className="text-white" />
                            </div>
                            <div className="ml-4">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <h4 className="font-medium text-slate-800">Created</h4>
                                <span className="text-xs text-slate-500">{ticket.createdAt}</span>
                              </div>
                              <p className="text-sm text-slate-600 mt-1">Ticket was created and submitted to the support team</p>
                            </div>
                          </div>
                          
                          {/* Assigned Step */}
                          <div className="flex items-start">
                            <div className={`rounded-full w-[30px] h-[30px] flex items-center justify-center z-10 ${ticket.assignedTo ? 'bg-blue-500' : 'bg-slate-300'}`}>
                              {ticket.assignedTo ? (
                                <CheckCircle size={16} className="text-white" />
                              ) : (
                                <User size={16} className="text-white" />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <h4 className="font-medium text-slate-800">Assigned</h4>
                                {ticket.assignedAt && (
                                  <span className="text-xs text-slate-500">{ticket.assignedAt}</span>
                                )}
                              </div>
                              {ticket.assignedTo ? (
                                <div className="flex items-center mt-1">
                                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-medium mr-2">
                                    {ticket.assignedTo.split(' ').map(name => name[0]).join('')}
                                  </div>
                                  <p className="text-sm text-slate-600">Assigned to {ticket.assignedTo}</p>
                                </div>
                              ) : (
                                <p className="text-sm text-slate-500 mt-1">Waiting to be assigned to a support agent</p>
                              )}
                            </div>
                          </div>
                          
                          {/* In Progress Step */}
                          <div className="flex items-start">
                            <div className={`rounded-full w-[30px] h-[30px] flex items-center justify-center z-10 ${ticket.status === 'In Progress' || ticket.status === 'Resolved' || ticket.status === 'Closed' ? 'bg-blue-500' : 'bg-slate-300'}`}>
                              {ticket.status === 'In Progress' || ticket.status === 'Resolved' || ticket.status === 'Closed' ? (
                                <CheckCircle size={16} className="text-white" />
                              ) : (
                                <Clock size={16} className="text-white" />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <h4 className="font-medium text-slate-800">In Progress</h4>
                                {ticket.status === 'In Progress' && ticket.lastUpdated && (
                                  <span className="text-xs text-slate-500">Since {ticket.lastUpdated}</span>
                                )}
                              </div>
                              {ticket.status === 'In Progress' ? (
                                <p className="text-sm text-slate-600 mt-1">Support team is actively working on your ticket</p>
                              ) : ticket.status === 'Resolved' || ticket.status === 'Closed' ? (
                                <p className="text-sm text-slate-600 mt-1">This step has been completed</p>
                              ) : (
                                <p className="text-sm text-slate-500 mt-1">Waiting for support team to begin work</p>
                              )}
                            </div>
                          </div>
                          
                          {/* Resolved Step */}
                          <div className="flex items-start">
                            <div className={`rounded-full w-[30px] h-[30px] flex items-center justify-center z-10 ${ticket.status === 'Resolved' || ticket.status === 'Closed' ? 'bg-blue-500' : 'bg-slate-300'}`}>
                              {ticket.status === 'Resolved' || ticket.status === 'Closed' ? (
                                <CheckCircle size={16} className="text-white" />
                              ) : (
                                <MessageSquare size={16} className="text-white" />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <h4 className="font-medium text-slate-800">Resolved</h4>
                                {ticket.status === 'Resolved' && ticket.lastUpdated && (
                                  <span className="text-xs text-slate-500">{ticket.lastUpdated}</span>
                                )}
                              </div>
                              {ticket.status === 'Resolved' || ticket.status === 'Closed' ? (
                                <p className="text-sm text-slate-600 mt-1">Your issue has been resolved by the support team</p>
                              ) : (
                                <p className="text-sm text-slate-500 mt-1">Waiting for resolution</p>
                              )}
                            </div>
                          </div>
                          
                          {/* Closed Step */}
                          <div className="flex items-start">
                            <div className={`rounded-full w-[30px] h-[30px] flex items-center justify-center z-10 ${ticket.status === 'Closed' ? 'bg-blue-500' : 'bg-slate-300'}`}>
                              {ticket.status === 'Closed' ? (
                                <CheckCircle size={16} className="text-white" />
                              ) : (
                                <XCircle size={16} className="text-white" />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <h4 className="font-medium text-slate-800">Closed</h4>
                                {ticket.status === 'Closed' && ticket.lastUpdated && (
                                  <span className="text-xs text-slate-500">{ticket.lastUpdated}</span>
                                )}
                              </div>
                              {ticket.status === 'Closed' ? (
                                <p className="text-sm text-slate-600 mt-1">This ticket has been closed and is no longer active</p>
                              ) : (
                                <p className="text-sm text-slate-500 mt-1">Ticket will be closed after confirmation</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Timeline Events */}
                    {ticket.timeline && ticket.timeline.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-slate-700 mb-3">Recent Activity</h3>
                        <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
                          {ticket.timeline.map((event, index) => (
                            <div key={index} className="p-3 flex items-start">
                              <div className={`w-2 h-2 rounded-full mt-1.5 mr-3 flex-shrink-0 ${
                                event.status === 'Created' ? 'bg-blue-500' :
                                event.status === 'Assigned' ? 'bg-indigo-500' :
                                event.status === 'In Progress' ? 'bg-amber-500' :
                                event.status === 'Resolved' ? 'bg-green-500' :
                                event.status === 'Closed' ? 'bg-slate-500' : 'bg-slate-300'
                              }`}></div>
                              <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                  <p className="font-medium text-slate-800 text-sm">{event.description}</p>
                                  <span className="text-xs text-slate-500">{event.date}</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Status: {event.status}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              <div className="border-t border-slate-200 px-6 py-4 flex justify-between items-center bg-slate-50">
                <div className="text-sm text-slate-500">
                  Showing <span className="font-medium">{filteredTickets.length}</span> of <span className="font-medium">{tickets.length}</span> tickets
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 border border-slate-200 rounded-md text-sm text-slate-500 hover:bg-slate-50 disabled:opacity-50" disabled>
                    Previous
                  </button>
                  <button className="px-3 py-1 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-md text-sm font-medium">
                    1
                  </button>
                  <button className="px-3 py-1 border border-slate-200 rounded-md text-sm text-slate-500 hover:bg-slate-50 disabled:opacity-50" disabled>
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Quick Actions Panel */}
          <div className="fixed bottom-6 right-6">
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:text-indigo-600 transition-all"
                title="Scroll to top"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m18 15-6-6-6 6"/>
                </svg>
              </button>
              
              <Link
                href="/tickets/employee/create-ticket"
                className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg hover:shadow-xl flex items-center justify-center text-white transition-all"
                title="Create new ticket"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Export and Print Functionality */}
          <div className="fixed bottom-6 left-6 ml-[250px] transition-all duration-300">
            <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    // Export functionality
                    const data = filteredTickets.map(t => ({
                      id: t.id,
                      subject: t.subject,
                      status: t.status,
                      priority: t.priority,
                      createdAt: t.createdAt,
                      assignedTo: t.assignedTo || 'Unassigned'
                    }));
                    
                    const csvContent = "data:text/csv;charset=utf-8," 
                      + "ID,Subject,Status,Priority,Created At,Assigned To\n"
                      + data.map(row => Object.values(row).join(",")).join("\n");
                    
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", "ticket_report.csv");
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Export to CSV"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </button>
                
                <button
                  onClick={() => {
                    // Print functionality
                    window.print();
                  }}
                  className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Print tickets"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9"/>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                    <rect x="6" y="14" width="12" height="8"/>
                  </svg>
                </button>
                
                <button
                  onClick={() => {
                    // Refresh functionality
                    refreshTickets();
                  }}
                  className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Refresh tickets"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isRefreshing ? "animate-spin" : ""}>
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Notification System */}
          <div id="notification-container" className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-md">
            {/* Notifications will be dynamically added here via JavaScript */}
          </div>
        </div>
      </div>
      
      {/* Add JavaScript for notifications */}
      <script dangerouslySetInnerHTML={{
        __html: `
          // Function to show notifications
          function showNotification(message, type = 'info') {
            const container = document.getElementById('notification-container');
            const notification = document.createElement('div');
            
            // Set classes based on notification type
            let bgColor = 'bg-blue-50 border-blue-200';
            let textColor = 'text-blue-800';
            let iconColor = 'text-blue-500';
            
            if (type === 'success') {
              bgColor = 'bg-green-50 border-green-200';
              textColor = 'text-green-800';
              iconColor = 'text-green-500';
            } else if (type === 'error') {
              bgColor = 'bg-red-50 border-red-200';
              textColor = 'text-red-800';
              iconColor = 'text-red-500';
            } else if (type === 'warning') {
              bgColor = 'bg-amber-50 border-amber-200';
              textColor = 'text-amber-800';
              iconColor = 'text-amber-500';
            } else {
              iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="' + iconColor + '"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
            }
            
            notification.className = \`\${bgColor} \${textColor} p-4 rounded-lg shadow-md border flex items-start gap-3 animate-fade-in\`;
            
            // Create icon based on type
            let iconSvg = '';
            if (type === 'success') {
              iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="' + iconColor + '"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
            } else if (type === 'error') {
              iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="' + iconColor + '"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
            } else if (type === 'warning') {
              iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="' + iconColor + '"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
            } else {
              iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="' + iconColor + '"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
            }
            
            notification.innerHTML = \`
              <div class="\${iconColor} flex-shrink-0">
                \${iconSvg}
              </div>
              <div class="flex-1">
                <p class="font-medium">\${message}</p>
              </div>
              <button class="text-slate-400 hover:text-slate-600" onclick="this.parentElement.remove()">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            \`;
            
            container.appendChild(notification);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
              notification.classList.add('animate-fade-out');
              setTimeout(() => {
                notification.remove();
              }, 300);
            }, 5000);
          }
          
          // Example usage:
          // showNotification('Ticket updated successfully', 'success');
          // showNotification('Failed to load tickets', 'error');
          // showNotification('Your ticket is being processed', 'info');
          // showNotification('Ticket requires your attention', 'warning');
          
          // Add CSS for animations
          const style = document.createElement('style');
          style.textContent = \`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes fadeOut {
              from { opacity: 1; transform: translateY(0); }
              to { opacity: 0; transform: translateY(-10px); }
            }
            
            .animate-fade-in {
              animation: fadeIn 0.3s ease-out forwards;
            }
            
            .animate-fade-out {
              animation: fadeOut 0.3s ease-in forwards;
            }
          \`;
          document.head.appendChild(style);
          
          // Show a welcome notification when the page loads
          window.addEventListener('load', () => {
            setTimeout(() => {
              showNotification('Welcome to Ticket Tracking! You can view and monitor all your support tickets here.', 'info');
            }, 1000);
          });
        `
      }} />
    </div>
  );
}