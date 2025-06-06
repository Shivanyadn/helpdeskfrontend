export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  accessToken?: string;
  user?: any;
  expiresAt?: string;
  validCategories?: any[];
}