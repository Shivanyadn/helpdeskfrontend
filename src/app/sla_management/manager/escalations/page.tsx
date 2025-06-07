'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Clock, MessageCircleDashed, TriangleAlert, User } from 'lucide-react';

// Lazy load the ManagerSidebar
const ManagerSidebar = dynamic(() => import('@/app/sidebar/ManagerSidebar'), {
  ssr: false,
  loading: () => <div className="p-4">Loading sidebar...</div>,
});

// Sample data for SLA escalations
const slaEscalationData = [
  {
    id: 1,
    ticketId: '#12345',
    customerName: 'John Doe',
    issueDescription: 'Unable to login to the system',
    escalationLevel: 'Level 1',
    escalationReason: 'Exceeded resolution time limit',
    escalatedAt: '2025-04-05 09:30 AM',
    priority: 'Medium',
    status: 'Pending',
  },
  {
    id: 2,
    ticketId: '#12346',
    customerName: 'Jane Smith',
    issueDescription: 'Website down for maintenance',
    escalationLevel: 'Level 2',
    escalationReason: 'Multiple support requests unanswered',
    escalatedAt: '2025-04-05 10:15 AM',
    priority: 'High',
    status: 'In Progress',
  },
  {
    id: 3,
    ticketId: '#12347',
    customerName: 'Michael Johnson',
    issueDescription: 'Unable to reset password',
    escalationLevel: 'Level 3',
    escalationReason: 'Critical issue affecting multiple users',
    escalatedAt: '2025-04-05 11:00 AM',
    priority: 'Critical',
    status: 'Pending',
  },
];

const ManagerSLAEscalationsPage = () => {
  const [slaEscalations] = useState(slaEscalationData);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Filter escalations based on search term and status
  const filteredEscalations = slaEscalations.filter(escalation => {
    const matchesSearch = 
      escalation.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      escalation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      escalation.issueDescription.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || escalation.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'Low': return 'bg-blue-100 text-blue-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get escalation level color
  const getEscalationLevelColor = (level: string) => {
    switch(level) {
      case 'Level 1': return 'bg-green-100 text-green-800';
      case 'Level 2': return 'bg-orange-100 text-orange-800';
      case 'Level 3': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ManagerSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-[250px]' : 'ml-[80px]'}`}>
        <div className="p-6">
          {/* Header with stats */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">SLA Management - Escalations</h1>
            <p className="text-gray-600 mb-4">Monitor and manage escalated tickets that require immediate attention</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-red-100 text-red-500 mr-4">
                    <TriangleAlert size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Escalations</p>
                    <p className="text-xl font-semibold">{slaEscalations.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pending Resolution</p>
                    <p className="text-xl font-semibold">{slaEscalations.filter(e => e.status === 'Pending').length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">In Progress</p>
                    <p className="text-xl font-semibold">{slaEscalations.filter(e => e.status === 'In Progress').length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and filter controls */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <search className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search by ticket ID, customer name, or issue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center">
                <filter className="text-gray-400 mr-2" />
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>
          </div>

          {/* Escalations list */}
          <div className="space-y-4">
            {filteredEscalations.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                <MessageCircleDashed className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600 text-lg">No escalations match your search criteria.</p>
                <button 
                  className="mt-4 text-blue-500 hover:text-blue-700"
                  onClick={() => {setSearchTerm(''); setFilterStatus('All');}}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              filteredEscalations.map((escalation) => (
                <div key={escalation.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Ticket {escalation.ticketId}
                      </h3>
                      <p className="text-gray-600">{escalation.customerName}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(escalation.priority)}`}>
                        {escalation.priority}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEscalationLevelColor(escalation.escalationLevel)}`}>
                        {escalation.escalationLevel}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {escalation.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Issue</p>
                      <p className="font-medium">{escalation.issueDescription}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Escalation Reason</p>
                      <p className="font-medium">{escalation.escalationReason}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      <span className="inline-block mr-1">⏱️</span> 
                      Escalated at {escalation.escalatedAt}
                    </p>
                    <div className="flex gap-2">
                      <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors">
                        Assign
                      </button>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManagerSLAEscalationsPage;
