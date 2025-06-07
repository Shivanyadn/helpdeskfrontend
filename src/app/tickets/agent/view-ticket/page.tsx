// app/tickets/agent/view-ticket/page.tsx

'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import AgentSidebar from '@/app/sidebar/AgentSidebar';
import { ArrowLeft, Clock, FileText, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Ticket {
  _id: string;
  ticketId: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  sla: string;
  assignedTo: { firstName: string; lastName: string } | null;
  attachments: { fileName: string; filePath: string }[];
  resolution?: string;
}

// Extract your inner component
function ViewTicketContent() {
  const searchParams = useSearchParams();
  const ticketId = searchParams.get('id') || 'TICKET-1';
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [ticket, setTicket] = useState<Ticket[] | null>(null);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token') || '';
        const response = await fetch(`http://localhost:5000/api/tickets`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data: Ticket[] = await response.json();
        const filtered = data.filter((ticket) => ticket.assignedTo?.firstName === 'John');
        setTicket(filtered);
      } catch (err) {
        console.error(err);
        setTicket([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Closed': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <>
      <AgentSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-[250px]' : 'ml-[80px]'} bg-gray-50 min-h-screen`}>
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">View Ticket Details</h1>
            <div className="flex items-center gap-2">
              <Link href="/dashboard/agent" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <ArrowLeft size={14} />
                <span>Back to Dashboard</span>
              </Link>
              <span className="text-gray-400">|</span>
              <p className="text-gray-600">Ticket #{ticketId}</p>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Loading ticket details...</p>
            </div>
          ) : ticket && ticket.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {ticket.map((t: Ticket) => (
                <div key={t.ticketId} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-semibold text-gray-800">{t.title}</h2>
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(t.status)}`}>
                        {t.status}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <Clock size={14} />
                      <span>Created: {new Date(t.createdAt).toLocaleDateString()}</span>
                      <span className="mx-1">•</span>
                      <span>SLA: {new Date(t.sla).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <FileText size={16} className="text-gray-500" />
                      Description
                    </h3>
                    <p className="text-gray-600 whitespace-pre-line mb-4">{t.description}</p>
                    <Link
                      href={`/tickets/agent/update-ticket?id=${t.ticketId}`}
                      className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Update Status
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={24} className="text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Tickets Found</h3>
              <p className="text-gray-600 mb-6">There are no tickets to display.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Export your suspense-wrapped page
export default function AgentViewTicketPage() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-500">Loading ticket data...</div>}>
      <ViewTicketContent />
    </Suspense>
  );
}
