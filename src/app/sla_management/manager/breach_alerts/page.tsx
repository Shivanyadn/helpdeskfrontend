'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { FlipHorizontal, GlassWaterIcon } from 'lucide-react';

// Lazy load the ManagerSidebar
const ManagerSidebar = dynamic(() => import('@/app/sidebar/ManagerSidebar'), {
  ssr: false,
  loading: () => <div className="p-4">Loading sidebar...</div>,
});

// Sample SLA Breach Data
const slaBreachData = [
  {
    id: 1,
    ticketId: '#12345',
    customerName: 'John Doe',
    issueDescription: 'Unable to login to the system',
    slaBreachTime: '2025-04-05 09:30 AM',
    escalationLevel: 'Level 1',
    timeElapsed: '2h 15m',
    severity: 'Medium',
    assignedTo: 'Support Team A',
  },
  {
    id: 2,
    ticketId: '#12346',
    customerName: 'Jane Smith',
    issueDescription: 'Website down for maintenance',
    slaBreachTime: '2025-04-05 10:15 AM',
    escalationLevel: 'Level 2',
    timeElapsed: '4h 30m',
    severity: 'High',
    assignedTo: 'Technical Team',
  },
  {
    id: 3,
    ticketId: '#12347',
    customerName: 'Michael Johnson',
    issueDescription: 'Unable to reset password',
    slaBreachTime: '2025-04-05 11:00 AM',
    escalationLevel: 'Level 3',
    timeElapsed: '6h 45m',
    severity: 'Critical',
    assignedTo: 'Security Team',
  },
];

const ManagerSLAAlertsPage = () => {
  const [slaBreaches] = useState(slaBreachData);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('All');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Filter breaches based on search and severity
  const filteredBreaches = slaBreaches.filter((breach) => {
    const matchesSearch =
      breach.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      breach.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      breach.issueDescription.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity =
      selectedSeverity === 'All' || breach.severity === selectedSeverity;

    return matchesSearch && matchesSeverity;
  });

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low':
        return 'border-l-blue-500';
      case 'Medium':
        return 'border-l-yellow-500';
      case 'High':
        return 'border-l-orange-500';
      case 'Critical':
        return 'border-l-red-500';
      default:
        return 'border-l-gray-500';
    }
  };

  // Get severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Low':
        return 'bg-blue-100 text-blue-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <ManagerSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <main
        className={`flex-1 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'ml-[250px]' : 'ml-[80px]'
        }`}
      >
        <div className="p-6">
          {/* Header with alert icon */}
          <div className="mb-8 flex items-center">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <circle className="text-red-600 h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                SLA Management - Breach Alerts
              </h1>
              <p className="text-gray-600">
                Critical tickets that have breached Service Level Agreements
              </p>
            </div>
          </div>

          {/* Search and filter */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GlassWaterIcon className="text-gray-400 h-5 w-5" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Search by ticket ID, customer name, or issue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center">
                <FlipHorizontal className="text-gray-400 h-5 w-5 mr-2" />
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                >
                  <option value="All">All Severities</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
          </div>

          {/* Timeline view of breaches */}
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            <div className="space-y-6">
              {filteredBreaches.length === 0 ? (
                <div className="ml-16 bg-white p-6 rounded-lg shadow-md text-center">
                  <p className="text-gray-600">
                    No SLA breaches match your search criteria.
                  </p>
                </div>
              ) : (
                filteredBreaches.map((breach) => (
                  <div
                    key={breach.id}
                    className="flex"
                  >
                    <div className="flex-shrink-0 relative">
                      <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center z-10 relative">
                        <circle className="text-red-600 h-6 w-6" />
                      </div>
                    </div>

                    <div
                      className={`ml-4 flex-grow bg-white rounded-lg shadow-md border-l-4 ${getSeverityColor(
                        breach.severity
                      )}`}
                    >
                      <div className="p-5">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold flex items-center">
                              Ticket {breach.ticketId}
                              <span
                                className={`ml-2 px-2 py-1 text-xs rounded-full ${getSeverityBadge(
                                  breach.severity
                                )}`}
                              >
                                {breach.severity}
                              </span>
                            </h3>
                            <p className="text-gray-600">{breach.customerName}</p>
                          </div>
                          <div className="mt-2 md:mt-0">
                            <span className="text-red-600 font-medium flex items-center">
                              <circle className="mr-1 h-5 w-5" /> Breached{' '}
                              {breach.timeElapsed} ago
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-gray-700">
                            <span className="font-medium">Issue:</span>{' '}
                            {breach.issueDescription}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Breach Time:</span>{' '}
                            {breach.slaBreachTime}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Escalation Level:</span>{' '}
                            {breach.escalationLevel}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Assigned To:</span>{' '}
                            {breach.assignedTo}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
                            Escalate
                          </button>
                          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                            View Details
                          </button>
                          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors">
                            Reassign
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManagerSLAAlertsPage;
