'use client';

import { useState, useEffect } from 'react';
import AgentSidebar from '@/app/sidebar/AgentSidebar';
import { Tag, Plus, Search, BookOpen, Filter, X, Save, CheckCircle } from 'lucide-react';

// Sample article data
const articles = [
  {
    id: 1,
    title: 'How to reset your password',
    excerpt: 'Step-by-step guide to reset your account password securely.',
    category: 'Account Management',
    tags: ['password', 'account'],
  },
  {
    id: 2,
    title: 'Troubleshooting network connectivity issues',
    excerpt: 'Common solutions for network problems in the office environment.',
    category: 'Network',
    tags: ['network', 'connectivity'],
  },
  {
    id: 3,
    title: 'Setting up email on mobile devices',
    excerpt: 'Configure your work email on iOS and Android devices.',
    category: 'Mobile',
    tags: ['email', 'mobile'],
  },
  {
    id: 4,
    title: 'Using the company VPN',
    excerpt: 'Instructions for connecting to the corporate network remotely.',
    category: 'Remote Work',
    tags: ['vpn', 'remote'],
  },
  {
    id: 5,
    title: 'Printer installation guide',
    excerpt: 'How to set up and configure network printers.',
    category: 'Hardware',
    tags: ['printer', 'hardware'],
  },
];

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
}

const TagArticlesPage = () => {
  const [taggedArticles, setTaggedArticles] = useState<Article[]>(articles);
  const [currentTag, setCurrentTag] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([
    'software', 'hardware', 'security', 'login', 'access', 'mobile', 'desktop', 
    'windows', 'mac', 'browser', 'outlook', 'teams', 'office365'
  ]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleAddTag = (articleId: number) => {
    if (!currentTag.trim()) return;
    
    // Check if tag already exists
    const article = taggedArticles.find(a => a.id === articleId);
    if (article && article.tags.includes(currentTag.trim())) {
      return; // Don't add duplicate tags
    }
    
    const updatedArticles = taggedArticles.map((article) =>
      article.id === articleId
        ? { ...article, tags: [...article.tags, currentTag.trim()] }
        : article
    );
    setTaggedArticles(updatedArticles);
    setCurrentTag(''); // Reset tag input field
  };

  const handleRemoveTag = (articleId: number, tagToRemove: string) => {
    const updatedArticles = taggedArticles.map((article) =>
      article.id === articleId
        ? { ...article, tags: article.tags.filter(tag => tag !== tagToRemove) }
        : article
    );
    setTaggedArticles(updatedArticles);
  };

  const handleSuggestedTagClick = (tag: string) => {
    setCurrentTag(tag);
  };

  const handleSaveChanges = () => {
    // Simulate saving to backend
    setShowSaveMessage(true);
    setTimeout(() => {
      setShowSaveMessage(false);
    }, 3000);
  };

  // Get unique categories for filter
  const categories = ['All Categories', ...new Set(taggedArticles.map(article => article.category))];

  // Filter articles by search term and category
  const filteredArticles = taggedArticles.filter(article => {
    const matchesSearch = searchTerm === '' || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All Categories' || 
      article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <AgentSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-[250px]' : 'ml-[80px]'} bg-gray-50 min-h-screen`}>
        <div className="p-6">
          {/* Header section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">Knowledge Base Article Tagging</h1>
            </div>
            <p className="text-gray-600">Add relevant tags to articles to improve searchability and organization</p>
          </div>

          {/* Success message */}
          {showSaveMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-fade-in">
              <CheckCircle size={18} />
              <span>Tags saved successfully!</span>
            </div>
          )}

          {/* Search and filter bar */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search input */}
              <div className="relative col-span-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search articles, content or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              
              {/* Category filter */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter size={18} className="text-gray-400" />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">All Categories</option>
                  {categories.filter(c => c !== 'All Categories').map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results count and save button */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              Showing {filteredArticles.length} of {taggedArticles.length} articles
            </p>
            <button
              onClick={handleSaveChanges}
              className="inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Save size={16} />
              <span>Save All Changes</span>
            </button>
          </div>

          {/* Articles grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredArticles.map((article) => (
              <div key={article.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">{article.title}</h3>
                  <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    {article.category}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{article.excerpt}</p>
                
                <div className="border-t border-gray-100 pt-4 mb-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">Current Tags:</p>
                  <div className="flex flex-wrap gap-2 min-h-[32px]">
                    {article.tags.map((tag, tagIndex) => (
                      <div 
                        key={tagIndex} 
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                      >
                        <Tag size={12} />
                        <span>{tag}</span>
                        <button 
                          onClick={() => handleRemoveTag(article.id, tag)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                          aria-label={`Remove ${tag} tag`}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {article.tags.length === 0 && (
                      <p className="text-sm text-gray-400 italic">No tags yet</p>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-grow">
                    <input
                      type="text"
                      placeholder="Add a tag..."
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && currentTag.trim()) {
                          handleAddTag(article.id);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => handleAddTag(article.id)}
                    disabled={!currentTag.trim()}
                    className="inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Plus size={16} />
                    <span>Add</span>
                  </button>
                </div>

                {/* Suggested tags */}
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">Suggested tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags
                      .filter(tag => !article.tags.includes(tag))
                      .slice(0, 6)
                      .map((tag, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestedTagClick(tag)}
                          className="px-2 py-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full border border-gray-200 transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredArticles.length === 0 && (
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No articles found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search term or category filter</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Custom animation styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default TagArticlesPage;
