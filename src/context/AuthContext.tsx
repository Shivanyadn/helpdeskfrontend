'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/api';

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
      
      console.log('Full login response:', response); // Detailed log
      
      if (response.success && response.data.accessToken && response.data.user) { // Check for accessToken and user
        const userData = response.data.user;
        const token = response.data.accessToken;
        
        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user_data', JSON.stringify(userData));
        
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
        console.error('Login failed:', response.error); // Debug log
        setError(response.error || 'Login failed');
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      console.error('Error during login:', err); // Debug log
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
