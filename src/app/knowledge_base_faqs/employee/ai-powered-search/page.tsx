'use client';

import React, { useState, useRef, useEffect } from 'react';
import EmployeeSidebar from '@/app/sidebar/EmployeeSidebar';
import { BookOpen, ArrowLeft, Lightbulb, Sparkles, Clock, ThumbsUp, ThumbsDown, MessageSquare, ExternalLink, Tag, Filter, X, ChevronDown, ChevronUp, Share2, Zap, HelpCircle } from 'lucide-react';
import Link from 'next/link';

// Enhanced FAQ data with categories, tags, and metadata
const faqs = [
  {
    id: 1,
    question: 'How do I reset my password?',
    answer: 'Go to your profile settings and click on "Reset Password". Follow the instructions sent to your email. If you don\'t receive the email within 5 minutes, check your spam folder or contact the IT support team.',
    category: 'Account',
    tags: ['password', 'account', 'security'],
    helpful: 124,
    lastUpdated: '2023-05-15'
  },
  {
    id: 2,
    question: 'How do I raise a support ticket?',
    answer: 'Navigate to the "My Tickets" section from your dashboard and click on "Create New Ticket". Fill in the required details including the issue category, priority, and description. You can also attach screenshots or relevant files to help explain the issue better.',
    category: 'Support',
    tags: ['tickets', 'support', 'help'],
    helpful: 98,
    lastUpdated: '2023-06-02'
  },
  {
    id: 3,
    question: 'What is the response time for critical issues?',
    answer: 'Critical issues are responded to within 1-2 hours during working hours (9 AM - 5 PM, Monday to Friday). For after-hours critical issues, an on-call support team is available with a response time of 2-4 hours. Non-critical issues are typically addressed within 24-48 hours.',
    category: 'Support',
    tags: ['response time', 'critical', 'SLA'],
    helpful: 76,
    lastUpdated: '2023-04-20'
  },
  {
    id: 4,
    question: 'How do I update my contact information?',
    answer: 'Go to your profile page, click on "Edit Profile" and update your contact details. Make sure to save your changes before exiting. Your updated information will be reflected across all company systems within 24 hours.',
    category: 'Account',
    tags: ['profile', 'contact', 'personal information'],
    helpful: 65,
    lastUpdated: '2023-03-10'
  },
  {
    id: 5,
    question: 'Can I change my department assignment?',
    answer: 'Department changes need to be requested through HR. Create a ticket in the HR category with details about your current department, requested department, and reason for the change. Your manager will be notified and will need to approve the request.',
    category: 'HR',
    tags: ['department', 'transfer', 'HR'],
    helpful: 42,
    lastUpdated: '2023-02-28'
  },
  {
    id: 6,
    question: 'How do I access the company VPN?',
    answer: 'Download the VPN client from the Software Center, then use your network credentials to connect. For detailed setup instructions, refer to the IT knowledge base article "VPN Setup Guide". If you encounter any issues, contact the IT helpdesk.',
    category: 'IT',
    tags: ['VPN', 'remote access', 'network'],
    helpful: 156,
    lastUpdated: '2023-05-20'
  },
];

// Get all unique categories and tags
const categories = Array.from(new Set(faqs.map(faq => faq.category)));
const allTags = Array.from(new Set(faqs.flatMap(faq => faq.tags)));

// Sample AI-generated responses
const aiResponses = {
  password: `Based on your query about password reset, here's what you need to do:

1. Go to your profile settings by clicking on your profile picture in the top-right corner
2. Select "Account Settings" from the dropdown menu
3. Click on the "Security" tab
4. Click the "Reset Password" button
5. Follow the instructions sent to your registered email address

If you don't receive the email within 5 minutes, please check your spam folder or contact the IT support team at support@company.com.

For security reasons, your password must:
- Be at least 8 characters long
- Include at least one uppercase letter, one lowercase letter, and one number
- Not be the same as your previous 3 passwords`,

  ticket: `To raise a support ticket in our helpdesk system:

1. Navigate to the "My Tickets" section from your dashboard
2. Click on the "Create New Ticket" button in the top-right corner
3. Select the appropriate category for your issue
4. Choose a priority level (Low, Medium, High, Critical)
5. Provide a clear subject line and detailed description
6. Attach any relevant screenshots or files that might help explain the issue
7. Click "Submit Ticket"

You'll receive an email confirmation with your ticket number. You can track the status of your ticket in the "My Tickets" section.

Pro tip: The more details you provide in your initial ticket, the faster our team can resolve your issue!`,

  vpn: `To access the company VPN for remote work:

1. Download the VPN client from the Software Center on your company laptop
2. Install the application following the on-screen instructions
3. Launch the VPN client from your desktop or Start menu
4. Enter your network username (same as your company email) and password
5. Click "Connect"

Once connected, you'll have access to all company resources as if you were in the office.

Common issues:
- If you can't connect, ensure you have a stable internet connection
- Verify your credentials are correct
- Make sure you're not connected to another VPN simultaneously
- Restart your computer if you continue to have issues

For detailed setup instructions with screenshots, refer to the IT knowledge base article "VPN Setup Guide".`
};

// Suggested queries based on common topics
const suggestedQueries = [
  'How to reset my password?',
  'Steps to create a support ticket',
  'VPN connection issues',
  'Change my contact information',
  'Department transfer process',
  'Response times for critical issues'
];

const FAQsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFAQs, setFilteredFAQs] = useState(faqs);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [expandedFaqs, setExpandedFaqs] = useState<number[]>([]);
  const [feedbackGiven, setFeedbackGiven] = useState<{[key: number]: 'up' | 'down' | null}>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleFaqExpand = (id: number) => {
    setExpandedFaqs(prev => 
      prev.includes(id) ? prev.filter(faqId => faqId !== id) : [...prev, id]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const giveFeedback = (id: number, type: 'up' | 'down') => {
    setFeedbackGiven(prev => ({
      ...prev,
      [id]: prev[id] === type ? null : type
    }));
  };


  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Handle search input
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim()) {
      setIsSearching(true);
      setShowSuggestions(false);
      
      // Add to recent searches if not already there
      if (!recentSearches.includes(query) && query.length > 3) {
        setRecentSearches(prev => [query, ...prev].slice(0, 5));
      }

      // Simulate AI processing delay
      setTimeout(() => {
        // Generate AI response based on keywords
        if (query.includes('password')) {
          setAiResponse(aiResponses.password);
        } else if (query.includes('ticket') || query.includes('support')) {
          setAiResponse(aiResponses.ticket);
        } else if (query.includes('vpn') || query.includes('remote')) {
          setAiResponse(aiResponses.vpn);
        } else {
          setAiResponse(null);
        }

        // Filter FAQs based on the search query
        const filtered = faqs.filter(faq =>
          faq.question.toLowerCase().includes(query) || 
          faq.answer.toLowerCase().includes(query) ||
          faq.tags.some(tag => tag.toLowerCase().includes(query))
        );
        setFilteredFAQs(filtered);
        setIsSearching(false);
      }, 1200); // Slightly longer delay to simulate AI thinking
    } else {
      setAiResponse(null);
      setFilteredFAQs(faqs);
      setIsSearching(false);
      setShowSuggestions(true);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setAiResponse(null);
    setFilteredFAQs(faqs);
    setShowSuggestions(true);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleSuggestedQuery = (query: string) => {
    setSearchQuery(query);
    handleSearch({ target: { value: query } } as React.ChangeEvent<HTMLInputElement>);
  };

  // Filter FAQs based on category and tags
  useEffect(() => {
    let filtered = faqs;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(faq => 
        selectedTags.some(tag => faq.tags.includes(tag))
      );
    }

    // Apply search query filter if exists
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(query) || 
        faq.answer.toLowerCase().includes(query) ||
        faq.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredFAQs(filtered);
  }, [selectedCategory, selectedTags, searchQuery]); // Add `searchQuery` here

  return (
    <div className="flex h-screen bg-gray-50">
      <EmployeeSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-[250px]' : 'ml-[80px]'} overflow-auto`}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">AI-Powered Knowledge Base</h1>
              <div className="flex items-center gap-2">
                <Link 
                  href="/dashboard/employee"
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Dashboard</span>
                </Link>
                <span className="text-gray-400">|</span>
                <p className="text-gray-600">Get instant answers to your questions</p>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Link 
                href="/knowledge_base_faqs/employee"
                className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <BookOpen size={16} />
                <span>Browse All Articles</span>
              </Link>
            </div>
          </div>
          
          {/* AI-Powered Search Hero Section */}
          <div className="mb-8 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-8 md:px-10 md:py-12">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-4">
                  <Sparkles size={20} className="text-yellow-300 mr-2" />
                  <h2 className="text-white font-bold text-lg">AI-Powered Knowledge Search</h2>
                </div>
                
                <h3 className="text-white text-2xl md:text-3xl font-bold mb-4">
                  How can we help you today?
                </h3>
                
                <div className="relative">
                  <div className="bg-white rounded-lg shadow-md transition-all duration-300">
                    <div className="flex items-center px-4 py-3">
                      {isSearching ? (
                        <div className="animate-pulse">
                          <Sparkles size={20} className="text-indigo-500 mr-2" />
                        </div>
                      ) : (
                        <Sparkles size={20} className="text-indigo-500 mr-2" />
                      )}
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Ask any question about company policies, procedures, or IT support..."
                        className="w-full border-0 focus:ring-0 text-gray-800 placeholder-gray-400 text-base"
                      />
                      
                      <div className="flex items-center">
                        {searchQuery && (
                          <button 
                            onClick={clearSearch}
                            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                          >
                            <X size={16} />
                          </button>
                        )}
                        <button 
                          onClick={toggleFilters}
                          className="ml-2 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                        >
                          <Filter size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Search Suggestions */}
                    {showSuggestions && !searchQuery && (
                      <div className="border-t border-gray-100 p-4">
                        {recentSearches.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Searches</h4>
                            <div className="flex flex-wrap gap-2">
                              {recentSearches.map((query, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleSuggestedQuery(query)}
                                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors flex items-center"
                                >
                                  <Clock size={12} className="mr-1.5 text-gray-500" />
                                  {query}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Suggested Questions</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {suggestedQueries.map((query, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestedQuery(query)} // Use `handleSuggestedQuery` here
                                className="text-left p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-800 transition-colors flex items-center"
                              >
                                <Sparkles size={14} className="mr-2 text-indigo-500 flex-shrink-0" />
                                <span className="line-clamp-1">{query}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 text-blue-100 text-sm flex items-center">
                  <Zap size={14} className="mr-1.5 text-yellow-300" />
                  <span>Powered by AI - Ask questions in natural language to get instant answers</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Filters Section - Conditionally shown */}
          {showFilters && (
            <div className="mb-6 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Filter size={16} className="text-indigo-600 mr-2" />
                  <h2 className="font-semibold text-gray-800">Filters</h2>
                </div>
                <button 
                  onClick={toggleFilters}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="All">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                            : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedTags([]);
                  }}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 mr-2"
                >
                  Clear All
                </button>
                <button 
                  onClick={toggleFilters}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
          
          {/* Loading State */}
          {isSearching && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 p-6 mb-6">
              <div className="flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="relative w-16 h-16 mb-4">
                    <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles size={24} className="text-indigo-500" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Searching for answers</h3>
                  <p className="text-gray-500 text-center">
                    Our AI is analyzing your question and finding the best information...
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* AI Response */}
          {!isSearching && aiResponse && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 mb-6">
              <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Sparkles size={18} className="text-indigo-600 mr-2" />
                  <h2 className="font-semibold text-gray-800">AI-Generated Answer</h2>
                </div>
                <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">Powered by AI</span>
              </div>
              
              <div className="p-5">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mr-3 mt-1">
                    <Sparkles size={16} className="text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <div className="prose prose-sm max-w-none">
                      {aiResponse.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className={idx === 0 ? "font-medium" : ""}>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors">
                          <ThumbsUp size={12} className="mr-1" />
                          <span>Helpful</span>
                        </button>
                        <button className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors">
                          <ThumbsDown size={12} className="mr-1" />
                          <span>Not helpful</span>
                        </button>
                      </div>
                      
                      <button className="inline-flex items-center px-2 py-1 text-xs font-medium text-indigo-700 hover:text-indigo-800">
                        <MessageSquare size={12} className="mr-1" />
                        <span>Provide feedback</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* FAQ Results */}
          {!isSearching && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 mb-6">
              <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <BookOpen size={18} className="text-indigo-600 mr-2" />
                  <h2 className="font-semibold text-gray-800">Knowledge Base Results</h2>
                </div>
                <span className="text-sm text-gray-500">{filteredFAQs.length} results</span>
              </div>
              
              <div className="divide-y divide-gray-100">
                {filteredFAQs.length > 0 ? (
                  filteredFAQs.map((faq) => (
                    <div key={faq.id} id={`faq-${faq.id}`} className="transition-colors">
                      <div 
                        className="p-5 cursor-pointer hover:bg-gray-50 flex justify-between items-start"
                        onClick={() => toggleFaqExpand(faq.id)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mr-2">
                              {faq.category}
                            </span>
                            <span className="text-sm text-gray-500 flex items-center">
                              <Clock size={12} className="mr-1" />
                              Updated {faq.lastUpdated}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800 flex items-start">
                            {faq.question}
                          </h3>
                        </div>
                        <div className="ml-4">
                          {expandedFaqs.includes(faq.id) ? (
                            <ChevronUp size={20} className="text-gray-500" />
                          ) : (
                            <ChevronDown size={20} className="text-gray-500" />
                          )}
                        </div>
                      </div>
                      
                      {expandedFaqs.includes(faq.id) && (
                        <div className="px-5 pb-5">
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
                            <div className="prose prose-sm max-w-none text-gray-700">
                              <p>{faq.answer}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center justify-between">
                            <div className="flex flex-wrap gap-2 mb-2 sm:mb-0">
                              {faq.tags.map(tag => (
                                <span 
                                  key={tag} 
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 cursor-pointer hover:bg-gray-200"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleTag(tag);
                                  }}
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    giveFeedback(faq.id, 'up');
                                  }}
                                  className={`p-1 rounded-full ${
                                    feedbackGiven[faq.id] === 'up' 
                                      ? 'bg-green-100 text-green-600' 
                                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                  }`}
                                >
                                  <ThumbsUp size={16} />
                                </button>
                                <span className="text-sm text-gray-500">{faq.helpful}</span>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    giveFeedback(faq.id, 'down');
                                  }}
                                  className={`p-1 rounded-full ${
                                    feedbackGiven[faq.id] === 'down' 
                                      ? 'bg-red-100 text-red-600' 
                                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                  }`}
                                >
                                  <ThumbsDown size={16} />
                                </button>
                              </div>
                              
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Share functionality would be implemented here
                                }}
                                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                                title="Share this article"
                              >
                                <Share2 size={16} />
                              </button>
                              
                              <Link 
                                href={`/knowledge_base_faqs/employee/article/${faq.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                                title="View full article"
                              >
                                <ExternalLink size={16} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <HelpCircle size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No results found</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-4">
                      We couldn&apos;t find any articles matching your search criteria. Try adjusting your filters or search terms.
                    </p>
                    <button 
                      onClick={clearSearch}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Clear Search
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Related Articles Section */}
          {!isSearching && searchQuery && filteredFAQs.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 mb-6">
              <div className="border-b border-gray-100 px-6 py-4">
                <div className="flex items-center">
                  <Lightbulb size={18} className="text-amber-500 mr-2" />
                  <h2 className="font-semibold text-gray-800">You might also find these helpful</h2>
                </div>
              </div>
              
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {faqs
                    .filter(faq => !filteredFAQs.some(f => f.id === faq.id))
                    .slice(0, 4)
                    .map(faq => (
                      <div 
                        key={faq.id}
                        className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => {
                          toggleFaqExpand(faq.id);
                          // Scroll to the FAQ
                          document.getElementById(`faq-${faq.id}`)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        <div className="flex items-center mb-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {faq.category}
                          </span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2">{faq.question}</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-gray-500">
                            <ThumbsUp size={10} className="mr-1" />
                            <span>{faq.helpful} found this helpful</span>
                          </div>
                          <Link 
                            href={`/knowledge_base_faqs/employee/article/${faq.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center"
                          >
                            <span>View</span>
                            <ExternalLink size={10} className="ml-1" />
                          </Link>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
          
         
    
          {/* Quick Tips Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 mb-6">
            <div className="border-b border-gray-100 px-6 py-4">
              <div className="flex items-center">
                <Lightbulb size={18} className="text-amber-500 mr-2" />
                <h2 className="font-semibold text-gray-800">Search Tips</h2>
              </div>
            </div>
            
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mr-3">
                      <Sparkles size={16} className="text-amber-600" />
                    </div>
                    <h3 className="font-medium text-gray-800">Use Natural Language</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Ask questions as you would to a colleague. Our AI understands natural language queries.
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-3">
                      <Tag size={16} className="text-blue-600" />
                    </div>
                    <h3 className="font-medium text-gray-800">Use Keywords</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Include specific keywords related to your issue for more accurate results.
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mr-3">
                      <Filter size={16} className="text-green-600" />
                    </div>
                    <h3 className="font-medium text-gray-800">Use Filters</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Narrow down results by selecting specific categories or tags that match your needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500 mb-4 md:mb-0">
                © 2023 Company Name. All rights reserved.
              </p>
              
              <div className="flex items-center space-x-4">
                <Link 
                  href="/privacy-policy"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Privacy Policy
                </Link>
                <Link 
                  href="/terms-of-service"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Terms of Service
                </Link>
                <Link 
                  href="/contact"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQsPage;
