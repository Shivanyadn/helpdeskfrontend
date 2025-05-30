'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AgentSidebar from '@/app/sidebar/AgentSidebar';
import { ArrowLeft, MessageSquare, Save, AlertCircle, CheckCircle, Clock, Paperclip, User } from 'lucide-react';
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

export default function AgentUpdateTicketPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ticketId = searchParams.get('id') || 'TKT-1001'; // Default ID if none provided
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false); // Changed to false to show data immediately
  const [newComment, setNewComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    // Mock fetch ticket with expanded data - immediately available
    const mockTicket: Ticket = {
      id: ticketId,
      subject: 'Printer not working in HR Dept',
      description: 'The printer in the HR department shows a paper jam error repeatedly. I have tried turning it off and on, but the error persists. Need assistance as soon as possible as we have important documents to print.',
      status: 'Open',
      priority: 'Medium',
      assignedTo: 'Agent Ravi',
      createdBy: 'Employee Sarah Johnson',
      department: 'HR',
      createdAt: '2025-04-02',
      updatedAt: '2025-04-03',
      comments: [
        'Requested model number from user',
        'User replied: HP LaserJet Pro M404dn',
        'Asked if there are any visible paper jams'
      ],
    };

    // Set ticket data immediately
    setTicket(mockTicket);
    setLoading(false);
  }, [ticketId]);

  const handleSave = () => {
    if (!ticket) return;

    setSaving(true);

    // Mock save with improved feedback
    setTimeout(() => {
      setSuccessMessage('Ticket updated successfully!');
      setSaving(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }, 800);
  };

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

  const addComment = () => {
    if (!ticket || !newComment.trim()) return;
    
    setTicket({
      ...ticket,
      comments: [...ticket.comments, newComment.trim()],
      updatedAt: new Date().toISOString().split('T')[0]
    });
    setNewComment('');
  };

  return (
    <>
      <AgentSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-[250px]' : 'ml-[80px]'} bg-gray-50 min-h-screen`}>
        <div className="p-6">
          {/* Header with breadcrumb */}
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

          {/* Success message */}
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main ticket information and edit form */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {ticket.subject}
                    </h2>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <Clock size={14} />
                      <span>Created: {ticket.createdAt}</span>
                      <span className="mx-1">•</span>
                      <span>Updated: {ticket.updatedAt}</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-medium text-gray-700 mb-3">Description</h3>
                    <p className="text-gray-600 whitespace-pre-line mb-6">{ticket.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Status */}
                      <div>
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

                      {/* Priority */}
                      <div>
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
                      
                      {/* Department */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                        <select
                          value={ticket.department}
                          onChange={(e) => setTicket({ ...ticket, department: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="IT Support">IT Support</option>
                          <option value="HR">HR</option>
                          <option value="Finance">Finance</option>
                          <option value="Operations">Operations</option>
                          <option value="Sales">Sales</option>
                        </select>
                      </div>
                      
                      {/* Assigned To */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                        <select
                          value={ticket.assignedTo}
                          onChange={(e) => setTicket({ ...ticket, assignedTo: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Agent Ravi">Agent Ravi</option>
                          <option value="Agent Mike">Agent Mike</option>
                          <option value="Agent Sarah">Agent Sarah</option>
                          <option value="Agent John">Agent John</option>
                        </select>
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
                      <div className="space-y-4 mb-6">
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
                      <p className="text-gray-500 italic mb-6">No comments yet</p>
                    )}
                    
                    {/* Add comment form */}
                    <div className="border-t border-gray-100 pt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Add Comment</label>
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
                          onClick={addComment}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          disabled={!newComment.trim()}
                        >
                          Add Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ticket details sidebar */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="font-medium text-gray-800">Ticket Details</h3>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Current Status</p>
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Current Priority</p>
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
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
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Created On</p>
                      <p className="text-gray-700">{ticket.createdAt}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                      <p className="text-gray-700">{ticket.updatedAt}</p>
                    </div>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Save size={16} />
                    {saving ? 'Saving Changes...' : 'Save Changes'}
                  </button>
                  
                  <Link 
                    href={`/tickets/agent/view-ticket?id=${ticketId}`}
                    className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center block"
                  >
                    Cancel
                  </Link>
                </div>
                
                {/* Help card */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-1.5">
                    <AlertCircle size={14} />
                    Ticket Update Tips
                  </h4>
                  <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                    <li>Update the status to reflect current progress</li>
                    <li>Add detailed comments for better tracking</li>
                    <li>Adjust priority based on urgency</li>
                    <li>Reassign ticket if needed</li>
                  </ul>
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
        </div>
      </div>
    </>
  );
}
