'use client';
 
import React, { useState, useRef } from 'react';
import AgentSidebar from '@/app/sidebar/AgentSidebar';
import { BookOpen, CheckCircle, AlertCircle, Send, HelpCircle, Info } from 'lucide-react';
import Link from 'next/link';

const SuggestFAQsPage = () => {
  const [suggestion, setSuggestion] = useState({ question: '', answer: '', category: 'general', tags: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSuggestion((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!suggestion.question.trim()) {
      setError('Question field is required');
      return;
    }
    
    if (!suggestion.answer.trim()) {
      setError('Answer field is required');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Here you would send the suggestion to an API
      console.log('Suggested FAQ:', suggestion);
      setLoading(false);
      setSubmitted(true);
      
      // Reset form after submission
      setTimeout(() => {
        setSuggestion({ question: '', answer: '', category: 'general', tags: '' });
        setSubmitted(false);
      }, 5000);
    }, 1000);
  };

  const categories = [
    { value: 'general', label: 'General Information' },
    { value: 'software', label: 'Software Issues' },
    { value: 'hardware', label: 'Hardware Problems' },
    { value: 'network', label: 'Network Connectivity' },
    { value: 'account', label: 'Account Management' },
    { value: 'security', label: 'Security & Privacy' },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AgentSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <div className="p-6 max-w-4xl mx-auto">
          {/* Header section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
              <BookOpen className="mr-3 text-blue-600" size={28} />
              Suggest New FAQs
            </h1>
            <p className="text-gray-600">
              Help improve our knowledge base by suggesting new frequently asked questions and answers
            </p>
          </div>
          
          {/* Info card */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex items-start">
            <Info className="text-blue-600 mr-3 mt-1 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-medium text-blue-800 mb-1">Why suggest FAQs?</h3>
              <p className="text-blue-700 text-sm">
                Your suggestions help us build a more comprehensive knowledge base, which can reduce ticket volume and improve customer satisfaction. Quality FAQs that address common issues will be reviewed and published by our team.
              </p>
            </div>
          </div>
          
          {/* Success message */}
          {submitted && (
            <div className="mb-8 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl flex items-center shadow-sm animate-fadeIn">
              <CheckCircle size={24} className="mr-3 text-green-500" />
              <div>
                <h3 className="font-medium">Suggestion submitted successfully!</h3>
                <p className="text-sm text-green-700 mt-1">Thank you for your contribution. Our team will review your suggestion.</p>
              </div>
            </div>
          )}
          
          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center">
              <AlertCircle size={24} className="mr-3 text-red-500" />
              <span>{error}</span>
            </div>
          )}
          
          {/* Suggestion form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <form ref={formRef} onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="col-span-2">
                    <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                      Question <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="question"
                      name="question"
                      placeholder="What is the question users might ask?"
                      value={suggestion.question}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Make it clear, concise, and specific
                    </p>
                  </div>
                  
                  <div className="col-span-2">
                    <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                      Answer <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="answer"
                      name="answer"
                      placeholder="Provide a detailed answer to the question"
                      value={suggestion.answer}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Include step-by-step instructions if applicable
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={suggestion.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      placeholder="e.g. password, login, reset (comma separated)"
                      value={suggestion.tags}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Add relevant keywords to help with search
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <Link 
                    href="/knowledge_base_faqs/agent/tag_articles"
                    className="text-gray-600 hover:text-gray-800 flex items-center text-sm"
                  >
                    <HelpCircle size={16} className="mr-1" />
                    View existing FAQs
                  </Link>
                  
                  <button
                    type="submit"
                    disabled={loading || submitted}
                    className={`px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium flex items-center shadow-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-200 ${
                      (loading || submitted) ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={18} className="mr-2" />
                        Submit Suggestion
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Tips section */}
          <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Tips for effective FAQ suggestions:</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="inline-block bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">1</span>
                <span>Focus on common issues that multiple users might encounter</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">2</span>
                <span>Write clear, concise questions that address specific problems</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">3</span>
                <span>Provide detailed answers with step-by-step instructions when applicable</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">4</span>
                <span>Include relevant screenshots or links if they would help clarify the answer</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestFAQsPage;
