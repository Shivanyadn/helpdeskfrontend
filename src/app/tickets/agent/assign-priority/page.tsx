'use client';

import { useState, useEffect } from 'react';
import AgentSidebar from '@/app/sidebar/AgentSidebar';

interface Ticket {
  ticketId: string;
  id: string;
  title: string;
  priority: string;
  updatedPriority: string;
  currentPriority: string;
  category: string;
  createdAt: string;
  status: string;
}

const AgentAssignPriorityPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('auth_token') || '';

        const response = await fetch('http://localhost:5000/api/tickets', {
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

        const formattedTickets = data.map(ticket => ({
          ticketId: ticket.ticketId,
          id: ticket.ticketId,
          title: ticket.title,
          priority: ticket.priority,
          updatedPriority: ticket.priority,
          currentPriority: ticket.priority,
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

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AgentSidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Tickets</h1>
          {tickets.length > 0 ? (
            <ul>
              {tickets.map(ticket => (
                <li key={ticket.ticketId} className="mb-2 p-2 border rounded shadow">
                  <h2 className="font-semibold">{ticket.title}</h2>
                  <p>Priority: {ticket.priority}</p>
                  <p>Status: {ticket.status}</p>
                  <p>Category: {ticket.category}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tickets available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentAssignPriorityPage;
