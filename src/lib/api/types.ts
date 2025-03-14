
import { Database } from '@/integrations/supabase/types';
import { User } from '@/types/auth';

// Generic response type
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

// Define service types based on database tables
export type SiteService = Database['public']['Tables']['sites']['Row'];
export type PageService = Database['public']['Tables']['pages']['Row'];
export type BookService = Database['public']['Tables']['books']['Row'];
export type AssetService = Database['public']['Tables']['assets']['Row'];
export type BlogPostService = Database['public']['Tables']['blog_posts']['Row'];
export type SeriesService = Database['public']['Tables']['series']['Row'];
export type TemplateService = Database['public']['Tables']['templates']['Row'];

// User profile service type
export interface ProfileService {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  user: User | null;
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
