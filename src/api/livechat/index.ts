import { API_BASE_URL } from '@/config';

// Define message type
export interface ChatMessage {
  id?: string;
  sender: 'user' | 'support';
  text: string;
  timestamp?: string;
}

// Define session type
export interface ChatSession {
  id: string;
  userId: string;
  agentId?: string;
  status: 'active' | 'closed';
  createdAt: string;
  updatedAt: string;
}

// Create a new chat session
export const createChatSession = async (): Promise<ChatSession> => {
  try {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Authentication token not found');
    }
    
    const response = await fetch(`${API_BASE_URL}/api/livechat/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      // Include credentials to send cookies
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to create chat session: ${response.status} - ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating chat session:', error);
    throw error;
  }
};

// Send a message in a chat session
export const sendChatMessage = async (sessionId: string, message: string): Promise<ChatMessage> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Authentication token not found');
    }
    
    const response = await fetch(`${API_BASE_URL}/api/livechat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify({
        sessionId,
        message
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to send message: ${response.status} - ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};

// Get messages for a chat session
export const getChatMessages = async (sessionId: string): Promise<ChatMessage[]> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Authentication token not found');
    }
    
    const response = await fetch(`${API_BASE_URL}/api/livechat/messages/${sessionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to get chat messages: ${response.status} - ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting chat messages:', error);
    throw error;
  }
};

// Close a chat session
export const closeChatSession = async (sessionId: string): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Authentication token not found');
    }
    
    const response = await fetch(`${API_BASE_URL}/api/livechat/session/${sessionId}/close`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to close chat session: ${response.status} - ${errorData.message || response.statusText}`);
    }
  } catch (error) {
    console.error('Error closing chat session:', error);
    throw error;
  }
};