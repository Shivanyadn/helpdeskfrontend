export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  accessToken?: string;
  user?: Record<string, unknown>; // Replaced `any` with a generic object type
  expiresAt?: string;
  validCategories?: string[]; // Replaced `any[]` with `string[]` assuming categories are strings
}