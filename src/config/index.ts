// API configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';  // Empty string to use relative URLs with proxy

// Other configuration constants can be added here
export const APP_NAME = 'Helpdesk Management System';
export const DEFAULT_TIMEOUT = 30000; // 30 seconds
export const MAX_UPLOAD_SIZE = 10 * 1024 * 1024; // 10MB