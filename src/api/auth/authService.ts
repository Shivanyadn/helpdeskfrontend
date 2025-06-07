import { ApiResponse } from '../types';

const API_URL = 'https://sso.zenapi.co.in/api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  profile_image: string;
  project_name: string;
  permissions: string[];
  role: string;
  id: string;
  username: string;
  email: string;
  // Add other user fields as needed
}

export interface LoginResponse {
  user: User;
  token: string;
  accessToken: string;
}

export interface ErrorResponse {
  message: string;
}

// Add this function to store user data
const storeUserData = (response: LoginResponse) => {
  if (response && response.user) {
    localStorage.setItem('user_data', JSON.stringify(response.user));
    localStorage.setItem('auth_token', response.token);
  }
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();

        // Log the response and data for debugging
        console.log('Response:', response);
        console.log('Data:', data);

        // Check if the response contains the required fields
        if (response.ok && data.accessToken && data.user) {
            // Store token and user data after successful login
            storeUserData(data as LoginResponse);

            return {
                success: true,
                data: data as LoginResponse,
            };
        } else {
            return {
                success: false,
                error: (data as ErrorResponse).message || 'Login failed',
            };
        }
    } catch (error) {
        console.error('Error during login:', error);
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