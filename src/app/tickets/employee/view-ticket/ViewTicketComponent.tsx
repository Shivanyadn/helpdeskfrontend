'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import EmployeeSidebar from '@/app/sidebar/EmployeeSidebar';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Tag, 
  AlertCircle, 
  User, 
  MessageSquare, 
  Paperclip, 
  Send,
  CheckCircle,
  RefreshCw,
  XCircle,
  FileText,
  Info,
} from 'lucide-react';


interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  department: string;
}

interface Message {
  id: string;
  sender: string;
  senderType: 'agent' | 'user';
  content: string;
  timestamp: string;
  attachments?: Attachment[];
}

interface Attachment {
  size: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  name: string; // 👈 Add this line
}

export default function ViewTicketPage() {
  const searchParams = useSearchParams();
  const ticketId = searchParams.get('id'); // e.g. /view?id=TICKET-1

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  const [resolutionDetails, setResolutionDetails] = useState('');
  const [showResolutionModal, setShowResolutionModal] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Add the handleResolveTicket function
  const handleResolveTicket = async () => {
    if (!ticketId) {
      alert('Ticket ID is missing. Cannot resolve ticket.');
      return;
    }
    
    if (!resolutionDetails.trim()) {
      alert('Please provide resolution details.');
      return;
    }
    setIsResolving(true);
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token') || '';
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      // Make the API request to resolve the ticket
      const response = await fetch(`http://localhost:5010/api/tickets/${ticketId}/resolve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          resolutionDetails: resolutionDetails 
        }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Resolve error response:', errorText);
        throw new Error(`Failed to resolve ticket: ${response.status} ${response.statusText}`);
      }
       
      // Update the ticket status in the UI
      if (ticket) {
        setTicket({
          ...ticket,
          status: 'Resolved'
        });
      }
      
      // Add a resolution message to the conversation
      const newMessage: Message = {
        id: `${messages.length + 1}`,
        sender: 'You',
        senderType: 'user',
        content: `Ticket resolved: ${resolutionDetails}`,
        timestamp: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      };
      
      setMessages([...messages, newMessage]);
      
      // Close the modal and reset the form
      setShowResolutionModal(false);
      setResolutionDetails('');
      
      // Show success message
      alert('Ticket has been successfully resolved.');
      
    } catch (error) {
      console.error('Error resolving ticket:', error);
      alert(`Failed to resolve ticket: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsResolving(false);
    }
  };

  // Function to handle attachment downloads
  const handleDownloadAttachment = async (attachmentId: string, fileName: string) => {
    if (!ticketId) {
      alert('Ticket ID is missing. Cannot download attachment.');
      return;
    }
    
    setIsDownloading(attachmentId);
    
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token') || '';
      
      // Log for debugging
      console.log(`Attempting to download: ${attachmentId} from ticket: ${ticketId}`);
      
      // Make the API request
      const response = await fetch(`http://localhost:5010/api/tickets/${ticketId}/attachments/${attachmentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Make sure to add Bearer prefix if required by your API
          'Accept': '*/*',
        },
        credentials: 'include',
      });
      
      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Download error response:', errorText);
        throw new Error(`Failed to download attachment: ${response.status} ${response.statusText}`);
      }
      
      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName || 'attachment';
      
      // Add to the DOM and trigger the download
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log('Download completed successfully');
      
    } catch (error) {
      console.error('Error downloading attachment:', error);
      alert(`Failed to download attachment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDownloading(null);
    }
  };

  useEffect(() => {
  const fetchTicketDetails = async () => {
    if (!ticketId) {
      setError('No ticket ID provided');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token') || '';
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      console.log('Auth Token:', authToken);
      console.log(`Fetching from URL: http://localhost:5010/api/tickets/${ticketId}`);

      const response = await fetch(`http://localhost:5010/api/tickets/${ticketId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching ticket: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (!data.success || !data.ticket) {
        throw new Error('Invalid API response format');
      }

      const ticketData = data.ticket;

      const transformedTicket: Ticket = {
        id: ticketData.ticketId || ticketData._id,
        subject: ticketData.title || 'No Title',
        description: ticketData.description || 'No description provided',
        status: ticketData.status || 'Open',
        priority: ticketData.priority || 'Medium',
        assignedTo: ticketData.assignedTo ? 
          `${ticketData.assignedTo.firstName} ${ticketData.assignedTo.lastName}` : 
          'Unassigned',
        createdAt: new Date(ticketData.createdAt).toLocaleDateString(),
        updatedAt: ticketData.sla ? new Date(ticketData.sla).toLocaleDateString() : 'N/A',
        category: ticketData.category || ticketData.issueCategory || 'General',
        department: 'IT Support'
      };

      setTicket(transformedTicket);

      if (ticketData.attachments && ticketData.attachments.length > 0) {
        setAttachments(ticketData.attachments);
      }

      // Mock messages for now, replace with real API calls later
      const mockMessages: Message[] = [
        {
          id: '1',
          sender: transformedTicket.assignedTo,
          senderType: 'agent',
          content: "We're looking into your issue. Could you please provide any additional details?",
          timestamp: new Date().toLocaleString(),
        },
        {
          id: '2',
          sender: 'You',
          senderType: 'user',
          content: "Thank you for the quick response. I'll provide more information if needed.",
          timestamp: new Date().toLocaleString(),
        }
      ];

      setMessages(mockMessages);

    } catch (err) {
      console.error('Error fetching ticket details:', err);
      setError('Failed to load ticket details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  fetchTicketDetails();
}, [ticketId]);


  // Get status color based on ticket status
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get priority color based on ticket priority
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSendReply = () => {
    if (replyText.trim()) {
      const newMessage: Message = {
        id: `${messages.length + 1}`,
        sender: 'You',
        senderType: 'user',
        content: replyText,
        timestamp: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      };
      
      setMessages([...messages, newMessage]);
      setReplyText('');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <EmployeeSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-[250px]' : 'ml-[80px]'} overflow-auto`}>
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header with breadcrumb */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Ticket Details</h1>
                <div className="flex items-center mt-2">
                  <Link 
                    href="/tickets/employee/track-ticket" 
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    <ArrowLeft size={16} className="mr-1" />
                    Back to Tickets
                  </Link>
                </div>
              </div>
              
              {!loading && ticket && (
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1.5 rounded-full font-medium border ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority} Priority
                  </span>
                  <span className={`text-xs px-3 py-1.5 rounded-full font-medium border ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>
              )}
            </div>
            
            {/* Search Ticket by ID */}
            <div className="mt-4 mb-2">
              <div className="relative max-w-md">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const searchInput = e.currentTarget.elements.namedItem('ticketSearch') as HTMLInputElement;
                  if (searchInput.value.trim()) {
                    window.location.href = `/tickets/employee/view-ticket?id=${searchInput.value.trim()}`;
                  }
                }}>
                  <div className="flex">
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Tag size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="ticketSearch"
                        placeholder="Search by ticket ID"
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                    >
                      Search
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            <hr className="border-t border-gray-200 my-4" />
          </div>
          
          {loading ? (
            <div className="bg-white p-8 rounded-lg shadow-sm flex items-center justify-center border border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                </div>
                <p className="text-gray-600 font-medium">Loading ticket details...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">Error</h3>
                <p className="text-gray-500 mb-4">{error}</p>
                <Link 
                  href="/tickets/employee/track-ticket" 
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  View All Tickets
                </Link>
              </div>
            </div>
          ) : !ticket ? (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">Ticket not found</h3>
                <p className="text-gray-500 mb-4">The ticket you are looking for doesnot exist or has been removed.</p>
                <Link 
                  href="/tickets/employee/track-ticket" 
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  View All Tickets
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar with additional info - Moved to left for better UX */}
              <div className="lg:col-span-1 space-y-5">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                  <div className="border-b border-gray-100 px-4 py-3 bg-gray-50 flex items-center justify-between">
                    <h2 className="font-semibold text-gray-800">Ticket Information</h2>
                    <button className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium">Edit</button>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Ticket ID</h3>
                      <div className="flex items-center">
                        <Tag size={14} className="text-blue-500 mr-2" />
                        <span className="text-gray-800 font-medium">#{ticket.id}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Assigned Agent</h3>
                      <div className="flex items-center">
                        <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                          <User size={14} className="text-blue-600" />
                        </div>
                        <span className="text-gray-800">{ticket.assignedTo}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Department</h3>
                      <span className="text-gray-800">{ticket.department}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
                      <span className="text-gray-800">{ticket.category}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Created On</h3>
                      <div className="flex items-center">
                        <Calendar size={14} className="text-blue-500 mr-2" />
                        <span className="text-gray-800">{ticket.createdAt}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">SLA Due</h3>
                      <div className="flex items-center">
                        <Clock size={14} className="text-blue-500 mr-2" />
                        <span className="text-gray-800">{ticket.updatedAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                  <div className="border-b border-gray-100 px-4 py-3 bg-gray-50">
                    <h2 className="font-semibold text-gray-800">Status Timeline</h2>
                  </div>
                  
                  <div className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="flex flex-col items-center mr-3">
                          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle size={14} className="text-green-600" />
                          </div>
                          <div className="w-0.5 h-8 bg-gray-200 mt-1"></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Ticket Created</p>
                          <p className="text-xs text-gray-500">{ticket.createdAt}</p>
                        </div>
                      </div>
                      
                      {ticket.status !== 'Open' && (
                        <div className="flex items-start">
                          <div className="flex flex-col items-center mr-3">
                            <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                              <RefreshCw size={14} className="text-amber-600" />
                            </div>
                            <div className="w-0.5 h-8 bg-gray-200 mt-1"></div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">In Progress</p>
                            <p className="text-xs text-gray-500">{ticket.updatedAt}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-start">
                        <div className="flex flex-col items-center mr-3">
                          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-400">Resolved</p>
                          <p className="text-xs text-gray-400">Pending</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                  <div className="border-b border-gray-100 px-4 py-3 bg-gray-50">
                    <h2 className="font-semibold text-gray-800">Actions</h2>
                  </div>
                  
                  <div className="p-4 space-y-2">
                    <button 
                      onClick={() => setShowResolutionModal(true)}
                      disabled={ticket?.status === 'Resolved' || ticket?.status === 'Closed' || isResolving}
                      className={`w-full px-4 py-2 rounded-md flex items-center justify-center gap-2 ${
                        ticket?.status === 'Resolved' || ticket?.status === 'Closed'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors'
                      } text-sm font-medium`}
                    >
                      {isResolving ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <CheckCircle size={16} />
                      )}
                      {ticket?.status === 'Resolved' ? 'Already Resolved' : 'Mark as Resolved'}
                    </button>
                    <button className="w-full px-4 py-2 text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                      <RefreshCw size={16} />
                      Request Update
                    </button>
                    <button className="w-full px-4 py-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                      <XCircle size={16} />
                      Cancel Ticket
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Main Ticket Details - Moved to right for better UX */}
              <div className="lg:col-span-3 space-y-5">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                  <div className="border-b border-gray-100 px-5 py-4 bg-gray-50 flex items-center">
                    <FileText size={18} className="text-blue-500 mr-2" />
                    <h2 className="font-semibold text-gray-800">Ticket Details</h2>
                  </div>
                  
                  <div className="p-5">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">{ticket.subject}</h2>
                    
                    <div className="mb-5">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                      <div className="bg-gray-50 p-4 rounded-md border border-gray-100 text-gray-700 whitespace-pre-line">
                        {ticket.description}
                      </div>
                    </div>
                    
                    {attachments.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Attachments</h3>
                        <div className="space-y-2">
                          {attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center p-3 bg-gray-50 rounded-md border border-gray-100">
                              <div className="w-9 h-9 bg-blue-50 rounded flex items-center justify-center mr-3">
                                <Paperclip size={16} className="text-blue-500" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-700">{attachment.fileName}</p>
                                <p className="text-xs text-gray-500">
                                  {attachment.fileType} • {(attachment.fileSize / 1024).toFixed(2)} KB
                                </p>
                              </div>
                              <button 
                                onClick={() => handleDownloadAttachment(`ticket-attachment-${index}`, attachment.name)}
                                className="ml-4 p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                                disabled={isDownloading === `ticket-attachment-${index}`}
                              >
                                {isDownloading === `ticket-attachment-${index}` ? (
                                  <RefreshCw size={16} className="animate-spin" />
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                  </svg>
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Conversation/Messages section */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                  <div className="border-b border-gray-100 px-5 py-4 bg-gray-50 flex items-center">
                    <MessageSquare size={18} className="text-blue-500 mr-2" />
                    <h2 className="font-semibold text-gray-800">Conversation</h2>
                  </div>
                  
                  <div className="p-5">
                    <div className="space-y-5 mb-6">
                      {messages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`p-4 rounded-md border ${
                            message.senderType === 'agent' 
                              ? 'bg-blue-50 border-blue-100' 
                              : 'bg-gray-50 border-gray-100'
                          }`}
                        >
                          <div className="flex justify-between mb-2">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                                message.senderType === 'agent' 
                                  ? 'bg-blue-100' 
                                  : 'bg-green-100'
                              }`}>
                                <User size={16} className={`${
                                  message.senderType === 'agent' 
                                    ? 'text-blue-600' 
                                    : 'text-green-600'
                                }`} />
                              </div>
                              <span className="font-medium text-gray-800">{message.sender}</span>
                            </div>
                            <span className="text-xs text-gray-500">{message.timestamp}</span>
                          </div>
                          <div className="text-gray-700 whitespace-pre-line">
                            {message.content}
                          </div>
                          
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-3">
                              {message.attachments.map((attachment, index) => (
                                <div key={index} className="mt-2 flex items-center p-2 bg-white rounded border border-gray-200 w-fit">
                                  <div className="w-9 h-9 bg-blue-50 rounded flex items-center justify-center mr-2">
                                    <Paperclip size={16} className="text-blue-500" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-700">{attachment.name}</p>
                                    <p className="text-xs text-gray-500">{attachment.size}</p>
                                  </div>
                                  <button 
                                    onClick={() => handleDownloadAttachment(`ticket-attachment-${index}`, attachment.name)}
                                    className="ml-4 p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                                    disabled={isDownloading === `ticket-attachment-${index}`}
                                  >
                                    {isDownloading === `ticket-attachment-${index}` ? (
                                      <RefreshCw size={16} className="animate-spin" />
                                    ) : (
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                      </svg>
                                    )}
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Add a reply section */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Add Reply</h3>
                      <div className="border border-gray-200 rounded-md overflow-hidden">
                        <textarea 
                          className="w-full px-4 py-3 border-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[120px] resize-y"
                          placeholder="Type your message here..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        
                        <div className="bg-gray-50 p-3 border-t border-gray-200 flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                              <Paperclip size={18} />
                            </button>
                          </div>
                          
                          <button 
                            onClick={handleSendReply}
                            disabled={!replyText.trim()}
                            className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                              replyText.trim() 
                                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            } transition-colors shadow-sm`}
                          >
                            <Send size={16} />
                            <span>Send Reply</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Related Articles */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                  <div className="border-b border-gray-100 px-5 py-4 bg-gray-50 flex items-center">
                    <Info size={18} className="text-blue-500 mr-2" />
                    <h2 className="font-semibold text-gray-800">Related Articles</h2>
                  </div>
                  
                  <div className="p-5 space-y-3">
                    <div className="p-3 border border-gray-100 rounded-md hover:border-blue-200 hover:bg-blue-50 transition-all cursor-pointer">
                      <h3 className="font-medium text-gray-800 mb-1">Common VPN Connection Issues</h3>
                      <p className="text-xs text-gray-500">Last updated: 2 days ago</p>
                    </div>
                    
                    <div className="p-3 border border-gray-100 rounded-md hover:border-blue-200 hover:bg-blue-50 transition-all cursor-pointer">
                      <h3 className="font-medium text-gray-800 mb-1">Troubleshooting VPN Error Codes</h3>
                      <p className="text-xs text-gray-500">Last updated: 1 week ago</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          </div>
  )}
        </div>

      </div>
      
      {/* Resolution Modal */}
      {showResolutionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Resolve Ticket</h3>
            </div>
            
            <div className="p-4">
              <p className="text-gray-600 mb-4">
                Please provide resolution details for ticket #{ticketId}
              </p>
              
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[100px] resize-y"
                placeholder="Enter resolution details..."
                value={resolutionDetails}
                onChange={(e) => setResolutionDetails(e.target.value)}
              ></textarea>
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowResolutionModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResolveTicket}
                disabled={isResolving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                {isResolving ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Resolving...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Resolve Ticket
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}