// src/manager/article-management/Articles.tsx

'use client';

import React, { useState, useEffect } from 'react';
import ManagerSidebar from '@/app/sidebar/ManagerSidebar';
import { Loader2, Plus, Edit2, Trash2, BookOpen, Save, Brain } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  category?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

const AILearningArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Placeholder for fetching articles
  useEffect(() => {
    const fetchArticles = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setArticles([
        { 
          id: 1, 
          title: 'Introduction to Machine Learning', 
          content: 'Machine learning is a branch of artificial intelligence that focuses on building applications that learn from data and improve their accuracy over time without being programmed to do so. In this article, we explore the fundamentals of machine learning algorithms and their applications.',
          createdAt: '2023-04-01', 
          updatedAt: '2023-04-02',
          category: 'Machine Learning',
          difficulty: 'Beginner'
        },
        { 
          id: 2, 
          title: 'Natural Language Processing Techniques', 
          content: 'Natural Language Processing (NLP) combines computational linguistics, machine learning, and deep learning models to process human language. This article covers tokenization, part-of-speech tagging, named entity recognition, and sentiment analysis techniques.',
          createdAt: '2023-04-03', 
          updatedAt: '2023-04-04',
          category: 'NLP',
          difficulty: 'Intermediate'
        },
        { 
          id: 3, 
          title: 'Advanced Neural Network Architectures', 
          content: 'This article explores cutting-edge neural network architectures including transformers, GANs, and reinforcement learning networks. We discuss their mathematical foundations and implementation considerations for AI researchers and practitioners.',
          createdAt: '2023-04-05', 
          updatedAt: '2023-04-06',
          category: 'Deep Learning',
          difficulty: 'Advanced'
        },
      ]);
      
      setIsLoading(false);
    };
    
    fetchArticles();
  }, []);

  // Handle adding a new article
  const handleAddArticle = () => {
    if (title && content) {
      const newArticle = {
        id: articles.length + 1,
        title,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category,
        difficulty,
      };
      setArticles([...articles, newArticle]);
      resetForm();
    }
  };

  // Handle editing an article
  const handleEditArticle = () => {
    if (editId !== null && title && content) {
      const updatedArticles = articles.map((article) =>
        article.id === editId ? { 
          ...article, 
          title, 
          content, 
          category,
          difficulty,
          updatedAt: new Date().toISOString() 
        } : article
      );
      setArticles(updatedArticles);
      resetForm();
    }
  };

  // Handle deleting an article
  const handleDeleteArticle = (id: number) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      const updatedArticles = articles.filter((article) => article.id !== id);
      setArticles(updatedArticles);
    }
  };

  // Reset form fields and state
  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('');
    setDifficulty('Beginner');
    setIsEditing(false);
    setEditId(null);
    setShowForm(false);
  };

  // Get difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-blue-100 text-blue-800';
      case 'Advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ManagerSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-6 max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <Brain size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">AI Learning Articles</h1>
                <p className="text-gray-600">Manage educational content for AI learning</p>
              </div>
            </div>
            
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition"
              >
                <Plus size={18} className="mr-2" /> New Article
              </button>
            )}
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit AI Learning Article' : 'Create New AI Learning Article'}</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Enter article title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <input
                      id="category"
                      type="text"
                      placeholder="e.g., Machine Learning, NLP, Computer Vision"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                      Difficulty Level
                    </label>
                    <select
                      id="difficulty"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as 'Beginner' | 'Intermediate' | 'Advanced')}
                      className="p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    id="content"
                    placeholder="Write your article content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    rows={8}
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={isEditing ? handleEditArticle : handleAddArticle}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition flex items-center"
                    disabled={!title.trim() || !content.trim()}
                  >
                    <Save size={18} className="mr-2" />
                    {isEditing ? 'Update Article' : 'Publish Article'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Articles List */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Published Learning Materials</h2>
              <div className="text-sm text-gray-500">{articles.length} articles</div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
                <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
                <span className="ml-2 text-gray-600">Loading articles...</span>
              </div>
            ) : articles.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">No AI learning articles have been published yet.</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-flex items-center transition"
                >
                  <Plus size={18} className="mr-2" /> Create Your First Article
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {articles.map((article) => (
                  <div key={article.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {article.category && (
                          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                            {article.category}
                          </span>
                        )}
                        {article.difficulty && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(article.difficulty)}`}>
                            {article.difficulty}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-800">{article.title}</h3>
                      <p className="text-gray-600 mt-2 mb-3">{article.content}</p>
                      
                      <div className="flex items-center text-sm text-gray-500 space-x-4 mt-4">
                        <span>Created: {new Date(article.createdAt).toLocaleDateString()}</span>
                        <span>Updated: {new Date(article.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 p-4 flex justify-end space-x-2">
                      <button 
                        onClick={() => {
                          setIsEditing(true);
                          setEditId(article.id);
                          setTitle(article.title);
                          setContent(article.content);
                          setCategory(article.category || '');
                          setDifficulty(article.difficulty || 'Beginner');
                          setShowForm(true);
                        }} 
                        className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition"
                      >
                        <Edit2 size={16} className="mr-2" /> Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteArticle(article.id)} 
                        className="flex items-center px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition"
                      >
                        <Trash2 size={16} className="mr-2" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AILearningArticles;
