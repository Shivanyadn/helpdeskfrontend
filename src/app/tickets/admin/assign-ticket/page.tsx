'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from "@/app/sidebar/AdminSidebar";
import { Menu, Search, RefreshCw, Filter, Users, AlertCircle, CheckCircle, Clock, ArrowUpDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

interface Ticket {
  id: string;
  subject: string;
  createdBy: string;
  status: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  assignedTo?: string;
  createdAt: string;
}

const agents = [
  { id: 'agent-a', name: 'Agent A', department: 'IT Support', availability: 'Available' },
  { id: 'agent-b', name: 'Agent B', department: 'Customer Service', availability: 'Busy' },
  { id: 'agent-c', name: 'Agent C', department: 'Technical', availability: 'Available' },
  { id: 'agent-d', name: 'Agent D', department: 'IT Support', availability: 'Away' },
];

const AdminAssignTicketPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [bulkAssignAgent, setBulkAssignAgent] = useState<string>('');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    // Replace with real API call
    const fetchTickets = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockUnassignedTickets: Ticket[] = [
          { id: 'ADM2001', subject: 'System crash issue', createdBy: 'user1@example.com', status: 'Open', priority: 'High', createdAt: '2023-06-15T10:30:00Z' },
          { id: 'ADM2002', subject: 'Forgot password', createdBy: 'user2@example.com', status: 'Open', priority: 'Low', createdAt: '2023-06-16T09:15:00Z' },
          { id: 'ADM2003', subject: 'Network connectivity problems', createdBy: 'user3@example.com', status: 'Open', priority: 'Medium', createdAt: '2023-06-16T14:45:00Z' },
          { id: 'ADM2004', subject: 'Software installation request', createdBy: 'user4@example.com', status: 'Open', priority: 'Medium', createdAt: '2023-06-17T11:20:00Z' },
          { id: 'ADM2005', subject: 'Database connection error', createdBy: 'user5@example.com', status: 'Pending', priority: 'Critical', createdAt: '2023-06-17T16:10:00Z' },
          { id: 'ADM2006', subject: 'Email configuration issue', createdBy: 'user6@example.com', status: 'Open', priority: 'Low', createdAt: '2023-06-18T08:30:00Z' },
        ];

        setTickets(mockUnassignedTickets);
        setFilteredTickets(mockUnassignedTickets);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...tickets];
    
    if (searchTerm) {
      filtered = filtered.filter(ticket => 
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (priorityFilter) {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }
    
    if (statusFilter) {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }
    
    // Apply sorting
    if (sortField) {
      filtered.sort((a, b) => {
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
    
    setFilteredTickets(filtered);
  }, [searchTerm, tickets, priorityFilter, statusFilter, sortField, sortDirection]);

  const handleAssign = (ticketId: string, agent: string) => {
    // TODO: Call backend API to assign ticket
    setAssignments((prev) => ({ ...prev, [ticketId]: agent }));
    // Show success message
    console.log(`Ticket ${ticketId} assigned to ${agent}`);
  };

  const handleBulkAssign = () => {
    if (!bulkAssignAgent || selectedTickets.length === 0) return;
    
    // Create a new assignments object
    const newAssignments = { ...assignments };
    selectedTickets.forEach(ticketId => {
      newAssignments[ticketId] = bulkAssignAgent;
    });
    
    setAssignments(newAssignments);
    setSelectedTickets([]);
    setBulkAssignAgent('');
    
    // Show success message
    console.log(`${selectedTickets.length} tickets assigned to ${bulkAssignAgent}`);
  };

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

  const toggleTicketSelection = (ticketId: string) => {
    setSelectedTickets(prev => 
      prev.includes(ticketId) 
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedTickets.length === filteredTickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(filteredTickets.map(ticket => ticket.id));
    }
  };

  const getPriorityBadgeClass = (priority?: string) => {
    switch (priority) {
      case 'Low':
        return 'bg-gray-100 text-gray-800';
      case 'Medium':
        return 'bg-blue-100 text-blue-800';
      case 'High':
        return 'bg-amber-100 text-amber-800';
      case 'Critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getAgentAvailabilityClass = (availability: string) => {
    switch (availability) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Busy':
        return 'bg-red-100 text-red-800';
      case 'Away':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
                <Menu className="h-6 w-6" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Assign Tickets</h1>
                <p className="text-sm text-gray-500">Manage and assign tickets to support agents</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={refreshTickets}
                className="flex items-center space-x-2"
              >
                <RefreshCw size={16} className={`${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </div>
          </div>

        <div className="p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              { title: "Unassigned Tickets", value: tickets.length, icon: <AlertCircle className="text-amber-500" />, bgColor: "bg-amber-50" },
              { title: "Critical Priority", value: tickets.filter(t => t.priority === 'Critical').length, icon: <AlertCircle className="text-red-500" />, bgColor: "bg-red-50" },
              { title: "Available Agents", value: agents.filter(a => a.availability === 'Available').length, icon: <Users className="text-green-500" />, bgColor: "bg-green-50" },
              { title: "Assigned Today", value: Object.keys(assignments).length, icon: <CheckCircle className="text-blue-500" />, bgColor: "bg-blue-50" },
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all hover:shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1 text-gray-800">{stat.value}</h3>
                  </div>
                  <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-auto flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search tickets by ID, subject, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filter Toggle */}
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter size={16} />
                <span>Filters</span>
              </Button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-4 border-t border-gray-100"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Priorities</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Statuses</option>
                      <option value="Open">Open</option>
                      <option value="Pending">Pending</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <Button 
                      variant="ghost"
                      onClick={() => {
                        setPriorityFilter('');
                        setStatusFilter('');
                        setSearchTerm('');
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Bulk Assignment */}
          {selectedTickets.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between"
            >
              <div className="mb-3 sm:mb-0">
                <p className="text-blue-800 font-medium">{selectedTickets.length} tickets selected</p>
              </div>
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <select
                  value={bulkAssignAgent}
                  onChange={(e) => setBulkAssignAgent(e.target.value)}
                  className="border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-1 sm:flex-none"
                >
                  <option value="">Select Agent</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name} ({agent.department})
                    </option>
                  ))}
                </select>
                <Button 
                  onClick={handleBulkAssign}
                  disabled={!bulkAssignAgent}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Assign
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => setSelectedTickets([])}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {/* Tickets Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedTickets.length === filteredTickets.length && filteredTickets.length > 0}
                          onChange={toggleSelectAll}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                      <button 
                        onClick={() => toggleSort('id')}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>Ticket ID</span>
                        {sortField === 'id' && (
                          <ArrowUpDown size={14} className="text-gray-400" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                      <button 
                        onClick={() => toggleSort('subject')}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>Subject</span>
                        {sortField === 'subject' && (
                          <ArrowUpDown size={14} className="text-gray-400" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                      <button 
                        onClick={() => toggleSort('createdBy')}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>Created By</span>
                        {sortField === 'createdBy' && (
                          <ArrowUpDown size={14} className="text-gray-400" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                      <button 
                        onClick={() => toggleSort('priority')}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>Priority</span>
                        {sortField === 'priority' && (
                          <ArrowUpDown size={14} className="text-gray-400" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                      <button 
                        onClick={() => toggleSort('status')}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>Status</span>
                        {sortField === 'status' && (
                          <ArrowUpDown size={14} className="text-gray-400" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                      <button 
                        onClick={() => toggleSort('createdAt')}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>Created</span>
                        {sortField === 'createdAt' && (
                          <ArrowUpDown size={14} className="text-gray-400" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Assign To</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">Loading tickets...</p>
                      </td>
                    </tr>
                  ) : filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedTickets.includes(ticket.id)}
                            onChange={() => toggleTicketSelection(ticket.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{ticket.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-800">{ticket.subject}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{ticket.createdBy}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(ticket.priority)}`}>
                            {ticket.priority || 'Normal'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Clock size={14} className="text-gray-400" />
                            <span>{formatDate(ticket.createdAt)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={assignments[ticket.id] || ''}
                            onChange={(e) => handleAssign(ticket.id, e.target.value)}
                            className="border rounded p-2 text-sm w-full max-w-[180px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select Agent</option>
                            {agents.map((agent) => (
                              <option key={agent.id} value={agent.id}>
                                {agent.name} - {agent.department}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center py-8">
                        <p className="text-gray-500">No tickets found matching your criteria.</p>
                        {(searchTerm || priorityFilter || statusFilter) && (
                          <button 
                            onClick={() => {
                              setSearchTerm('');
                              setPriorityFilter('');
                              setStatusFilter('');
                            }}
                            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                          >
                            Clear all filters
                          </button>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Agent Availability Section */}
          <div className="mt-6 bg-white rounded-xl shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4">Agent Availability</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {agents.map((agent) => (
                <div key={agent.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{agent.name}</h3>
                      <p className="text-sm text-gray-500">{agent.department}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAgentAvailabilityClass(agent.availability)}`}>
                      {agent.availability}
                    </span>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">
                    <p>Assigned tickets: {Object.values(assignments).filter(a => a === agent.id).length}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminAssignTicketPage;
