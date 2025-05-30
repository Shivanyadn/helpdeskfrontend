'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { authService, UserData, LoginResponse } from '@/api';

type User = {
  id: string;
  email: string;
  username: string;
  role: string;
  permissions: string[];
  project_name: string;
  profile_image: string;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing user session on mount
  useEffect(() => {
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      setUser(storedUser as User);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login({ username, password });
      
      if (response.success && response.data) {
        const userData = response.data.user;
        const token = response.data.token;
        
        // Ensure token is properly stored with Bearer prefix if needed
        const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        const rawToken = token.replace('Bearer ', '');
        
        // Store token in multiple formats for compatibility
        localStorage.setItem('token', formattedToken);
        localStorage.setItem('auth_token', formattedToken);
        localStorage.setItem('raw_token', rawToken);
        localStorage.setItem('authToken', rawToken); // Add this for compatibility with your create-ticket page
        
        // Store user data
        localStorage.setItem('user_data', JSON.stringify(userData));
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Store expiration if available
        if (response.data.expiresAt) {
          localStorage.setItem('tokenExpiry', response.data.expiresAt);
        }
        
        console.log('Token stored successfully:', formattedToken.substring(0, 20) + '...');
        
        // Also store valid categories if they're available in the response
        if (response.data.validCategories) {
          localStorage.setItem('validCategories', JSON.stringify(response.data.validCategories));
        }
        
        setUser({
          id: userData.id,
          email: userData.email,
          username: userData.username,
          role: userData.role,
          permissions: userData.permissions,
          project_name: userData.project_name,
          profile_image: userData.profile_image,
        });
        
        setIsLoading(false);
        return true;
      } else {
        setError(response.error || 'Login failed');
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
