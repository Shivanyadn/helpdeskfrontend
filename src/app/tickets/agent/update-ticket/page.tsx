'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AgentSidebar from '@/app/sidebar/AgentSidebar';
import { ArrowLeft, Save, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

interface Ticket {
  ticketId: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: { firstName: string; lastName: string } | null;
  createdAt: string;
}

export default function AgentUpdateTicketPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ticketId = searchParams.get('id') || 'TICKET-1'; // Default ID if none provided

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem('token') || localStorage.getItem('auth_token') || '';

        const response = await fetch(`http://localhost:5000/api/tickets/${ticketId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Error fetching ticket details: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data); // Debugging
        setTicket(data.ticket); // Ensure you're setting the correct property
      } catch (error) {
        console.error('Error fetching ticket details:', error);
        setTicket(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [ticketId]);

  const handleSave = async () => {
    if (!ticket) return;

    setSaving(true);

    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token') || '';

      if (!token) {
        throw new Error('Authorization token is missing. Please log in again.');
      }

      console.log('Authorization Token:', token); // Debugging

      // Make the PATCH request to update the ticket
      const response = await fetch('http://localhost:5000/api/tickets/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Add Bearer token for authorization
        },
        body: JSON.stringify({
          ticketId: ticket.ticketId,
          status: ticket.status,
          priority: ticket.priority,
        }),
      });

      console.log('Response Status:', response.status); // Debugging

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        throw new Error(errorData.message || 'Failed to update the ticket');
      }

      const data = await response.json();
      console.log('API Response:', data); // Debugging
      setSuccessMessage(data.message || 'Ticket updated successfully!');
      setTicket(data.ticket); // Update the ticket state with the response data
    } catch (error) {
      console.error('Fetch Error:', error);
      setSuccessMessage('Failed to update the ticket. Please try again.');
    } finally {
      setSaving(false);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Critical':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <>
      <AgentSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-[250px]' : 'ml-[80px]'} bg-gray-50 min-h-screen`}>
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Update Ticket</h1>
            <div className="flex items-center gap-2">
              <Link
                href={`/tickets/agent/view-ticket?id=${ticketId}`}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <ArrowLeft size={14} />
                <span>Back to Ticket</span>
              </Link>
              <span className="text-gray-400">|</span>
              <p className="text-gray-600">Editing Ticket #{ticketId}</p>
            </div>
          </div>

          {successMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <CheckCircle size={18} />
              <span>{successMessage}</span>
            </div>
          )}

          {loading ? (
            <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Loading ticket details...</p>
            </div>
          ) : ticket ? (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">{ticket.title}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                      <Clock size={14} />
                      <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-medium text-gray-700 mb-3">Description</h3>
                    <p className="text-gray-600 whitespace-pre-line mb-6">{ticket.description}</p>
                  </div>

                  {/* Right Column */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={ticket.status}
                        onChange={(e) => setTicket({ ...ticket, status: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                      <select
                        value={ticket.priority}
                        onChange={(e) => setTicket({ ...ticket, priority: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                      <p className="text-gray-700">{ticket.assignedTo?.firstName || 'Unassigned'}</p>
                    </div>

                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full"
                    >
                      {saving ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={24} className="text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Ticket Not Found</h3>
              <p className="text-gray-600 mb-6">The ticket you're trying to update doesn't exist or has been removed.</p>
              <Link
                href="/tickets/agent"
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Return to Tickets
              </Link>
            </div>
          )}

          <div className="mt-10 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Instructions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">For Updating Ticket</h3>
                <ul className="list-disc list-inside text-gray-600">
                  <li>Ensure all fields are filled out correctly.</li>
                  <li>Update the status and priority as needed.</li>
                  <li>Provide a detailed description of the changes.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">For Saving Changes</h3>
                <ul className="list-disc list-inside text-gray-600">
                  <li>Click the "Save Changes" button after making updates.</li>
                  <li>Wait for the confirmation message to appear.</li>
                  <li>Navigate back to the ticket list if needed.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
