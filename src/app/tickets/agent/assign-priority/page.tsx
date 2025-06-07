'use client';

import { useState, useEffect } from 'react';
import AgentSidebar from '@/app/sidebar/AgentSidebar';
import { AlertTriangle, CheckCircle,Filter, Search, ArrowUpDown, Info, Shield, Tag, Calendar } from 'lucide-react';
import Link from 'next/link';

interface Ticket {
  ticketId: string; // Unique identifier for the ticket
  id: string; // Add this property if required by the API
  title: string; // Title or subject of the ticket
  priority: string; // Current priority of the ticket
  updatedPriority: string; // Priority after user modification
  currentPriority: string; // Add this property to track the original priority
  category: string; // Category of the ticket
  createdAt: string; // Creation date of the ticket
  status: string; // Current status of the ticket
}

const AgentAssignPriorityPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [sortOrder, setSortOrder] = useState('desc');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkPriority, setBulkPriority] = useState('Medium');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('auth_token') || '';

        const response = await fetch('https://help.zenapi.co.in/api/tickets', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Error fetching tickets: ${response.status}`);
        }

        const data: Ticket[] = await response.json();

        // Map the API response to match the required format
        const formattedTickets = data.map(ticket => ({
          ticketId: ticket.ticketId,
          id: ticket.ticketId, // Map ticketId to id if required
          title: ticket.title,
          priority: ticket.priority,
          updatedPriority: ticket.priority, // Initialize updatedPriority with the current priority
          currentPriority: ticket.priority, // Track the original priority
          category: ticket.category,
          createdAt: ticket.createdAt,
          status: ticket.status,
        }));

        setTickets(formattedTickets);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setTickets([]);
      }
    };

    fetchTickets();
  }, []);

  const handlePriorityChange = (index: number, newPriority: string) => {
    const updated = [...tickets];
    updated[index].updatedPriority = newPriority;
    updated[index].currentPriority = newPriority; // Automatically update currentPriority
    setTickets(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token') || '';

      if (!token) {
        throw new Error('Authorization token is missing. Please log in again.');
      }

      // Filter tickets where the priority has been updated
      const updatedTickets = tickets.filter(ticket => ticket.currentPriority !== ticket.updatedPriority);

      // Make PATCH requests for each updated ticket
      const updatePromises = updatedTickets.map(ticket =>
        fetch('https://help.zenapi.co.in/api/tickets/update', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            ticketId: ticket.id,
            priority: ticket.updatedPriority,
          }),
        })
      );

      // Wait for all requests to complete
      const responses = await Promise.all(updatePromises);

      // Check for any failed requests
      const failedResponses = responses.filter(response => !response.ok);
      if (failedResponses.length > 0) {
        throw new Error('Some tickets failed to update. Please try again.');
      }

      setSuccessMessage('Ticket priorities updated successfully!');
      setSelectedTickets([]);
      setShowBulkActions(false);

      // Refresh tickets after saving
      const refreshedTickets = tickets.map(ticket => ({
        ...ticket,
        currentPriority: ticket.updatedPriority,
      }));
      setTickets(refreshedTickets);
    } catch (error) {
      console.error('Error saving priorities:', error);
    } finally {
      setSaving(false);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-800 border-orange-200';
      case 'Medium':
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return <Shield size={14} className="mr-1 text-red-600" />;
      case 'High':
        return <AlertTriangle size={14} className="mr-1 text-orange-600" />;
      case 'Medium':
        return <Info size={14} className="mr-1 text-yellow-600" />;
      case 'Low':
        return <Tag size={14} className="mr-1 text-green-600" />;
      default:
        return null;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
      const aValue = priorityOrder[a.updatedPriority as keyof typeof priorityOrder] || 0;
      const bValue = priorityOrder[b.updatedPriority as keyof typeof priorityOrder] || 0;
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    } else if (sortBy === 'time') {
      return sortOrder === 'desc'
        ? a.createdAt.localeCompare(b.createdAt)
        : b.createdAt.localeCompare(a.createdAt);
    } else {
      return sortOrder === 'desc'
        ? b.ticketId.localeCompare(a.ticketId)
        : a.ticketId.localeCompare(b.ticketId);
    }
  });

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const toggleTicketSelection = (ticketId: string) => {
    setSelectedTickets(prev => {
      if (prev.includes(ticketId)) {
        return prev.filter(id => id !== ticketId);
      } else {
        return [...prev, ticketId];
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectedTickets.length === sortedTickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(sortedTickets.map(ticket => ticket.ticketId));
    }
  };

  const applyBulkPriority = () => {
    const updated = [...tickets];
    selectedTickets.forEach(ticketId => {
      const index = updated.findIndex(t => t.ticketId === ticketId);
      if (index !== -1) {
        updated[index].updatedPriority = bulkPriority;
      }
    });
    setTickets(updated);
    setShowBulkActions(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AgentSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header with title and description */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Assign Priority to Tickets</h1>
            <p className="text-gray-600">Manage and update ticket priorities based on urgency and impact</p>
          </div>

          {/* Action bar with search and filters */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search tickets by ID or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Pending">Pending</option>
                  <option value="Resolved">Resolved</option>
                </select>

                <button className="flex items-center px-4 py-2.5 bg-white border rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                  <Filter size={18} className="mr-2 text-gray-500" />
                  More Filters
                </button>

                {selectedTickets.length > 0 && (
                  <button
                    onClick={() => setShowBulkActions(!showBulkActions)}
                    className="flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Bulk Actions ({selectedTickets.length})
                  </button>
                )}
              </div>
            </div>

            {/* Bulk actions panel */}
            {showBulkActions && selectedTickets.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex flex-wrap items-center gap-3">
                <span className="text-blue-700 font-medium">Set priority for {selectedTickets.length} selected tickets:</span>
                <select
                  value={bulkPriority}
                  onChange={(e) => setBulkPriority(e.target.value)}
                  className={`border rounded px-3 py-1.5 ${getPriorityColor(bulkPriority)}`}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
                <button
                  onClick={applyBulkPriority}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Apply
                </button>
                <button
                  onClick={() => setSelectedTickets([])}
                  className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            )}
          </div>

          {/* Success message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl flex items-center shadow-sm animate-fadeIn">
              <CheckCircle size={20} className="mr-3 text-green-500" />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {/* Tickets table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 text-sm font-medium text-gray-700">
              <div className="col-span-1 flex items-center">
                <input
                  type="checkbox"
                  checked={selectedTickets.length === sortedTickets.length && sortedTickets.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-1">ID</div>
              <div className="col-span-3">Subject</div>
              <div className="col-span-2">
                <button
                  onClick={() => toggleSort('priority')}
                  className="flex items-center"
                >
                  Current Priority
                  <ArrowUpDown size={14} className="ml-1" />
                </button>
              </div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">
                <button
                  onClick={() => toggleSort('time')}
                  className="flex items-center"
                >
                  Time Open
                  <ArrowUpDown size={14} className="ml-1" />
                </button>
              </div>
              <div className="col-span-1">New Priority</div>
            </div>

            <div className="divide-y divide-gray-100">
              {sortedTickets.length > 0 ? (
                sortedTickets.map((ticket) => {
                  const originalIndex = tickets.findIndex(t => t.ticketId === ticket.ticketId);
                  const isSelected = selectedTickets.includes(ticket.ticketId);

                  return (
                    <div
                      key={ticket.ticketId}
                      className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-blue-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}
                    >
                      <div className="col-span-1">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleTicketSelection(ticket.ticketId)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <div className="col-span-1 font-medium text-gray-700">{ticket.ticketId}</div>
                      <div className="col-span-3">
                        <Link href={`/tickets/agent/update-ticket?id=${ticket.ticketId}`} className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                          {ticket.title}
                        </Link>
                        <div className="text-xs text-gray-500 mt-1 flex items-center">
                          <span className={`px-2 py-0.5 rounded-full inline-flex items-center ${
                            ticket.status === 'Open' ? 'bg-blue-100 text-blue-800' :
                            ticket.status === 'In Progress' ? 'bg-purple-100 text-purple-800' :
                            ticket.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full mr-1 bg-current"></span>
                            {ticket.status}
                          </span>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className={`px-3 py-1.5 rounded-md border inline-flex items-center ${getPriorityColor(ticket.priority)}`}>
                          {getPriorityIcon(ticket.priority)}
                          {ticket.priority}
                        </span>
                      </div>
                      <div className="col-span-2 text-gray-700 flex items-center">
                        <Tag size={16} className="mr-2 text-gray-400" />
                        {ticket.category}
                      </div>
                      <div className="col-span-2 flex items-center">
                        <Calendar size={16} className="mr-2 text-gray-400" />
                        {ticket.createdAt}
                      </div>
                      <div className="col-span-1">
                        <select
                          value={ticket.updatedPriority}
                          onChange={(e) => handlePriorityChange(originalIndex, e.target.value)}
                          className={`border rounded px-3 py-2 w-full ${getPriorityColor(ticket.updatedPriority)} transition-all duration-200 hover:shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none`}
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical</option>
                        </select>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <AlertTriangle size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium">No tickets match your search criteria</p>
                  <p className="mt-2">Try adjusting your filters or search terms</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer with stats and save button */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
              Showing <span className="font-medium text-gray-700">{sortedTickets.length}</span> of <span className="font-medium text-gray-700">{tickets.length}</span> tickets
              {selectedTickets.length > 0 && (
                <span className="ml-2">(<span className="font-medium text-blue-600">{selectedTickets.length}</span> selected)</span>
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 flex items-center shadow-sm transition-all duration-200 w-full sm:w-auto justify-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Saving Changes...
                </>
              ) : (
                'Save Priority Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentAssignPriorityPage;
