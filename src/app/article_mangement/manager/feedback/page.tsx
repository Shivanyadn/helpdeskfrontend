'use client';

import React, { useState, useEffect, Suspense } from 'react';
import ManagerSidebar from '@/app/sidebar/ManagerSidebar';
import { Loader2, Plus, MessageSquare, Edit2, Trash2, Save, X } from 'lucide-react';

// Article type
interface Article {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  feedback: string[];
}

// Inline ArticleCard component
const ArticleCard = ({
  article,
  onEdit,
  onDelete,
  onAddFeedback,
}: {
  article: Article;
  onEdit: () => void;
  onDelete: () => void;
  onAddFeedback: (id: number, feedback: string) => void;
}) => {
  const [feedbackInput, setFeedbackInput] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800">{article.title}</h3>
        <p className="text-gray-600 mt-2 mb-3">{article.content}</p>
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <span>Created: {new Date(article.createdAt).toLocaleDateString()}</span>
          <span>Updated: {new Date(article.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="border-t border-gray-100 bg-gray-50 p-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium text-gray-700 flex items-center">
            <MessageSquare size={18} className="mr-2 text-blue-500" />
            Feedback ({article.feedback.length})
          </h4>
          <button
            onClick={() => setShowFeedbackForm(!showFeedbackForm)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          >
            {showFeedbackForm ? (
              <>
                <X size={16} className="mr-1" /> Cancel
              </>
            ) : (
              <>
                <Plus size={16} className="mr-1" /> Add Feedback
              </>
            )}
          </button>
        </div>

        {showFeedbackForm && (
          <div className="mb-4 bg-white p-4 rounded-md border border-gray-200">
            <textarea
              value={feedbackInput}
              onChange={(e) => setFeedbackInput(e.target.value)}
              placeholder="Share your thoughts on this article..."
              className="p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={() => {
                  if (feedbackInput.trim()) {
                    onAddFeedback(article.id, feedbackInput);
                    setFeedbackInput('');
                    setShowFeedbackForm(false);
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition flex items-center"
                disabled={!feedbackInput.trim()}
              >
                <Save size={16} className="mr-2" /> Submit Feedback
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3 mt-2">
          {article.feedback.length > 0 ? (
            article.feedback.map((fb, idx) => (
              <div key={idx} className="bg-white p-3 rounded-md border border-gray-200">
                <p className="text-gray-700">{fb}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm italic">No feedback has been provided yet.</p>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 p-4 flex justify-end space-x-2">
        <button
          onClick={onEdit}
          className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition"
        >
          <Edit2 size={16} className="mr-2" /> Edit
        </button>
        <button
          onClick={onDelete}
          className="flex items-center px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition"
        >
          <Trash2 size={16} className="mr-2" /> Delete
        </button>
      </div>
    </div>
  );
};

const ArticlesWithFeedback = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchArticles = async () => {
      await new Promise((res) => setTimeout(res, 1000)); // simulate loading
      setArticles([
        {
          id: 1,
          title: 'AI in Healthcare',
          content: 'Artificial intelligence is transforming healthcare by improving diagnostics, treatment plans, and patient care. Machine learning algorithms can analyze medical images with high accuracy, while AI-powered systems help manage patient data efficiently.',
          createdAt: '2023-04-01',
          updatedAt: '2023-04-02',
          feedback: ['Very informative article about the latest AI applications in healthcare.', 'Would love to see more examples of hospitals implementing these technologies.'],
        },
        {
          id: 2,
          title: 'AI Ethics',
          content: 'As AI becomes more prevalent, ethical considerations are increasingly important. Issues like bias in algorithms, privacy concerns, and the impact of automation on employment need careful consideration to ensure AI benefits society as a whole.',
          createdAt: '2023-04-03',
          updatedAt: '2023-04-04',
          feedback: ['This article raises important points about AI ethics that are often overlooked.'],
        },
      ]);
    };
    fetchArticles();
  }, []);

  const handleAddArticle = () => {
    if (title && content) {
      const newArticle: Article = {
        id: articles.length + 1,
        title,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        feedback: [],
      };
      setArticles([...articles, newArticle]);
      setTitle('');
      setContent('');
      setShowForm(false);
    }
  };

  const handleEditArticle = () => {
    if (editId !== null && title && content) {
      const updated = articles.map((a) =>
        a.id === editId ? { ...a, title, content, updatedAt: new Date().toISOString() } : a
      );
      setArticles(updated);
      setTitle('');
      setContent('');
      setEditId(null);
      setIsEditing(false);
      setShowForm(false);
    }
  };

  const handleDeleteArticle = (id: number) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      setArticles(articles.filter((a) => a.id !== id));
    }
  };

  const handleStartEdit = (article: Article) => {
    setIsEditing(true);
    setEditId(article.id);
    setTitle(article.title);
    setContent(article.content);
    setShowForm(true);
  };

  const handleAddFeedback = (id: number, feedback: string) => {
    if (feedback.trim()) {
      const updated = articles.map((a) =>
        a.id === id ? { ...a, feedback: [...a.feedback, feedback] } : a
      );
      setArticles(updated);
    }
  };

  const handleCancelForm = () => {
    setTitle('');
    setContent('');
    setIsEditing(false);
    setEditId(null);
    setShowForm(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ManagerSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-6 max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Article Management</h1>
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
              <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Article' : 'Create New Article'}</h2>
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
                    rows={6}
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCancelForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={isEditing ? handleEditArticle : handleAddArticle}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                    disabled={!title.trim() || !content.trim()}
                  >
                    {isEditing ? 'Update Article' : 'Publish Article'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Articles List */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Published Articles</h2>
            <Suspense
              fallback={
                <div className="flex justify-center items-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
                  <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
                  <span className="ml-2 text-gray-600">Loading articles...</span>
                </div>
              }
            >
              {articles.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <p className="text-gray-500 mb-4">No articles have been published yet.</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-flex items-center transition"
                  >
                    <Plus size={18} className="mr-2" /> Create Your First Article
                  </button>
                </div>
              ) : (
                articles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onEdit={() => handleStartEdit(article)}
                    onDelete={() => handleDeleteArticle(article.id)}
                    onAddFeedback={handleAddFeedback}
                  />
                ))
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlesWithFeedback;
