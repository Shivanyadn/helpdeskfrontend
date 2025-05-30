// Login function that stores the token
export const login = async (username: string, password: string) => {
  try {
    const response = await fetch('https://sso.zenapi.co.in/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Login failed');
    }

    const data = await response.json();
    
    // Store the token in localStorage (both formats for compatibility)
    localStorage.setItem('token', data.token);
    localStorage.setItem('auth_token', data.token);
    
    // Store user info (both formats for compatibility)
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('user_data', JSON.stringify(data.user));
    
    // Also store expiration time
    if (data.expiresAt) {
      localStorage.setItem('tokenExpiry', data.expiresAt);
    }
    
    console.log('Token stored successfully:', data.token.substring(0, 15) + '...');
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Function to check if user is logged in
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
  return !!token;
};

// Function to get the token
export const getToken = () => {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem('token') || localStorage.getItem('auth_token');
};

// Function to logout
export const logout = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('token');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  localStorage.removeItem('user_data');
  localStorage.removeItem('tokenExpiry');
};