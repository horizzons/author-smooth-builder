
import { Database } from '@/integrations/supabase/types';
import { User } from '@/types/auth';

// Generic response type
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

// API error types
export enum ApiErrorType {
  AUTH = 'auth',
  VALIDATION = 'validation',
  SERVER = 'server',
  TIMEOUT = 'timeout',
  NETWORK = 'network',
  UNKNOWN = 'unknown'
}

// API error class
export class ApiError extends Error {
  type: ApiErrorType;
  status?: number;
  data?: any;

  constructor(message: string, type: ApiErrorType = ApiErrorType.UNKNOWN, status?: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
    this.status = status;
    this.data = data;
  }
}

// Use the Database types directly from Supabase
export type SiteRow = Database['public']['Tables']['sites']['Row'];
export type PageRow = Database['public']['Tables']['pages']['Row'];
export type BookRow = Database['public']['Tables']['books']['Row'];
export type AssetRow = Database['public']['Tables']['assets']['Row'];
export type BlogPostRow = Database['public']['Tables']['blog_posts']['Row'];
export type SeriesRow = Database['public']['Tables']['series']['Row'];
export type TemplateRow = Database['public']['Tables']['templates']['Row'];
export type ProfileRow = Database['public']['Tables']['profiles']['Row'];

// Define interface for profile with user data
export interface ProfileWithUser extends ProfileRow {
  user?: User | null;
}

// Pagination parameters
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// Filter parameters
export interface FilterParams {
  [key: string]: any;
}
