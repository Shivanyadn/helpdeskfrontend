// Remove the import for getAuthToken since it's not exported
// import { getAuthToken } from '../tickets';

const API_BASE_URL = 'http://localhost:5005/api';

export interface AssetRequestPayload {
  userId: string; // MongoDB ObjectId as string (24 character hex)
  requestType: 'New Asset' | 'Repair' | 'Access';
  justification: string;
  costCenter: string;
  timeline: string;
  attachments: File[];
}

export interface AssetRequestResponse {
  requestId: string;
  requestType: string;
  justification: string;
  costCenter: string;
  timeline: string;
  attachments: any[];
}

export interface ApiResponse {
  message: string;
  data: AssetRequestResponse;
}

/**
 * Get authentication token from local storage
 */
const getAuthToken = (): string => {
  const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
  
  if (!token) {
    console.error('Authentication token not found');
    throw new Error('Authentication token not found. Please log in again.');
  }
  
  return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
};

/**
 * Submit an asset request
 */
export const submitAssetRequest = async (payload: AssetRequestPayload): Promise<ApiResponse> => {
  try {
    const token = getAuthToken();
    
    console.log('Submitting request to:', `${API_BASE_URL}/servicerequest/form`);
    
    // Ensure requestType is one of the allowed values
    if (!["New Asset", "Repair", "Access"].includes(payload.requestType)) {
      throw new Error('Invalid request type. Must be one of: New Asset, Repair, Access');
    }
    
    // Instead of using FormData, let's use JSON for the request
    const requestData = {
      userId: payload.userId,
      requestType: payload.requestType, // This should now be one of the allowed values
      justification: payload.justification,
      costCenter: payload.costCenter,
      timeline: payload.timeline,
      attachments: [] // Empty array as per your API format
    };
    
    console.log('Request payload:', requestData);
    
    try {
      const response = await fetch(`${API_BASE_URL}/servicerequest/form`, {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData),
        // Remove credentials and mode to simplify the request
        // These can sometimes cause CORS issues
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

      return await response.json();
    } catch (fetchError) {
      // More detailed error handling for network issues
      if (fetchError instanceof TypeError && fetchError.message.includes('Failed to fetch')) {
        console.error('Network error - API endpoint may be unreachable:', `${API_BASE_URL}/servicerequest/formbody`);
        
        // Add more debugging information
        console.log('This might be a CORS issue. Check if your backend has proper CORS headers enabled.');
        
        throw new Error('Unable to connect to the server. Please check your network connection or try again later.');
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('Error submitting asset request:', error);
    throw error;
  }
};

/**
 * Get user ID from local storage
 */
export const getUserId = (): string => {
  try {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const user = JSON.parse(userData);
      // Check if the user has a MongoDB ObjectId format (_id or id)
      // MongoDB ObjectIds are typically 24 character hex strings
      const mongoId = user._id || user.id || '';
      
      // If it's already in MongoDB ObjectId format, return it
      if (mongoId && typeof mongoId === 'string' && /^[0-9a-fA-F]{24}$/.test(mongoId)) {
        return mongoId;
      }
      
      // If we have a userId in the format that's not a MongoDB ObjectId,
      // log a warning since we can't convert it automatically
      if (mongoId) {
        console.warn('User ID is not in MongoDB ObjectId format:', mongoId);
      }
      
      // For testing, you can hardcode a valid MongoDB ObjectId
      // Remove this in production or replace with proper user ID retrieval
      return "67eba845ced70509479b2049"; // Hardcoded valid ObjectId for testing
    }
    return '';
  } catch (error) {
    console.error('Error getting user ID:', error);
    return '';
  }
};