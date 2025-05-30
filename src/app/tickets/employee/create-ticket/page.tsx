'use client';

import { useState, useEffect } from 'react';
import EmployeeSidebar from '@/app/sidebar/EmployeeSidebar';
import { PaperclipIcon, SendIcon, AlertCircleIcon, ArrowLeft, CheckCircle, XCircle, Loader } from 'lucide-react';
import Link from 'next/link';
import { createTicket, isUserLoggedIn } from '@/api/tickets';
import { useRouter } from 'next/navigation';

export default function CreateTicketPage() {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('Low');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Check if user is logged in when component mounts
  useEffect(() => {
    if (!isUserLoggedIn()) {
      setErrorMessage('You need to be logged in to create a ticket. Redirecting to login...');
      setSubmitStatus('error');
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  }, [router]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Update the handleSubmit function to properly handle the API response
  // Update the handleSubmit function to properly handle authentication errors
  // Add this helper function at the top of your file, after the imports
  const getAuthToken = () => {
    return localStorage.getItem('token') || localStorage.getItem('auth_token');
  };
  
  // Then update your useEffect to check for token
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setErrorMessage('You need to be logged in to create a ticket. Redirecting to login...');
      setSubmitStatus('error');
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }
  }, [router]);
  
  // Update your handleSubmit function to properly handle file uploads
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for token before submitting
    const token = getAuthToken();
    if (!token) {
      setErrorMessage('You need to be logged in to create a ticket. Please log in and try again.');
      setSubmitStatus('error');
      return;
    }
    
    // Validate required fields
    if (!subject.trim()) {
      setErrorMessage('Please enter a subject for your ticket.');
      setSubmitStatus('error');
      return;
    }
    
    if (!description.trim()) {
      setErrorMessage('Please provide a description of your issue.');
      setSubmitStatus('error');
      return;
    }
    
    if (!category) {
      setErrorMessage('Please select a category for your ticket.');
      setSubmitStatus('error');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
  
    try {
      // Create the ticket payload
      const ticketPayload = {
        title: subject,
        description: description,
        category: category,
        priority: priority
      };
      
      console.log('Submitting ticket:', ticketPayload);
      console.log('Attachments:', attachments.length > 0 ? attachments.map(a => a.name) : 'None');
      
      // Call the API with the ticket data and attachments
      const result = await createTicket(
        ticketPayload,
        attachments.length > 0 ? attachments : undefined
      );
      
      console.log('Ticket created successfully:', result);
      setSubmitStatus('success');
      
      // Reset form after successful submission
      setTimeout(() => {
        setSubject('');
        setDescription('');
        setCategory('');
        setPriority('Low');
        setAttachments([]);
        setSubmitStatus('idle');
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting ticket:', error);
      setSubmitStatus('error');
      
      if (error instanceof Error) {
        setErrorMessage(error.message);
        
        // If it's an authentication error, redirect to login
        if (error.message.includes('Authentication token')) {
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        }
      } else {
        setErrorMessage('Failed to create ticket. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <EmployeeSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-[250px]' : 'ml-[80px]'}`}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800">Create New Ticket</h1>
            <div className="flex items-center gap-2">
              <Link 
                href="/dashboard/employee"
                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <ArrowLeft size={14} />
                <span>Back to Dashboard</span>
              </Link>
              <span className="text-slate-400">|</span>
              <p className="text-slate-600">Submit a new support request to our team</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
                  <h2 className="font-semibold text-white">Ticket Details</h2>
                </div>
                
                {submitStatus === 'success' && (
                  <div className="m-6 p-4 bg-emerald-50 border border-emerald-100 rounded-lg flex items-start gap-3">
                    <CheckCircle className="text-emerald-500 mt-0.5 flex-shrink-0" size={18} />
                    <div>
                      <h3 className="font-medium text-emerald-800">Ticket Created Successfully</h3>
                      <p className="text-emerald-700 text-sm mt-1">Your ticket has been submitted and will be reviewed by our support team.</p>
                    </div>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="m-6 p-4 bg-rose-50 border border-rose-100 rounded-lg flex items-start gap-3">
                    <XCircle className="text-rose-500 mt-0.5 flex-shrink-0" size={18} />
                    <div>
                      <h3 className="font-medium text-rose-800">Failed to Create Ticket</h3>
                      <p className="text-rose-700 text-sm mt-1">{errorMessage || 'Please try again later or contact support.'}</p>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-slate-700 block">Subject</label>
                    <input
                      id="subject"
                      type="text"
                      placeholder="Brief description of your issue"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label htmlFor="category" className="text-sm font-medium text-slate-700 block">Category</label>
                      <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="IT Support">IT Support</option>
                        <option value="Network Issue">Network Issue</option>
                        <option value="HR">HR</option>
                        <option value="Software">Software</option>
                        <option value="Hardware">Hardware</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="priority" className="text-sm font-medium text-slate-700 block">Priority</label>
                      <select
                        id="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium text-slate-700 block">Description</label>
                    <textarea
                      id="description"
                      placeholder="Please provide detailed information about your issue"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all min-h-[150px]"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 block">Attachments</label>
                    <div className="border border-dashed border-slate-300 rounded-lg p-4 bg-slate-50">
                      <div className="flex items-center justify-center">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <div className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700">
                            <PaperclipIcon size={18} />
                            <span>Add files or drop files here</span>
                          </div>
                          <input
                            id="file-upload"
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleAttachment}
                          />
                        </label>
                      </div>
                      
                      {attachments.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {attachments.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                              <span className="text-sm truncate max-w-xs">{file.name}</span>
                              <button 
                                type="button" 
                                onClick={() => removeAttachment(index)}
                                className="text-slate-500 hover:text-red-500"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-3">
                    <button
                      type="submit"
                      className={`w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2.5 px-4 rounded-lg hover:from-green-700 hover:to-green-800 transition-colors shadow-md flex items-center justify-center space-x-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader size={18} className="animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <SendIcon size={18} />
                          <span>Submit Ticket</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Sidebar with Help */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
                  <h2 className="font-semibold text-white">Help & Tips</h2>
                </div>
                
                <div className="p-6 space-y-5">
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                    <div className="flex space-x-3">
                      <div className="text-indigo-500 flex-shrink-0">
                        <AlertCircleIcon size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium text-indigo-800 text-sm">Before submitting</h3>
                        <p className="text-indigo-700 text-sm mt-1">Check our knowledge base for quick solutions to common problems.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-slate-700 text-sm">Tips for faster resolution:</h3>
                    <ul className="space-y-2">
                      {[
                        "Be specific about your issue",
                        "Include steps to reproduce the problem",
                        "Mention any error messages you received",
                        "Add screenshots if possible",
                        "Select the appropriate category and priority"
                      ].map((tip, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-slate-600">
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="border-t border-slate-100 pt-4 mt-4">
                    <h3 className="font-medium text-slate-700 text-sm mb-2">Priority levels:</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                        <span className="text-sm text-slate-600">Low - Minor issues, no urgency</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                        <span className="text-sm text-slate-600">Medium - Important but not urgent</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                        <span className="text-sm text-slate-600">High - Urgent issues affecting work</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                        <span className="text-sm text-slate-600">Critical - System down, immediate attention</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
