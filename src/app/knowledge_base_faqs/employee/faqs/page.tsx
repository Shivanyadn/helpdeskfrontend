// Directory: src/knowledge-base/employee/faqs/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import EmployeeSidebar from '@/app/sidebar/EmployeeSidebar';
import { ArrowLeft, BookOpen, Search, ChevronDown, ChevronUp, Tag, Clock, ThumbsUp, ThumbsDown, HelpCircle, Bookmark, Share2 } from 'lucide-react';
import Link from 'next/link';
import { getArticles, Article } from '@/api/faq';

const FAQsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqs, setExpandedFaqs] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<Article[]>([]);
  const [feedbackGiven, setFeedbackGiven] = useState<{[key: string]: 'up' | 'down' | null}>({});
  const [savedFaqs, setSavedFaqs] = useState<string[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch articles from API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const data = await getArticles();
        setArticles(data);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(data.map(article => article.category)));
        setCategories(uniqueCategories);
        
        // Extract unique tags
        const uniqueTags = Array.from(new Set(data.flatMap(article => article.tags)));
        setAllTags(uniqueTags);
        
        setFilteredFaqs(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch articles:', err);
        setError('Failed to load articles. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleFaqExpand = (id: string) => {
    setExpandedFaqs(prev => 
      prev.includes(id) ? prev.filter(faqId => faqId !== id) : [...prev, id]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const giveFeedback = (id: string, type: 'up' | 'down') => {
    setFeedbackGiven(prev => ({
      ...prev,
      [id]: prev[id] === type ? null : type
    }));
  };

  const toggleSaveFaq = (id: string) => {
    setSavedFaqs(prev => 
      prev.includes(id) ? prev.filter(faqId => faqId !== id) : [...prev, id]
    );
  };

  // Filter FAQs based on search, category, and tags
  useEffect(() => {
    let filtered = articles;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(query) || 
        article.content.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }
    
    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(article => 
        selectedTags.some(tag => article.tags.includes(tag))
      );
    }
    
    setFilteredFaqs(filtered);
  }, [searchQuery, selectedCategory, selectedTags, articles]);

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <EmployeeSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-[250px]' : 'ml-[80px]'} overflow-auto`}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Knowledge Base</h1>
              <div className="flex items-center gap-2">
                <Link 
                  href="/dashboard/employee"
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Dashboard</span>
                </Link>
                <span className="text-gray-400">|</span>
                <p className="text-gray-600">Find answers to common questions</p>
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
          
          {/* Search and Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <div className="border-b border-gray-100 px-6 py-4 flex items-center">
                  <Search size={16} className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Search FAQs by keyword, question, or answer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border-0 focus:ring-0 text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <Tag size={14} className="text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Filter by</span>
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="text-sm border-0 focus:ring-0 py-0 pl-2 pr-7 rounded-md bg-transparent text-gray-700"
                  >
                    <option value="All">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Popular Tags */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <Tag size={16} className="text-blue-600 mr-2" />
              <h2 className="font-semibold text-gray-800">Popular Tags</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 10).map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          
          {/* Loading State */}
          {isLoading && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 p-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
              <h3 className="text-xl font-medium text-gray-900">Loading articles...</h3>
            </div>
          )}
          
          {/* Error State */}
          {error && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4">
                <HelpCircle size={28} />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Error</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
          
          {/* FAQ Accordion */}
          {!isLoading && !error && filteredFaqs.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 mb-6">
              <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <HelpCircle size={18} className="text-blue-600 mr-2" />
                  <h2 className="font-semibold text-gray-800">Frequently Asked Questions</h2>
                </div>
                <span className="text-sm text-gray-500">{filteredFaqs.length} results</span>
              </div>
              
              <div className="divide-y divide-gray-100">
                {filteredFaqs.map((article) => (
                  <div key={article._id} className="transition-colors">
                    <div 
                      className="p-5 cursor-pointer hover:bg-gray-50 flex justify-between items-start"
                      onClick={() => toggleFaqExpand(article._id)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                            {article.category}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center">
                            <Clock size={12} className="mr-1" />
                            Updated {formatDate(article.updatedAt)}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 flex items-start">
                          {article.title}
                        </h3>
                      </div>
                      <div className="ml-4">
                        {expandedFaqs.includes(article._id) ? (
                          <ChevronUp size={20} className="text-gray-500" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-500" />
                        )}
                      </div>
                    </div>
                    
                    {expandedFaqs.includes(article._id) && (
                      <div className="px-5 pb-5">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
                          <div className="prose prose-sm max-w-none text-gray-700">
                            <p>{article.content}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-between">
                          <div className="flex flex-wrap gap-2 mb-2 sm:mb-0">
                            {article.tags.map(tag => (
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
                                  giveFeedback(article._id, 'up');
                                }}
                                className={`p-1 rounded-full ${
                                  feedbackGiven[article._id] === 'up' 
                                    ? 'bg-green-100 text-green-600' 
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                <ThumbsUp size={16} />
                              </button>
                              <span className="text-sm text-gray-500">{article.views}</span>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  giveFeedback(article._id, 'down');
                                }}
                                className={`p-1 rounded-full ${
                                  feedbackGiven[article._id] === 'down' 
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
                                toggleSaveFaq(article._id);
                              }}
                              className={`p-1 rounded-full ${
                                savedFaqs.includes(article._id) 
                                  ? 'bg-blue-100 text-blue-600' 
                                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                              }`}
                              title={savedFaqs.includes(article._id) ? "Saved" : "Save for later"}
                            >
                              <Bookmark size={16} />
                            </button>
                            
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(window.location.href + '#faq-' + article._id);
                                alert('Link copied to clipboard!');
                              }}
                              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                              title="Share"
                            >
                              <Share2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* No Results State */}
          {!isLoading && !error && filteredFaqs.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-500 mb-4">
                <HelpCircle size={28} />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No FAQs found</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                {searchQuery 
                  ? `No FAQs match your search for "${searchQuery}".` 
                  : selectedCategory !== 'All' || selectedTags.length > 0
                    ? `No FAQs found with the selected filters.`
                    : "There are no FAQs available at this time."}
              </p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedTags([]);
                }}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
          
          {/* Can't find answer section */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-sm overflow-hidden text-white p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold mb-2">Cannot find what you are looking for?</h3>
                <p className="text-blue-100">Our support team is ready to help you with any questions.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                  href="/contact"
                  className="px-4 py-2 text-sm font-medium bg-blue-400 bg-opacity-30 text-white hover:bg-opacity-40 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  Contact Support
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
