'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AgentSidebar from '@/app/sidebar/AgentSidebar';
import { ArrowLeft, Clock, MessageSquare, Paperclip, User, AlertCircle, CheckCircle, RefreshCw, ChevronRight, FileText, Tag, Calendar } from 'lucide-react';
import Link from 'next/link';

interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: string;
  createdBy: string;
  department: string;
  createdAt: string;
  updatedAt: string;
  comments: string[];
}

export default function AgentViewTicketPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ticketId = searchParams.get('id') || 'TKT-1001'; // Default ID if none provided
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedTickets, setRelatedTickets] = useState<Ticket[]>([]);
  const [newComment, setNewComment] = useState('');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    // Mock API call with reduced timeout
    const mockTicket: Ticket = {
      id: ticketId,
      subject: 'Email not syncing on mobile',
      description: 'The work email is not syncing on the mobile device after security update. I have tried restarting the app and the device multiple times but the issue persists. Need urgent assistance as I have important emails to respond to.',
      status: 'Open',
      priority: 'Medium',
      assignedTo: 'Agent Ravi',
      createdBy: 'Employee John Doe',
      department: 'IT Support',
      createdAt: '2025-04-02',
      updatedAt: '2025-04-05',
      comments: [
        'Initial response sent: Asked for device model and OS version',
        'User replied: iPhone 14 Pro, iOS 18.2',
        'Asked for screenshots of the error message',
        'Suggested clearing app cache and reinstalling'
      ],
    };

    // Mock related tickets
    const mockRelatedTickets: Ticket[] = [
      {
        id: 'TKT-1002',
        subject: 'VPN connection issues',
        description: 'Cannot connect to company VPN from home network',
        status: 'In Progress',
        priority: 'High',
        assignedTo: 'Agent Ravi',
        createdBy: 'Employee John Doe',
        department: 'IT Support',
        createdAt: '2025-04-03',
        updatedAt: '2025-04-04',
        comments: ['Investigating network settings'],
      },
      {
        id: 'TKT-1003',
        subject: 'Password reset required',
        description: 'Need to reset password for company portal',
        status: 'Resolved',
        priority: 'Low',
        assignedTo: 'Agent Mike',
        createdBy: 'Employee John Doe',
        department: 'IT Support',
        createdAt: '2025-04-01',
        updatedAt: '2025-04-02',
        comments: ['Password reset completed', 'User confirmed access'],
      },
    ];

    // Reduced timeout to 100ms for faster loading
    setTimeout(() => {
      setTicket(mockTicket);
      setRelatedTickets(mockRelatedTickets);
      setLoading(false);
    }, 100);
  }, [ticketId]);

  const getStatusColor = (status: string) => {
    switch(status) {
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

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Open':
        return <AlertCircle size={16} className="text-blue-600" />;
      case 'In Progress':
        return <RefreshCw size={16} className="text-amber-600" />;
      case 'Resolved':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'Closed':
        return <CheckCircle size={16} className="text-slate-600" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
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

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    if (ticket) {
      const updatedTicket = {
        ...ticket,
        comments: [...ticket.comments, newComment],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setTicket(updatedTicket);
      setNewComment('');
    }
  };

  const handleStatusChange = (newStatus: string) => {
    if (ticket) {
      const updatedTicket = {
        ...ticket,
        status: newStatus,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setTicket(updatedTicket);
    }
  };

  return (
    <>
      <AgentSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-[250px]' : 'ml-[80px]'} bg-gray-50 min-h-screen`}>
        <div className="p-6">
          {/* Header with breadcrumb */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">View Ticket Details</h1>
            <div className="flex items-center gap-2">
              <Link 
                href="/dashboard/agent"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
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
          ) : ticket ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main ticket information */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {ticket.subject}
                      </h2>
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {getStatusIcon(ticket.status)}
                        {ticket.status}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <Clock size={14} />
                      <span>Created: {ticket.createdAt}</span>
                      <span className="mx-1">•</span>
                      <span>Updated: {ticket.updatedAt}</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <FileText size={16} className="text-gray-500" />
                      Description
                    </h3>
                    <p className="text-gray-600 whitespace-pre-line">{ticket.description}</p>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Tag size={14} className="text-gray-500" />
                        <span className="text-sm text-gray-500">Department:</span>
                        <span className="text-sm font-medium">{ticket.department}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-500" />
                        <span className="text-sm text-gray-500">Created:</span>
                        <span className="text-sm font-medium">{ticket.createdAt}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments section */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="font-medium text-gray-800 flex items-center gap-2">
                      <MessageSquare size={16} />
                      <span>Agent Comments ({ticket.comments.length})</span>
                    </h3>
                  </div>
                  
                  <div className="p-6">
                    {ticket.comments.length > 0 ? (
                      <div className="space-y-4">
                        {ticket.comments.map((comment, index) => (
                          <div key={index} className="border-l-2 border-blue-500 pl-4 py-1">
                            <p className="text-gray-600">{comment}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(new Date(ticket.createdAt).getTime() + (index * 24 * 60 * 60 * 1000)).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No comments yet</p>
                    )}
                    
                    {/* Add comment form */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <textarea 
                        className="w-full border border-gray-200 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add a comment..."
                        rows={3}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      ></textarea>
                      <div className="flex justify-between mt-3">
                        <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                          <Paperclip size={14} />
                          <span>Attach</span>
                        </button>
                        <button 
                          onClick={handleAddComment}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Add Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Related tickets section */}
                {relatedTickets.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="font-medium text-gray-800">Related Tickets</h3>
                    </div>
                    
                    <div className="divide-y divide-gray-100">
                      {relatedTickets.map((relatedTicket) => (
                        <div key={relatedTicket.id} className="p-4 hover:bg-gray-50">
                          <Link href={`/tickets/agent/view-ticket?id=${relatedTicket.id}`} className="block">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-gray-800">{relatedTicket.subject}</p>
                                <p className="text-sm text-gray-500 mt-1">#{relatedTicket.id} • Created: {relatedTicket.createdAt}</p>
                              </div>
                              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(relatedTicket.status)}`}>
                                {getStatusIcon(relatedTicket.status)}
                                {relatedTicket.status}
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Ticket details sidebar */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="font-medium text-gray-800">Ticket Details</h3>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Status</p>
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {getStatusIcon(ticket.status)}
                        {ticket.status}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Priority</p>
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Department</p>
                      <p className="text-gray-700">{ticket.department}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Assigned To</p>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <User size={12} className="text-blue-600" />
                        </div>
                        <p className="text-gray-700">{ticket.assignedTo}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Created By</p>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                          <User size={12} className="text-gray-600" />
                        </div>
                        <p className="text-gray-700">{ticket.createdBy}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
                  <button 
                    onClick={() => router.push(`/tickets/agent/update-ticket?id=${ticket.id}`)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Update Ticket
                  </button>
                  
                  {ticket.status === 'Open' && (
                    <button 
                      onClick={() => handleStatusChange('In Progress')}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Mark as In Progress
                    </button>
                  )}
                  
                  {(ticket.status === 'Open' || ticket.status === 'In Progress') && (
                    <button 
                      onClick={() => handleStatusChange('Resolved')}
                      className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Mark as Resolved
                    </button>
                  )}
                  
                  {ticket.status === 'Resolved' && (
                    <button 
                      onClick={() => handleStatusChange('Closed')}
                      className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Close Ticket
                    </button>
                  )}
                </div>
                
                {/* Ticket activity timeline */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="font-medium text-gray-800">Activity Timeline</h3>
                  </div>
                  
                  <div className="p-4">
                    <div className="relative pl-6 border-l border-gray-200 space-y-4">
                      <div className="relative">
                        <div className="absolute -left-[25px] mt-1 w-4 h-4 rounded-full bg-blue-500"></div>
                        <p className="text-sm font-medium">Ticket Created</p>
                        <p className="text-xs text-gray-500">{ticket.createdAt}</p>
                      </div>
                      
                      {ticket.comments.length > 0 && (
                        <div className="relative">
                          <div className="absolute -left-[25px] mt-1 w-4 h-4 rounded-full bg-green-500"></div>
                          <p className="text-sm font-medium">First Response</p>
                          <p className="text-xs text-gray-500">
                            {new Date(new Date(ticket.createdAt).getTime() + (24 * 60 * 60 * 1000)).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      
                      <div className="relative">
                        <div className="absolute -left-[25px] mt-1 w-4 h-4 rounded-full bg-gray-300"></div>
                        <p className="text-sm font-medium">Last Updated</p>
                        <p className="text-xs text-gray-500">{ticket.updatedAt}</p>
                      </div>
                    </div>
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
              <p className="text-gray-600 mb-6">The ticket you're looking for doesn't exist or has been removed.</p>
              <Link 
                href="/tickets/agent"
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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
