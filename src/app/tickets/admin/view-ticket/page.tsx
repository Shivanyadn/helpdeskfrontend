'use client';

import { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Download, 
  ChevronDown, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Menu,
  ArrowUpDown,
  MoreHorizontal
} from 'lucide-react';
import AdminSidebar from '@/app/sidebar/AdminSidebar';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

interface Ticket {
  id: string;
  subject: string;
  createdBy: string;
  assignedTo: string;
  status: 'Open' | 'In Progress' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  createdAt: string;
  department: string;
}

const AdminViewTicketsPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    // Simulate API call with timeout
    const fetchTickets = async () => {
      setIsLoading(true);
      try {
        // Replace with real API call
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockTickets: Ticket[] = [
          {
            id: 'ADM1001',
            subject: 'Email not syncing with Outlook',
            createdBy: 'john.doe@domain.com',
            assignedTo: 'Agent Smith',
            status: 'Open',
            priority: 'High',
            createdAt: '2025-04-01',
            department: 'IT Support',
          },
          {
            id: 'ADM1002',
            subject: 'VPN access issue for remote team',
            createdBy: 'jane.smith@domain.com',
            assignedTo: 'Agent Johnson',
            status: 'In Progress',
            priority: 'Medium',
            createdAt: '2025-04-02',
            department: 'Network',
          },
          {
            id: 'ADM1003',
            subject: 'Software installation needed for new hire',
            createdBy: 'robert.brown@domain.com',
            assignedTo: 'Agent Williams',
            status: 'Closed',
            priority: 'Low',
            createdAt: '2025-04-03',
            department: 'IT Support',
          },
          {
            id: 'ADM1004',
            subject: 'Server down in east region data center',
            createdBy: 'admin@domain.com',
            assignedTo: 'Agent Davis',
            status: 'Open',
            priority: 'Critical',
            createdAt: '2025-04-04',
            department: 'Infrastructure',
          },
          {
            id: 'ADM1005',
            subject: 'Password reset request',
            createdBy: 'emily.wilson@domain.com',
            assignedTo: 'Agent Thompson',
            status: 'Closed',
            priority: 'Low',
            createdAt: '2025-04-05',
            department: 'IT Support',
          },
          {
            id: 'ADM1006',
            subject: 'New software license request',
            createdBy: 'michael.jones@domain.com',
            assignedTo: 'Agent Garcia',
            status: 'In Progress',
            priority: 'Medium',
            createdAt: '2025-04-06',
            department: 'Software',
          },
        ];

        setTickets(mockTickets);
        setFilteredTickets(mockTickets);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  useEffect(() => {
    // Apply filters, search, and sorting
    let result = tickets;
    
    // Apply search term
    if (searchTerm) {
      result = result.filter(ticket => 
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.createdBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'All') {
      result = result.filter(ticket => ticket.status === statusFilter);
    }
    
    // Apply priority filter
    if (priorityFilter !== 'All') {
      result = result.filter(ticket => ticket.priority === priorityFilter);
    }
    
    // Apply department filter
    if (departmentFilter !== 'All') {
      result = result.filter(ticket => ticket.department === departmentFilter);
    }
    
    // Apply sorting
    if (sortField) {
      result.sort((a, b) => {
        let valueA = a[sortField as keyof Ticket];
        let valueB = b[sortField as keyof Ticket];
        
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return sortDirection === 'asc' 
            ? valueA.localeCompare(valueB) 
            : valueB.localeCompare(valueA);
        }
        
        return 0;
      });
    }
    
    setFilteredTickets(result);
  }, [searchTerm, statusFilter, priorityFilter, departmentFilter, tickets, sortField, sortDirection]);

  const refreshTickets = () => {
    setIsLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'In Progress':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'Closed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <AlertCircle size={14} className="mr-1" />;
      case 'In Progress':
        return <Clock size={14} className="mr-1" />;
      case 'Closed':
        return <CheckCircle2 size={14} className="mr-1" />;
      default:
        return null;
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'Low':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'Medium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'High':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'Critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Get unique departments for filter
  const departments = ['All', ...new Set(tickets.map(ticket => ticket.department))];

  // Stats for dashboard cards
  const stats = [
    { 
      title: "Total Tickets", 
      value: tickets.length, 
      icon: <AlertCircle className="text-blue-500" />, 
      bgColor: "bg-blue-50 dark:bg-blue-900/20" 
    },
    { 
      title: "Open Tickets", 
      value: tickets.filter(t => t.status === 'Open').length, 
      icon: <AlertCircle className="text-amber-500" />, 
      bgColor: "bg-amber-50 dark:bg-amber-900/20" 
    },
    { 
      title: "In Progress", 
      value: tickets.filter(t => t.status === 'In Progress').length, 
      icon: <Clock className="text-purple-500" />, 
      bgColor: "bg-purple-50 dark:bg-purple-900/20" 
    },
    { 
      title: "Closed Tickets", 
      value: tickets.filter(t => t.status === 'Closed').length, 
      icon: <CheckCircle2 className="text-green-500" />, 
      bgColor: "bg-green-50 dark:bg-green-900/20" 
    },
  ];

  return (
    <>
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar} 
              className="md:hidden"
            >
              <Menu />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Ticket Management</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage all support tickets in the system</p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${stat.bgColor} rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 transition-all hover:shadow-md`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">{stat.value}</h3>
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    {stat.icon}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Filters and Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-auto flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                {/* Filter Toggle */}
                <Button 
                  variant="outline" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2"
                >
                  <Filter size={16} />
                  <span>Filters</span>
                </Button>

                {/* Refresh Button */}
                <button 
                  onClick={refreshTickets}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <RefreshCw size={18} className={`${isLoading ? 'animate-spin' : ''}`} />
                </button>

                {/* Export Button */}
                <button className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                  <Download size={18} />
                </button>
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="All">All Status</option>
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  {/* Priority Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="w-full appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="All">All Priority</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                  {/* Department Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                    <select
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                      className="w-full appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="ghost"
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('All');
                      setPriorityFilter('All');
                      setDepartmentFilter('All');
                    }}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Tickets Table */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50 dark:bg-gray-700 text-left">
                  <tr>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort('id')}
                        className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        <span>Ticket ID</span>
                        {sortField === 'id' && (
                          <ArrowUpDown size={14} className="text-gray-400" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort('subject')}
                        className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        <span>Subject</span>
                        {sortField === 'subject' && (
                          <ArrowUpDown size={14} className="text-gray-400" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort('createdBy')}
                        className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        <span>Created By</span>
                        {sortField === 'createdBy' && (
                          <ArrowUpDown size={14} className="text-gray-400" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort('assignedTo')}
                        className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        <span>Assigned To</span>
                        {sortField === 'assignedTo' && (
                          <ArrowUpDown size={14} className="text-gray-400" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort('status')}
                        className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        <span>Status</span>
                        {sortField === 'status' && (
                          <ArrowUpDown size={14} className="text-gray-400" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort('priority')}
                        className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        <span>Priority</span>
                        {sortField === 'priority' && (
                          <ArrowUpDown size={14} className="text-gray-400" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort('createdAt')}
                        className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        <span>Created At</span>
                        {sortField === 'createdAt' && (
                          <ArrowUpDown size={14} className="text-gray-400" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading tickets...</p>
                      </td>
                    </tr>
                  ) : filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket, index) => (
                      <motion.tr 
                        key={ticket.id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{ticket.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                          <div className="max-w-xs truncate">{ticket.subject}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{ticket.createdBy}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{ticket.assignedTo}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(ticket.status)}`}>
                            {getStatusIcon(ticket.status)}
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{ticket.createdAt}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex space-x-2">
                            <button className="p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                              <Eye size={16} />
                            </button>
                            <div className="relative group">
                              <button className="p-1.5 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <MoreHorizontal size={16} />
                              </button>
                              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 hidden group-hover:block z-10">
                                <div className="py-1">
                                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Edit Ticket</a>
                                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Reassign Ticket</a>
                                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Close Ticket</a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">No tickets found matching your criteria.</p>
                        <button 
                          onClick={() => {
                            setSearchTerm('');
                            setStatusFilter('All');
                            setPriorityFilter('All');
                            setDepartmentFilter('All');
                          }}
                          className="mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Clear filters
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {filteredTickets.length > 0 && (
              <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Previous
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredTickets.length}</span> of{' '}
                      <span className="font-medium">{filteredTickets.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <span className="sr-only">Previous</span>
                        {/* Chevron left icon */}
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                        1
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© 2025 Helpdesk Management System. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminViewTicketsPage;