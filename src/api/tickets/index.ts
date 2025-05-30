import { getToken } from '../auth';

const API_BASE_URL = 'http://localhost:5000/api';

// Payload to create a new ticket
export interface CreateTicketPayload {
  title: string;
  description: string;
  category: string;
  priority: string;
  // Add any additional fields your backend expects
}

// File attachment metadata
export interface TicketAttachment {
  fileType: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  uploadedAt: string;
  _id: string;
}

// Assigned user information
export interface AssignedTo {
  _id: string;
  firstName: string;
  lastName: string;
}

// Ticket response structure
export interface TicketResponse {
  updatedAt: boolean;
  _id: string;
  ticketId: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  attachments: TicketAttachment[];
  createdAt: string;
  sla: string;
  assignedTo: AssignedTo;
}

// Function to get all tickets
export const getTickets = async (): Promise<TicketResponse[]> => {
  try {
    // Use getAuthToken instead of getToken to ensure proper token format
    const token = getAuthToken();
    
    // Use the base URL without any parameters
    let url = `${API_BASE_URL}/tickets`;
    
    console.log('Fetching tickets from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      // Add these options to match other API calls
      mode: 'cors',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Error fetching tickets: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch tickets:', error);
    return [];
  }
};

// API response for create ticket
export interface TicketApiResponse {
  success: boolean;
  ticket: TicketResponse;
}

// Check if the stored token is still valid
export const isTokenValid = (): boolean => {
  const expiry = localStorage.getItem('tokenExpiry');
  if (!expiry) return false;

  const expiryDate = new Date(expiry);
  return expiryDate > new Date();
};

// Retrieve the authorization token
const getAuthToken = (): string => {
  if (!isTokenValid()) {
    console.warn('Token may be expired');
  }

  const authToken = getToken();
  if (authToken) {
    return authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
  }

  const fallbackToken = typeof window !== 'undefined'
    ? localStorage.getItem('raw_token') ||
      localStorage.getItem('token') ||
      localStorage.getItem('auth_token')
    : null;

  if (!fallbackToken) {
    console.error('Authentication token not found');
    if (typeof window !== 'undefined') {
      console.log('Available localStorage keys:', Object.keys(localStorage));
    }
    throw new Error('Authentication token not found. Please log in again.');
  }

  return fallbackToken.startsWith('Bearer ') ? fallbackToken : `Bearer ${fallbackToken}`;
};

// Store token securely
export const storeAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    const rawToken = token.replace('Bearer ', '');
    const fullToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

    localStorage.setItem('raw_token', rawToken);
    localStorage.setItem('token', fullToken);
    localStorage.setItem('auth_token', fullToken);

    console.log('Token stored successfully:', fullToken.substring(0, 15) + '...');
  }
};

// Create a new support ticket
export const createTicket = async (
  ticketData: CreateTicketPayload,
  files?: File[]
): Promise<TicketResponse> => {
  try {
    const token = getAuthToken();

    const formData = new FormData();
    formData.append('title', ticketData.title);
    formData.append('description', ticketData.description);
    formData.append('category', ticketData.category);
    formData.append('priority', ticketData.priority);

    if (files?.length) {
      files.forEach(file => {
        formData.append('attachments', file);
      });
    }

    const response = await fetch(`${API_BASE_URL}/tickets`, {
      method: 'POST',
      headers: {
        Authorization: token,
        // Let browser handle Content-Type with boundary for FormData
      },
      body: formData,
      mode: 'cors',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.message || `Error: ${response.status}`);
      } catch {
        throw new Error(errorText || `Error: ${response.status}`);
      }
    }

    const responseData: TicketApiResponse = await response.json();
    if (!responseData.success) {
      throw new Error('Failed to create ticket');
    }

    return responseData.ticket;
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
};

// Fetch all tickets for the current user
export const getUserTickets = async (): Promise<TicketResponse[]> => {
  try {
    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}/tickets`, {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error: ${response.status}`);
    }

    const data: TicketResponse[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
};

// Utility to check if the user is logged in
export const isUserLoggedIn = (): boolean => {
  const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
  return !!token;
};

// Interface for ticket resolution payload
export interface ResolveTicketPayload {
  ticketId: string;
  resolutionDetails: string;
}

// Function to resolve a ticket
export const resolveTicket = async (payload: ResolveTicketPayload): Promise<{ success: boolean; message: string }> => {
  try {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/tickets/resolve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(payload),
      mode: 'cors',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.message || `Error: ${response.status}`);
      } catch {
        throw new Error(`Failed to resolve ticket: ${response.statusText}`);
      }
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || 'Ticket resolved successfully'
    };
  } catch (error) {
    console.error('Failed to resolve ticket:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};
