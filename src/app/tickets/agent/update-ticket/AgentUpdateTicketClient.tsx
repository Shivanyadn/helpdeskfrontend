// src/app/tickets/agent/update-ticket/AgentUpdateTicketClient.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import AgentSidebar from '@/app/sidebar/AgentSidebar';
import { ArrowLeft, AlertCircle, CheckCircle, Clock } from 'lucide-react';
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

export default function AgentUpdateTicketClient() {
  const searchParams = useSearchParams();
  const ticketId = searchParams.get('id');

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    if (!ticketId) return;

    const fetchTicketDetails = async () => {
      try {
        setLoading(true);
        const token =
          localStorage.getItem('token') || localStorage.getItem('auth_token') || '';

        const response = await fetch(`http://localhost:5000/api/tickets/${ticketId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`Error fetching ticket: ${response.status}`);

        const data = await response.json();
        setTicket(data.ticket);
        setErrorMessage('');
      } catch (err) {
        console.error(err);
        setTicket(null);
        setErrorMessage('Could not load ticket. Please check the ticket ID.');
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [ticketId]);

  const handleSave = async () => {
    if (!ticket) return;

    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const token =
        localStorage.getItem('token') || localStorage.getItem('auth_token') || '';
      if (!token) throw new Error('Missing token');

      const response = await fetch(`http://localhost:5000/api/tickets/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ticketId: ticket.ticketId,
          status: ticket.status,
          priority: ticket.priority,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update ticket');
      }

      const result = await response.json();
      setTicket(result.ticket);
      setSuccessMessage(result.message || 'Ticket updated successfully');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Fetch Error:', error.message);
        setErrorMessage('Failed to update the ticket. Please try again.');
      } else {
        console.error('Unknown error occurred:', error);
        setErrorMessage('An unexpected error occurred.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AgentSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'ml-[250px]' : 'ml-[80px]'
        } bg-gray-50 min-h-screen`}
      >
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Update Ticket</h1>
            {ticketId ? (
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
            ) : (
              <p className="text-red-500">No Ticket ID provided</p>
            )}
          </div>

          {successMessage && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <CheckCircle size={18} />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
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
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
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
              <p className="text-gray-600 mb-6">
                The ticket you are trying to update does not exist or has been removed.
              </p>
              <Link
                href="/tickets/agent"
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Return to Tickets
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
