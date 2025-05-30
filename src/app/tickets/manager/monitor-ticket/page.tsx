'use client';

import { useEffect, useState, Suspense, lazy } from 'react';
import { FaTicketAlt, FaUserCog, FaCalendarAlt, FaExclamationCircle } from 'react-icons/fa';

const ManagerSidebar = lazy(() => import('@/app/sidebar/ManagerSidebar'));

interface Ticket {
  id: string;
  subject: string;
  assignee: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  createdAt: string;
  employeeName: string;
  department: string;
}

const ManagerMonitorTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      // Simulate API fetch with mock data
      const mockTickets: Ticket[] = [
        { id: 'T1001', subject: 'System outage', assignee: 'Agent A', priority: 'Critical', status: 'Open', createdAt: '2025-04-01', employeeName: 'John Smith', department: 'Finance' },
        { id: 'T1002', subject: 'Password reset', assignee: 'Agent B', priority: 'Low', status: 'Resolved', createdAt: '2025-04-03', employeeName: 'Sarah Johnson', department: 'HR' },
        { id: 'T1003', subject: 'Software installation', assignee: 'Agent A', priority: 'Medium', status: 'In Progress', createdAt: '2025-04-04', employeeName: 'Mike Davis', department: 'IT' },
        { id: 'T1004', subject: 'Data access issue', assignee: 'Agent C', priority: 'High', status: 'Open', createdAt: '2025-04-02', employeeName: 'Lisa Wong', department: 'Marketing' },
        { id: 'T1005', subject: 'Email configuration', assignee: 'Agent B', priority: 'Medium', status: 'In Progress', createdAt: '2025-04-05', employeeName: 'Robert Chen', department: 'Sales' },
        { id: 'T1006', subject: 'Network connectivity', assignee: 'Agent C', priority: 'High', status: 'Open', createdAt: '2025-04-06', employeeName: 'Emma Taylor', department: 'Operations' },
      ];
      setTickets(mockTickets);
    };

    fetchTickets();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return 'bg-blue-100 text-blue-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-500';
      case 'In Progress': return 'bg-yellow-500';
      case 'Resolved': return 'bg-green-500';
      case 'Closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    (filterStatus === 'All' || ticket.status === filterStatus) &&
    (searchTerm === '' ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.employeeName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const statusCounts = {
    Open: tickets.filter(t => t.status === 'Open').length,
    'In Progress': tickets.filter(t => t.status === 'In Progress').length,
    Resolved: tickets.filter(t => t.status === 'Resolved').length,
    Closed: tickets.filter(t => t.status === 'Closed').length,
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Suspense fallback={<div className="w-64 bg-white p-4 shadow">Loading Sidebar...</div>}>
        <ManagerSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      </Suspense>

      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Ticket Monitoring Dashboard</h1>
            <p className="text-gray-600">Track and manage team ticket assignments</p>
          </div>


          {/* Status Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Open Tickets</p>
                  <p className="text-2xl font-bold">{statusCounts.Open}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <FaExclamationCircle className="text-red-500 text-xl" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">In Progress</p>
                  <p className="text-2xl font-bold">{statusCounts['In Progress']}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <FaUserCog className="text-yellow-500 text-xl" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Resolved</p>
                  <p className="text-2xl font-bold">{statusCounts.Resolved}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <FaTicketAlt className="text-green-500 text-xl" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-gray-500">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Closed</p>
                  <p className="text-2xl font-bold">{statusCounts.Closed}</p>
                </div>
                <div className="p-3 bg-gray-100 rounded-full">
                  <FaCalendarAlt className="text-gray-500 text-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-2">
                <label className="text-gray-700 font-medium">Filter by Status:</label>
                <select 
                  className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All Tickets</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tickets..."
                  className="border rounded-md pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Tickets Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full">
                            <FaTicketAlt className="text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">#{ticket.id}</div>
                            <div className="text-sm text-gray-500">{ticket.subject}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{ticket.employeeName}</div>
                        <div className="text-sm text-gray-500">{ticket.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{ticket.assignee}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`h-2.5 w-2.5 rounded-full mr-2 ${getStatusColor(ticket.status)}`}></div>
                          <span className="text-sm text-gray-900">{ticket.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {ticket.createdAt}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No tickets found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerMonitorTickets;
