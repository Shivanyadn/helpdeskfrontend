// Replace the import with authService
import { authService } from '../../api/auth/authService';

// API endpoint for articles
const API_BASE_URL = 'http://localhost:5001/api';

export interface Article {
  _id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  views: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

/**
 * Helper function to get auth token
 */
const getAuthToken = (): string => {
  const user = authService.getStoredUser();
  return user?.token || '';
};

/**
 * Get all articles
 */
export const getArticles = async (): Promise<Article[]> => {
  try {
    // Use the helper function to get the token
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/articles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching articles: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getArticles:', error);
    throw error;
  }
};

/**
 * Get article by ID
 */
export const getArticleById = async (articleId: string): Promise<Article> => {
  try {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/articles/${articleId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      mode: 'cors',
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Article data received:', data);
    return data;
  } catch (error) {
    console.error(`Error fetching article ${articleId}:`, error);
    throw error;
  }
};