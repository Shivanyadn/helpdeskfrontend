import { ApiResponse } from '../types';
import { storeAuthToken } from '../tickets';

const API_URL = 'https://sso.zenapi.co.in';

export interface LoginCredentials {
  username: string;
  password: string;
}

// Add this function to store user data
const storeUserData = (response: any) => {
  if (response && response.user) {
    localStorage.setItem('user_data', JSON.stringify(response.user));
    localStorage.setItem('auth_token', response.token);
  }
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Login failed',
        };
      }

      // Store token and user data after successful login
      storeUserData(data);
      
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        error: 'An error occurred during login',
      };
    }
  },
  
  getStoredUser: () => {
    if (typeof window === 'undefined') return null;
    
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        return null;
      }
    }
    return null;
  },
  
  logout: (): void => {
    localStorage.removeItem('user_data');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token');
  }
};